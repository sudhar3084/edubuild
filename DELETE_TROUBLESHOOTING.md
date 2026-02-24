## Delete Project Troubleshooting Guide

If you cannot delete a project, here are the common reasons and solutions:

### **1. Authentication Issues**

**Problem:** You are not logged in or your session expired.

**Solution:**
- Make sure you are logged in as Admin
- Check browser console for 401 errors
- Try logging out and logging back in
- Email: `admin@edubuild.com`
- Password: `admin123`

### **2. Authorization Issues**

**Problem:** The backend checks if you're the project creator OR an admin.

**Current Logic:**
```javascript
if (project.createdBy !== req.userId && req.userRole !== 'admin') {
  return res.status(403).json({ message: 'Not authorized to delete this project' });
}
```

**Solution:**
- Ensure you're logged in as an admin
- The admin user ID should match: `550e8400-e29b-41d4-a716-446655440002`
- Projects created by this admin ID can be deleted

### **3. Token Not Being Sent**

**Problem:** The Authorization header is missing from the DELETE request.

**Check:**
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Click Delete button
4. Look for the DELETE request to `/api/projects/{id}`
5. Check Headers → Request Headers
6. Verify `Authorization: Bearer {token}` is present

**If missing:**
- Check localStorage has 'token' key
- Open Console and type: `localStorage.getItem('token')`
- Should return a JWT token string

### **4. Database Mismatch**

**Problem:** The `createdBy` field doesn't match the admin user ID.

**Check in Database:**
```sql
-- Check admin user ID
SELECT id, email, role FROM edubuild_users WHERE role = 'admin';

-- Check project creator
SELECT id, title, "createdBy" FROM edubuild_projects;
```

**Solution:**
If the createdBy IDs don't match, update them:
```sql
UPDATE edubuild_projects 
SET "createdBy" = '550e8400-e29b-41d4-a716-446655440002' 
WHERE "createdBy" IS NULL OR "createdBy" != '550e8400-e29b-41d4-a716-446655440002';
```

### **5. CORS or Network Issues**

**Problem:** The DELETE request is being blocked.

**Check:**
- Backend is running on port 5000
- Frontend is running on port 5173
- No network errors in console

### **Quick Debug Steps:**

1. **Open Browser Console (F12)**
2. **Type this to check token:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('User:', JSON.parse(localStorage.getItem('user')));
   ```

3. **Expected output:**
   ```javascript
   Token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Long token string
   User: { id: "550e8400-e29b-41d4-a716-446655440002", role: "admin", ... }
   ```

4. **Try deleting and check Network tab for the response**

### **Manual Fix (If All Else Fails):**

Run this SQL to make admin the creator of all projects:
```sql
UPDATE edubuild_projects 
SET "createdBy" = '550e8400-e29b-41d4-a716-446655440002';
```

Then refresh the page and try deleting again.
