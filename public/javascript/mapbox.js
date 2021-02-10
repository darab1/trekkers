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
  style: 'mapbox://styles/darab8/ckkwrg6hw56qa17qdh6fdpj4u?optimize=true',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

tourLocations.forEach(location => {
  const element = document.createElement('div');
  element.className = 'location-pin';

  new mapboxgl.Marker({
    element: element,
    anchor: 'bottom'
  })
    .setLngLat(location.coordinates)
    .addTo(map);

  new mapboxgl.Popup({ offset: 25 })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.name}</p>`)
    .addTo(map);

  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 120,
    bottom: 80,
    left: 50,
    right: 50
  }
});
