require('@testing-library/jest-dom');

// Use CommonJS require for all imports
const { render, screen, waitFor } = require('@testing-library/react');
const { setupServer } = require('msw/node');
const { http, HttpResponse } = require('msw');
const { Provider } = require('react-redux');
const { store } = require('../../store');
const PokemonList = require('../PokmentList').default;

const server = setupServer(
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json({
      count: 1118,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('PokemonList', () => {
  it('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders pokemon list after loading', async () => {
    render(
      <Provider store={store}>
        <PokemonList />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });
});