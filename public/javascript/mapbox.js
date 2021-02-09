/* eslint-disable */
console.log('heloo from the client side');
const tourLocations = JSON.parse(
  document.getElementById('map').dataset.tourLocations
);

console.log(tourLocations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFyYWI4IiwiYSI6ImNrODF1ejUxeTBzdG4zZHJ1ajEzNHB0OTIifQ.QmZ5yVfKz0FKHGljGBhIVA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/darab8/ckkwrg6hw56qa17qdh6fdpj4u'
  // center: [22.502055, 40.277168],
  // zoom: 8
});

const bounds = new mapboxgl.LatLngBounds();
