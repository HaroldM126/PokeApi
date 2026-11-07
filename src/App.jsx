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
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-name">Poke<span>dex</span></span>
        </div>
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="signal-dot" />
            Centro de exploración · datos en vivo
          </div>
          <h1>
            Atrápalos
            <span> todos.</span>
          </h1>
          <p>Tu archivo de campo para descubrir, comparar y reconocer cada Pokémon.</p>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-ball"><span /></div>
          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✦</span>
        </div>
      </header>

      <section className="search-panel" aria-label="Búsqueda de Pokémon">
        <div className="search-label">
          <label htmlFor="pokemon-search">Explora el archivo</label>
          <span>01 — 20</span>
        </div>
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="pokemon-search"
            type="search"
            placeholder="Busca por nombre..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <kbd>⌘ K</kbd>
        </div>
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
        <section className="catalog-section" aria-live="polite">
          <div className="catalog-heading">
            <div>
              <p className="section-eyebrow">Dex nacional / registros</p>
              <h2>{search ? 'Resultados de búsqueda' : 'Primeros avistamientos'}</h2>
            </div>
            <span className="result-count">{filteredPokemons.length} encontrados</span>
          </div>
          <div className="pokemon-grid">
            {filteredPokemons.length > 0 ? (
              filteredPokemons.map((pokemon, index) => (
                <PokemonCard key={pokemon.name} pokemonName={pokemon.name} index={index} />
              ))
            ) : (
              <p className="state-message">No se encontraron coincidencias.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
