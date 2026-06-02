// NukeMap (WEB) — usa Leaflet (OpenStreetMap, sem chave de API).
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Circle, MapContainer, Marker, Polygon, TileLayer, useMap, useMapEvents } from "react-leaflet";

export interface NukeMapRef {
  flyTo: (lat: number, lng: number, deltaDeg: number) => void;
}

export interface NukeMapProps {
  initialLat: number;
  initialLng: number;
  location: { latitude: number; longitude: number };
  onPress?: (lat: number, lng: number) => void;
  showCrosshair: boolean;
  wave: number;
  fireball: number; heavy: number; moderate: number; light_zone: number; thermal: number;
  burstType: "air" | "ground" | null;
  detonated: boolean;
  craterRadius: number;
  showFallout: boolean;
  falloutPoly: Array<{ latitude: number; longitude: number }>;
}

// Converte deltaDeg (graus de latitude) num zoom level aproximado do Leaflet
function deltaToZoom(delta: number) {
  // 0.15° ≈ zoom 12; 1° ≈ zoom 9; 10° ≈ zoom 5
  const z = Math.round(Math.log2(360 / delta));
  return Math.max(3, Math.min(18, z));
}

// Crosshair vermelho como DivIcon
const crosshairIcon = L.divIcon({
  html: `
    <div style="position:relative;width:50px;height:50px;">
      <div style="position:absolute;top:50%;left:0;width:50px;height:1px;background:#ff3b30;transform:translateY(-50%);"></div>
      <div style="position:absolute;left:50%;top:0;width:1px;height:50px;background:#ff3b30;transform:translateX(-50%);"></div>
      <div style="position:absolute;top:50%;left:50%;width:30px;height:30px;border:1px solid rgba(255,59,48,0.4);border-radius:50%;transform:translate(-50%,-50%);"></div>
      <div style="position:absolute;top:50%;left:50%;width:8px;height:8px;border:2px solid #ff3b30;border-radius:50%;transform:translate(-50%,-50%);"></div>
    </div>
  `,
  className: "",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

function MapClickHandler({ onPress }: { onPress?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) { onPress?.(e.latlng.lat, e.latlng.lng); },
  });
  return null;
}

function MapController({ flyToCmd }: { flyToCmd: React.MutableRefObject<((lat: number, lng: number, delta: number) => void) | null> }) {
  const map = useMap();
  flyToCmd.current = (lat, lng, delta) => {
    map.flyTo([lat, lng], deltaToZoom(delta), { duration: 0.9 });
  };
  return null;
}

const NukeMap = forwardRef<NukeMapRef, NukeMapProps>((props, ref) => {
  const flyToCmd = useRef<((lat: number, lng: number, delta: number) => void) | null>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (lat, lng, delta) => flyToCmd.current?.(lat, lng, delta),
  }));

  const {
    initialLat, initialLng, location, onPress, showCrosshair, wave,
    fireball, heavy, moderate, light_zone, thermal,
    burstType, detonated, craterRadius, showFallout, falloutPoly,
  } = props;

  const center: [number, number] = [location.latitude, location.longitude];
  const initial: [number, number] = [initialLat, initialLng];

  return (
    <div style={{ position: "absolute", inset: 0, background: "#000" }}>
      <MapContainer
        center={initial}
        zoom={12}
        style={{ width: "100%", height: "100%", background: "#0a0a0a" }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Tile escuro tipo NUKEMAP */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
          subdomains={["a", "b", "c", "d"]}
        />

        <MapController flyToCmd={flyToCmd} />
        <MapClickHandler onPress={onPress} />

        {showCrosshair && <Marker position={center} icon={crosshairIcon} />}

        {wave >= 1 && (
          <Circle center={center} radius={fireball} pathOptions={{ color: "#fff", weight: 2, fillColor: "#fff0c8", fillOpacity: 0.95 }} />
        )}
        {wave >= 2 && (
          <Circle center={center} radius={heavy} pathOptions={{ color: "#ff2200", weight: 1.5, fillColor: "#ff3c00", fillOpacity: 0.5 }} />
        )}
        {wave >= 3 && (
          <Circle center={center} radius={moderate} pathOptions={{ color: "#ff6600", weight: 1, fillColor: "#ff7800", fillOpacity: 0.3 }} />
        )}
        {wave >= 4 && (
          <Circle center={center} radius={light_zone} pathOptions={{ color: "#ffcc00", weight: 1, fillColor: "#ffc800", fillOpacity: 0.15 }} />
        )}
        {wave >= 5 && (
          <Circle center={center} radius={thermal} pathOptions={{ color: "rgba(255,100,0,0.5)", weight: 1, fillColor: "#ff5000", fillOpacity: 0.08 }} />
        )}

        {detonated && burstType === "ground" && craterRadius > 0 && (
          <Circle center={center} radius={craterRadius} pathOptions={{ color: "#3a2410", weight: 2, fillColor: "#28190c", fillOpacity: 0.92 }} />
        )}

        {showFallout && falloutPoly.length > 0 && (
          <Polygon
            positions={falloutPoly.map((p) => [p.latitude, p.longitude]) as [number, number][]}
            pathOptions={{ color: "rgba(120,255,120,0.7)", weight: 1.5, fillColor: "#50ff50", fillOpacity: 0.18 }}
          />
        )}
      </MapContainer>
    </div>
  );
});

NukeMap.displayName = "NukeMap";
export default NukeMap;
