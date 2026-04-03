Frontend — Quick Start & Deploy

Overview
- Next.js (App Router) frontend for the portfolio. Uses Firebase Auth (Google + Email/Password), Tailwind CSS, and Framer Motion for animations. The frontend communicates with the PHP backend via REST API (passes Firebase ID tokens in the Authorization header).

Prerequisites
- Node.js 18+ and a package manager (`npm`, `pnpm`, or `yarn`).

Environment variables
Create `.env.local` in the `frontend/` folder with these values:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID` (optional)
- `NEXT_PUBLIC_API_URL` — the base URL of the PHP backend (e.g. `https://api.example.com`)

Local development
1. Install dependencies:
```bash
cd frontend
npm install
# or pnpm install
```
2. Run dev server:
```bash
npm run dev
# opens on http://localhost:3000
```

Production build
```bash
npm run build
npm run start
```

Firebase setup (brief)
1. Create a Firebase project and add a Web App.
2. Enable Authentication providers: Google and Email/Password in the Firebase Console.
3. Add `localhost` and your deployed domain as authorized domains.
4. Copy the Firebase config values into `.env.local` (the frontend uses only public values).

How authentication works
- Client uses Firebase Auth to sign in users and obtain ID tokens.
- The frontend's API client automatically fetches the ID token and sends it in the `Authorization: Bearer <token>` header to protected backend endpoints.

Admin onboarding
- To create admin access you must add an email or Firebase UID to the backend `admins` table (see backend README for SQL snippet).

Uploads
- Frontend uploads images via the backend `/api/upload` endpoint. The backend supports local storage or Cloudinary (optional) based on environment variables.

Deploying to Vercel
1. Create a new Vercel project and point it to the `frontend` directory or monorepo root.
2. Add the environment variables in the Vercel dashboard (the `NEXT_PUBLIC_...` keys listed above).
3. Deploy. Make sure `NEXT_PUBLIC_API_URL` points to your backend domain.

Notes
- Keep API base URL and Firebase keys secure in the deploy environment.
- The frontend only stores public Firebase config values — private service account keys belong to the backend.
