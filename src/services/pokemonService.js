import axios from 'axios';

const BASE_URL = import.meta.env.VITE_POKEAPI_URL;

const getBaseUrl = () => {
  if (!BASE_URL) {
    throw new Error('La URL de PokéAPI no está configurada.');
  }

  return BASE_URL.replace(/\/$/, '');
};

export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/pokemon?limit=${limit}&offset=${offset}`,
    );
    return response.data.results;
  } catch (error) {
    throw new Error(
      `Error al obtener la lista de datos: ${error.message}`,
      { cause: error },
    );
  }
};

export const getPokemonDetails = async (nameOrId) => {
  try {
    const response = await axios.get(
      `${getBaseUrl()}/pokemon/${String(nameOrId).toLowerCase()}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(`No se pudo obtener la información de "${nameOrId}"`, {
      cause: error,
    });
  }
};
