import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UnsplashImage {
  id: string;
  urls: { small: string; thumb: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

interface ImageSearchResponse {
  results: UnsplashImage[];
}

export const imageApi = createApi({
  reducerPath: "imageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.unsplash.com" }),
  endpoints: (builder) => ({
    getImages: builder.query<ImageSearchResponse, string>({
      query: (searchTerm) => ({
        url: "search/photos",
        params: {
          query: searchTerm,
          client_id: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
          per_page: 8,
        },
      }),
    }),
  }),
});

export const { useGetImagesQuery } = imageApi;
