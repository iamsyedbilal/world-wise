import { createContext, useEffect, useState } from 'react';

const BASE_URL = `http://localhost:8000/`;

const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}cities`);
        const data = await res.json();
        setCities(data);
      } catch (error) {
        alert('There was an error while fetching data ' + error);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    async function fetchCity() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}cities/${id}`);
        const data = await res.json();
        setCurrentCity(data);
      } catch (error) {
        alert('There was an error while fetching data ' + error);
      } finally {
        setLoading(false);
      }
    }
    fetchCity();
  }

  async function createCity(newCity) {
    async function fetchCity() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}cities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCity),
        });
        const data = await res.json();
        setCities((cities) => [...cities, data]);
      } catch (error) {
        alert('There was an error while fetching data ' + error);
      } finally {
        setLoading(false);
      }
    }
    fetchCity();
  }

  async function deleteCity(id) {
    async function fetchCity() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}cities/${id}`, {
          method: 'DELETE',
        });
        await res.json();
        setCities((cities) => cities.filter((city) => city.id !== id));
      } catch (error) {
        alert('There was an error while fetching data ' + error);
      } finally {
        setLoading(false);
      }
    }
    fetchCity();
  }

  return (
    <CitiesContext.Provider
      value={{ cities, loading, currentCity, getCity, createCity, deleteCity }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
