/* eslint-disable */
export const displayMap = tourLocations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZGFyYWI4IiwiYSI6ImNrODF1ejUxeTBzdG4zZHJ1ajEzNHB0OTIifQ.QmZ5yVfKz0FKHGljGBhIVA';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/darab8/ckkwrg6hw56qa17qdh6fdpj4u'
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

    map.scrollZoom.disable();
  });

  map.fitBounds(bounds, {
    padding: {
      top: 120,
      bottom: 80,
      left: 50,
      right: 50
    }
  });

  // Scroll to the top of the tour-details page
  window.scrollTo(0, 0);
};
