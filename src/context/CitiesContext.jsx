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

  return (
    <CitiesContext.Provider value={{ cities, loading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
