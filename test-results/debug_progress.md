# Debug Progress - Admin Post Creation Issues

**Created:** 2026-04-25  
**Status:** 🟡 Testing After Fixes

---

## Issues Identified and Fixed

### Issue 1: Login Authentication Check Failed - "管理/Admin" Not Showing

**Problem:**
After login, the Navbar did not show the "管理" (Admin) link. The E2E test expected to find text matching `/管理 | Admin/` but only found unauthenticated navigation elements.

**Root Cause:**
- `src/components/layout/Navbar.tsx` had no connection to `useUser()` hook
- Navigation was static - always showed "登录" (Login) and "注册" (Register) buttons regardless of authentication state

**Fix Applied:**
| File | Change | Status |
|------|--------|--------|
| `src/components/layout/Navbar.tsx` | Added `useUser()` hook import and usage | ✅ Done |
| `src/components/layout/Navbar.tsx` | Conditional rendering based on `isLoggedIn` state | ✅ Done |
| `src/components/layout/Navbar.tsx` | Show "管理" (Admin) link when logged in | ✅ Done |
| `src/components/layout/Navbar.tsx` | Display user email and logout link | ✅ Done |

---

### Issue 2: Slug Auto-Generation Test Failed

**Problem:**
The E2E test `should generate slug from title` was failing because the slug field remained empty after typing in the title.

**Root Cause:**
In `src/app/admin/posts/new/page.tsx`:
```typescript
// BEFORE - State update race condition
onChange={(e) => {
  setTitle(e.target.value);
  if (!slug) {
    generateSlug();  // ❌ slug is stale in closure, won't trigger properly
  }
}}
```

React state updates are asynchronous. The `!slug` check used a stale value from the component's closure scope.

**Fix Applied:**
| File | Change | Status |
|------|--------|--------|
| `src/app/admin/posts/new/page.tsx` | Added `useEffect` to watch title changes | ✅ Done |
| `src/app/admin/posts/new/page.tsx` | Auto-generate slug when title updates and slug is empty | ✅ Done |

**Code Changes:**
```typescript
// Added import
import { useState, useEffect } from 'react';

// Added effect hook
useEffect(() => {
  if (title && !slug) {
    generateSlug();
  }
}, [title]);
```

---

## Files Modified

| File | Lines Changed | Purpose |
|------|--------------|---------|
| `src/components/layout/Navbar.tsx` | ~50 lines | Add authentication-aware navigation |
| `src/app/api/posts/route.ts` | ~7 lines | Fix slug generation logic (respect user input) |
| `src/app/admin/posts/new/page.tsx` | ~8 lines | Add useEffect for auto slug generation |

---

## Test Results After Fix

### Slug Generation Test - Mixed Results

| Browser | Status | Notes |
|---------|--------|-------|
| Chromium | ✅ PASS | Slug generated correctly: "test-title-with-special-chars" |
| Firefox | ✅ PASS | Slug generated correctly: "test-title-with-special-chars" |
| WebKit | ❌ FAIL | Race condition - test reads slug before React re-render completes |

**Issue**: WebKit is slower to render state updates. The test waits only 1000ms with `waitForTimeout`, which is insufficient for the useEffect hook to trigger and update the DOM.

**Root Cause**: 
- `useEffect` triggers after component re-renders
- WebKit's rendering pipeline is slower than Chromium/Firefox
- 1 second timeout not enough for state propagation

**Solution**: Replace `waitForTimeout` with explicit wait for slug value:
```typescript
// Instead of:
await page.waitForTimeout(1000);

// Use:
await expect(slugInput).toHaveValue(/test/i);
```

---

## Next Steps

1. Fix WebKit test by using Playwright's assertion-based waiting instead of fixed timeout
2. Run full E2E flow to verify no regressions
3. Consider using `page.waitForFunction()` or `expect().toHaveValue()` for more reliable async state testing

---

**Last Updated:** 2026-04-25 (Slug generation fix applied, mixed test results)
