# Open Dashboard

Authentication — REMOVE COMPLETELY

Do NOT implement authentication of any kind.

Remove:

Login pages

Signup/registration pages

Logout functionality

Passwords

OAuth

Google/Microsoft/Apple sign-in

User accounts

Authentication middleware

Authentication API endpoints

Session-based authentication

JWT authentication

Password reset

Email verification

User onboarding that requires an account

The application must open directly to the main Dashboard.

User Data

For this version, treat the application as a single-user productivity workspace.

Do not require a User table or user ID for normal application functionality.

Store application data directly in the database using the application's existing data models.

If persistence is needed, use a local or development database without authentication.

Access

Anyone who opens the application should immediately see:

Dashboard
Emails
Meetings
Tasks
AI Assistant
Settings

No login screen should ever appear.

Important

Do not add authentication later as a hidden dependency.

The entire application must function end-to-end without authentication.

Keep the architecture modular so authentication could optionally be added in a future version, but do not implement it now.

Updated Security Requirement

Since there is no authentication, treat this as a single-user/local or private deployment application.

Remove user-to-user data isolation requirements from the implementation.

Still implement:

Input validation

Secure API-key handling

Server-side AI API calls

Protection against prompt injection

Safe file handling

Rate limiting where appropriate

Secure database access

Never expose AI provider API keys in frontend code.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://open-workspace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/faee48be-fe3a-45cf-841e-54894e99c963).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
