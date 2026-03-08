# 🚀 Quick Start Guide - Testing Login & Signup

## ✅ What Was Fixed

The login and signup functionality has been updated to work with the new backend API instead of Supabase.

### Changes Made:

1. **AuthContext.jsx** - Updated to use backend API
2. **DashboardPage.jsx** - Updated to redirect based on user role
3. **App.jsx** - Added routes for role-specific dashboards

---

## 🔧 Setup Instructions

### Step 1: Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5000`

**Note**: Make sure PostgreSQL, Redis, and Elasticsearch are running!

### Step 2: Start Frontend

```bash
# In the root directory
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🧪 Testing Login & Signup

### Test Signup Flow

1. Go to `http://localhost:5173/signup`
2. Fill in the form:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Agree & join"
4. You should be redirected to the candidate dashboard

### Test Login Flow

1. Go to `http://localhost:5173/login`
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `password123`
3. Click "Sign in"
4. You should be redirected based on your role:
   - **Candidate** → `/candidate/dashboard`
   - **Recruiter** → `/recruiter/dashboard`
   - **Admin** → `/admin/dashboard`

---

## 📋 User Roles

When signing up, users are automatically assigned the **candidate** role.

To test other roles, you need to:

1. Create a user via signup
2. Manually update the role in the database:

```sql
-- Make user a recruiter
UPDATE users SET role = 'recruiter' WHERE email = 'john@example.com';

-- Make user an admin
UPDATE users SET role = 'admin' WHERE email = 'john@example.com';
```

---

## 🔍 Troubleshooting

### Backend Not Running

**Error**: "Network Error" or "Cannot connect to server"

**Solution**:
```bash
cd backend
npm run dev
```

### Database Not Connected

**Error**: "Database connection failed"

**Solution**:
1. Make sure PostgreSQL is running
2. Check `.env` file in backend folder
3. Run the schema:
```bash
psql -U postgres -d hike_for_sure -f backend/database/schema.sql
```

### CORS Error

**Error**: "CORS policy blocked"

**Solution**:
- Make sure backend `.env` has:
```
FRONTEND_URL=http://localhost:5173
```

### Token Issues

**Error**: "Invalid token" or "Unauthorized"

**Solution**:
- Clear localStorage in browser console:
```javascript
localStorage.clear();
```
- Try logging in again

---

## 🎯 API Endpoints Being Used

### Signup
```
POST http://localhost:5000/api/v1/auth/signup
Body: {
  "email": "john@example.com",
  "password": "password123",
  "role": "candidate",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```
POST http://localhost:5000/api/v1/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

### Response Format
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "role": "candidate"
  },
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token"
}
```

---

## 📱 Testing with Postman

You can also test the API directly with Postman:

1. **Signup Request**:
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/signup`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "role": "candidate",
     "firstName": "Test",
     "lastName": "User"
   }
   ```

2. **Login Request**:
   - Method: POST
   - URL: `http://localhost:5000/api/v1/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

---

## ✅ Expected Behavior

### After Successful Signup:
1. User is created in database
2. JWT tokens are generated
3. Tokens are stored in localStorage
4. User is redirected to `/candidate/dashboard`
5. Dashboard shows welcome message

### After Successful Login:
1. Credentials are validated
2. JWT tokens are generated
3. Tokens are stored in localStorage
4. User is redirected based on role
5. Dashboard loads with user data

---

## 🔐 Security Features

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens expire after 1 hour
- ✅ Refresh tokens expire after 7 days
- ✅ Tokens stored in localStorage
- ✅ Automatic token refresh on API calls

---

## 🎨 UI Features

- ✅ Loading states during authentication
- ✅ Error messages displayed
- ✅ Form validation
- ✅ Responsive design
- ✅ Dark mode support

---

## 📊 Database Tables Used

### users
- id (UUID)
- email
- password_hash
- role (candidate/recruiter/admin)
- status
- created_at

### candidate_profiles
- id (UUID)
- user_id (FK to users)
- first_name
- last_name
- created_at

### recruiter_profiles
- id (UUID)
- user_id (FK to users)
- first_name
- last_name
- company_id
- created_at

---

## 🚀 Next Steps

After login/signup works:

1. ✅ Test candidate dashboard features
2. ✅ Test job browsing and applications
3. ✅ Test messaging system
4. ✅ Test profile management
5. ✅ Test subscription plans

---

## 💡 Tips

- Use Chrome DevTools to inspect network requests
- Check browser console for errors
- Check backend terminal for API logs
- Use Postman to test API independently
- Clear localStorage if you encounter token issues

---

**Login and Signup are now fully functional! 🎉**

If you encounter any issues, check:
1. Backend is running on port 5000
2. Database is connected
3. Frontend is running on port 5173
4. No CORS errors in console
