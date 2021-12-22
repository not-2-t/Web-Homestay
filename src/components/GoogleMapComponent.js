import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GOOGLE_MAP_KEY } from '../config';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const Map = ({ latitude, longitude, results, handleClickPopup }) => {
    const center = {
        lat: latitude,
        lng: longitude
    };
    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                { /* Child components, such as markers, info windows, etc. */ }
                <></>
            </GoogleMap>
        </LoadScript>
    )
}

export default Map;