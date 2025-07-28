import React from 'react'
import { useGetPokemonListQuery } from '../features/Pokmen/pokmenApi'
import { Link } from 'react-router-dom'

const PokemonList: React.FC = () => {
  const { data, error, isLoading } = useGetPokemonListQuery({ offset: 0, limit: 20 })

  if (isLoading) return <div className="loading">Loading Pokémon...</div>
  if (error) return <div className="error">Error loading Pokémon</div>

  const getPokemonId = (url: string) => {
    const parts = url.split('/')
    return parts[parts.length - 2]
  }

  return (
    <div className="pokemon-list">
      {data?.results.map((pokemon) => {
        const pokemonId = getPokemonId(pokemon.url)
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`

        return (
          <Link
            key={pokemon.name}
            to={`/pokemon/${pokemon.name}`}
            className="pokemon-card"
          >
            <div className="pokemon-image">
              <img
                src={imageUrl}
                alt={pokemon.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/96?text=Pokemon'
                }}
              />
            </div>
            <div className="pokemon-list-info">
              <span className="pokemon-item-text">{pokemon.name}</span>
              <span className="pokemon-item-text">#{pokemonId.padStart(3, '0')}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default PokemonList