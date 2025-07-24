# 🔐 Login & Authentication in Visual Data Core

The Visual Data Core platform includes a robust and secure **login & authentication system** using modern best practices. This guide describes the full implementation as it exists in the system.

---

## ✅ Features Overview

- JWT-based stateless authentication
- Login and registration with validation
- Secure password hashing with bcrypt
- User role and activity-based access
- Detailed logging using Winston

---

## 🧑 User Roles

Users can have one of the following roles:

- `admin` – Full system access, user and project management
- `contentadmin` – Content and dashboard related operations (extendable)
- `normal` – Basic user

---

## 🔑 JWT Authentication

- On successful login, the backend returns a signed JWT:
  ```json
  {
    "id": "user_id",
    "role": "admin",
    "isActive": true
  }
  ```

- This token is stored in the frontend (e.g., localStorage) and sent with every request in the `Authorization` header:
  ```http
  Authorization: Bearer <token>
  ```

- Token expiration is set to **1 hour**.

---

## 🔐 Password Security

- All passwords are hashed using `bcryptjs` before storing in the database.
- Minimum password length is **6 characters**.
- Passwords are never logged or returned in API responses.

---

## 📥 API Endpoints

### `POST /api/auth/register`
- Registers a new user
- Validates email and password

### `POST /api/auth/login`
- Authenticates user credentials
- Returns a token and user profile

### `GET /api/users/profile`
- Returns the authenticated user’s profile

### `PUT /api/users/update-user/:id`
- Admin route to update user details (username, email, role, isActive)

### `PUT /api/users/change-password`
- Authenticated users can change their own password

### `PUT /api/users/:id/set-password`
- Admin-only endpoint to reset another user's password

---

## 🛡️ Middleware: `authMiddleware`

- Checks for a valid JWT token
- Validates token structure and expiration
- Ensures the user is active
- Attaches `req.user` with decoded token information

---

## ⚠️ Error Handling & Logging

All authentication and user routes log:

- Successful and failed login attempts
- Unauthorized access attempts
- Errors with stack trace for internal logs
- Security-related events

---

## 🌐 Frontend Integration

- Login and registration pages using React, CoreUI, and Axios
- Stores token in `localStorage` and attaches it to every request
- Handles and displays server error messages
- Role-based route protection with redirect logic

---

## 🔐 Security Considerations

- Token-based access eliminates session handling complexity
- Proper HTTP status codes for every outcome
- Role-based and activity-based access controls ensure only active users operate

---

> This authentication layer forms the foundation of Visual Data Core’s secure and extensible platform. Next: Role-based permissions and project-based access control.