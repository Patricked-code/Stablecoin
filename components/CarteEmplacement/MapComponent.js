import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MapComponent = ({ latitude, longitude }) => {
  const mapContainerRef = useRef(null);
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiemllYXJvdW5hIiwiYSI6ImNsb2Q1bTB5ZTAwZXUycW9pbXF0NHhzMngifQ.uj7vH5It8YUi75nNfXG1VA'; // Remplacez par votre propre clé d'accès Mapbox
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Style de la carte (vous pouvez en choisir un autre)
      center: [longitude, latitude],
      zoom: 13,
    });

 // Ajoutez un marqueur à la position de l'utilisateur
    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
