-- PortfolioGuardian FATCA/CRS Step 4 Migration (ARRAY TYPE FIXED)
-- This migration ensures proper handling of Step 4 (FATCA/CRS Details)
-- Designed for existing ARRAY column type
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Add comment to existing fatca_crs_owners column
DO $$ 
BEGIN
    -- Add a comment for documentation
    COMMENT ON COLUMN applications.fatca_crs_owners IS 'Array of beneficial owners/controlling persons for FATCA/CRS compliance (up to 8 entries)';
END $$;

-- 2. Create index for better performance on FATCA/CRS queries
-- Note: Using standard index since GIN doesn't work well with generic arrays
CREATE INDEX IF NOT EXISTS idx_applications_fatca_crs_owners 
ON applications (fatca_crs_owners);

-- 3. Create a validation function to ensure array doesn't exceed 8 entries
CREATE OR REPLACE FUNCTION validate_fatca_crs_owners()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if fatca_crs_owners array has more than 8 entries
    IF NEW.fatca_crs_owners IS NOT NULL THEN
        IF array_length(NEW.fatca_crs_owners, 1) > 8 THEN
            RAISE EXCEPTION 'Maximum 8 beneficial owners/controlling persons allowed for FATCA/CRS';
        END IF;
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
        ELSE COALESCE(array_length(fatca_crs_owners, 1), 0)
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
    owner_data TEXT;
    parsed_json JSONB;
BEGIN
    -- Initialize empty array
    result := ARRAY[]::TEXT[];
    
    -- Get the array data
    SELECT fatca_crs_owners INTO owner_data
    FROM applications 
    WHERE id = app_id;
    
    -- If we have data, try to extract names
    IF owner_data IS NOT NULL THEN
        BEGIN
            -- Try to parse each element as JSON and extract fullLegalName
            FOR i IN 1..array_length(owner_data, 1) LOOP
                BEGIN
                    parsed_json := owner_data[i]::JSONB;
                    IF parsed_json ? 'fullLegalName' AND (parsed_json->>'fullLegalName') != '' THEN
                        result := result || (parsed_json->>'fullLegalName');
                    END IF;
                EXCEPTION
                    WHEN others THEN
                        -- Skip invalid JSON entries
                        CONTINUE;
                END;
            END LOOP;
        EXCEPTION
            WHEN others THEN
                -- Return empty array if parsing fails
                result := ARRAY[]::TEXT[];
        END;
    END IF;
    
    RETURN result;
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
        WHEN a.fatca_crs_owners IS NULL OR COALESCE(array_length(a.fatca_crs_owners, 1), 0) = 0 THEN 'No beneficial owners'
        WHEN array_length(a.fatca_crs_owners, 1) = 1 THEN '1 beneficial owner'
        ELSE array_length(a.fatca_crs_owners, 1) || ' beneficial owners'
    END as beneficial_owner_summary
FROM applications a;

-- 8. Create function to clean up empty beneficial owner entries
CREATE OR REPLACE FUNCTION clean_empty_beneficial_owners()
RETURNS void AS $$
DECLARE
    app_record RECORD;
    cleaned_array TEXT[];
    owner_json JSONB;
BEGIN
    -- Process each application
    FOR app_record IN 
        SELECT id, fatca_crs_owners 
        FROM applications 
        WHERE fatca_crs_owners IS NOT NULL 
        AND array_length(fatca_crs_owners, 1) > 0
    LOOP
        cleaned_array := ARRAY[]::TEXT[];
        
        -- Check each owner in the array
        FOR i IN 1..array_length(app_record.fatca_crs_owners, 1) LOOP
            BEGIN
                owner_json := app_record.fatca_crs_owners[i]::JSONB;
                -- Keep only entries with non-empty fullLegalName
                IF owner_json ? 'fullLegalName' AND (owner_json->>'fullLegalName') != '' THEN
                    cleaned_array := cleaned_array || app_record.fatca_crs_owners[i];
                END IF;
            EXCEPTION
                WHEN others THEN
                    -- Skip invalid entries
                    CONTINUE;
            END;
        END LOOP;
        
        -- Update the record if we have changes
        IF array_length(cleaned_array, 1) != array_length(app_record.fatca_crs_owners, 1) THEN
            UPDATE applications 
            SET fatca_crs_owners = CASE 
                WHEN array_length(cleaned_array, 1) > 0 THEN cleaned_array 
                ELSE NULL 
            END
            WHERE id = app_record.id;
        END IF;
    END LOOP;
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
                'old_count', CASE WHEN OLD.fatca_crs_owners IS NULL THEN 0 ELSE COALESCE(array_length(OLD.fatca_crs_owners, 1), 0) END,
                'new_count', CASE WHEN NEW.fatca_crs_owners IS NULL THEN 0 ELSE COALESCE(array_length(NEW.fatca_crs_owners, 1), 0) END,
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
    RAISE NOTICE 'The fatca_crs_owners ARRAY column is ready to handle up to 8 beneficial owners.';
END $$; 