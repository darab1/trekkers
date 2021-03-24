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
    // Add popup information for each marker
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.name}</p>`)
      .addTo(map);

    // Create DOM element for marker
    const el = document.createElement('div');
    el.className = 'location-pin';

    // Add markers to the map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(location.coordinates)
      .setPopup(popup)
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

  // Scroll to the top of the tour-details page
  window.scrollTo(0, 0);
};
