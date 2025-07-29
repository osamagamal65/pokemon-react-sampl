import { vi, describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { pokemonApi } from '../pokmenApi';
import { setupStore } from '../../../store';

// Mock data
const mockPokemonList = {
  count: 2,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockPokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  stats: [],
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    other: {},
  },
  types: [
    { type: { name: 'grass' } },
    { type: { name: 'poison' } },
  ],
};

// Setup mock server
const server = setupServer(
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json(mockPokemonList);
  }),
  http.get('https://pokeapi.co/api/v2/pokemon/:id', () => {
    return HttpResponse.json(mockPokemonDetails);
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => {
  vi.clearAllMocks();
  server.resetHandlers();
});

// Disable API mocking after the tests are done
afterAll(() => server.close());

describe('Pokemon API', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
  });

  it('should fetch pokemon list', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ offset: 0, limit: 20 })
    );

    // The result from initiate is a query action result
    const data = result.data;
    expect(data).toEqual(mockPokemonList);
    expect(result.isSuccess).toBe(true);
  });

  it('should handle pagination parameters correctly', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ offset: 20, limit: 10 })
    );

    const data = result.data;
    expect(data).toBeDefined();
    expect(data?.results).toHaveLength(2);
  });

  it('should fetch pokemon details', async () => {
    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonDetails.initiate('1')
    );

    const data = result.data;
    expect(data).toEqual(mockPokemonDetails);
    expect(result.isSuccess).toBe(true);
  });

  it('should handle API errors', async () => {
    // Force an error response
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const result = await store.dispatch(
      pokemonApi.endpoints.getPokemonList.initiate({ offset: 0, limit: 20 })
    );

    expect(result.isError).toBe(true);
    expect(result.error).toBeDefined();
  });
});