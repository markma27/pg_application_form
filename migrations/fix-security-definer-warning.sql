-- Fix Security Definer Warning for applications_with_beneficial_owners view
-- This migration recreates the view with explicit security settings

-- Drop the existing view
DROP VIEW IF EXISTS applications_with_beneficial_owners;

-- Recreate the view with explicit SECURITY INVOKER (uses querying user's permissions)
CREATE VIEW applications_with_beneficial_owners 
WITH (security_invoker = true) AS
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

-- Grant appropriate permissions
GRANT SELECT ON applications_with_beneficial_owners TO authenticated;

-- Add comment to document the security choice
COMMENT ON VIEW applications_with_beneficial_owners IS 
'View of applications with beneficial owner information. Uses security_invoker=true to respect RLS policies.'; 