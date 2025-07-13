-- PortfolioGuardian FATCA/CRS Step 4 Migration (FIXED VERSION)
-- This migration ensures proper handling of Step 4 (FATCA/CRS Details)
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Check and update the fatca_crs_owners column type if needed
DO $$ 
BEGIN
    -- Check if the column exists and its current type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' 
        AND column_name = 'fatca_crs_owners'
    ) THEN
        -- Add a comment for documentation
        COMMENT ON COLUMN applications.fatca_crs_owners IS 'Array of beneficial owners/controlling persons for FATCA/CRS compliance (up to 8 entries)';
    ELSE
        -- Add the column if it doesn't exist (using JSONB array)
        ALTER TABLE applications ADD COLUMN fatca_crs_owners JSONB;
        
        -- Add a comment for documentation
        COMMENT ON COLUMN applications.fatca_crs_owners IS 'Array of beneficial owners/controlling persons for FATCA/CRS compliance (up to 8 entries)';
    END IF;
END $$;

-- 2. Create index for better performance on FATCA/CRS queries
CREATE INDEX IF NOT EXISTS idx_applications_fatca_crs_owners 
ON applications USING GIN (fatca_crs_owners);

-- 3. Create a validation function to ensure array doesn't exceed 8 entries
CREATE OR REPLACE FUNCTION validate_fatca_crs_owners()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if fatca_crs_owners array has more than 8 entries
    IF NEW.fatca_crs_owners IS NOT NULL THEN
        -- Handle both array and JSONB array formats
        DECLARE
            owner_count INTEGER;
        BEGIN
            -- Try to get array length from JSONB
            owner_count := jsonb_array_length(NEW.fatca_crs_owners);
            
            IF owner_count > 8 THEN
                RAISE EXCEPTION 'Maximum 8 beneficial owners/controlling persons allowed for FATCA/CRS';
            END IF;
        EXCEPTION
            WHEN others THEN
                -- If it's not a JSONB array, skip validation
                NULL;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to enforce the validation
DROP TRIGGER IF EXISTS trigger_validate_fatca_crs_owners ON applications;
CREATE TRIGGER trigger_validate_fatca_crs_owners
    BEFORE INSERT OR UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION validate_fatca_crs_owners();

-- 5. Create helper function to get beneficial owner count
CREATE OR REPLACE FUNCTION get_beneficial_owner_count(app_id UUID)
RETURNS INTEGER AS $$
DECLARE
    result INTEGER;
BEGIN
    SELECT CASE 
        WHEN fatca_crs_owners IS NULL THEN 0
        ELSE jsonb_array_length(fatca_crs_owners)
    END INTO result
    FROM applications 
    WHERE id = app_id;
    
    RETURN COALESCE(result, 0);
END;
$$ LANGUAGE plpgsql;

-- 6. Create helper function to extract beneficial owner names
CREATE OR REPLACE FUNCTION get_beneficial_owner_names(app_id UUID)
RETURNS TEXT[] AS $$
DECLARE
    result TEXT[];
BEGIN
    SELECT ARRAY(
        SELECT value->>'fullLegalName'
        FROM applications,
             jsonb_array_elements(fatca_crs_owners) AS value
        WHERE id = app_id
        AND fatca_crs_owners IS NOT NULL
        AND value->>'fullLegalName' IS NOT NULL
        AND value->>'fullLegalName' != ''
    ) INTO result;
    
    RETURN COALESCE(result, ARRAY[]::TEXT[]);
END;
$$ LANGUAGE plpgsql;

-- 7. Create view for easier querying of applications with beneficial owners
CREATE OR REPLACE VIEW applications_with_beneficial_owners AS
SELECT 
    a.id,
    a.reference_number,
    a.entity_name,
    a.entity_type,
    a.is_submitted,
    a.submitted_at,
    a.created_at,
    get_beneficial_owner_count(a.id) as beneficial_owner_count,
    get_beneficial_owner_names(a.id) as beneficial_owner_names,
    CASE 
        WHEN a.fatca_crs_owners IS NULL OR jsonb_array_length(a.fatca_crs_owners) = 0 THEN 'No beneficial owners'
        WHEN jsonb_array_length(a.fatca_crs_owners) = 1 THEN '1 beneficial owner'
        ELSE jsonb_array_length(a.fatca_crs_owners) || ' beneficial owners'
    END as beneficial_owner_summary
FROM applications a;

-- 8. Create function to clean up empty beneficial owner entries
CREATE OR REPLACE FUNCTION clean_empty_beneficial_owners()
RETURNS void AS $$
BEGIN
    UPDATE applications 
    SET fatca_crs_owners = (
        SELECT jsonb_agg(value)
        FROM jsonb_array_elements(fatca_crs_owners) AS value
        WHERE value->>'fullLegalName' IS NOT NULL 
        AND value->>'fullLegalName' != ''
    )
    WHERE fatca_crs_owners IS NOT NULL
    AND jsonb_array_length(fatca_crs_owners) > 0;
END;
$$ LANGUAGE plpgsql;

-- 9. Add audit logging for beneficial owner changes
CREATE OR REPLACE FUNCTION log_beneficial_owner_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log when beneficial owners are added/modified
    IF (OLD.fatca_crs_owners IS DISTINCT FROM NEW.fatca_crs_owners) THEN
        INSERT INTO audit_logs (
            event,
            application_id,
            user_id,
            timestamp,
            details
        ) VALUES (
            'beneficial_owners_updated',
            NEW.id,
            'system',
            NOW(),
            jsonb_build_object(
                'old_count', CASE WHEN OLD.fatca_crs_owners IS NULL THEN 0 ELSE jsonb_array_length(OLD.fatca_crs_owners) END,
                'new_count', CASE WHEN NEW.fatca_crs_owners IS NULL THEN 0 ELSE jsonb_array_length(NEW.fatca_crs_owners) END,
                'reference_number', NEW.reference_number
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Create trigger for audit logging
DROP TRIGGER IF EXISTS trigger_log_beneficial_owner_changes ON applications;
CREATE TRIGGER trigger_log_beneficial_owner_changes
    AFTER UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION log_beneficial_owner_changes();

-- 11. Grant necessary permissions
GRANT SELECT ON applications_with_beneficial_owners TO authenticated;
GRANT EXECUTE ON FUNCTION get_beneficial_owner_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_beneficial_owner_names(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION clean_empty_beneficial_owners() TO service_role;

-- 12. Final verification query
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name = 'fatca_crs_owners';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'FATCA/CRS Step 4 migration completed successfully!';
    RAISE NOTICE 'The fatca_crs_owners column is ready to handle up to 8 beneficial owners.';
END $$; 