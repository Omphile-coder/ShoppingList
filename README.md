# WeShop

WeShop is a React and TypeScript shopping list app for CodeTribe Academy Task 4. Redux holds the current session, lists, and items. JSON Server stores records. This update takes inspiration from the supplied ShopBuddy reference while keeping the existing WeShop data model and using its own design.

Create an account, make a named list, add items with a category, quantity, notes, and optional photo, then check them off as you shop. Search and sort settings appear in the list URL. **Share list** sends a text copy with a native share sheet or clipboard, so recipients can read it without an account.

## Run locally

Use Node.js 24.14.0, then:

```sh
npm ci
npm run dev
```

Open http://localhost:5173. Vite proxies API calls to JSON Server on port 8000. Use `npm start` to run only the API. On first start the launcher creates `data/db.json` from the empty seed. Existing local data stays in place. Set `DB_FILE` to use a different database path. The optional `UNSPLASH_ACCESS_KEY` enables Unsplash search; you can also paste an image URL.

If port 8000 is in use, stop the other API or choose another port before running `npm run dev`. In PowerShell, set `$env:PORT = '8010'`. The launcher and Vite will both use that port for the API.

```sh
npm run lint
npm run build
```

## Fix the existing Render service

In the Render dashboard, select the existing **Web Service** and set its repository and branch to the reviewed version that contains this update. Use the repository root, with these settings:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Health Check Path | `/` |

The launcher reads Render's `PORT` and binds on `0.0.0.0`. JSON Server is a runtime dependency, so omitting development tools still leaves the API installed. Check the deploy logs for `JSON Server started on PORT`, then open the service URL to verify it responds. See [Render Web Services](https://render.com/docs/web-services).

Render's default filesystem is ephemeral. If existing remote data matters, back it up before redeploying. To retain new records through deploys, use a Render plan that supports [persistent disks](https://render.com/docs/disks), mount one at `/var/data`, and set `DB_FILE=/var/data/db.json`. Copy any existing data to that file before switching; the launcher only creates a seed when the file is missing.

For Vercel, set `VITE_API_URL` to the working Render HTTPS URL and redeploy the frontend. `vercel.json` makes direct visits and refreshes on routes such as `/lists/:id` work.

For photo search, set UNSPLASH_ACCESS_KEY as a Secret in Vercel. Use the Access Key from your Unsplash app. WeShop calls Unsplash from a server function.

## Course demo and data

The assignment calls for reversible password encryption and JSON Server. The browser encrypts credentials on registration and password changes and decrypts them at sign-in. The session stores profile fields only. The protected routes and owner checks apply in the browser. JSON Server has no server-side authorization, and the browser's encryption key is public. Use sample data and unique demo passwords.

Keep `.env` and `data/db.json` local. If they were tracked in an older checkout, run `git rm --cached -- .env data/db.json` before committing this update; this keeps the local files and stops tracking them. If a real key was committed, rotate it.

## Where the code lives

- `src/pages`: login, registration, list dashboard, item detail, and profile screens.
- `src/components`: shared navigation, dialogs, forms, and notifications.
- `src/services`: calls to JSON Server and record types.
- `src/features`: Redux session, list, and item state.
- `scripts/start-server.mjs`: sets up the data file and starts the API.
- `docs/PLAN.md`: design direction, steps, and app flow.
