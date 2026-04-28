# Admin Login Debug State

**Created:** 2026-04-19  
**Status:** 🔴 Testing - Login Cookie Not Being Set Properly

---

## Completed Tests (无需再试)

| Test | Status | Result |
|------|--------|--------|
| Admin dashboard route test | ✅ Done | `/admin/dashboard.json` returns 404 (route doesn't exist) |
| Login API connection test | ✅ Done | `/api/auth/login` is accessible and returns proper JSON responses |
| Supabase connection verified | ✅ Done | Login successfully authenticates with Supabase |

---

## Current Status

### Login Functionality
- **Status:** ⚠️ Testing Needed
- **Test Credentials:** `chb00668899@outlook.com` / `chb006688`
- **Issue:** After login, creating articles still prompts for login repeatedly

---

## 🔴 Issue Found: Cookie Not Being Set in Response (IN PROGRESS)

**Problem:** Login API authenticates successfully but browser doesn't receive session cookie, causing repeated login prompts.

**Root Cause:**
1. `createServerClient`'s `setAll` callback was using `request.cookies.set()`
2. This only modifies server-side request object, **doesn't send Set-Cookie to browser**
3. Browser receives JSON response without Set-Cookie header → no session stored

---

## Fixes Applied (Session 7 - Login Cookie Response Header)

| # | Fix | Status | Result |
|---|-----|--------|--------|
| 1 | Added `credentials: 'include'` to useUser hook fetch | ✅ Done | User info fetch works ✓ |
| 2 | Added `credentials: 'include'` to create article fetch | ✅ Done | Article POST sends cookie ✓ |
| 3 | Fixed login route Set-Cookie header construction | ⏳ In Progress | **Testing now** |

### Key Code Changes (LOGIN ROUTE)

**Before:**
```typescript
setAll(cookiesToSet: Array<{ name: string; value: string }>) {
  cookiesToSet.forEach(({ name, value }) =>
    request.cookies.set(name, value, {...}) // ❌ Doesn't send to browser!
  );
}
// Returns NextResponse.json() without Set-Cookie header
```

**After:**
```typescript
let setCookieHeader = '';

setAll(cookiesToSet: Array<{ name: string; value: string }>) {
  for (const cookie of cookiesToSet) {
    const expires = new Date(Date.now() + (cookie.maxAge ?? 0) * 1000);
    setCookieHeader += `${cookie.name}=${cookie.value}; Path=/; Expires=...`;
  }
}

// Return response with Set-Cookie header
const response = NextResponse.json({...});
response.headers.set('Set-Cookie', setCookieHeader.trim());
return response; // ✅ Cookie sent to browser!
```

### Files Modified

| File | Change | Purpose |
|------|--------|---------|
| `src/app/api/auth/login/route.ts` | Manual Set-Cookie header construction | Send session cookie to browser ✓ |
| `src/hooks/useUser.ts` | Added `credentials: 'include'` | Read user with cookie ✓ |
| `src/app/admin/posts/new/page.tsx` | Added `credentials: 'include'` | POST article with cookie ✓ |

---

### Testing Required (CURRENT PRIORITY)

1. **Start dev server:** `npm run dev`
2. **Open browser Network tab**
3. **Login with:** `chb00668899@outlook.com` / `chb006688`
4. **Check Login API Response Headers for:**
   - `Set-Cookie: sb-...` (Supabase session cookie)
   - `__session=...` or similar

5. **If Set-Cookie exists:**
   - Try creating an article
   - Should work without re-prompting for login

6. **If NO Set-Cookie in response:**
   - Need alternative approach to set Supabase cookies

---

## Technical Notes

### Why Previous Approach Failed

```
createServerClient's setAll callback:
- Runs on SERVER only
- request.cookies.set() modifies server-side cookie jar
- NEVER reaches browser automatically in API routes

Correct approach for API routes:
- Build Set-Cookie header string manually
- Add to response.headers
- Browser receives and stores cookie
```

### Supabase Cookie Naming

Supabase SSR sets these cookies on successful login:
- `sb-[project-id]-auth-token` - Main session token (also called sb-auth-token)
- May also set `__session` depending on version

---

## Next Steps

1. **Test login flow and verify Set-Cookie header**
2. **If cookie is set:** Test article creation works
3. **If NO cookie:** Consider using `@supabase/auth-helpers-nextjs` which handles this automatically
