export type CountryCode = "DE" | "FR" | "NL" | "PL";

const supportedCountries: CountryCode[] = ['DE', 'FR', 'NL', 'PL'];

export const fetchSupportedCountries = (): CountryCode[] => {
  return supportedCountries;
};

export const isSupportedCountry = (country: string): boolean => {
  return supportedCountries.includes(country as CountryCode);
};