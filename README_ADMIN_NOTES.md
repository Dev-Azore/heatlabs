Admin Access Notes
- Admin UI is at /admin but hidden from the navbar.
- The server component checks get_my_role() RPC before rendering admin UI.
- Only users with role 'admin' or 'moderator' will see the admin pages.
