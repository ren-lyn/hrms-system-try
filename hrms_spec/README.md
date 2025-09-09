# HRMS for CCDC — Integration Deliverables (Laravel + React + MySQL)

This folder contains schemas, API contracts, and code stubs to integrate the requested HRMS features into a Laravel (PHP) backend and a React (Tailwind/Bootstrap) frontend with MySQL.

## Contents
- db/mysql_schema.sql — MySQL schema aligned to ERD and use cases
- openapi/hrms.yaml — OpenAPI describing endpoints and payloads
- backend_laravel/routes/api.php — Route definitions to paste/merge into Laravel
- backend_laravel/app/Models/*.php — Eloquent model stubs
- backend_laravel/app/Http/Controllers/*.php — Controller stubs implementing endpoints
- frontend_react/services/api.ts — Minimal fetch wrapper
- frontend_react/components/charts — Chart components wired to analytics/report endpoints

## How to integrate

1) Database
- Create a new MySQL database and run db/mysql_schema.sql (or convert into Laravel migrations as desired).

2) Backend (Laravel)
- Copy backend_laravel/app/**/* into your Laravel app under app/.
- Merge backend_laravel/routes/api.php into routes/api.php (add/adjust middleware as needed).
- Add policies/middleware for JWT/session auth and RBAC (Admin, HR, Manager, Employee, Applicant).
- Implement TODOs in controllers to call your existing services/repos where noted.

3) Frontend (React)
- Copy frontend_react/services/api.ts into your src/services/api.ts.
- Copy frontend_react/components/charts/* into your src/components/charts/.
- Import and place the charts in your dashboards. Ensure base URL/auth headers in api.ts match your setup.

4) Biometric attendance
- Point devices/gateway to POST /api/attendance/logs with payload: { employee_id, timestamp, source: "biometric" }.
- If your biometric system exports CSV, create a cron job to transform and POST in batches.

5) Predictive analytics
- Nightly job computes features (attendance streaks, overtime, evaluation scores) and updates turnover_risk.
- /api/analytics/turnover-risk aggregates for dashboards; trainer/scorer can be off-service (Python) writing into DB.

## Roles
- Admin: all
- HR: recruitment, onboarding, employees, payroll, leave, benefits, evaluations, disciplinary, reports, analytics
- Manager: team evaluations, disciplinary reports, approvals
- Employee: self-service portal (profile, attendance, leave, payslips, benefits, evaluations)
- Applicant: apply and track status

## Notes
- All endpoints are namespaced under /api and return JSON.
- Replace stub logic with real Eloquent/service calls and add validation.
- Use form requests, notifications, and jobs in Laravel to complete flows.