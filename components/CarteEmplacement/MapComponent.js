import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ latitude, longitude }) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const [location, setLocation] = useState({ lat: latitude, lng: longitude });

  // Configuration de base de la carte
  const mapContainerStyle = {
    height: "100%",
    width: "100%",
  };

  // Centre par défaut si les coordonnées ne sont pas fournies
  const defaultCenter = {
    lat: -3.745,
    lng: -38.523,
  };

  useEffect(() => {
    if (latitude && longitude) {
      setLocation({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <LoadScript googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location || defaultCenter}
          zoom={15}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
