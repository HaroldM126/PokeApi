import { useEffect, useState } from 'react';
import { getPokemonDetails } from '../services/pokemonService';

function PokemonCard({ pokemonName, index = 0 }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPokemonDetails(pokemonName);

        if (active) {
          setPokemon(data);
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      active = false;
    };
  }, [pokemonName]);

  if (loading) {
    return <article className="pokemon-card card-status">Cargando registro...</article>;
  }

  if (error) {
    return (
      <article className="pokemon-card card-status card-error" role="alert">
        {error}
      </article>
    );
  }

  if (!pokemon) {
    return null;
  }

  return (
    <article
      className={`pokemon-card stagger-${Math.min(index, 7)}`}
      data-type={pokemon.types[0]?.type.name || 'normal'}
    >
      <div className="card-topline">
        <span className="card-index">#{String(pokemon.id).padStart(3, '0')}</span>
        <span className="type-label">{pokemon.types[0]?.type.name}</span>
      </div>
      <img
        src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
        alt={`Ilustración de ${pokemon.name}`}
        className="pokemon-image"
      />
      <h2>
        {pokemon.name}
      </h2>
      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span className={`type-badge type-${type.type.name}`} key={type.type.name}>
            {type.type.name}
          </span>
        ))}
      </div>
      <div className="pokemon-stats">
        {[
          ['HP', pokemon.stats[0]?.base_stat || 0],
          ['ATQ', pokemon.stats[1]?.base_stat || 0],
          ['DEF', pokemon.stats[2]?.base_stat || 0],
        ].map(([label, value]) => (
          <div className="stat-row" key={label}>
            <div className="stat-label"><span>{label}</span><strong>{value}</strong></div>
            <progress max="150" value={value} aria-label={`${label}: ${value}`} />
          </div>
        ))}
      </div>
    </article>
  );
}

export default PokemonCard;
