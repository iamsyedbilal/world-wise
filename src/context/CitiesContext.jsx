import { createContext, useCallback, useEffect, useReducer } from 'react';

const BASE_URL = `http://localhost:8000/`;

const CitiesContext = createContext();

const initialState = {
  cities: [],
  loading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };

    case 'LOADING/DONE':
      return { ...state, loading: false };

    case 'CITIES/LOADED':
      return { ...state, cities: action.payload };

    case 'CITY/LOADED':
      return { ...state, currentCity: action.payload };

    case 'CITY/CREATED':
      return {
        ...state,
        cities: [...state.cities, action.payload],
      };

    case 'CITY/DELETED':
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case 'REJECTED':
      return { ...state, error: action.payload };

    default:
      throw new Error('Unknown action type: ' + action.type);
  }
}

function CitiesProvider({ children }) {
  const [{ cities, loading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Fetch all cities
  useEffect(() => {
    async function fetchCities() {
      try {
        dispatch({ type: 'LOADING' });

        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();

        dispatch({ type: 'CITIES/LOADED', payload: data });
      } catch (error) {
        dispatch({ type: 'REJECTED', payload: error.message });
      } finally {
        dispatch({ type: 'LOADING/DONE' });
      }
    }

    fetchCities();
  }, []);

  // Get single city
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      try {
        dispatch({ type: 'LOADING' });

        const res = await fetch(`${BASE_URL}cities/${id}`);
        const data = await res.json();

        dispatch({ type: 'CITY/LOADED', payload: data });
      } catch (error) {
        dispatch({ type: 'REJECTED', payload: error.message });
      } finally {
        dispatch({ type: 'LOADING/DONE' });
      }
    },
    [currentCity.id]
  );

  // Create city
  async function createCity(newCity) {
    try {
      dispatch({ type: 'LOADING' });

      const res = await fetch(`${BASE_URL}cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });

      const data = await res.json();

      dispatch({ type: 'CITY/CREATED', payload: data });
    } catch (error) {
      dispatch({ type: 'REJECTED', payload: error.message });
    } finally {
      dispatch({ type: 'LOADING/DONE' });
    }
  }

  // Delete city
  async function deleteCity(id) {
    try {
      dispatch({ type: 'LOADING' });

      await fetch(`${BASE_URL}cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'CITY/DELETED', payload: id });
    } catch (error) {
      dispatch({ type: 'REJECTED', payload: error.message });
    } finally {
      dispatch({ type: 'LOADING/DONE' });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        loading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
