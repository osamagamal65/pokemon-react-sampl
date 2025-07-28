// In PokemonList.test.tsx
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, describe, expect, it } from 'vitest';
import { pokemonApi } from '../../features/Pokmen/pokmenApi';
import PokemonList from '../PokmentList';

// Create a custom store for testing
const setupTestStore = () => {
  const store = configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });
  return store;
};

// Mock the RTK Query hook
const mockUseGetPokemonListQuery = vi.fn();
vi.mock('../../features/Pokmen/pokmenApi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetPokemonListQuery: () => mockUseGetPokemonListQuery(),
  };
});

const mockPokemonList = {
  count: 7,
  next: null,
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
  ]
};

describe('PokemonList', () => {
  let store: ReturnType<typeof setupTestStore>;

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <PokemonList />
        </MemoryRouter>
      </Provider>
    );
  };

  beforeEach(() => {
    store = setupTestStore();
    vi.clearAllMocks();
    mockUseGetPokemonListQuery.mockReset();
  });

  it('displays loading state', () => {
    mockUseGetPokemonListQuery.mockReturnValue({ isLoading: true });
    renderComponent();
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    mockUseGetPokemonListQuery.mockReturnValue({ 
      error: { status: 500, data: 'Server Error' } 
    });
    renderComponent();
    expect(screen.getByText('Error loading Pokémon')).toBeInTheDocument();
  });

  it('displays list of pokemon when data is loaded', async () => {
    mockUseGetPokemonListQuery.mockReturnValue({ 
      data: mockPokemonList,
      isLoading: false,
      error: undefined
    });
    
    renderComponent();
    
    // Check if pokemon names are displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
    expect(screen.getByText('venusaur')).toBeInTheDocument();
    
    // Check if all 7 pokemon are rendered
    const pokemonCards = screen.getAllByRole('link');
    expect(pokemonCards).toHaveLength(7);
  });

  it('displays pokemon with correct details', () => {
    const singlePokemonList = {
      ...mockPokemonList,
      results: [mockPokemonList.results[0]] // Just test with bulbasaur
    };
    
    mockUseGetPokemonListQuery.mockReturnValue({ 
      data: singlePokemonList,
      isLoading: false,
      error: undefined
    });
    
    renderComponent();
    
    // Check if the pokemon name is displayed
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    
    // Check if the pokemon number is displayed with leading zeros
    expect(screen.getByText('#001')).toBeInTheDocument();
    
    // Check if the image has the correct alt text and src
    const image = screen.getByAltText('bulbasaur');
    expect(image).toHaveAttribute(
      'src', 
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
    );
  });
});