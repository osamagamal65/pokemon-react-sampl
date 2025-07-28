import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export interface PokemonDetails {
  id: number
  name: string
  height: number
  weight: number
  stats: any
  sprites: {
    front_default: string
    other: any
    // Add other sprites as needed
  }
  types: {
    type: {
      name: string
    }
  }[]
  // Add other details as needed
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonList: builder.query<PokemonListResponse, { offset: number; limit: number }>({
      query: ({ offset = 0, limit = 20 }) => `pokemon?offset=${offset}&limit=${limit}`,
    }),
    getPokemonDetails: builder.query<PokemonDetails, string | number>({
      query: (id) => `pokemon/${id}`,
    }),
  }),
})

export const { useGetPokemonListQuery, useGetPokemonDetailsQuery } = pokemonApi