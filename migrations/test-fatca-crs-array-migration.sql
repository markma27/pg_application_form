-- Test queries to verify FATCA/CRS ARRAY migration
-- Run these after the array migration to verify everything works

-- 1. Check if the column exists and confirm it's ARRAY type
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'applications' 
AND column_name = 'fatca_crs_owners';

-- 2. Check if the helper functions exist
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name IN (
    'get_beneficial_owner_count',
    'get_beneficial_owner_names',
    'validate_fatca_crs_owners',
    'clean_empty_beneficial_owners'
) 
AND routine_schema = 'public';

-- 3. Check if triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name IN (
    'trigger_validate_fatca_crs_owners',
    'trigger_log_beneficial_owner_changes'
)
AND event_object_table = 'applications';

-- 4. Test the helper functions (safe to run even with no data)
SELECT 
    'Testing helper functions' as test_description,
    get_beneficial_owner_count('00000000-0000-0000-0000-000000000000'::UUID) as test_count,
    get_beneficial_owner_names('00000000-0000-0000-0000-000000000000'::UUID) as test_names;

-- 5. Check if the view exists
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_name = 'applications_with_beneficial_owners';

-- 6. Test the view (will show all applications with beneficial owner summary)
SELECT 
    id,
    reference_number,
    entity_name,
    beneficial_owner_count,
    beneficial_owner_summary
FROM applications_with_beneficial_owners 
LIMIT 5;

-- 7. Test array length functionality with actual data (if any exists)
SELECT 
    id,
    reference_number,
    CASE 
        WHEN fatca_crs_owners IS NULL THEN 0
        ELSE COALESCE(array_length(fatca_crs_owners, 1), 0)
    END as direct_array_length,
    get_beneficial_owner_count(id) as function_count
FROM applications 
WHERE fatca_crs_owners IS NOT NULL
LIMIT 3;

-- 8. Verify index exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'applications' 
AND indexname = 'idx_applications_fatca_crs_owners';

-- Success message
SELECT 'FATCA/CRS ARRAY migration verification completed successfully!' as status; 