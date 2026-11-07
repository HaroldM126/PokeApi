import { useEffect, useMemo, useState } from 'react';
import PokemonCard from './components/PokemonCard';
import { getPokemonList } from './services/pokemonService';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonList(20, 0);

        if (active) {
          setPokemonList(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchPokemons();

    return () => {
      active = false;
    };
  }, []);

  const filteredPokemons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(normalizedSearch),
    );
  }, [pokemonList, search]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">PokéAPI · catálogo en tiempo real</p>
        <h1>Pokédex</h1>
        <p>Explora los primeros registros y encuentra tu Pokémon favorito.</p>
      </header>

      <section className="search-panel" aria-label="Búsqueda de Pokémon">
        <label htmlFor="pokemon-search">Buscar por nombre</label>
        <input
          id="pokemon-search"
          type="search"
          placeholder="Ej. pikachu"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      {loading && (
        <p className="state-message" aria-live="polite">
          Cargando datos desde el servidor...
        </p>
      )}

      {error && (
        <p className="state-message error-message" role="alert">
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <section className="pokemon-grid" aria-live="polite">
          {filteredPokemons.length > 0 ? (
            filteredPokemons.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemonName={pokemon.name} />
            ))
          ) : (
            <p className="state-message">No se encontraron coincidencias.</p>
          )}
        </section>
      )}
    </main>
  );
}

export default App;
