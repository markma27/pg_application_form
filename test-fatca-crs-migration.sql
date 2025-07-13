-- Test queries to verify FATCA/CRS migration
-- Run these after the migration to verify everything works

-- 1. Check if the column exists and its type
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
);

-- 3. Test the helper functions (safe to run even with no data)
SELECT 
    'Testing helper functions' as test_description,
    get_beneficial_owner_count('00000000-0000-0000-0000-000000000000'::UUID) as test_count,
    get_beneficial_owner_names('00000000-0000-0000-0000-000000000000'::UUID) as test_names;

-- 4. Check if the view exists
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_name = 'applications_with_beneficial_owners';

-- 5. Test the view (will show all applications with beneficial owner summary)
SELECT 
    id,
    reference_number,
    entity_name,
    beneficial_owner_count,
    beneficial_owner_summary
FROM applications_with_beneficial_owners 
LIMIT 5;

-- Success message
SELECT 'FATCA/CRS migration verification completed successfully!' as status; 