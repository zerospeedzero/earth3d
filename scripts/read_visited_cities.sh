#!/bin/sh
wget https://www.tripadvisor.com/TravelMap-a_uid.884ECE0E4BAC7794B724809A8AFA1411 -o /dev/null -O ./visited_cities.html
cat ./visited_cities.html | grep '^data' | head -n 1 | cut -c 7- | jq . > ./visited_cities.json
cat visited_cities.json | jq '.store."modules.unimplemented.entity.LightWeightPin"' > ./been_cities.json
node ./add_population.js
cp been_cities_population.json ./../public
