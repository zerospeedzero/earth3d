const fs = require('fs');
const axios = require('axios');

const inputFile = 'been_cities.json'; // Replace with the path to your input JSON file
const outputFile = 'been_cities_population.json'; // Replace with the desired output JSON file

// Replace 'YOUR_GEONAMES_USERNAME' with your actual GeoNames username
const geonamesUsername = 'temp6666temp';

// Read the input JSON file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading input JSON file:', err);
    return;
  }

  try {
    const inputJson = JSON.parse(data);
    const maps = [];

    // Define a function to query GeoNames for a city's data
    const queryGeoNames = (cityName, cityData) => {
      return axios
        .get(`http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${geonamesUsername}`)
        .then((response) => {
          const geonames = response.data.geonames[0];
          const population = geonames ? geonames.population : null;
          const countryName = geonames ? geonames.countryName : null;
          const countryCode = geonames ? geonames.countryCode : null;

          maps.push({
            text: cityData.name,
            size: 0.00001,
            country: countryName,
            city: cityName,
            lat: cityData.lat,
            lng: cityData.lng,
            population: population,
            countryName: countryName,
            countryCode: countryCode,
          });
        })
        .catch((error) => {
          console.error(`Error fetching data for ${cityName}: ${error}`);
        });
    };

    // Create an array of promises for querying GeoNames for each city
    const promises = Object.entries(inputJson).map(([key, cityData]) => {
      const cityName = cityData.name.split(',')[0].trim(); // Extract city name
      return queryGeoNames(cityName, cityData);
    });

    // Wait for all promises to complete
    Promise.all(promises)
      .then(() => {
        const outputJson = {
          type: 'maps',
          maps: maps,
        };

        // Write the formatted JSON to the output file
        fs.writeFile(outputFile, JSON.stringify(outputJson, null, 2), (err) => {
          if (err) {
            console.error('Error writing output JSON file:', err);
          } else {
            console.log('Formatted JSON written to output file.');
          }
        });
      });
  } catch (parseError) {
    console.error('Error parsing input JSON:', parseError);
  }
});
