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
    <article className="pokemon-card" style={{ '--card-delay': `${index * 45}ms` }}>
      <div className="card-topline">
        <span className="card-index">N.º {String(pokemon.id).padStart(3, '0')}</span>
        <span className="card-pip" aria-hidden="true" />
      </div>
      <img
        src={pokemon.sprites.front_default}
        alt={`Ilustración de ${pokemon.name}`}
        className="pokemon-image"
      />
      <h2>
        {pokemon.name}
      </h2>
      <p className="pokemon-types">
        <strong>Tipos:</strong> {pokemon.types.map((type) => type.type.name).join(', ')}
      </p>
      <div className="pokemon-stats">
        <span><strong>HP</strong> {pokemon.stats[0].base_stat}</span>
        <span><strong>Ataque</strong> {pokemon.stats[1].base_stat}</span>
      </div>
    </article>
  );
}

export default PokemonCard;
