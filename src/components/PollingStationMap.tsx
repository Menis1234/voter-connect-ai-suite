import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { usePollingStations } from "@/hooks/usePollingStations";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083];

const PollingStationMap: React.FC = () => {
  const { data: stations = [], isLoading, isError } = usePollingStations();

  const center: [number, number] = stations.length
    ? [
        stations.reduce((sum, station) => sum + station.latitude, 0) / stations.length,
        stations.reduce((sum, station) => sum + station.longitude, 0) / stations.length,
      ]
    : DEFAULT_CENTER;

  if (isLoading) {
    return (
      <div className="polling-station-map flex items-center justify-center">
        <p className="text-muted-foreground">Loading polling stations...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="polling-station-map flex items-center justify-center">
        <p className="text-destructive">Error loading polling stations</p>
      </div>
    );
  }

  return (
    <MapContainer center={center} zoom={6} className="polling-station-map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
        >
          <Popup>{station.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default PollingStationMap;