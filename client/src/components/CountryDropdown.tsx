import { Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface CountryDropdownProps {
    onSelect: (selectedCountry: string) => void;
  }
  function CountryDropdown({ onSelect }: CountryDropdownProps) {
    const [countries, setCountries] = useState<string[]>([]);
    const [searchTerm] = useState<string>("");
    useEffect(() => {
      const fetchCountries = async () => {
        try {
          const response = await fetch("https://restcountries.com/v3.1/all");
          const data = await response.json();
          const countryList = data.map(
            (country: {
              name: {
                common: string;
              };
            }) => country.name.common
          );
  
          setCountries(countryList);
        } catch (error) {
          console.error("Error fetching countries:", error);
        }
      };
      fetchCountries();
    }, []);
    const filteredCountries = countries.filter((country) =>
      country.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const sortedCountries = filteredCountries.sort();
    return (
      <Select
        placeholder="Select a country"
        onChange={(e) => onSelect(e.target.value)}
      >
        {" "}
        {sortedCountries.map((country, index) => (
          <option key={index} value={country}>
            {" "}
            {country}{" "}
          </option>
        ))}{" "}
      </Select>
    );
  }

  export default CountryDropdown;