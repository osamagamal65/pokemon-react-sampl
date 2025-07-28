import { pokemonApi } from '../pokmenApi';
import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

// Mock node-fetch
// @ts-ignore
global.fetch = fetch;

describe('Pokemon API', () => {
  it    ('should fetch pokemon list', async () => {
    const { data } = await pokemonApi.endpoints.getPokemonList.initiate({ offset: 0, limit: 20 })
    expect(data).toBeDefined();
    expect(data?.results).toBeInstanceOf(Array);
  });
});