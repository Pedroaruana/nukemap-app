// NukeMap (NATIVE) — usa react-native-maps. Web tem versão paralela (.web.tsx) com Leaflet.
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Circle, MapPressEvent, Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";

const darkMap = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#444" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#050a0f" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

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
  falloutPoly: { latitude: number; longitude: number }[];
}

const NukeMap = forwardRef<NukeMapRef, NukeMapProps>((props, ref) => {
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    flyTo: (lat, lng, delta) => {
      mapRef.current?.animateToRegion(
        { latitude: lat, longitude: lng, latitudeDelta: delta, longitudeDelta: delta },
        900,
      );
    },
  }));

  const {
    initialLat, initialLng, location, onPress, showCrosshair, wave,
    fireball, heavy, moderate, light_zone, thermal,
    burstType, detonated, craterRadius, showFallout, falloutPoly,
  } = props;

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
      mapType="satellite"
      customMapStyle={darkMap}
      onPress={(e: MapPressEvent) => {
        const c = e.nativeEvent.coordinate;
        onPress?.(c.latitude, c.longitude);
      }}
      initialRegion={{ latitude: initialLat, longitude: initialLng, latitudeDelta: 0.15, longitudeDelta: 0.15 }}
    >
      {showCrosshair && (
        <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={s.crosshair}>
            <View style={s.crosshairH} />
            <View style={s.crosshairV} />
            <View style={s.crosshairDot} />
            <View style={s.crosshairRing} />
          </View>
        </Marker>
      )}

      {wave >= 1 && (
        <Circle center={location} radius={fireball} strokeColor="#fff" strokeWidth={2} fillColor="rgba(255,240,200,0.95)" />
      )}
      {wave >= 2 && (
        <Circle center={location} radius={heavy} strokeColor="#ff2200" strokeWidth={1.5} fillColor="rgba(255,60,0,0.5)" />
      )}
      {wave >= 3 && (
        <Circle center={location} radius={moderate} strokeColor="#ff6600" strokeWidth={1} fillColor="rgba(255,120,0,0.3)" />
      )}
      {wave >= 4 && (
        <Circle center={location} radius={light_zone} strokeColor="#ffcc00" strokeWidth={1} fillColor="rgba(255,200,0,0.15)" />
      )}
      {wave >= 5 && (
        <Circle center={location} radius={thermal} strokeColor="rgba(255,100,0,0.5)" strokeWidth={1} fillColor="rgba(255,80,0,0.08)" />
      )}

      {detonated && burstType === "ground" && craterRadius > 0 && (
        <Circle center={location} radius={craterRadius} strokeColor="#3a2410" strokeWidth={2} fillColor="rgba(40,25,12,0.92)" />
      )}

      {showFallout && (
        <Polygon coordinates={falloutPoly} strokeColor="rgba(120,255,120,0.7)" strokeWidth={1.5} fillColor="rgba(80,255,80,0.18)" />
      )}
    </MapView>
  );
});

NukeMap.displayName = "NukeMap";
export default NukeMap;

const RED = "#ff3b30";
const s = StyleSheet.create({
  crosshair: { width: 50, height: 50, justifyContent: "center", alignItems: "center" },
  crosshairH: { position: "absolute", width: 50, height: 1, backgroundColor: RED },
  crosshairV: { position: "absolute", width: 1, height: 50, backgroundColor: RED },
  crosshairDot: { width: 8, height: 8, borderRadius: 4, borderWidth: 2, borderColor: RED, backgroundColor: "transparent" },
  crosshairRing: { position: "absolute", width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: "rgba(255,59,48,0.4)" },
});
