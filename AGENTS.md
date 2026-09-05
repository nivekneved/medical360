# Project UX & UI Architecture Guidelines

## Strict Rules
1. **NO Popups / Modals for CRUD Operations**:
   - Do NOT use modal popups / dialog overlays when adding, editing, or deleting records/items (procedures, doctors, hospitals, inquiries, case studies, etc.).
   - ALWAYS use **inline expandable forms**, **in-place editor cards**, **accordion panels**, or **dedicated dedicated inline sections** embedded directly in the page flow.
   - Confirmation for deletion or status updates should be handled with inline confirmation bars/banners, not blocking modal popups.
