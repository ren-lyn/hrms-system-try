# TODO: Fix Doubling Toasts in JobPostings.js

## Steps to Complete
- [x] Add loading state variables (isSubmitting, deletingId, togglingId)
- [x] Update handleDelete to set deletingId and disable button during operation
- [x] Update handleToggleStatus to set togglingId and disable button during operation
- [x] Update handleSave to set isSubmitting and disable submit button during operation
- [x] Update delete button to be disabled when deletingId matches
- [x] Update toggle button to be disabled when togglingId matches
- [x] Update submit button to be disabled when isSubmitting is true
- [x] Added toastId to "No job postings found." message to prevent duplication
- [x] Kept original ToastContainer design in HrStaffDashboard.js
- [x] Test the changes to ensure toasts no longer double
