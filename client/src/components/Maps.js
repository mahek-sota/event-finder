import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export default function Maps(propsMaps){
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0); 

    
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyByU0eQL7mxd2hAA9H42KnlcScPDtStfuk',
  });
  // console.log(venue)

  React.useEffect(() => {

    console.log(propsMaps.propsMaps.props)
    const getData = setTimeout(async () => {
      const response = await fetch(`/api/getCardVenueDetails?id=${propsMaps.propsMaps.props.eventId}`);
      const apiResponse = await response.json();
      setLat(Number(apiResponse[0].lat));
      setLng(Number(apiResponse[0].lng));

      console.log(apiResponse)
      
    }, 10)
    
    return () => clearTimeout(getData)
    }, [])
  
  
    console.log("Location", lat, lng)

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{"lat": lat, "lng" : lng}}
        zoom={15}
      >
        <Marker position={{"lat": lat, "lng" : lng}} />
      </GoogleMap>      
    </div>

  ) : null;
}
