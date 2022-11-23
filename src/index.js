import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox() {
  const name = searchBox.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }
  fetchCountries(name)
    .then(countries => {
      console.log('countries', countries);
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          createCountryList(countries)
        );
      }
    })
    .catch(alertWrongName);
}

function createCountryList(countries) {
  const result = countries
    .map(({ name, flags }) => {
      return `<li>
                <img src="${flags.svg}" alt="Flag of ${name.official}" width = 40px height = 40px>
                <h2>${name.official}</h2>
            </li>`;
    })
    .join('');
  return result;
}

function createCountryInfo(countries) {
  const result = countries
    .map(({ capital, population, languages }) => {
      return `<p><b>Capital: </b>${capital}</p>
          <p><b>Population: </b>${population}</p>
          <p><b>Languages: </b>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  return result;
}

function alertWrongName() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertTooManyMatches() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
