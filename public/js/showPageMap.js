mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://style/mapbox/streets-v11",
  center: doctor.geometry.coordinates,
  zoom: 9,
});

const marker = new mapboxgl.Marker()
  .setLngLat(doctor.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`
    <h4>${doctor.firstname} ${doctor.lastname}</h4><p>${doctor.location}</p>`)
  )
  .addTo(map);
