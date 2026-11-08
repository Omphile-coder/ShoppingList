# WeShop update plan

Visual direction: warm paper, dark forest green, rounded list cards, and clear primary actions. Use the reference for the sign-in, add, and share flow while keeping WeShop's own layout.

1. Make JSON Server start the same way on Windows and Render.
2. Refresh sign-in, registration, dashboard, list details, and profile.
3. Check item editing, URL search and sorting, and list sharing at desktop and phone widths.

Flow: sign in → open My lists → create a named list → add or check off items → share a copy. Load the list by ID after a refresh, check its owner in the app, and render items using the URL filters. Save each mutation to JSON Server before updating Redux.
