import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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
import NukeMap, { NukeMapRef } from "../../components/NukeMap";

const { width, height } = Dimensions.get("window");

// ── CIDADES (50+) ────────────────────────────────────────────────────────────
type City = {
  latitude: number; longitude: number; population: number; country: string;
  density: number; // pessoas/km² no centro urbano (para cálculo de baixas)
};
const CITIES: Record<string, City> = {
  "São Paulo":       { latitude: -23.5505, longitude: -46.6333, population: 22000000, country: "BR", density: 7400 },
  "Rio de Janeiro":  { latitude: -22.9068, longitude: -43.1729, population: 13000000, country: "BR", density: 5400 },
  "Brasília":        { latitude: -15.7939, longitude: -47.8828, population: 4600000,  country: "BR", density: 480 },
  "Salvador":        { latitude: -12.9777, longitude: -38.5016, population: 3900000,  country: "BR", density: 3800 },
  "Belo Horizonte":  { latitude: -19.9167, longitude: -43.9345, population: 6000000,  country: "BR", density: 7200 },
  "Manaus":          { latitude:  -3.1190, longitude: -60.0217, population: 2200000,  country: "BR", density: 158 },
  "Curitiba":        { latitude: -25.4284, longitude: -49.2733, population: 1960000,  country: "BR", density: 4000 },
  "Porto Alegre":    { latitude: -30.0346, longitude: -51.2177, population: 1490000,  country: "BR", density: 2800 },
  "Recife":          { latitude:  -8.0476, longitude: -34.8770, population: 4100000,  country: "BR", density: 7000 },
  "Fortaleza":       { latitude:  -3.7172, longitude: -38.5433, population: 4100000,  country: "BR", density: 8000 },

  "Nova York":       { latitude:  40.7128, longitude: -74.0060, population: 19000000, country: "US", density: 11000 },
  "Los Angeles":     { latitude:  34.0522, longitude: -118.2437,population: 13000000, country: "US", density: 3200 },
  "Chicago":         { latitude:  41.8781, longitude: -87.6298, population: 9500000,  country: "US", density: 4600 },
  "Washington DC":   { latitude:  38.9072, longitude: -77.0369, population: 6300000,  country: "US", density: 4300 },
  "Miami":           { latitude:  25.7617, longitude: -80.1918, population: 6200000,  country: "US", density: 5000 },
  "São Francisco":   { latitude:  37.7749, longitude: -122.4194,population: 4700000,  country: "US", density: 7200 },
  "Las Vegas":       { latitude:  36.1699, longitude: -115.1398,population: 2300000,  country: "US", density: 1800 },
  "Houston":         { latitude:  29.7604, longitude: -95.3698, population: 7100000,  country: "US", density: 1400 },

  "Cidade do México":{ latitude:  19.4326, longitude: -99.1332, population: 22000000, country: "MX", density: 6000 },
  "Buenos Aires":    { latitude: -34.6037, longitude: -58.3816, population: 15000000, country: "AR", density: 14400 },
  "Lima":            { latitude: -12.0464, longitude: -77.0428, population: 10700000, country: "PE", density: 3300 },
  "Bogotá":          { latitude:   4.7110, longitude: -74.0721, population: 10900000, country: "CO", density: 4300 },
  "Santiago":        { latitude: -33.4489, longitude: -70.6693, population: 6800000,  country: "CL", density: 8500 },

  "Londres":         { latitude:  51.5074, longitude:  -0.1278, population: 9000000,  country: "GB", density: 5700 },
  "Paris":           { latitude:  48.8566, longitude:   2.3522, population: 11000000, country: "FR", density: 21000 },
  "Berlim":          { latitude:  52.5200, longitude:  13.4050, population: 3700000,  country: "DE", density: 4100 },
  "Madrid":          { latitude:  40.4168, longitude:  -3.7038, population: 6700000,  country: "ES", density: 5400 },
  "Roma":            { latitude:  41.9028, longitude:  12.4964, population: 4300000,  country: "IT", density: 2200 },
  "Lisboa":          { latitude:  38.7223, longitude:  -9.1393, population: 2900000,  country: "PT", density: 5200 },
  "Amsterdã":        { latitude:  52.3676, longitude:   4.9041, population: 1170000,  country: "NL", density: 5200 },
  "Atenas":          { latitude:  37.9838, longitude:  23.7275, population: 3150000,  country: "GR", density: 7500 },
  "Estocolmo":       { latitude:  59.3293, longitude:  18.0686, population: 1650000,  country: "SE", density: 5200 },
  "Viena":           { latitude:  48.2082, longitude:  16.3738, population: 1950000,  country: "AT", density: 4700 },
  "Kiev":            { latitude:  50.4501, longitude:  30.5234, population: 2960000,  country: "UA", density: 3300 },

  "Moscou":          { latitude:  55.7558, longitude:  37.6173, population: 13000000, country: "RU", density: 5000 },
  "São Petersburgo": { latitude:  59.9311, longitude:  30.3609, population: 5400000,  country: "RU", density: 3800 },
  "Istanbul":        { latitude:  41.0082, longitude:  28.9784, population: 15500000, country: "TR", density: 2900 },
  "Cairo":           { latitude:  30.0444, longitude:  31.2357, population: 21000000, country: "EG", density: 19000 },
  "Tel Aviv":        { latitude:  32.0853, longitude:  34.7818, population: 4500000,  country: "IL", density: 8300 },
  "Teerã":           { latitude:  35.6892, longitude:  51.3890, population: 9500000,  country: "IR", density: 11800 },
  "Riade":           { latitude:  24.7136, longitude:  46.6753, population: 7700000,  country: "SA", density: 4500 },
  "Dubai":           { latitude:  25.2048, longitude:  55.2708, population: 3500000,  country: "AE", density: 3400 },

  "Tóquio":          { latitude:  35.6762, longitude: 139.6503, population: 37000000, country: "JP", density: 6200 },
  "Osaka":           { latitude:  34.6937, longitude: 135.5023, population: 19000000, country: "JP", density: 11800 },
  "Pequim":          { latitude:  39.9042, longitude: 116.4074, population: 21000000, country: "CN", density: 1300 },
  "Xangai":          { latitude:  31.2304, longitude: 121.4737, population: 28000000, country: "CN", density: 3800 },
  "Hong Kong":       { latitude:  22.3193, longitude: 114.1694, population: 7500000,  country: "HK", density: 6800 },
  "Seul":            { latitude:  37.5665, longitude: 126.9780, population: 9700000,  country: "KR", density: 16000 },
  "Pyongyang":       { latitude:  39.0392, longitude: 125.7625, population: 3100000,  country: "KP", density: 5400 },
  "Taipé":           { latitude:  25.0330, longitude: 121.5654, population: 2700000,  country: "TW", density: 9800 },
  "Bangkok":         { latitude:  13.7563, longitude: 100.5018, population: 10500000, country: "TH", density: 5300 },
  "Singapura":       { latitude:   1.3521, longitude: 103.8198, population: 5900000,  country: "SG", density: 8400 },
  "Mumbai":          { latitude:  19.0760, longitude:  72.8777, population: 20400000, country: "IN", density: 21000 },
  "Nova Delhi":      { latitude:  28.6139, longitude:  77.2090, population: 32000000, country: "IN", density: 11300 },
  "Karachi":         { latitude:  24.8607, longitude:  67.0011, population: 16000000, country: "PK", density: 24000 },
  "Jacarta":         { latitude:  -6.2088, longitude: 106.8456, population: 10800000, country: "ID", density: 15300 },

  "Sydney":          { latitude: -33.8688, longitude: 151.2093, population: 5300000,  country: "AU", density: 2100 },
  "Joanesburgo":     { latitude: -26.2041, longitude:  28.0473, population: 5900000,  country: "ZA", density: 2900 },
  "Lagos":           { latitude:   6.5244, longitude:   3.3792, population: 15400000, country: "NG", density: 13700 },
};

// Densidade padrão para alvos personalizados / GPS
const DEFAULT_DENSITY = 3000;

// ── ARSENAL (15+) ─────────────────────────────────────────────────────────────
type BombShape = "gravity" | "sphere" | "mirv" | "tsar";
type Weapon = {
  id: string; name: string; kt: number; color: string;
  desc: string; year: string; country: string; shape: BombShape;
};
const WEAPONS: Weapon[] = [
  { id: "davy",      name: "Davy Crockett", kt: 0.02,  color: "#a8ff78", desc: "Menor arma nuclear já criada",       year: "1961", country: "🇺🇸", shape: "sphere" },
  { id: "sadm",      name: "W54 SADM",      kt: 1,     color: "#78ffd6", desc: "Mochila nuclear portátil",            year: "1964", country: "🇺🇸", shape: "sphere" },
  { id: "artillery", name: "W48 155mm",     kt: 0.072, color: "#bbff66", desc: "Projétil de artilharia nuclear",      year: "1963", country: "🇺🇸", shape: "gravity" },
  { id: "tactical",  name: "B57 Tática",    kt: 5,     color: "#9effa0", desc: "Bomba tática anti-submarino",         year: "1963", country: "🇺🇸", shape: "gravity" },
  { id: "hiroshima", name: "Little Boy",    kt: 15,    color: "#ffd200", desc: "Hiroshima — 6 ago 1945",              year: "1945", country: "🇺🇸", shape: "gravity" },
  { id: "nagasaki",  name: "Fat Man",       kt: 21,    color: "#ff9500", desc: "Nagasaki — 9 ago 1945",               year: "1945", country: "🇺🇸", shape: "sphere" },
  { id: "trinity",   name: "Trinity Gadget",kt: 22,    color: "#ffb700", desc: "Primeiro teste nuclear da história",  year: "1945", country: "🇺🇸", shape: "sphere" },
  { id: "rds1",      name: "RDS-1 (Joe-1)", kt: 22,    color: "#ff8855", desc: "Primeira bomba soviética",            year: "1949", country: "🇷🇺", shape: "sphere" },
  { id: "w76",       name: "W76 SLBM",      kt: 100,   color: "#ff7733", desc: "Ogiva submarina padrão americana",    year: "1978", country: "🇺🇸", shape: "mirv" },
  { id: "b61",       name: "B61-12",        kt: 340,   color: "#ff6b35", desc: "Bomba gravitacional OTAN moderna",    year: "2020", country: "🇺🇸", shape: "gravity" },
  { id: "trident",   name: "Trident II D5", kt: 475,   color: "#ff5522", desc: "SLBM submarina — padrão atual",       year: "1990", country: "🇺🇸", shape: "mirv" },
  { id: "topol",     name: "RS-24 Yars",    kt: 800,   color: "#ff3b30", desc: "ICBM russo MIRV moderno",             year: "2010", country: "🇷🇺", shape: "mirv" },
  { id: "w88",       name: "W88",           kt: 475,   color: "#ff4444", desc: "Ogiva mais avançada dos EUA",         year: "1989", country: "🇺🇸", shape: "mirv" },
  { id: "df41",      name: "DF-41",         kt: 1000,  color: "#ff2266", desc: "ICBM chinês de longo alcance",        year: "2017", country: "🇨🇳", shape: "mirv" },
  { id: "b83",       name: "B83",           kt: 1200,  color: "#ff1144", desc: "Maior bomba ativa dos EUA",           year: "1983", country: "🇺🇸", shape: "gravity" },
  { id: "satan",     name: "R-36 Satan",    kt: 20000, color: "#ff0066", desc: "ICBM soviético — 10 ogivas MIRV",     year: "1974", country: "🇷🇺", shape: "mirv" },
  { id: "tsar",      name: "Tsar Bomba",    kt: 50000, color: "#ff0080", desc: "Maior explosão da história — URSS",   year: "1961", country: "🇷🇺", shape: "tsar" },
];

// ── COMPONENTE: BOMBA 3D ─────────────────────────────────────────────────────
function Bomb3D({ shape, color }: { shape: BombShape; color: string }) {
  if (shape === "gravity") {
    // Bomba de gravidade tipo B83/Little Boy — cilindro alongado com nose cone e aletas
    return (
      <View style={{ alignItems: "center" }}>
        {/* nose cone */}
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 10,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color,
        }} />
        {/* corpo */}
        <View style={{
          width: 14, height: 36,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 0.9, shadowRadius: 8,
        }}>
          <View style={{ position: "absolute", top: 6, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 14, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 22, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
        </View>
        {/* aletas em X */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: -3 }}>
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 12, borderRightWidth: 10,
            borderBottomColor: "transparent", borderRightColor: color,
          }} />
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 12, borderLeftWidth: 10,
            borderBottomColor: "transparent", borderLeftColor: color,
          }} />
        </View>
      </View>
    );
  }

  if (shape === "sphere") {
    // Fat Man — esfera com aletas
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 12,
        }}>
          {/* highlight pra dar profundidade */}
          <View style={{
            position: "absolute", top: 4, left: 6,
            width: 14, height: 10, borderRadius: 7,
            backgroundColor: "rgba(255,255,255,0.35)",
          }} />
          {/* rebites/parafusos */}
          <View style={{ position: "absolute", top: 12, right: 4, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", bottom: 12, left: 6, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
        </View>
        {/* aletas atrás */}
        <View style={{ flexDirection: "row", marginTop: -4 }}>
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 8, borderRightWidth: 6,
            borderBottomColor: "transparent", borderRightColor: color,
          }} />
          <View style={{ width: 4 }} />
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 8, borderLeftWidth: 6,
            borderBottomColor: "transparent", borderLeftColor: color,
          }} />
        </View>
      </View>
    );
  }

  if (shape === "tsar") {
    // Tsar Bomba — gigante prata com nose arredondado
    return (
      <View style={{ alignItems: "center" }}>
        {/* nose arredondado */}
        <View style={{
          width: 18, height: 14,
          borderTopLeftRadius: 9, borderTopRightRadius: 9,
          backgroundColor: color,
        }} />
        {/* corpo gordo */}
        <View style={{
          width: 22, height: 32,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 14,
        }}>
          <View style={{ position: "absolute", top: 5, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 14, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 23, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          {/* highlight */}
          <View style={{ position: "absolute", top: 3, left: 2, width: 4, height: 24, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </View>
        {/* aletas largas */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: -3 }}>
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 11, borderRightWidth: 12,
            borderBottomColor: "transparent", borderRightColor: color,
          }} />
          <View style={{
            width: 0, height: 0,
            borderBottomWidth: 11, borderLeftWidth: 12,
            borderBottomColor: "transparent", borderLeftColor: color,
          }} />
        </View>
      </View>
    );
  }

  // MIRV — cluster de cones reentry vehicles
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 1 }}>
        {/* cone esquerdo (atrás) */}
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 22,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color, opacity: 0.55,
          transform: [{ scaleY: 0.85 }],
        }} />
        {/* cone central (maior, frente) */}
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 32,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 10,
        }} />
        {/* cone direito (atrás) */}
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 22,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color, opacity: 0.55,
          transform: [{ scaleY: 0.85 }],
        }} />
      </View>
      {/* base circular do bus */}
      <View style={{
        width: 32, height: 6,
        borderRadius: 3,
        backgroundColor: color,
        opacity: 0.8,
        marginTop: 1,
        shadowColor: color, shadowOpacity: 0.8, shadowRadius: 6,
      }} />
      {/* segunda base mais fina */}
      <View style={{
        width: 36, height: 3,
        borderRadius: 2,
        backgroundColor: color,
        opacity: 0.5,
        marginTop: 1,
      }} />
    </View>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return Math.floor(n).toString();
}

// Gera polígono de fallout (forma de gota com vento)
function falloutPolygon(
  center: { latitude: number; longitude: number },
  radiusKm: number,
  windDeg: number,
  windStrength: number,
) {
  const points: { latitude: number; longitude: number }[] = [];
  const steps = 60;
  const rad = (windDeg * Math.PI) / 180;
  // converte km → graus aprox
  const kmToLat = 1 / 111;
  const kmToLng = 1 / (111 * Math.cos((center.latitude * Math.PI) / 180));

  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    // gota: alonga na direção do vento
    const dirAlign = Math.cos(a - rad);
    const stretch = 1 + windStrength * Math.max(0, dirAlign) * 2.5;
    const r = radiusKm * stretch * (0.6 + 0.4 * Math.random() * 0.3 + 0.4);
    points.push({
      latitude: center.latitude + Math.sin(a) * r * kmToLat,
      longitude: center.longitude + Math.cos(a) * r * kmToLng,
    });
  }
  return points;
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function HomeScreen() {
  const mapRef = useRef<NukeMapRef>(null);

  const [city, setCity] = useState("São Paulo");
  const [customTarget, setCustomTarget] = useState(false);
  const [location, setLocation] = useState({ latitude: -23.5505, longitude: -46.6333 });
  const [weapon, setWeapon] = useState(WEAPONS[4]);
  const [wave, setWave] = useState(0);
  const [detonated, setDetonated] = useState(false);
  const [showCities, setShowCities] = useState(false);
  const [showWeapons, setShowWeapons] = useState(false);
  const [showFallout, setShowFallout] = useState(false);
  const [search, setSearch] = useState("");
  const [windDeg] = useState(() => Math.random() * 360);
  const [windStrength] = useState(() => 0.5 + Math.random() * 0.5);

  const [stats, setStats] = useState({
    totalPop: 22000000, destroyed: 0, severe: 0, light: 0, fallout: 0,
  });
  const [currentDensity, setCurrentDensity] = useState(7400);
  const [burstType, setBurstType] = useState<"air" | "ground" | null>(null);
  const [showBurstInfo, setShowBurstInfo] = useState(false);
  const [altitude, setAltitude] = useState(580); // metros — altura de Hiroshima
  const [timelineStep, setTimelineStep] = useState(-1);
  const [panelMinimized, setPanelMinimized] = useState(false);

  // animações
  const flashAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const warningAnim = useRef(new Animated.Value(1)).current;
  const fireballScale = useRef(new Animated.Value(0)).current;
  const shockwaveScale = useRef(new Animated.Value(0)).current;
  const shockwaveOpacity = useRef(new Animated.Value(0)).current;
  const mushroomY = useRef(new Animated.Value(50)).current;
  const mushroomOpacity = useRef(new Animated.Value(0)).current;
  const weaponSpin = useRef(new Animated.Value(0)).current;
  const weaponTilt = useRef(new Animated.Value(0)).current;
  const falloutAnim = useRef(new Animated.Value(0)).current;

  // pulse de alerta no header
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(warningAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(warningAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  // animação 3D de rotação contínua quando modal de armas está aberto
  useEffect(() => {
    if (showWeapons) {
      Animated.loop(
        Animated.timing(weaponSpin, {
          toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true,
        }),
      ).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(weaponTilt, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(weaponTilt, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      weaponSpin.stopAnimation();
      weaponTilt.stopAnimation();
      weaponSpin.setValue(0);
      weaponTilt.setValue(0);
    }
  }, [showWeapons]);

  const kt = weapon.kt;

  // Escala realista (cube-root law, calibrada contra NUKEMAP / Glasstone-Dolan)
  // Referência Little Boy (15 kt): fireball ~150m, 20psi ~0.9km, 5psi ~1.7km, 1psi ~4.4km, queimadura ~2.1km
  const cbrt = Math.cbrt(kt);
  // Altura ótima (HOB) para maximizar 5psi — fórmula de Glasstone-Dolan
  const optimalHOB = 220 * cbrt;
  // Penalidade quando altitude se afasta do ótimo (parabólica)
  const altOffset = burstType === "air" ? Math.abs(altitude - optimalHOB) / Math.max(optimalHOB, 1) : 0;
  const altPenalty = Math.max(0.65, 1 - altOffset * altOffset * 0.45);

  const blastMult = burstType === "air" ? 1.30 * altPenalty : burstType === "ground" ? 0.95 : 1.0;
  const thermalMult = burstType === "air" ? 1.20 * altPenalty : burstType === "ground" ? 0.70 : 1.0;
  const falloutMult = burstType === "ground" ? 4.5 : burstType === "air" ? 0.2 : 1.0;

  const fireball = 60 * cbrt * (burstType === "ground" ? 1.1 : 1.0);
  const heavy = 320 * cbrt * blastMult;
  const moderate = 640 * cbrt * blastMult;
  const light_zone = 1730 * cbrt * blastMult;
  const thermal = 700 * Math.pow(kt, 0.41) * thermalMult;
  const craterRadius = burstType === "ground" ? 45 * Math.pow(kt, 0.3) : 0;

  // ── ÁUDIO ──────────────────────────────────────────────────────────────────
  const sirenPlayer = useAudioPlayer(require("../../assets/sounds/siren.wav"));
  const boomPlayer = useAudioPlayer(require("../../assets/sounds/boom.wav"));
  const rumblePlayer = useAudioPlayer(require("../../assets/sounds/rumble.wav"));

  function playSiren() {
    try { sirenPlayer.seekTo(0); sirenPlayer.play(); } catch {}
  }
  function playBoom() {
    try { boomPlayer.seekTo(0); boomPlayer.play(); } catch {}
    try {
      rumblePlayer.volume = 0.7;
      rumblePlayer.seekTo(0);
      setTimeout(() => { try { rumblePlayer.play(); } catch {} }, 200);
    } catch {}
  }

  // fallout (em metros) — proporcional à raiz cúbica do kt
  const falloutRadiusKm = Math.pow(kt, 1 / 3) * 4 * windStrength * falloutMult;

  function locateMe() {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const pos = await Location.getCurrentPositionAsync({});
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const coord = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setLocation(coord);
        setCity("MINHA POSIÇÃO");
        setCustomTarget(true);
        setCurrentDensity(2000); // densidade suburbana
        setStats({ totalPop: 500000, destroyed: 0, severe: 0, light: 0, fallout: 0 });
        setDetonated(false);
        setWave(0);
        mapRef.current?.flyTo(coord.latitude, coord.longitude, 0.15);
      } catch (e) {
        console.warn(e);
      }
    })();
  }

  function selectCity(name: string) {
    const data = CITIES[name];
    if (!data) return;
    Haptics.selectionAsync();
    setCity(name);
    setCustomTarget(false);
    setLocation({ latitude: data.latitude, longitude: data.longitude });
    setCurrentDensity(data.density);
    setStats({ totalPop: data.population, destroyed: 0, severe: 0, light: 0, fallout: 0 });
    setDetonated(false);
    setWave(0);
    setShowCities(false);
    mapRef.current?.flyTo(data.latitude, data.longitude, 0.15);
  }

  function handleMapPress(lat: number, lng: number) {
    if (detonated || wave > 0) return; // trava o mapa durante/depois da explosão
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocation({ latitude: lat, longitude: lng });
    setCity("ALVO PERSONALIZADO");
    setCustomTarget(true);
    setCurrentDensity(DEFAULT_DENSITY);
    setStats({ totalPop: 1_000_000, destroyed: 0, severe: 0, light: 0, fallout: 0 });
    setDetonated(false);
    setWave(0);
  }

  function triggerDetonation() {
    if (detonated) {
      setDetonated(false);
      setWave(0);
      setShowFallout(false);
      setBurstType(null);
      setTimelineStep(-1);
      setPanelMinimized(false);
      setStats((s) => ({ ...s, destroyed: 0, severe: 0, light: 0, fallout: 0 }));
      fireballScale.setValue(0);
      shockwaveScale.setValue(0);
      shockwaveOpacity.setValue(0);
      mushroomY.setValue(50);
      mushroomOpacity.setValue(0);
      falloutAnim.setValue(0);
      return;
    }
    if (!burstType) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const pop = customTarget ? stats.totalPop : CITIES[city]?.population || 1_000_000;
    const density = currentDensity;

    // Áreas em km² (raios em metros → /1e6) — zonas concêntricas em ordem crescente
    const PI = Math.PI;
    const ring = (rOut: number, rIn: number) =>
      rOut > rIn ? (PI * (rOut ** 2 - rIn ** 2)) / 1e6 : 0;

    // ordena os raios externos (fireball < heavy < moderate < thermal? < light_zone)
    const r1 = fireball;
    const r2 = Math.max(r1, heavy);
    const r3 = Math.max(r2, moderate);
    const r4 = Math.max(r3, Math.min(thermal, light_zone));
    const r5 = Math.max(r4, Math.max(thermal, light_zone));

    const areaFireball = (PI * r1 ** 2) / 1e6;
    const areaHeavy    = ring(r2, r1);
    const areaModerate = ring(r3, r2);
    const areaThermal  = ring(r4, r3); // anel onde queimaduras dominam
    const areaLight    = ring(r5, r4);

    // Densidade decai pra fora do centro (cidade não é homogênea)
    const popFireball = areaFireball * density * 1.0;
    const popHeavy    = areaHeavy    * density * 0.95;
    const popModerate = areaModerate * density * 0.80;
    const popThermal  = areaThermal  * density * 0.55;
    const popLight    = areaLight    * density * 0.35;

    // Taxas de mortalidade por zona (Glasstone-Dolan + estudos de Hiroshima):
    //  fireball     → 98% mortos (vaporização)
    //  20psi heavy  → 90% mortos, 10% feridos graves
    //  5psi moderate→ 50% mortos, 45% feridos graves, 5% leves
    //  1psi light   →  5% mortos, 25% feridos graves, 30% leves
    //  thermal      → 25% mortos por queimaduras, 50% feridos graves
    let deaths =
      popFireball * 0.98 +
      popHeavy    * 0.90 +
      popModerate * 0.50 +
      popLight    * 0.05 +
      popThermal  * 0.25;

    let severe =
      popHeavy    * 0.10 +
      popModerate * 0.45 +
      popLight    * 0.25 +
      popThermal  * 0.50;

    let light =
      popModerate * 0.05 +
      popLight    * 0.30 +
      popThermal  * 0.20;

    // Fallout: contaminação a sotavento (depende do vento)
    const falloutAreaKm2 = PI * (falloutRadiusKm ** 2) * 0.6; // gota tem ~60% da área do círculo
    let falloutVictims = falloutAreaKm2 * density * 0.4 * windStrength;

    // Limita pelo total da população (não pode matar mais gente do que existe)
    const cap = (n: number) => Math.min(n, pop);
    deaths = cap(deaths);
    severe = cap(severe);
    light = cap(light);
    falloutVictims = cap(falloutVictims);

    // Soma também não pode passar do total
    const totalCasualties = deaths + severe + light;
    if (totalCasualties > pop) {
      const k = pop / totalCasualties;
      deaths *= k; severe *= k; light *= k;
    }

    setStats({
      totalPop: pop,
      destroyed: Math.floor(deaths),
      severe: Math.floor(severe),
      light: Math.floor(light),
      fallout: Math.floor(falloutVictims),
    });

    // auto-zoom pra caber a explosão na tela
    const maxRadius = Math.max(thermal, light_zone) * 2.4; // metros
    const delta = Math.max(0.05, maxRadius / 111000); // metros → graus aprox
    mapRef.current?.flyTo(location.latitude, location.longitude, delta);

    // ÁUDIO: sirene primeiro, depois boom + rumble
    playSiren();
    setTimeout(() => playBoom(), 2200);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2300);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 2500);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 3000);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 3500);

    // TIMELINE
    timeline.forEach((_, i) => setTimeout(() => setTimelineStep(i), 2200 + i * 900));

    // FLASH ofuscante (depois da sirene)
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0.4, duration: 200, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 14, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -14, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -3, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      Animated.sequence([
        Animated.timing(fireballScale, { toValue: 1, duration: 300, easing: Easing.out(Easing.exp), useNativeDriver: true }),
        Animated.timing(fireballScale, { toValue: 1.2, duration: 800, useNativeDriver: true }),
      ]).start();
    }, 2200);

    // SHOCKWAVE
    Animated.parallel([
      Animated.timing(shockwaveScale, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(shockwaveOpacity, { toValue: 0.7, duration: 200, useNativeDriver: true }),
        Animated.timing(shockwaveOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    ]).start();

    // COGUMELO sobe
    Animated.parallel([
      Animated.timing(mushroomY, { toValue: -200, duration: 2500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(mushroomOpacity, { toValue: 0, duration: 600, useNativeDriver: true }),
        Animated.timing(mushroomOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(mushroomOpacity, { toValue: 0.7, duration: 2000, useNativeDriver: true }),
      ]),
    ]).start();

    // Sequência de ondas (depois da sirene)
    setTimeout(() => setWave(1), 2200);
    setTimeout(() => setWave(2), 2450);
    setTimeout(() => setWave(3), 2700);
    setTimeout(() => setWave(4), 2950);
    setTimeout(() => { setWave(5); setDetonated(true); }, 3200);

    setTimeout(() => {
      setShowFallout(true);
      Animated.timing(falloutAnim, {
        toValue: 1, duration: 4000, easing: Easing.out(Easing.quad), useNativeDriver: false,
      }).start();
    }, 4200);
  }

  const cityKeys = useMemo(
    () =>
      Object.keys(CITIES).filter(
        (c) => search === "" || c.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  // Comparações intuitivas
  const comparisons = useMemo(() => {
    const hiroshimas = (kt / 15).toFixed(kt < 15 ? 2 : kt < 150 ? 1 : 0);
    const destroyedAreaKm2 = (Math.PI * moderate ** 2) / 1e6;
    const thermalAreaKm2 = (Math.PI * thermal ** 2) / 1e6;
    const stadiumsThermal = thermalAreaKm2 / 0.025; // estádio futebol ≈ 0.025km²
    const manhattanPct = (destroyedAreaKm2 / 59.1) * 100; // Manhattan = 59.1km²
    return [
      `💥 Equivale a ${fmt(parseFloat(hiroshimas))} bombas de Hiroshima`,
      `🏟 Raio térmico = área de ${Math.round(stadiumsThermal)} estádios do Maracanã`,
      manhattanPct >= 1
        ? `🗽 Destruição = ${manhattanPct < 100 ? manhattanPct.toFixed(0) + "% de Manhattan" : (manhattanPct / 100).toFixed(1) + "× Manhattan"}`
        : `🏙 Destruição = ${(destroyedAreaKm2 * 100).toFixed(0)} quarteirões`,
    ];
  }, [kt, moderate, thermal]);

  // Timeline (segundos relativos à detonação)
  const timeline = useMemo(() => {
    const shockwaveTimeAt1km = 1.4; // segundos para onda chegar a 1km
    return [
      { t: "0s",   label: "FLASH",       desc: `Cega num raio de ${(thermal / 1000).toFixed(1)} km` },
      { t: "0.5s", label: "BOLA DE FOGO", desc: `Pico: ${(fireball * 2).toFixed(0)} m de diâmetro · 100 milhões °C` },
      { t: `${shockwaveTimeAt1km}s`, label: "ONDA DE CHOQUE", desc: `Chega a 1 km · 600 km/h` },
      { t: "40s",  label: "COGUMELO",    desc: `Atinge estratosfera · ${(20 + Math.log10(kt) * 5).toFixed(0)} km de altura` },
      { t: "15min",label: burstType === "ground" ? "FALLOUT INTENSO" : "FALLOUT",
        desc: burstType === "ground" ? "Chuva radioativa começa a cair" : "Pequena contaminação a sotavento" },
    ];
  }, [kt, fireball, thermal, burstType]);

  const falloutPoly = useMemo(
    () => falloutPolygon(location, falloutRadiusKm, windDeg, windStrength),
    [location, falloutRadiusKm, windDeg, windStrength],
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* MAPA */}
      <Animated.View style={[s.mapWrap, { transform: [{ translateX: shakeAnim }] }]}>
        <NukeMap
          ref={mapRef}
          initialLat={location.latitude}
          initialLng={location.longitude}
          location={location}
          onPress={handleMapPress}
          showCrosshair={!detonated && wave === 0}
          wave={wave}
          fireball={fireball}
          heavy={heavy}
          moderate={moderate}
          light_zone={light_zone}
          thermal={thermal}
          burstType={burstType}
          detonated={detonated}
          craterRadius={craterRadius}
          showFallout={showFallout}
          falloutPoly={falloutPoly}
        />
      </Animated.View>

      {/* FLASH NUCLEAR */}
      <Animated.View pointerEvents="none" style={[s.flash, { opacity: flashAnim }]} />

      {/* HUD TOP */}
      <View style={s.hud}>
        <View style={s.hudLeft}>
          <Animated.Text style={[s.hudWarning, { opacity: warningAnim }]}>
            ☢ CLASSIFIED · DEFCON 1
          </Animated.Text>
          <Text style={s.hudCity} numberOfLines={1}>{city.toUpperCase()}</Text>
          <Text style={s.hudCoord}>
            {location.latitude.toFixed(3)}°, {location.longitude.toFixed(3)}°
          </Text>
        </View>
        <View style={s.hudRight}>
          <Text style={s.hudKt}>
            {kt >= 1000 ? `${(kt / 1000).toFixed(kt % 1000 === 0 ? 0 : 1)} MT` : `${kt} KT`}
          </Text>
          <Text style={s.hudWeaponName}>{weapon.name}</Text>
          <Text style={s.hudWind}>
            🌬 {windDeg.toFixed(0)}° · {(windStrength * 60).toFixed(0)}km/h
          </Text>
        </View>
      </View>

      {/* BOTÕES FLUTUANTES */}
      <View style={s.fab}>
        <Pressable style={s.fabBtn} onPress={locateMe}>
          <Text style={s.fabIcon}>📍</Text>
        </Pressable>
        <Pressable
          style={s.fabBtn}
          onPress={() =>
            mapRef.current?.flyTo(location.latitude, location.longitude, 0.15)
          }
        >
          <Text style={s.fabIcon}>🎯</Text>
        </Pressable>
      </View>

      {/* PAINEL INFERIOR */}
      <View style={s.panel}>
        {/* Handle de minimizar (só aparece depois de detonar) */}
        {detonated && (
          <Pressable
            style={s.minBar}
            onPress={() => {
              Haptics.selectionAsync();
              setPanelMinimized((m) => !m);
            }}
          >
            <View style={s.minGrip} />
            <Text style={s.minTxt}>
              {panelMinimized ? "▲  TOQUE PARA EXPANDIR" : "▼  TOQUE PARA MINIMIZAR"}
            </Text>
            <View style={s.minGrip} />
          </Pressable>
        )}

        {!panelMinimized && (
        <>
        <View style={s.selectRow}>
          <Pressable style={s.selectBtn} onPress={() => setShowCities(true)}>
            <Text style={s.selectLabel}>ALVO</Text>
            <Text style={s.selectValue} numberOfLines={1}>{city}</Text>
            <Text style={s.selectArrow}>▼</Text>
          </Pressable>

          <Pressable
            style={[s.selectBtn, { borderColor: weapon.color }]}
            onPress={() => setShowWeapons(true)}
          >
            <Text style={s.selectLabel}>ARSENAL</Text>
            <Text style={[s.selectValue, { color: weapon.color }]} numberOfLines={1}>
              ☢ {weapon.name}
            </Text>
            <Text style={[s.selectArrow, { color: weapon.color }]}>▼</Text>
          </Pressable>
        </View>

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
              <Text style={s.statIcon}>☣</Text>
              <Text style={[s.statVal, { color: "#78ff78" }]}>{fmt(stats.fallout)}</Text>
              <Text style={s.statLbl}>NUVEM RAD.</Text>
            </View>
            <View style={s.statBox}>
              <Text style={s.statIcon}>👥</Text>
              <Text style={s.statVal}>{fmt(stats.totalPop)}</Text>
              <Text style={s.statLbl}>POP TOTAL</Text>
            </View>
          </View>
        )}

        {/* COMPARAÇÕES INTUITIVAS */}
        {detonated && (
          <View style={s.compBox}>
            {comparisons.map((c, i) => (
              <Text key={i} style={s.compText}>{c}</Text>
            ))}
          </View>
        )}

        {/* TIMELINE DA DETONAÇÃO */}
        {detonated && (
          <View style={s.timelineBox}>
            <Text style={s.timelineTitle}>⏱  CRONOLOGIA DA EXPLOSÃO</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {timeline.map((tl, i) => {
                const active = i <= timelineStep;
                return (
                  <View
                    key={i}
                    style={[
                      s.tlItem,
                      active && { borderColor: "#ffd200", backgroundColor: "rgba(255,210,0,0.08)" },
                    ]}
                  >
                    <Text style={[s.tlTime, active && { color: "#ffd200" }]}>{tl.t}</Text>
                    <Text style={[s.tlLabel, active && { color: "#fff" }]}>{tl.label}</Text>
                    <Text style={s.tlDesc}>{tl.desc}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {detonated && (
          <View style={s.zonesRow}>
            {[
              { color: "#fff", label: "Bola de fogo" },
              { color: "#ff2200", label: "Destruição total" },
              { color: "#ff6600", label: "Dano moderado" },
              { color: "#ffcc00", label: "Dano leve" },
              { color: "#78ff78", label: "Nuvem radioativa" },
            ].map((z) => (
              <View key={z.label} style={s.zoneItem}>
                <View style={[s.zoneDot, { backgroundColor: z.color }]} />
                <Text style={s.zoneLabel}>{z.label}</Text>
              </View>
            ))}
          </View>
        )}

        </>
        )}

        {/* SELETOR DE TIPO DE EXPLOSÃO */}
        {!detonated && (
          <View style={s.burstRow}>
            <Pressable
              style={[
                s.burstBtn,
                burstType === "air" && s.burstBtnActiveAir,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setBurstType("air");
              }}
            >
              <Text style={s.burstIcon}>☁</Text>
              <Text
                style={[
                  s.burstLabel,
                  burstType === "air" && { color: "#78d0ff" },
                ]}
              >
                NO AR
              </Text>
            </Pressable>

            <Pressable
              style={[
                s.burstBtn,
                burstType === "ground" && s.burstBtnActiveGround,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setBurstType("ground");
              }}
            >
              <Text style={s.burstIcon}>⛰</Text>
              <Text
                style={[
                  s.burstLabel,
                  burstType === "ground" && { color: "#ffa066" },
                ]}
              >
                NO SOLO
              </Text>
            </Pressable>

            <Pressable
              style={s.burstHelp}
              onPress={() => setShowBurstInfo(true)}
            >
              <Text style={s.burstHelpIcon}>?</Text>
            </Pressable>
          </View>
        )}

        {/* SLIDER DE ALTITUDE — só para air burst */}
        {!detonated && burstType === "air" && (
          <View style={s.altBox}>
            <View style={s.altHeader}>
              <Text style={s.altLabel}>ALTITUDE DE DETONAÇÃO</Text>
              <Text style={s.altValue}>{altitude} m</Text>
            </View>
            <Slider
              style={{ width: "100%", height: 32 }}
              minimumValue={0}
              maximumValue={3000}
              step={10}
              value={altitude}
              onValueChange={setAltitude}
              minimumTrackTintColor="#78d0ff"
              maximumTrackTintColor="#222"
              thumbTintColor="#78d0ff"
            />
            <View style={s.altHints}>
              <Text style={s.altHint}>0 m (solo)</Text>
              <Text style={[s.altHint, { color: "#78d0ff", fontWeight: "900" }]}>
                Ótimo: {optimalHOB.toFixed(0)} m
              </Text>
              <Text style={s.altHint}>3000 m</Text>
            </View>
            {Math.abs(altitude - optimalHOB) < optimalHOB * 0.1 && (
              <Text style={s.altOptimal}>✓ EFICIÊNCIA MÁXIMA</Text>
            )}
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            s.detonateBtn,
            detonated && s.resetBtn,
            !burstType && !detonated && s.detonateBtnDisabled,
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
          onPress={triggerDetonation}
        >
          <Text style={s.detBtnText}>
            {detonated
              ? "⟳  RESETAR SIMULAÇÃO"
              : !burstType
                ? "⚠  ESCOLHA O TIPO DE EXPLOSÃO"
                : `☢  DETONAR ${burstType === "air" ? "NO AR" : "NO SOLO"}`}
          </Text>
        </Pressable>

        <Text style={s.tipText}>
          💡 Toque em qualquer ponto do mapa para definir alvo personalizado
        </Text>
      </View>

      {/* MODAL — CIDADES */}
      <Modal visible={showCities} transparent animationType="slide">
        <View style={s.modal}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>SELECIONAR ALVO</Text>
              <Text style={s.modalCount}>{cityKeys.length} CIDADES</Text>
            </View>
            <TextInput
              style={s.modalSearch}
              value={search}
              onChangeText={setSearch}
              placeholder="🔍 Buscar cidade..."
              placeholderTextColor="#444"
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              {cityKeys.map((c) => (
                <Pressable key={c} style={s.modalItem} onPress={() => selectCity(c)}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.modalItemText}>{c}</Text>
                    <Text style={s.modalItemSub}>
                      Pop. {fmt(CITIES[c].population)} · {CITIES[c].country}
                    </Text>
                  </View>
                  <Text style={s.modalItemArrow}>›</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={s.modalClose} onPress={() => setShowCities(false)}>
              <Text style={s.modalCloseText}>CANCELAR</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL — TIPO DE EXPLOSÃO */}
      <Modal visible={showBurstInfo} transparent animationType="fade">
        <Pressable style={s.modal} onPress={() => setShowBurstInfo(false)}>
          <View style={s.infoBox}>
            <Text style={s.infoTitle}>TIPO DE DETONAÇÃO</Text>

            <View style={s.infoSection}>
              <Text style={[s.infoHead, { color: "#78d0ff" }]}>
                ☁  EXPLOSÃO NO AR (Air Burst)
              </Text>
              <Text style={s.infoBody}>
                Detonação centenas/milhares de metros acima do solo.
                {"\n\n"}
                • Maior área de destruição: a onda de choque reflete no chão e se sobrepõe, ampliando o dano em até 30%.
                {"\n"}
                • A bola de fogo NÃO toca a superfície — pouca poeira é vaporizada, gerando MENOS fallout radioativo.
                {"\n"}
                • Estratégia usada em Hiroshima (580m) e Nagasaki (500m) para maximizar mortes civis.
                {"\n"}
                • Ideal contra alvos urbanos sem proteção.
              </Text>
            </View>

            <View style={[s.infoSection, { marginTop: 14 }]}>
              <Text style={[s.infoHead, { color: "#ffa066" }]}>
                ⛰  EXPLOSÃO NO SOLO (Ground Burst)
              </Text>
              <Text style={s.infoBody}>
                Detonação ao nível do solo.
                {"\n\n"}
                • Raio de destruição ~25% MENOR — energia se perde criando a cratera (que pode ter 100m+ de profundidade).
                {"\n"}
                • Vaporiza milhões de toneladas de terra/concreto que sobem na nuvem cogumelo e descem como chuva radioativa: FALLOUT até 4-5x MAIOR.
                {"\n"}
                • Contamina o terreno por décadas. Usado contra bunkers, silos e alvos enterrados.
              </Text>
            </View>

            <Pressable
              style={s.modalClose}
              onPress={() => setShowBurstInfo(false)}
            >
              <Text style={s.modalCloseText}>ENTENDI</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* MODAL — ARMAS COM 3D */}
      <Modal visible={showWeapons} transparent animationType="slide">
        <View style={s.modal}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>SELECIONAR ARSENAL · {WEAPONS.length}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {WEAPONS.map((w) => {
                const isSelected = weapon.id === w.id;
                const spin = weaponSpin.interpolate({
                  inputRange: [0, 1], outputRange: ["0deg", "360deg"],
                });
                const tilt = weaponTilt.interpolate({
                  inputRange: [0, 1], outputRange: ["-15deg", "15deg"],
                });
                return (
                  <Pressable
                    key={w.id}
                    style={[
                      s.weaponCard,
                      isSelected && {
                        borderColor: w.color,
                        borderWidth: 2,
                        shadowColor: w.color,
                        shadowOpacity: 0.6,
                        shadowRadius: 16,
                      },
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setWeapon(w);
                      setShowWeapons(false);
                      setDetonated(false);
                      setShowFallout(false);
                      setWave(0);
                    }}
                  >
                    {/* BOMBA 3D rotativa */}
                    <View style={[s.weapon3DContainer, { borderColor: w.color }]}>
                      <Animated.View
                        style={{
                          transform: [{ perspective: 600 }, { rotateY: spin }],
                        }}
                      >
                        <Bomb3D shape={w.shape} color={w.color} />
                      </Animated.View>
                      <View style={[s.weapon3DBase, { backgroundColor: w.color + "40" }]} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={[s.weaponName, { color: w.color }]}>{w.name}</Text>
                        <Text style={s.weaponCountry}>{w.country}</Text>
                      </View>
                      <Text style={s.weaponDesc}>{w.desc}</Text>
                      <View style={s.weaponMeta}>
                        <Text style={s.weaponYear}>📅 {w.year}</Text>
                        <Text style={[s.weaponKt, { color: w.color }]}>
                          {w.kt >= 1000 ? `${(w.kt / 1000).toFixed(w.kt % 1000 === 0 ? 0 : 1)} MT` : `${w.kt} KT`}
                        </Text>
                      </View>
                      {/* Barra de potência */}
                      <View style={s.powerBar}>
                        <View
                          style={[
                            s.powerFill,
                            {
                              backgroundColor: w.color,
                              width: `${Math.min(100, (Math.log10(w.kt + 1) / Math.log10(50001)) * 100)}%`,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Pressable style={s.modalClose} onPress={() => setShowWeapons(false)}>
              <Text style={s.modalCloseText}>FECHAR</Text>
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
  flash: { ...StyleSheet.absoluteFillObject, backgroundColor: "#fff", zIndex: 99 },

  mushroom: {
    position: "absolute",
    top: height * 0.4,
    left: 0, right: 0,
    alignItems: "center",
    zIndex: 50,
  },
  mushroomTxt: { fontSize: 100 },
  mushroomStem: { fontSize: 60, color: "#888", marginTop: -20 },

  hud: {
    position: "absolute",
    top: Platform.OS === "android" ? (StatusBar.currentHeight ?? 32) + 8 : 54,
    left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  hudLeft: { gap: 2, flex: 1 },
  hudRight: { alignItems: "flex-end" },
  hudWarning: { color: RED, fontSize: 10, fontWeight: "900", letterSpacing: 3 },
  hudCity: {
    color: "#fff", fontSize: 22, fontWeight: "900", letterSpacing: 2,
    textShadowColor: "#000", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8,
  },
  hudCoord: { color: "#777", fontSize: 9, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  hudKt: {
    color: YELLOW, fontSize: 20, fontWeight: "900", letterSpacing: 1,
    textShadowColor: "#000", textShadowRadius: 8,
  },
  hudWeaponName: { color: "#aaa", fontSize: 11, letterSpacing: 1 },
  hudWind: { color: "#78ffd6", fontSize: 9, marginTop: 2 },

  fab: {
    position: "absolute",
    right: 14,
    top: height * 0.32,
    gap: 10,
    zIndex: 20,
  },
  fabBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderWidth: 1, borderColor: "#333",
    justifyContent: "center", alignItems: "center",
  },
  fabIcon: { fontSize: 20 },

  crosshair: { width: 50, height: 50, justifyContent: "center", alignItems: "center" },
  crosshairH: { position: "absolute", width: 50, height: 1, backgroundColor: RED },
  crosshairV: { position: "absolute", width: 1, height: 50, backgroundColor: RED },
  crosshairDot: {
    width: 8, height: 8, borderRadius: 4,
    borderWidth: 2, borderColor: RED, backgroundColor: "transparent",
  },
  crosshairRing: {
    position: "absolute",
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1, borderColor: "rgba(255,59,48,0.4)",
  },

  panel: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.94)",
    borderTopWidth: 1, borderTopColor: "#222",
    paddingTop: 14, paddingHorizontal: 14,
    paddingBottom: Platform.OS === "ios" ? 32 : 18,
    gap: 12,
  },

  selectRow: { flexDirection: "row", gap: 10 },
  selectBtn: {
    flex: 1, flexDirection: "row", alignItems: "center",
    backgroundColor: DIM, borderRadius: 10,
    borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 12, paddingVertical: 10, gap: 6,
  },
  selectLabel: { color: "#555", fontSize: 9, fontWeight: "700", letterSpacing: 1.5 },
  selectValue: { flex: 1, color: "#fff", fontSize: 13, fontWeight: "700" },
  selectArrow: { color: "#555", fontSize: 10 },

  statsRow: { flexDirection: "row", gap: 8 },
  statBox: {
    flex: 1, backgroundColor: DIM, borderRadius: 10,
    padding: 10, alignItems: "center",
    borderWidth: 1, borderColor: BORDER, gap: 2,
  },
  statIcon: { fontSize: 16 },
  statVal: { color: "#fff", fontSize: 14, fontWeight: "900" },
  statLbl: { color: "#555", fontSize: 8, fontWeight: "700", letterSpacing: 1 },

  zonesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  zoneItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  zoneDot: { width: 8, height: 8, borderRadius: 4 },
  zoneLabel: { color: "#666", fontSize: 10, fontWeight: "600" },

  // BURST TYPE SELECTOR
  burstRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "stretch",
  },
  burstBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: DIM,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingVertical: 12,
  },
  burstBtnActiveAir: {
    borderColor: "#78d0ff",
    backgroundColor: "rgba(120,208,255,0.08)",
    shadowColor: "#78d0ff",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  burstBtnActiveGround: {
    borderColor: "#ffa066",
    backgroundColor: "rgba(255,160,102,0.08)",
    shadowColor: "#ffa066",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  burstIcon: { fontSize: 16, color: "#aaa" },
  burstLabel: {
    color: "#888",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  burstHelp: {
    width: 38,
    backgroundColor: DIM,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  burstHelpIcon: {
    color: "#888",
    fontSize: 16,
    fontWeight: "900",
  },

  // MINIMIZE BAR
  minBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 4,
    marginTop: -8,
    marginBottom: 2,
  },
  minGrip: {
    width: 36, height: 3, borderRadius: 2,
    backgroundColor: "#333",
  },
  minTxt: {
    color: "#666",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
  },

  // ALTITUDE
  altBox: {
    backgroundColor: DIM,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#78d0ff30",
    padding: 10,
    gap: 4,
  },
  altHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  altLabel: { color: "#888", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  altValue: { color: "#78d0ff", fontSize: 14, fontWeight: "900" },
  altHints: { flexDirection: "row", justifyContent: "space-between", marginTop: -4 },
  altHint: { color: "#555", fontSize: 9 },
  altOptimal: {
    color: "#a8ff78", fontSize: 10, fontWeight: "900", letterSpacing: 2,
    textAlign: "center", marginTop: 2,
  },

  // COMPARAÇÕES
  compBox: {
    backgroundColor: "rgba(255,210,0,0.05)",
    borderLeftWidth: 2, borderLeftColor: YELLOW,
    paddingLeft: 10, paddingVertical: 6, paddingRight: 8,
    borderRadius: 4,
    gap: 3,
  },
  compText: { color: "#ddd", fontSize: 11, fontWeight: "600" },

  // TIMELINE
  timelineBox: { gap: 6 },
  timelineTitle: { color: "#666", fontSize: 9, fontWeight: "900", letterSpacing: 2 },
  tlItem: {
    width: 130,
    backgroundColor: DIM,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 8,
    padding: 8,
    marginRight: 6,
    gap: 2,
  },
  tlTime: { color: "#555", fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  tlLabel: { color: "#aaa", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  tlDesc: { color: "#666", fontSize: 9, lineHeight: 12 },

  // INFO MODAL
  infoBox: {
    margin: 20,
    backgroundColor: "#0d0d0d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
    padding: 20,
  },
  infoTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 4,
    marginBottom: 16,
    textAlign: "center",
  },
  infoSection: {},
  infoHead: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  infoBody: {
    color: "#bbb",
    fontSize: 12,
    lineHeight: 18,
  },

  detonateBtn: {
    backgroundColor: RED, borderRadius: 12,
    paddingVertical: 16, alignItems: "center",
    shadowColor: RED, shadowOpacity: 0.5, shadowRadius: 12,
  },
  detonateBtnDisabled: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    shadowOpacity: 0,
  },
  resetBtn: {
    backgroundColor: "#1a1a1a", borderWidth: 1, borderColor: "#333",
    shadowOpacity: 0,
  },
  detBtnText: { color: "#fff", fontSize: 15, fontWeight: "900", letterSpacing: 3 },
  tipText: { color: "#444", fontSize: 9, textAlign: "center", letterSpacing: 0.5 },

  modal: { flex: 1, backgroundColor: "rgba(0,0,0,0.85)", justifyContent: "flex-end" },
  modalBox: {
    backgroundColor: "#0d0d0d",
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderColor: "#222",
    padding: 20, maxHeight: height * 0.82,
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { color: "#fff", fontSize: 12, fontWeight: "900", letterSpacing: 4 },
  modalCount: { color: "#555", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  modalSearch: {
    backgroundColor: DIM, color: "#fff", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
    fontSize: 14, borderWidth: 1, borderColor: BORDER,
  },
  modalItem: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: "#111",
  },
  modalItemText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  modalItemSub: { color: "#555", fontSize: 11, marginTop: 2 },
  modalItemArrow: { color: "#444", fontSize: 20 },
  modalClose: {
    marginTop: 14, backgroundColor: "#1a1a1a", borderRadius: 10,
    paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: BORDER,
  },
  modalCloseText: { color: "#666", fontWeight: "700", letterSpacing: 2, fontSize: 12 },

  // WEAPON CARD com 3D
  weaponCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: DIM, borderRadius: 14,
    padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: BORDER, gap: 12,
  },
  weapon3DContainer: {
    width: 70, height: 70,
    borderRadius: 35,
    borderWidth: 1.5,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center", alignItems: "center",
    overflow: "hidden",
  },
  missileNose: {
    width: 0, height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    alignSelf: "center",
  },
  missileBody: {
    width: 12, height: 38,
    borderRadius: 2,
    alignSelf: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  missileStripe: {
    position: "absolute",
    left: 0, right: 0, top: 8,
    height: 2,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  missileFins: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: -2,
  },
  missileFinL: {
    width: 0, height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 10,
    borderRightWidth: 8,
    borderBottomColor: "transparent",
  },
  missileFinR: {
    width: 0, height: 0,
    borderTopWidth: 0,
    borderBottomWidth: 10,
    borderLeftWidth: 8,
    borderBottomColor: "transparent",
  },
  missileFlame: {
    alignSelf: "center",
    width: 8, height: 10,
    borderRadius: 4,
    backgroundColor: "#ffaa00",
    marginTop: -2,
    shadowColor: "#ff5500",
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  weapon3DBase: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    height: 8,
    opacity: 0.6,
  },
  weaponName: { fontSize: 15, fontWeight: "900" },
  weaponCountry: { fontSize: 12 },
  weaponDesc: { color: "#666", fontSize: 11, marginTop: 2 },
  weaponMeta: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, alignItems: "center" },
  weaponYear: { color: "#555", fontSize: 10, fontWeight: "600" },
  weaponKt: { fontSize: 13, fontWeight: "900" },
  powerBar: {
    height: 3, backgroundColor: "#111",
    borderRadius: 2, marginTop: 6, overflow: "hidden",
  },
  powerFill: { height: "100%", borderRadius: 2 },
});
