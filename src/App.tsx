import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PokemonList from './components/PokmentList'
import PokemonDetails from './components/PokmenDetails'

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokédex</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PokemonList />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App