Plan: Remove M-Pesa (Daraja) integration and implement Admin Resources

Summary
- Removed server-side Daraja STK initiation and callback handlers and the frontend payment modal. This plan documents follow-up cleanup steps, DB migration options, and a clear implementation plan for an Admin Resources page so another engineer can continue.

Scope
- Remove remaining references to M-Pesa/Daraja across docs and UI copy.
- Keep payments-related DB tables for history (recommended) unless explicitly asked to drop them.
- Implement Admin Resources (DB migration, backend admin endpoints, frontend admin UI).

Files already changed
- .env: MPESA_* keys removed
- Removed files: public/api/payments/initiate.php, public/api/payments/callback.php, src/components/payment/MpesaModal.tsx

Next steps (ordered)
1. Repo sweep: remove or mark remaining MPesa/Daraja mentions in docs, copy, and non-code assets.
2. Confirm DB policy: keep payments table for audit/history (recommended). If dropping, create an explicit SQL migration and backup plan.
3. Backend: scaffold admin resources endpoints (list/get/create/update/delete). Use existing auth middleware and store uploaded files under public/uploads/resources/.
4. DB migration: create migration file to add `resources` table.
5. Frontend: add admin Resources page, ResourceForm component, API client methods, and admin navigation link.
6. Testing & verification: run TS build, PHP lint, run manual e2e for enrollments and admin resource CRUD.

Security considerations
- Limit allowed mime types (pdf, docx, pptx, mp4, jpg, png).
- Enforce max file size (e.g., 50MB) and store files with randomized names.
- Sanitize filenames, validate content-type, and restrict uploads to admin role.

Verification checklist
- No frontend references to /api/payments/ or MpesaModal imports.
- .env contains no MPESA_ keys.
- TypeScript build passes (npm run build exit 0).
- PHP lint returns no syntax errors for modified/added PHP files.
- DB migration applied successfully on test DB with rollback plan.
- Admin Resources CRUD manual e2e passes (create, download/view, update, delete).

If desired, I will now:
1) finish repo sweep and create a list of exact files/lines to change,
2) scaffold DB migration and backend endpoints (non-breaking), and
3) scaffold frontend admin pages and API client.

Timestamp: 2026-03-01
