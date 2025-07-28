import { vi, beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonDetails from '../PokmenDetails';

// Mock the RTK Query hook
const mockUseGetPokemonDetailsQuery = vi.fn();

vi.mock('../../features/Pokmen/pokmenApi', () => ({
  useGetPokemonDetailsQuery: () => mockUseGetPokemonDetailsQuery(),
}));

const mockPokemon = {
    id: 25,
    name: 'pikachu',
    height: 4,
    weight: 60,
    stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
    ],
    sprites: {
        front_default: 'pikachu-front.png',
        other: {
            'official-artwork': {
                front_default: 'pikachu-official.png'
            }
        }
    },
    types: [
        { type: { name: 'electric' } }
    ]
};

// Test component that wraps the PokemonDetails with router
const TestComponent = () => (
    <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        <Routes>
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
    </MemoryRouter>
);

describe('PokemonDetails', () => {
    // Mock return values for different states
    const mockReturnValues = {
        loading: { data: undefined, error: undefined, isLoading: true },
        error: { data: undefined, error: { status: 404, data: 'Not Found' }, isLoading: false },
        success: { data: mockPokemon, error: undefined, isLoading: false }
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset the mock implementation
        mockUseGetPokemonDetailsQuery.mockImplementation(() => ({}));
    });

    it('displays loading state', () => {
        mockUseGetPokemonDetailsQuery.mockReturnValue(mockReturnValues.loading);
        render(<TestComponent />);
        expect(screen.getByText('Loading Pokémon details...')).toBeInTheDocument();
    });

    it('displays error state', async () => {
        mockUseGetPokemonDetailsQuery.mockReturnValue(mockReturnValues.error);
        render(<TestComponent />);
        expect(await screen.findByText('Error loading Pokémon details')).toBeInTheDocument();
    });

    it('renders pokemon details when data is loaded', async () => {
        mockUseGetPokemonDetailsQuery.mockReturnValue(mockReturnValues.success);
        render(<TestComponent />);

        // Check if the pokemon name is displayed
        expect(await screen.findByText('pikachu')).toBeInTheDocument();
        // Check if the height is displayed
        expect(screen.getByText(/height/i)).toBeInTheDocument();
        expect(screen.getByText(/0.4 m/i)).toBeInTheDocument();
        // Check if the weight is displayed
        expect(screen.getByText(/weight/i)).toBeInTheDocument();
        expect(screen.getByText(/6.0 kg/i)).toBeInTheDocument();
    });

    it('handles missing official artwork', async () => {
        const pokemonWithoutArtwork = {
            ...mockPokemon,
            sprites: {
                ...mockPokemon.sprites,
                other: { 'official-artwork': null }
            }
        };

        mockUseGetPokemonDetailsQuery.mockReturnValue({
            ...mockReturnValues.success,
            data: pokemonWithoutArtwork
        });

        render(<TestComponent />);

        const img = await screen.findByAltText('pikachu');
        expect(img).toHaveAttribute('src', 'pikachu-front.png');
    });
});