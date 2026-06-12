export interface Stadium {
  id: string;
  name: string;
  capacity: number;
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  latitude: number; // for interactive SVG map plotting
  longitude: number;
  description: string;
  image: string; // fallback CSS gradient or asset
}

export const stadiums: Stadium[] = [
  {
    id: "azteca",
    name: "Estadio Azteca",
    capacity: 87523,
    city: "Mexico City",
    country: "Mexico",
    latitude: 19.3029,
    longitude: -99.1505,
    description: "Historic venue, hosting its third World Cup opening matches. It has witnessed the greatest moments in football history.",
    image: "linear-gradient(135deg, #0c1c36 0%, #1a3c73 100%)"
  },
  {
    id: "metlife",
    name: "MetLife Stadium",
    capacity: 82500,
    city: "East Rutherford (New York/New Jersey)",
    country: "USA",
    latitude: 40.8135,
    longitude: -74.0744,
    description: "Chosen to host the prestigious FIFA World Cup 2026 Final. A state-of-the-art multi-purpose stadium.",
    image: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
  },
  {
    id: "att",
    name: "AT&T Stadium",
    capacity: 80000,
    city: "Arlington (Dallas)",
    country: "USA",
    latitude: 32.7473,
    longitude: -97.0945,
    description: "Features a retractable roof and one of the largest high-definition video screens in the world.",
    image: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
  },
  {
    id: "arrowhead",
    name: "Arrowhead Stadium",
    capacity: 76416,
    city: "Kansas City",
    country: "USA",
    latitude: 39.0489,
    longitude: -94.4839,
    description: "Guinness World Record holder for the loudest stadium in the world. Famous for its passionate atmosphere.",
    image: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)"
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    capacity: 72220,
    city: "Houston",
    country: "USA",
    latitude: 29.6847,
    longitude: -95.4081,
    description: "Another giant dome stadium with retractable roof, featuring extensive premium amenities.",
    image: "linear-gradient(135deg, #172554 0%, #1e40af 100%)"
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz Stadium",
    capacity: 71000,
    city: "Atlanta",
    country: "USA",
    latitude: 33.7573,
    longitude: -84.4010,
    description: "Famed for its unique pinwheel retractable roof and central halo board display.",
    image: "linear-gradient(135deg, #030712 0%, #1f2937 100%)"
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    capacity: 70240,
    city: "Inglewood (Los Angeles)",
    country: "USA",
    latitude: 33.9535,
    longitude: -118.3390,
    description: "The most expensive stadium ever built, featuring a dramatic translucent canopy roof.",
    image: "linear-gradient(135deg, #082f49 0%, #0369a1 100%)"
  },
  {
    id: "lincoln",
    name: "Lincoln Financial Field",
    capacity: 69796,
    city: "Philadelphia",
    country: "USA",
    latitude: 39.9008,
    longitude: -75.1675,
    description: "Known as 'The Linc', featuring state-of-the-art eco-friendly wind turbines and solar panels.",
    image: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)"
  },
  {
    id: "lumen",
    name: "Lumen Field",
    capacity: 69000,
    city: "Seattle",
    country: "USA",
    latitude: 47.5952,
    longitude: -122.3316,
    description: "Features a unique horseshoe-shaped design providing stunning views of the Seattle skyline.",
    image: "linear-gradient(135deg, #022c22 0%, #0f766e 100%)"
  },
  {
    id: "levis",
    name: "Levi's Stadium",
    capacity: 68500,
    city: "Santa Clara (San Francisco)",
    country: "USA",
    latitude: 37.4033,
    longitude: -121.9698,
    description: "A highly sustainable stadium, featuring a green roof, solar terrace, and advanced Wi-Fi.",
    image: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)"
  },
  {
    id: "gillette",
    name: "Gillette Stadium",
    capacity: 65878,
    city: "Foxborough (Boston)",
    country: "USA",
    latitude: 42.0909,
    longitude: -71.2643,
    description: "Features a landmark lighthouse and bridge in the north end zone, creating an iconic aesthetic.",
    image: "linear-gradient(135deg, #0f172a 0%, #334155 100%)"
  },
  {
    id: "hardrock",
    name: "Hard Rock Stadium",
    capacity: 64767,
    city: "Miami Gardens (Miami)",
    country: "USA",
    latitude: 25.9580,
    longitude: -80.2389,
    description: "A colorful, vibrant venue in tropical Florida. Designed to cover 90% of spectator seats.",
    image: "linear-gradient(135deg, #0f766e 0%, #0284c7 100%)"
  },
  {
    id: "bcplace",
    name: "BC Place",
    capacity: 54500,
    city: "Vancouver",
    country: "Canada",
    latitude: 49.2767,
    longitude: -123.1120,
    description: "An architectural marvel located on the edge of False Creek, featuring a retractable roof.",
    image: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)"
  },
  {
    id: "bbva",
    name: "Estadio BBVA",
    capacity: 53500,
    city: "Guadalupe (Monterrey)",
    country: "Mexico",
    latitude: 25.6692,
    longitude: -100.2447,
    description: "Nicknamed 'El Gigante de Acero' (The Steel Giant), famed for its stunning view of the Cerro de la Silla mountain.",
    image: "linear-gradient(135deg, #0f172a 0%, #475569 100%)"
  },
  {
    id: "akron",
    name: "Estadio Akron",
    capacity: 48071,
    city: "Zapopan (Guadalajara)",
    country: "Mexico",
    latitude: 20.6819,
    longitude: -103.4627,
    description: "Designed like a volcano topped by a cloud, blending naturally with the local landscape.",
    image: "linear-gradient(135deg, #991b1b 0%, #dc2626 100%)"
  },
  {
    id: "bmo",
    name: "BMO Field",
    capacity: 45736,
    city: "Toronto",
    country: "Canada",
    latitude: 43.6328,
    longitude: -79.4186,
    description: "Located at Exhibition Place, expanded specifically to host the first-ever World Cup match on Canadian soil.",
    image: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)"
  }
];
