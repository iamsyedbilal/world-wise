import useCities from '../hooks/useCities';
import Spinner from './Spinner';
import Message from './Message';
import CountryItem from './CountryItem';
import styles from './CountryList.module.css';

export default function CountryList() {
  const { cities, loading } = useCities();
  if (loading) return <Spinner />;

  if (!cities.length)
    return (
      <Message
        message={'Add your first city by clicking on a city on the map'}
      />
    );

  // const countries = cities.reduce((arr, city) => {
  //   if (!arr.map((el) => el.country).includes(city.country))
  //     return [...arr, { country: city.country, emoji: city.emoji }];
  //   else return arr;
  // }, []);

  // const countries = [...new Set(cities.map((city) => city.country))].map(
  //   (country) => {
  //     const city = cities.find((c) => c.country === country);
  //     return { country, emoji: city.emoji };
  //   }
  // );

  const countries = Array.from(
    new Map(
      cities.map((city) => [
        city.country,
        { country: city.country, emoji: city.emoji },
      ])
    ).values()
  );

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}
