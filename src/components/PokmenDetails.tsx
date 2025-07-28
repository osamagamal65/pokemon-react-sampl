import { useGetPokemonDetailsQuery } from "../features/Pokmen/pokmenApi";

const { useParams, Link } = require('react-router-dom');
require('../index.css');

const PokemonDetails = () => {
  const { id } = useParams();
  const { data: pokemon, error, isLoading } = useGetPokemonDetailsQuery(id || '');

  if (isLoading) return <div className="loading">Loading Pokémon details...</div>;
  if (error || !pokemon) return <div className="error">Error loading Pokémon details</div>;

  const imageUrl = pokemon.sprites.other?.['official-artwork']?.front_default || 
                  pokemon.sprites.front_default;

  return (
    <div className="pokemon-details-container">
      <Link to="/" className="back-button">← Back to Pokédex</Link>
      
      <div className="pokemon-details-card">
        <div className="pokemon-header">
          <h1 className="pokemon-name">{pokemon.name}</h1>
          <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>

        <div className="pokemon-image-container">
          <img 
            src={imageUrl} 
            alt={pokemon.name} 
            className="pokemon-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://via.placeholder.com/300?text=Pokemon';
            }}
          />
        </div>

        <div className="pokemon-types">
          {pokemon.types.map((type: any) => (
            <span 
              key={type.type.name} 
              className={`type type-${type.type.name}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="pokemon-stats">
          <div className="stat">
            <span className="stat-label">Height</span>
            <span className="stat-value">{(pokemon.height / 10).toFixed(1)} m</span>
          </div>
          <div className="stat">
            <span className="stat-label">Weight</span>
            <span className="stat-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
          </div>
          {pokemon.stats.map((stat: any) => (
            <div key={stat.stat.name} className="stat-item">
              <span className="stat-label">{stat.stat.name.replace('-', ' ')}</span>
              <div className="stat-bar-container">
                <div 
                  className="stat-bar" 
                  style={{
                    width: `${(stat.base_stat / 255) * 100}%`,
                    '--stat-value': stat.base_stat
                  } as React.CSSProperties}
                >
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetails;
