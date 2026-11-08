import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Defines the TypeScript structure for individual images and the overall Unsplash API response
export interface UnsplashImage {
  id: string;
  urls: { small: string; thumb: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

interface ImageSearchResponse {
  results: UnsplashImage[];
}

// Sends searches to WeShop so the browser never receives the Unsplash key.
export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // Passes only the search term to the server.
    getImages: builder.query<ImageSearchResponse, string>({
      query: (searchTerm) => ({
        url: "unsplash",
        params: {
          query: searchTerm,
        },
      }),
    }),
  }),
});

// Exports the auto-generated React hook so you can easily fetch data in your components
export const { useGetImagesQuery } = imageApi;