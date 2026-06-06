// cidades com densidade urbana (peguei dos dados de censo)
// uso a densidade pra calcular quantas pessoas morrem em cada zona

export type City = {
  latitude: number;
  longitude: number;
  population: number;
  country: string;
  density: number; // pessoas/km² no centro urbano
};

export const CITIES: Record<string, City> = {
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
  "Belém":           { latitude:  -1.4558, longitude: -48.5044, population: 2500000,  country: "BR", density: 1300 },
  "Goiânia":         { latitude: -16.6869, longitude: -49.2648, population: 1500000,  country: "BR", density: 1700 },

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
  "Montevidéu":      { latitude: -34.9011, longitude: -56.1645, population: 1800000,  country: "UY", density: 2900 },
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

/** Densidade padrão para alvos personalizados / GPS quando a cidade real é desconhecida. */
export const DEFAULT_DENSITY = 3000;
