# 🧪 Manual Testing Guide for Critical UX Issues

## Overview

This guide covers manual testing for the critical UX issues that automated tests cannot fully verify. These tests should be performed before production deployment to ensure optimal user experience.

---

## 🔄 **1. State Management and Session Persistence**

### **Test: Cross-Tab State Consistency**
**Objective**: Verify state doesn't leak between tabs and sessions persist correctly

**Steps**:
1. **Login in Tab 1**:
   - Open browser tab, navigate to `/auth/login`
   - Login with valid credentials
   - Verify you're redirected to dashboard/profile

2. **Open Tab 2**:
   - Open new tab, navigate to any protected route (e.g., `/profile`)
   - **Expected**: Should be automatically logged in (session shared)
   - **Red Flag**: If prompted to login again

3. **Test State Isolation**:
   - In Tab 1: Navigate to `/marketplace`, apply filters
   - In Tab 2: Navigate to `/marketplace`
   - **Expected**: Filters should NOT be applied in Tab 2
   - **Red Flag**: If filters persist across tabs

4. **Test Session Persistence**:
   - Close all tabs
   - Reopen browser, navigate to protected route
   - **Expected**: Should remain logged in
   - **Red Flag**: If logged out after browser restart

### **Test: Page Refresh State Recovery**
**Steps**:
1. Login and navigate to `/marketplace`
2. Apply search filters and sort options
3. Refresh the page (F5)
4. **Expected**: User remains logged in, but filters reset (acceptable)
5. **Red Flag**: If user is logged out or page crashes

---

## ⏳ **2. Loading States and Fallback UIs**

### **Test: Loading Indicators**
**Objective**: Verify all data-loading operations show proper feedback

**Steps**:
1. **Slow Network Simulation**:
   - Open DevTools → Network tab
   - Set throttling to "Slow 3G"

2. **Test Each Page**:
   - Navigate to `/marketplace`
   - **Expected**: See loading spinner or skeleton while properties load
   - **Red Flag**: Blank page or no loading indicator

   - Navigate to `/services`
   - **Expected**: Loading state while services fetch
   - **Red Flag**: Page appears broken during loading

   - Navigate to `/profile`
   - **Expected**: Profile data loads with proper fallbacks
   - **Red Flag**: Missing profile sections without explanation

3. **Test Form Submissions**:
   - Create new property listing
   - Submit form
   - **Expected**: Button shows "Creating..." or similar
   - **Red Flag**: No feedback during submission

### **Test: Error Boundaries**
**Steps**:
1. Navigate to `/admin/diagnostics`
2. If any component fails to load:
   - **Expected**: Error boundary with "Try again" button
   - **Red Flag**: White screen or browser error

---

## 💾 **3. Data Persistence Verification**

### **Test: Form Data Actually Saves**
**Objective**: Verify forms save data to database, not just UI

**Critical Test - Property Creation**:
1. Navigate to `/marketplace/create`
2. Fill out complete property form:
   - Title: "Test Property [Current Date/Time]"
   - Description: "Manual test property"
   - Price: $500,000
   - Add at least one image
3. Submit form
4. **Expected**: Success message + redirect to property page
5. **Verification**: 
   - Navigate to `/marketplace`
   - Search for your test property
   - **Expected**: Property appears in listings
   - **Red Flag**: Property not found in database

**Critical Test - Service Request**:
1. Navigate to `/services/request`
2. Create service request with unique title
3. Submit form
4. **Verification**:
   - Navigate to `/profile/my-requests`
   - **Expected**: Request appears in your list
   - **Red Flag**: Request not saved

**Critical Test - Bidding**:
1. Find active auction property
2. Place bid higher than current bid
3. **Expected**: Bid confirmation + updated current bid
4. **Verification**: Refresh page, verify bid is still highest
5. **Red Flag**: Bid disappears after refresh

### **Test: Profile Updates**:
1. Navigate to `/profile`
2. Update profile information (name, bio, etc.)
3. Save changes
4. **Expected**: Success toast notification
5. **Verification**: Refresh page, verify changes persist
6. **Red Flag**: Changes revert after refresh

---

## 🔐 **4. Authentication Flow Edge Cases**

### **Test: Token Expiration Handling**
**Steps**:
1. Login normally
2. Wait 1 hour (or manually expire token in DevTools)
3. Try to perform authenticated action (create listing)
4. **Expected**: Automatic token refresh OR redirect to login
5. **Red Flag**: Error without proper handling

### **Test: Protected Route Enforcement**
**Steps**:
1. **Logout** completely
2. Try to access protected routes directly:
   - `/profile`
   - `/marketplace/create`
   - `/calendar`
3. **Expected**: Redirect to login with callback URL
4. **Red Flag**: Access granted without authentication

### **Test: OAuth Flow**:
1. Logout completely
2. Click "Login with Google" or "Login with GitHub"
3. Complete OAuth flow
4. **Expected**: Successful login + redirect to intended page
5. **Red Flag**: OAuth errors or infinite redirects

---

## 📝 **5. User Feedback and Logging**

### **Test: Toast Notifications**
**Objective**: Verify users get feedback for all actions

**Test Success Messages**:
1. Create property listing
2. **Expected**: Green success toast appears
3. Send message to another user
4. **Expected**: "Message sent!" toast
5. Update profile
6. **Expected**: "Profile updated" toast

**Test Error Messages**:
1. Try to bid with insufficient amount
2. **Expected**: Red error toast with specific message
3. Try to submit form with missing required fields
4. **Expected**: Validation error messages

### **Test: Loading Feedback**:
1. Submit any form
2. **Expected**: Button text changes to "Saving..." or similar
3. **Red Flag**: No indication that action is processing

### **Test: Error Logging**:
1. Open DevTools Console
2. Perform various actions
3. **Expected**: No console errors during normal operations
4. **Red Flag**: JavaScript errors or warnings

---

## 🚨 **Critical Issues to Watch For**

### **🔴 CRITICAL - Must Fix Before Production**:
- User logged out after page refresh
- Form submissions don't save to database
- No loading states during data operations
- Protected routes accessible without authentication
- JavaScript errors in console
- No user feedback for form submissions

### **🟡 WARNING - Should Fix Soon**:
- Slow loading without indicators
- Missing error messages
- State persisting incorrectly across tabs
- OAuth flow issues

### **🟢 MINOR - Nice to Have**:
- Enhanced loading animations
- More detailed error messages
- Better offline handling

---

## ✅ **Testing Checklist**

**Before Production Deployment**:
- [ ] Login persists across browser restart
- [ ] All forms save data to database
- [ ] Loading states visible during data operations
- [ ] Protected routes redirect to login when not authenticated
- [ ] Toast notifications appear for user actions
- [ ] No JavaScript errors in console
- [ ] OAuth providers work correctly
- [ ] Bidding system saves bids to database
- [ ] Profile updates persist after refresh
- [ ] Error boundaries catch component failures

**Performance Testing**:
- [ ] Test on slow network (3G simulation)
- [ ] Test with large datasets (many properties/services)
- [ ] Test concurrent users (multiple browser tabs)

---

## 🎯 **Success Criteria**

**The application is ready for production when**:
1. ✅ All critical tests pass
2. ✅ Users receive feedback for every action
3. ✅ Data persists correctly across sessions
4. ✅ Authentication flows work reliably
5. ✅ Loading states prevent user confusion
6. ✅ No critical JavaScript errors

**Remember**: These manual tests are essential because they verify the actual user experience that automated tests cannot fully capture.
