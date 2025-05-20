import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Flag } from 'lucide-react';

// Fixing the Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapClickHandlerProps {
  onMapClick: (location: [number, number]) => void;
  disabled: boolean;
}

// Component to handle map clicks
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick, disabled }) => {
  const map = useMapEvents({
    click: (e) => {
      if (!disabled) {
        const { lat, lng } = e.latlng;
        onMapClick([lat, lng]);
      }
    }
  });
  
  return null;
};

interface MapViewProps {
  onLocationSelect: (location: [number, number]) => void;
  userGuessLocation: [number, number] | null;
  actualLocation: [number, number] | null;
  disableClicks: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  onLocationSelect, 
  userGuessLocation, 
  actualLocation,
  disableClicks 
}) => {
  const mapRef = useRef<L.Map | null>(null);

  // Reset view when actual location changes (new round)
  useEffect(() => {
    if (!actualLocation && !userGuessLocation && mapRef.current) {
      mapRef.current.setView([20, 0], 2);
    }
  }, [actualLocation, userGuessLocation]);

  // Show both markers when feedback is being shown
  useEffect(() => {
    if (userGuessLocation && actualLocation && mapRef.current) {
      // Calculate bounds that include both markers
      const bounds = L.latLngBounds(
        L.latLng(userGuessLocation[0], userGuessLocation[1]),
        L.latLng(actualLocation[0], actualLocation[1])
      );
      mapRef.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 5,
        animate: true
      });
    }
  }, [userGuessLocation, actualLocation]);

  return (
    <div className="relative w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={5}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapClickHandler onMapClick={onLocationSelect} disabled={disableClicks} />
        
        {userGuessLocation && (
          <Marker position={[userGuessLocation[0], userGuessLocation[1]]}>
            <Popup>Your guess</Popup>
          </Marker>
        )}
        
        {actualLocation && (
          <>
            <Marker position={[actualLocation[0], actualLocation[1]]} 
                   icon={new L.Icon({
                     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                     shadowUrl: iconShadow,
                     iconSize: [25, 41],
                     iconAnchor: [12, 41]
                   })}>
              <Popup>Actual location</Popup>
            </Marker>
            
            {userGuessLocation && (
              <Circle 
                center={[actualLocation[0], actualLocation[1]]}
                radius={10000} // 10km circle
                pathOptions={{ fillColor: 'green', fillOpacity: 0.1, color: 'green', weight: 1 }}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;