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

    // Iterate over each city in the input JSON and query GeoNames for population
    for (const key in inputJson) {
      if (inputJson.hasOwnProperty(key)) {
        const city = inputJson[key];
        const cityName = city.name.split(',')[0].trim(); // Extract city name
        const country = city.name.split(',')[1] ? city.name.split(',')[1].trim() : ''; // Extract country name

        // Create a promise to query GeoNames
        console.log(cityName)
        console.log(geonamesUsername)
        const promise = axios.get(`http://api.geonames.org/searchJSON?q=${cityName}&maxRows=1&username=${geonamesUsername}`)
          .then((response) => {
            const geonames = response.data.geonames[0];
            const population = geonames ? geonames.population : null;
            const countryName = geonames ? geonames.countryName : null;
            const countryCode = geonames ? geonames.countryCode : null;

            maps.push({
              text: city.name,
              size: 0.00001,
              country: country,
              city: cityName,
              lat: city.lat,
              lng: city.lng,
              population: population,
              countryName: countryName,
              countryCode: countryCode
            });
          })
          .catch((error) => {
            console.error(`Error fetching data for ${cityName}: ${error}`);
          });
      }
    }

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
