import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

const { width, height } = Dimensions.get("window");

// ── CIDADES ───────────────────────────────────────────────────────────────────
const CITIES: Record<
  string,
  { latitude: number; longitude: number; population: number; country: string }
> = {
  "São Paulo": {
    latitude: -23.5505,
    longitude: -46.6333,
    population: 22000000,
    country: "BR",
  },
  "Nova York": {
    latitude: 40.7128,
    longitude: -74.006,
    population: 19000000,
    country: "US",
  },
  Tokyo: {
    latitude: 35.6762,
    longitude: 139.6503,
    population: 37000000,
    country: "JP",
  },
  Moscou: {
    latitude: 55.7558,
    longitude: 37.6173,
    population: 13000000,
    country: "RU",
  },
  Londres: {
    latitude: 51.5074,
    longitude: -0.1278,
    population: 9000000,
    country: "GB",
  },
  Pequim: {
    latitude: 39.9042,
    longitude: 116.4074,
    population: 21000000,
    country: "CN",
  },
  Paris: {
    latitude: 48.8566,
    longitude: 2.3522,
    population: 11000000,
    country: "FR",
  },
  "Los Angeles": {
    latitude: 34.0522,
    longitude: -118.2437,
    population: 13000000,
    country: "US",
  },
  "Rio de Janeiro": {
    latitude: -22.9068,
    longitude: -43.1729,
    population: 13000000,
    country: "BR",
  },
};

// ── ARSENAIS ─────────────────────────────────────────────────────────────────
const WEAPONS = [
  {
    id: "davy",
    name: "Davy Crockett",
    kt: 0.02,
    color: "#a8ff78",
    desc: "Menor arma nuclear já criada",
  },
  {
    id: "mk54",
    name: "W54 SADM",
    kt: 1,
    color: "#78ffd6",
    desc: "Mochila nuclear portátil",
  },
  {
    id: "hiroshima",
    name: "Little Boy",
    kt: 15,
    color: "#ffd200",
    desc: "Hiroshima, 1945",
  },
  {
    id: "nagasaki",
    name: "Fat Man",
    kt: 21,
    color: "#ff9500",
    desc: "Nagasaki, 1945",
  },
  {
    id: "b61",
    name: "B61",
    kt: 340,
    color: "#ff6b35",
    desc: "Bomba gravitacional OTAN",
  },
  {
    id: "trident",
    name: "Trident II",
    kt: 475,
    color: "#ff3b30",
    desc: "SLBM EUA — padrão atual",
  },
  {
    id: "tsar",
    name: "Tsar Bomba",
    kt: 50000,
    color: "#ff0080",
    desc: "Maior explosão da história",
  },
];

const darkMap = [
  { elementType: "geometry", stylers: [{ color: "#0a0a0a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#444" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#000" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a1a1a" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#050a0f" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);

  const [city, setCity] = useState("São Paulo");
  const [location, setLocation] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
  });
  const [weapon, setWeapon] = useState(WEAPONS[2]);
  const [wave, setWave] = useState(0);
  const [detonated, setDetonated] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [showWeapons, setShowWeapons] = useState(false);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalPop: 22000000,
    destroyed: 0,
    severe: 0,
    light: 0,
  });

  // animações
  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const warningAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(warningAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(warningAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const kt = weapon.kt;
  const radius = kt * 100; // metros, proporcional

  // Zonas de dano baseadas em kt reais (simplificado)
  const fireball = radius * 0.08;
  const heavy = radius * 0.3;
  const moderate = radius * 0.7;
  const light_zone = radius * 1.3;
  const thermal = radius * 2.0;

  function selectCity(name: string) {
    const data = CITIES[name];
    if (!data) return;
    setCity(name);
    setLocation({ latitude: data.latitude, longitude: data.longitude });
    setStats({ totalPop: data.population, destroyed: 0, severe: 0, light: 0 });
    setDetonated(false);
    setShowCities(false);
    mapRef.current?.animateToRegion(
      {
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.15,
      },
      900,
    );
  }

  function triggerDetonation() {
    if (detonated) {
      // reset
      setDetonated(false);
      setWave(0);
      setStats((s) => ({ ...s, destroyed: 0, severe: 0, light: 0 }));
      return;
    }

    const pop = CITIES[city]?.population || 1_000_000;
    const factor = Math.min(kt / 15, 1);

    setStats({
      totalPop: pop,
      destroyed: Math.floor(pop * 0.05 + pop * 0.2 * factor),
      severe: Math.floor(pop * 0.25 * (1 + factor * 0.5)),
      light: Math.floor(pop * 0.3),
    });

    // flash branco
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // shake
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -4,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();

    setWave(1);
    setTimeout(() => setWave(2), 250);
    setTimeout(() => setWave(3), 500);
    setTimeout(() => setWave(4), 750);
    setTimeout(() => {
      setWave(5);
      setDetonated(true);
    }, 1000);
  }

  const cityKeys = Object.keys(CITIES).filter(
    (c) => search === "" || c.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* MAPA */}
      <Animated.View
        style={[s.mapWrap, { transform: [{ translateX: shakeAnim }] }]}
      >
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          mapType="satellite"
          customMapStyle={darkMap}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.15,
            longitudeDelta: 0.15,
          }}
        >
          {/* Marcador */}
          <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={s.crosshair}>
              <View style={s.crosshairH} />
              <View style={s.crosshairV} />
              <View style={s.crosshairDot} />
            </View>
          </Marker>

          {/* Fireball */}
          {wave >= 1 && (
            <Circle
              center={location}
              radius={fireball}
              strokeColor="#fff"
              strokeWidth={2}
              fillColor="rgba(255,255,255,0.9)"
            />
          )}
          {/* Heavy blast */}
          {wave >= 2 && (
            <Circle
              center={location}
              radius={heavy}
              strokeColor="#ff2200"
              strokeWidth={1.5}
              fillColor="rgba(255,60,0,0.45)"
            />
          )}
          {/* Moderate */}
          {wave >= 3 && (
            <Circle
              center={location}
              radius={moderate}
              strokeColor="#ff6600"
              strokeWidth={1}
              fillColor="rgba(255,120,0,0.28)"
            />
          )}
          {/* Light */}
          {wave >= 4 && (
            <Circle
              center={location}
              radius={light_zone}
              strokeColor="#ffcc00"
              strokeWidth={1}
              fillColor="rgba(255,200,0,0.15)"
            />
          )}
          {/* Thermal */}
          {wave >= 5 && (
            <Circle
              center={location}
              radius={thermal}
              strokeColor="rgba(255,100,0,0.5)"
              strokeWidth={1}
              fillColor="rgba(255,80,0,0.07)"
            />
          )}
        </MapView>
      </Animated.View>

      {/* FLASH NUCLEAR */}
      <Animated.View
        pointerEvents="none"
        style={[s.flash, { opacity: flashAnim }]}
      />

      {/* HUD TOP */}
      <View style={s.hud}>
        <View style={s.hudLeft}>
          <Animated.Text style={[s.hudWarning, { opacity: warningAnim }]}>
            ☢ CLASSIFIED
          </Animated.Text>
          <Text style={s.hudCity}>{city.toUpperCase()}</Text>
        </View>
        <View style={s.hudRight}>
          <Text style={s.hudKt}>
            {kt >= 1000 ? `${kt / 1000} MT` : `${kt} KT`}
          </Text>
          <Text style={s.hudWeaponName}>{weapon.name}</Text>
        </View>
      </View>

      {/* PAINEL INFERIOR */}
      <View style={s.panel}>
        {/* LINHA: Cidade + Arma */}
        <View style={s.selectRow}>
          <Pressable style={s.selectBtn} onPress={() => setShowCities(true)}>
            <Text style={s.selectLabel}>ALVO</Text>
            <Text style={s.selectValue} numberOfLines={1}>
              {city}
            </Text>
            <Text style={s.selectArrow}>▼</Text>
          </Pressable>

          <Pressable
            style={[s.selectBtn, { borderColor: weapon.color }]}
            onPress={() => setShowWeapons(true)}
          >
            <Text style={s.selectLabel}>ARSENAL</Text>
            <Text
              style={[s.selectValue, { color: weapon.color }]}
              numberOfLines={1}
            >
              {weapon.name}
            </Text>
            <Text style={[s.selectArrow, { color: weapon.color }]}>▼</Text>
          </Pressable>
        </View>

        {/* STATS */}
        {detonated && (
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={s.statIcon}>💀</Text>
              <Text style={s.statVal}>{fmt(stats.destroyed)}</Text>
              <Text style={s.statLbl}>MORTES</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statIcon}>🏚</Text>
              <Text style={s.statVal}>{fmt(stats.severe)}</Text>
              <Text style={s.statLbl}>CRÍTICOS</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statIcon}>🏠</Text>
              <Text style={s.statVal}>{fmt(stats.light)}</Text>
              <Text style={s.statLbl}>FERIDOS</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statIcon}>👥</Text>
              <Text style={s.statVal}>{fmt(stats.totalPop)}</Text>
              <Text style={s.statLbl}>POPULAÇÃO</Text>
            </View>
          </View>
        )}

        {/* ZONAS */}
        {detonated && (
          <View style={s.zonesRow}>
            {[
              { color: "#fff", label: "Bola de fogo" },
              { color: "#ff2200", label: "Destruição total" },
              { color: "#ff6600", label: "Dano moderado" },
              { color: "#ffcc00", label: "Dano leve" },
              { color: "#ff8844", label: "Queimaduras térmicas" },
            ].map((z) => (
              <View key={z.label} style={s.zoneItem}>
                <View style={[s.zoneDot, { backgroundColor: z.color }]} />
                <Text style={s.zoneLabel}>{z.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* BOTÃO */}
        <Pressable
          style={({ pressed }) => [
            s.detonateBtn,
            detonated && s.resetBtn,
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
          onPress={triggerDetonation}
        >
          <Text style={s.detBtnText}>
            {detonated ? "⟳  RESETAR SIMULAÇÃO" : "☢  DETONAR"}
          </Text>
        </Pressable>
      </View>

      {/* MODAL — SELECIONAR CIDADE */}
      <Modal visible={showCities} transparent animationType="slide">
        <View style={s.modal}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>SELECIONAR ALVO</Text>
            <TextInput
              style={s.modalSearch}
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar cidade..."
              placeholderTextColor="#444"
            />
            <ScrollView>
              {cityKeys.map((c) => (
                <Pressable
                  key={c}
                  style={s.modalItem}
                  onPress={() => selectCity(c)}
                >
                  <Text style={s.modalItemText}>{c}</Text>
                  <Text style={s.modalItemSub}>
                    Pop. {fmt(CITIES[c].population)} · {CITIES[c].country}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={s.modalClose}
              onPress={() => setShowCities(false)}
            >
              <Text style={s.modalCloseText}>CANCELAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL — SELECIONAR ARMA */}
      <Modal visible={showWeapons} transparent animationType="slide">
        <View style={s.modal}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>SELECIONAR ARSENAL</Text>
            <ScrollView>
              {WEAPONS.map((w) => (
                <Pressable
                  key={w.id}
                  style={[
                    s.weaponItem,
                    weapon.id === w.id && {
                      borderColor: w.color,
                      borderWidth: 1.5,
                    },
                  ]}
                  onPress={() => {
                    setWeapon(w);
                    setShowWeapons(false);
                    setDetonated(false);
                    setWave(0);
                  }}
                >
                  <View style={[s.weaponDot, { backgroundColor: w.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[s.weaponName, { color: w.color }]}>
                      {w.name}
                    </Text>
                    <Text style={s.weaponDesc}>{w.desc}</Text>
                  </View>
                  <Text style={[s.weaponKt, { color: w.color }]}>
                    {w.kt >= 1000 ? `${w.kt / 1000}MT` : `${w.kt}KT`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={s.modalClose}
              onPress={() => setShowWeapons(false)}
            >
              <Text style={s.modalCloseText}>CANCELAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const RED = "#ff3b30";
const YELLOW = "#ffd200";
const DIM = "#1a1a1a";
const BORDER = "#2a2a2a";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },

  mapWrap: { ...StyleSheet.absoluteFillObject },

  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    zIndex: 99,
  },

  // HUD
  hud: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight ?? 32) + 8 : 54,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  hudLeft: { gap: 2 },
  hudRight: { alignItems: "flex-end" },
  hudWarning: {
    color: RED,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 4,
  },
  hudCity: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  hudKt: {
    color: YELLOW,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 1 },
  },
  hudWeaponName: {
    color: "#aaa",
    fontSize: 11,
    letterSpacing: 1,
  },

  // CROSSHAIR
  crosshair: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  crosshairH: {
    position: "absolute",
    width: 40,
    height: 1,
    backgroundColor: RED,
  },
  crosshairV: {
    position: "absolute",
    width: 1,
    height: 40,
    backgroundColor: RED,
  },
  crosshairDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: RED,
    backgroundColor: "transparent",
  },

  // PANEL
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.93)",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: Platform.OS === "ios" ? 32 : 18,
    gap: 12,
  },

  selectRow: {
    flexDirection: "row",
    gap: 10,
  },
  selectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DIM,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  selectLabel: {
    color: "#555",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  selectValue: { flex: 1, color: "#fff", fontSize: 13, fontWeight: "700" },
  selectArrow: { color: "#555", fontSize: 10 },

  // STATS
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: DIM,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    gap: 2,
  },
  statIcon: { fontSize: 16 },
  statVal: { color: "#fff", fontSize: 14, fontWeight: "900" },
  statLbl: { color: "#555", fontSize: 8, fontWeight: "700", letterSpacing: 1 },

  // ZONAS
  zonesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  zoneItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  zoneLabel: {
    color: "#666",
    fontSize: 10,
    fontWeight: "600",
  },

  // DETONAR
  detonateBtn: {
    backgroundColor: RED,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
  },
  detBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 3,
  },

  // MODAL
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#0d0d0d",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: "#222",
    padding: 20,
    maxHeight: height * 0.72,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 14,
  },
  modalSearch: {
    backgroundColor: DIM,
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalItem: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },
  modalItemText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  modalItemSub: { color: "#555", fontSize: 11, marginTop: 2 },
  modalClose: {
    marginTop: 14,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalCloseText: {
    color: "#666",
    fontWeight: "700",
    letterSpacing: 2,
    fontSize: 12,
  },

  // WEAPONS
  weaponItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DIM,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BORDER,
    gap: 12,
  },
  weaponDot: { width: 10, height: 10, borderRadius: 5 },
  weaponName: { fontSize: 14, fontWeight: "800" },
  weaponDesc: { color: "#555", fontSize: 11, marginTop: 2 },
  weaponKt: { fontSize: 13, fontWeight: "900" },
});
