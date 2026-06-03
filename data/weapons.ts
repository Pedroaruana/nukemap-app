/**
 * @author  Pedro Aruana <github.com/Pedroaruana>
 * @license MIT
 */

// Arsenal nuclear histórico — rendimentos em kilotons (kt) baseados em registros
// públicos da NRDC, FAS e Bulletin of the Atomic Scientists.

export type BombShape = "gravity" | "sphere" | "mirv" | "tsar";

export type Weapon = {
  id: string;
  name: string;
  kt: number;
  color: string;
  desc: string;
  year: string;
  country: string;
  shape: BombShape;
};

export const WEAPONS: Weapon[] = [
  { id: "davy",      name: "Davy Crockett",  kt: 0.02,  color: "#a8ff78", desc: "Menor arma nuclear já criada",       year: "1961", country: "🇺🇸", shape: "sphere"  },
  { id: "sadm",      name: "W54 SADM",       kt: 1,     color: "#78ffd6", desc: "Mochila nuclear portátil",            year: "1964", country: "🇺🇸", shape: "sphere"  },
  { id: "artillery", name: "W48 155mm",      kt: 0.072, color: "#bbff66", desc: "Projétil de artilharia nuclear",      year: "1963", country: "🇺🇸", shape: "gravity" },
  { id: "tactical",  name: "B57 Tática",     kt: 5,     color: "#9effa0", desc: "Bomba tática anti-submarino",         year: "1963", country: "🇺🇸", shape: "gravity" },
  { id: "hiroshima", name: "Little Boy",     kt: 15,    color: "#ffd200", desc: "Hiroshima — 6 ago 1945",              year: "1945", country: "🇺🇸", shape: "gravity" },
  { id: "nagasaki",  name: "Fat Man",        kt: 21,    color: "#ff9500", desc: "Nagasaki — 9 ago 1945",               year: "1945", country: "🇺🇸", shape: "sphere"  },
  { id: "trinity",   name: "Trinity Gadget", kt: 22,    color: "#ffb700", desc: "Primeiro teste nuclear da história",  year: "1945", country: "🇺🇸", shape: "sphere"  },
  { id: "rds1",      name: "RDS-1 (Joe-1)",  kt: 22,    color: "#ff8855", desc: "Primeira bomba soviética",            year: "1949", country: "🇷🇺", shape: "sphere"  },
  { id: "w76",       name: "W76 SLBM",       kt: 100,   color: "#ff7733", desc: "Ogiva submarina padrão americana",    year: "1978", country: "🇺🇸", shape: "mirv"    },
  { id: "b61",       name: "B61-12",         kt: 340,   color: "#ff6b35", desc: "Bomba gravitacional OTAN moderna",    year: "2020", country: "🇺🇸", shape: "gravity" },
  { id: "trident",   name: "Trident II D5",  kt: 475,   color: "#ff5522", desc: "SLBM submarina — padrão atual",       year: "1990", country: "🇺🇸", shape: "mirv"    },
  { id: "topol",     name: "RS-24 Yars",     kt: 800,   color: "#ff3b30", desc: "ICBM russo MIRV moderno",             year: "2010", country: "🇷🇺", shape: "mirv"    },
  { id: "w88",       name: "W88",            kt: 475,   color: "#ff4444", desc: "Ogiva mais avançada dos EUA",         year: "1989", country: "🇺🇸", shape: "mirv"    },
  { id: "df41",      name: "DF-41",          kt: 1000,  color: "#ff2266", desc: "ICBM chinês de longo alcance",        year: "2017", country: "🇨🇳", shape: "mirv"    },
  { id: "b83",       name: "B83",            kt: 1200,  color: "#ff1144", desc: "Maior bomba ativa dos EUA",           year: "1983", country: "🇺🇸", shape: "gravity" },
  { id: "satan",     name: "R-36 Satan",     kt: 20000, color: "#ff0066", desc: "ICBM soviético — 10 ogivas MIRV",     year: "1974", country: "🇷🇺", shape: "mirv"    },
  { id: "tsar",      name: "Tsar Bomba",     kt: 50000, color: "#ff0080", desc: "Maior explosão da história — URSS",   year: "1961", country: "🇷🇺", shape: "tsar"    },
];
