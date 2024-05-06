import { CountryCode, fetchSupportedCountries, isSupportedCountry } from './utilityFunctions';


const countries:CountryCode[] = fetchSupportedCountries(); 
console.log('countries:', countries);

const country = 'DE';

if (isSupportedCountry(country)) {
  console.log(`${country} is a supported country.`);
} else {
  console.log(`${country} is not a supported country.`);
}

console.log(isSupportedCountry('NL')); 
console.log(isSupportedCountry('BR')); 