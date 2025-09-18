# Expense Tracker (CRA) - React + Redux + Firebase + Tailwind

This is a refactored CRA-style scaffold for your expense tracker using:
- React
- Redux Toolkit
- Firebase (Authentication + Realtime Database)
- Tailwind CSS

## How to use

1. Install dependencies:
```bash
npm install
```

2. Set up Tailwind (already configured). If CRA version throws PostCSS errors, ensure your `react-scripts` supports PostCSS 8. If not, consider using CRACO or upgrading react-scripts.

3. Add your Firebase config:
Replace `src/firebase/firebaseConfig.js` placeholders with your project's Firebase config. Make sure `databaseURL` is the actual Realtime Database endpoint like `https://your-app-default-rtdb.firebaseio.com`.

4. Start the app:
```bash
npm start
```

## Notes & Next steps
- The project expects the Realtime Database structure `/users/{uid}/expenses/{expenseId}`.
- Signup sends a verification email. Users must verify to be fully trusted (you can gate features by `user.emailVerified`).
- You can extend slices, add CSV export for VIP users, and convert CSS modules to Tailwind further.
