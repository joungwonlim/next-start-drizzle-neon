This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

1. [o] nextjs setup
2. [o] shadcn setup "pnpm add shadcn@latest"
3. [o] .vscode, .prettierrc.json
4. [o] env/server.ts
   - @t3-oss/env-nextjs
   - zod
5. [o] next-config.mjs
   - jiti
   - .env
6. [o] drizzle, neon database setup
   - drizzle.config.ts
   - db/schema
7. [O] folder structure setup
   - frontend
     - layout.tsx(\*independent)
   - backend
     - layout.tsx(\*independent)
   - layout.tsx(default)
8. [o] next-auth setup
   - app/api/auth/[...nextauth]/route.ts
   - config/authOptions.ts
     - userLoginLog
9. [o] middleware.ts setup
   - app/api/userTrack/route.ts - userActivityLog - userErrorLog 10.[o]backend setup
   - data-table setup
