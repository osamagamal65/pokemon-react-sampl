// const React = require('react');
const { fireEvent, render, screen, waitFor } = require('@testing-library/react');
const { MemoryRouter, Route, Routes } = require('react-router-dom');

// Import the component to test
const PokemonDetails = require('../PokmenDetails').default;

// Mock the RTK Query hook
jest.mock('../../features/Pokmen/pokmenApi', () => ({
  useGetPokemonDetailsQuery: jest.fn(),
}));

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'pikachu-front.png',
    other: {
      'official-artwork': {
        front_default: 'pikachu-official.png'
      }
    }
  },
  types: [
    {
      type: {
        name: 'electric',
        url: 'https://pokeapi.co/api/v2/type/13/'
      }
    }
  ],
  stats: [
    {
      base_stat: 55,
      stat: {
        name: 'hp'
      }
    },
    {
      base_stat: 90,
      stat: {
        name: 'attack'
      }
    }
  ]
};

// Test component to wrap PokemonDetails with router
const TestComponent = () => (
  <MemoryRouter initialEntries={['/pokemon/pikachu']}>
    <Routes>
      <Route path="/pokemon/:id" element={<PokemonDetails />} />
    </Routes>
  </MemoryRouter>
);

describe('PokemonDetails', () => {
  const { useGetPokemonDetailsQuery } = require('../../features/Pokmen/pokmenApi');

  beforeEach(() => {
    useGetPokemonDetailsQuery.mockReset();
  });

  it('displays loading state', () => {
    useGetPokemonDetailsQuery.mockReturnValue({ isLoading: true });
    
    render(<TestComponent />);
    expect(screen.getByText('Loading Pokémon details...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    useGetPokemonDetailsQuery.mockReturnValue({ error: { message: 'Error' } });
    
    render(<TestComponent />);
    expect(screen.getByText('Error loading Pokémon details')).toBeInTheDocument();
  });

  it('renders pokemon details when data is loaded', async () => {
    useGetPokemonDetailsQuery.mockReturnValue({ data: mockPokemon });
    
    render(<TestComponent />);
    
    // Check basic info
    expect(screen.getByText('pikachu')).toBeInTheDocument();
    expect(screen.getByText('#025')).toBeInTheDocument();
    expect(screen.getByText('0.4 m')).toBeInTheDocument();
    expect(screen.getByText('6.0 kg')).toBeInTheDocument();
    
    // Check types
    expect(screen.getByText('electric')).toBeInTheDocument();
    
    // Check stats
    expect(screen.getByText('hp')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('attack')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    
    // Check image
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'pikachu-official.png');
  });

  it('falls back to default sprite when official artwork is not available', async () => {
    const pokemonWithoutOfficialArt = {
      ...mockPokemon,
      sprites: {
        front_default: 'pikachu-front.png',
        other: {}
      }
    };
    
    useGetPokemonDetailsQuery.mockReturnValue({ data: pokemonWithoutOfficialArt });
    
    render(<TestComponent />);
    
    const image = screen.getByAltText('pikachu');
    expect(image).toHaveAttribute('src', 'pikachu-front.png');
  });

  it('handles image error by showing placeholder', async () => {
    useGetPokemonDetailsQuery.mockReturnValue({ data: mockPokemon });
    
    render(<TestComponent />);
    
    const image = screen.getByAltText('pikachu');
    fireEvent.error(image);
    
    await waitFor(() => {
      expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300?text=Pokemon');
    });
  });
});