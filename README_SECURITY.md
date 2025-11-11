# Nexus Security Configuration Guide

## Critical: Firestore Security Rules Setup

Your application now includes proper security measures, but **you must configure Firestore Security Rules in your Firebase Console** for them to take effect.

### Steps to Configure Firestore Security Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Nexus project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of the `firestore.rules` file in this repository
5. Paste it into the Firebase Console rules editor
6. Click **Publish** to deploy the rules

### Important: Admin User Setup

The hardcoded admin email check has been removed for security. To create admin users:

1. Go to Firebase Console → Firestore Database
2. Create a collection named `admins`
3. Add a document with the user's UID as the document ID
4. Add any admin profile fields needed (name, email, etc.)

Example admin document structure:
```
Collection: admins
Document ID: [USER_UID]
Fields:
  - nome: "Jon"
  - email: "nexusbyjon@gmail.com"
  - cargo: "Administrador"
  - criadoEm: [Timestamp]
```

## Security Improvements Implemented

### 1. ✅ Fixed Client-Side Authorization
- **Before**: Admin role determined by hardcoded email check in client code
- **After**: Admin role verified by checking `admins` collection in Firestore
- **Impact**: Prevents attackers from bypassing admin checks

### 2. ✅ Added Input Validation
- **Added**: Zod validation schemas for all critical inputs
- **Protected**: Sales, products, payments, and appointments
- **Prevents**: Injection attacks, data corruption, XSS vulnerabilities

Validation includes:
- Maximum length limits on all text fields
- Numeric range validation
- Positive number checks for monetary values
- String sanitization (trim, max length)

### 3. ✅ Removed Information Leakage
- **Before**: Detailed errors logged to browser console in production
- **After**: Console logging only in development mode (`import.meta.env.DEV`)
- **Impact**: Prevents attackers from seeing internal error details

### 4. ✅ Created Firestore Security Rules Template
- **File**: `firestore.rules`
- **Protects**: All collections and subcollections
- **Enforces**: Owner-based access control and admin privileges

## Validation Schemas

All validation schemas are in `src/lib/validation.ts`:

- **vendaSchema**: Validates sales data (customer name, payment details, amounts)
- **produtoSchema**: Validates product data (name, prices, quantities, stock)
- **pagamentoSchema**: Validates payment amounts
- **agendamentoSchema**: Validates appointment data (client info, service, duration)

## Security Best Practices

### For Developers:

1. **Never bypass validation**: Always use the validation schemas before database operations
2. **No sensitive data in console**: Use `if (import.meta.env.DEV)` for debug logging
3. **Check admin status server-side**: Use Firestore rules and admin collection checks
4. **Validate all inputs**: Both client-side (UX) and service-side (security)

### For Production Deployment:

1. ✅ Deploy Firestore Security Rules (see above)
2. ✅ Create admin user documents in the `admins` collection
3. ✅ Test all CRUD operations with different user roles
4. ✅ Verify that non-admin users cannot access admin features
5. ✅ Verify that users cannot access other users' data

## Testing Security

### Test Admin Access:
1. Log in with a regular barbeiro account
2. Try to access admin pages - should redirect
3. Check Firestore - should not see other barbeiros' data

### Test Validation:
1. Try to submit forms with very long text (>500 chars)
2. Try negative prices or quantities
3. Verify proper error messages appear

### Test Authorization:
1. Create a test barbeiro user
2. Verify they can only see/edit their own data
3. Verify they cannot access admin endpoints

## Firebase Console Checklist

- [ ] Firestore Security Rules deployed
- [ ] Admin users created in `admins` collection
- [ ] Email/password authentication enabled
- [ ] Firestore indexes created if needed
- [ ] Backup strategy configured
- [ ] Budget alerts configured (free tier limits)

## Support

If you encounter issues with security configuration, check:
1. Firebase Console → Firestore → Rules tab for rule syntax errors
2. Browser console for permission denied errors
3. Firestore usage tab for quota warnings

For Firebase-specific issues, consult: https://firebase.google.com/docs/firestore/security/rules-query
