import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);

  const [city, setCity] = useState("São Paulo");

  const [location, setLocation] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
  });

  const [power, setPower] = useState(50000);

  const [wave, setWave] = useState(0);

  const [stats, setStats] = useState({
    totalPop: 22000000,
    destroyed: 0,
    severe: 0,
    light: 0,
  });

  function getPopulation(cityName: string) {
    const cities: any = {
      "São Paulo": 22000000,
      "Nova York": 19000000,
      Tokyo: 37000000,
      Moscou: 13000000,
    };

    return cities[cityName] || 1000000;
  }

  function calculateImpact() {
    const pop = getPopulation(city);

    setStats({
      totalPop: pop,
      destroyed: Math.floor(pop * 0.25),
      severe: Math.floor(pop * 0.45),
      light: Math.floor(pop * 0.3),
    });
  }

  function searchCity() {
    const cities: any = {
      "São Paulo": { latitude: -23.5505, longitude: -46.6333 },
      "Nova York": { latitude: 40.7128, longitude: -46.6333 },
      Tokyo: { latitude: 35.6762, longitude: 139.6503 },
      Moscou: { latitude: 55.7558, longitude: 37.6173 },
    };

    const result = cities[city];
    if (!result) return;

    setLocation(result);

    mapRef.current?.animateToRegion(
      {
        ...result,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      },
      800,
    );
  }

  function simulateExplosion() {
    calculateImpact();

    // 💥 animação em 3 ondas
    setWave(1);

    setTimeout(() => setWave(2), 200);
    setTimeout(() => setWave(3), 400);
    setTimeout(() => setWave(0), 900);
  }

  const radius = power * 0.1;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="satellite"
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        <Marker coordinate={location} />

        {/* 💥 ONDA 1 (FORTE) */}
        {wave >= 1 && (
          <Circle
            center={location}
            radius={radius * 0.4}
            strokeColor="white"
            fillColor="rgba(255,0,0,0.35)"
          />
        )}

        {/* 💥 ONDA 2 (MÉDIA) */}
        {wave >= 2 && (
          <Circle
            center={location}
            radius={radius * 0.8}
            strokeColor="orange"
            fillColor="rgba(255,165,0,0.25)"
          />
        )}

        {/* 💥 ONDA 3 (GRANDE / PRESSÃO) */}
        {wave >= 3 && (
          <Circle
            center={location}
            radius={radius * 1.3}
            strokeColor="yellow"
            fillColor="rgba(255,255,0,0.15)"
          />
        )}
      </MapView>

      <View style={styles.panel}>
        <Text style={styles.title}>NUKEMAP SIMULATOR</Text>

        <TextInput style={styles.input} value={city} onChangeText={setCity} />

        <Pressable style={styles.button} onPress={searchCity}>
          <Text style={styles.buttonText}>🔎 Pesquisar cidade</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "#ff9500" }]}
          onPress={simulateExplosion}
        >
          <Text style={styles.buttonText}>💥 Simular explosão</Text>
        </Pressable>

        {/* 📊 INFO */}
        <View style={styles.damageBox}>
          <Text style={styles.damageText}>
            🏙️ População: {stats.totalPop.toLocaleString()}
          </Text>
          <Text style={styles.damageText}>
            💀 Mortes: {stats.destroyed.toLocaleString()}
          </Text>
          <Text style={styles.damageText}>
            🏚️ Feridos graves: {stats.severe.toLocaleString()}
          </Text>
          <Text style={styles.damageText}>
            🏠 Feridos leves: {stats.light.toLocaleString()}
          </Text>
        </View>

        {/* POTÊNCIA */}
        <View style={styles.row}>
          <Pressable onPress={() => setPower(1000)} style={styles.small}>
            <Text style={styles.text}>1 kt</Text>
          </Pressable>

          <Pressable onPress={() => setPower(50000)} style={styles.small}>
            <Text style={styles.text}>50 kt</Text>
          </Pressable>

          <Pressable onPress={() => setPower(100000)} style={styles.small}>
            <Text style={styles.text}>100 kt</Text>
          </Pressable>

          <Pressable onPress={() => setPower(1000000)} style={styles.small}>
            <Text style={styles.text}>1 mt</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.92)",
    padding: 16,
  },

  title: {
    color: "#ff3b30",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#ff3b30",
    padding: 10,
    marginBottom: 8,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  damageBox: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#111",
    borderRadius: 8,
  },

  damageText: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  small: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 6,
  },

  text: {
    color: "#fff",
    fontSize: 12,
  },
});
