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

// Configures the RTK Query API slice, setting the Unsplash base URL for all requests
export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.unsplash.com" }),
  endpoints: (builder) => ({
    // Defines the search endpoint that takes a search term and passes it along with your API key
    getImages: builder.query<ImageSearchResponse, string>({
      query: (searchTerm) => ({
        url: "search/photos",
        params: {
          query: searchTerm,
          client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
          per_page: 8, // Limits the results to 8 images per request
        },
      }),
    }),
  }),
});

// Exports the auto-generated React hook so you can easily fetch data in your components
export const { useGetImagesQuery } = imageApi;