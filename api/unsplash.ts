import type { IncomingMessage, ServerResponse } from "node:http";

// Accepts a search term and sends the private Access Key only to Unsplash.
export async function searchPhotos(request: IncomingMessage, response: ServerResponse, accessKey: string | undefined) {
  const key = accessKey?.trim();
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    response.end(JSON.stringify({ error: "Use GET to search for photos." }));
    return;
  }

  const query = new URL(request.url ?? "/", "http://localhost").searchParams.get("query")?.trim();
  if (!query || query.length > 100) {
    response.statusCode = 400;
    response.end(JSON.stringify({ error: "Enter a search term between 1 and 100 characters." }));
    return;
  }

  if (!key) {
    response.statusCode = 503;
    response.end(JSON.stringify({ error: "Photo search is unavailable. You can paste an image URL." }));
    return;
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "8");
  try {
    const result = await fetch(url, {
      headers: { Authorization: `Client-ID ${key}` },
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!result.ok) throw new Error("Unsplash search failed.");
    const photos = await result.json();
    if (!photos || typeof photos !== "object" || !("results" in photos) || !Array.isArray(photos.results)) {
      throw new Error("Unsplash returned an invalid photo response.");
    }
    response.end(JSON.stringify({ results: photos.results }));
  } catch {
    response.statusCode = 502;
    response.end(JSON.stringify({ error: "Photo search failed. Try again or paste an image URL." }));
  }
}

// Vercel loads the key from the server environment at request time.
export default function handler(request: IncomingMessage, response: ServerResponse) {
  return searchPhotos(request, response, process.env.UNSPLASH_ACCESS_KEY);
}
