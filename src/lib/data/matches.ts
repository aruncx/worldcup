export interface MatchEvent {
  minute: number;
  type: 'goal' | 'card-yellow' | 'card-red' | 'sub' | 'var' | 'injury';
  detail: string;
  teamId?: string; // which team did it
}

export interface MatchStats {
  possession: [number, number]; // [Team A, Team B]
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface Match {
  id: string;
  stage: 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarter Finals' | 'Semi Finals' | 'Final';
  group?: string; // A to L
  homeTeamId: string;
  homeTeamName: string;
  homeTeamFlag: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamFlag: string;
  homeScore?: number;
  awayScore?: number;
  status: 'completed' | 'live' | 'upcoming';
  minute?: number; // for live matches
  date: string; // e.g. "2026-06-13"
  time: string; // e.g. "18:00"
  stadiumId: string;
  stadiumName: string;
  stats?: MatchStats;
  timeline?: MatchEvent[];
}

export const matches: Match[] = [
  // June 11 - Completed
  {
    id: "m1",
    stage: "Group Stage",
    group: "A",
    homeTeamId: "usa",
    homeTeamName: "United States",
    homeTeamFlag: "🇺🇸",
    awayTeamId: "iraq",
    awayTeamName: "Iraq",
    awayTeamFlag: "🇮🇶",
    homeScore: 3,
    awayScore: 1,
    status: "completed",
    date: "2026-06-11",
    time: "17:00",
    stadiumId: "metlife",
    stadiumName: "MetLife Stadium",
    stats: {
      possession: [58, 42],
      shots: [15, 8],
      shotsOnTarget: [7, 3],
      corners: [6, 2],
      fouls: [10, 14],
      yellowCards: [1, 2],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 15, type: "goal", detail: "Goal! Christian Pulisic (Penalty)", teamId: "usa" },
      { minute: 32, type: "card-yellow", detail: "Yellow Card - Jalal Hassan", teamId: "iraq" },
      { minute: 44, type: "goal", detail: "Goal! Timothy Weah, Assist: Antonee Robinson", teamId: "usa" },
      { minute: 55, type: "sub", detail: "Substitution: Iraq (Hussein in, Ali out)", teamId: "iraq" },
      { minute: 68, type: "goal", detail: "Goal! Aymen Hussein, Assist: Amir Al-Ammari", teamId: "iraq" },
      { minute: 75, type: "card-yellow", detail: "Yellow Card - Weston McKennie", teamId: "usa" },
      { minute: 82, type: "goal", detail: "Goal! Folarin Balogun, Assist: Giovanni Reyna", teamId: "usa" }
    ]
  },
  {
    id: "m2",
    stage: "Group Stage",
    group: "A",
    homeTeamId: "cameroon",
    homeTeamName: "Cameroon",
    homeTeamFlag: "🇨🇲",
    awayTeamId: "slovakia",
    awayTeamName: "Slovakia",
    awayTeamFlag: "🇸🇰",
    homeScore: 2,
    awayScore: 0,
    status: "completed",
    date: "2026-06-11",
    time: "20:00",
    stadiumId: "bcplace",
    stadiumName: "BC Place",
    stats: {
      possession: [46, 54],
      shots: [11, 13],
      shotsOnTarget: [6, 4],
      corners: [4, 7],
      fouls: [16, 9],
      yellowCards: [3, 1],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 23, type: "card-yellow", detail: "Yellow Card - Zambo Anguissa", teamId: "cameroon" },
      { minute: 38, type: "goal", detail: "Goal! Vincent Aboubakar, Assist: Bryan Mbeumo", teamId: "cameroon" },
      { minute: 62, type: "sub", detail: "Substitution: Slovakia (Suslov in, Haraslin out)", teamId: "slovakia" },
      { minute: 71, type: "goal", detail: "Goal! Bryan Mbeumo", teamId: "cameroon" },
      { minute: 85, type: "injury", detail: "Injury Check - Milan Škriniar (Slovakia) cleared to play", teamId: "slovakia" }
    ]
  },
  // June 12 - Completed
  {
    id: "m3",
    stage: "Group Stage",
    group: "B",
    homeTeamId: "mexico",
    homeTeamName: "Mexico",
    homeTeamFlag: "🇲🇽",
    awayTeamId: "south-korea",
    awayTeamName: "South Korea",
    awayTeamFlag: "🇰🇷",
    homeScore: 2,
    awayScore: 1,
    status: "completed",
    date: "2026-06-12",
    time: "16:00",
    stadiumId: "azteca",
    stadiumName: "Estadio Azteca",
    stats: {
      possession: [52, 48],
      shots: [14, 11],
      shotsOnTarget: [5, 4],
      corners: [5, 4],
      fouls: [12, 11],
      yellowCards: [2, 1],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 18, type: "goal", detail: "Goal! Son Heung-min, Assist: Lee Kang-in", teamId: "south-korea" },
      { minute: 29, type: "card-yellow", detail: "Yellow Card - Edson Álvarez", teamId: "mexico" },
      { minute: 40, type: "goal", detail: "Goal! Santiago Giménez, Assist: Orbelín Pineda", teamId: "mexico" },
      { minute: 77, type: "var", detail: "VAR Review: Penalty awarded to Mexico for handball", teamId: "mexico" },
      { minute: 79, type: "goal", detail: "Goal! Santiago Giménez (Penalty)", teamId: "mexico" }
    ]
  },
  {
    id: "m4",
    stage: "Group Stage",
    group: "B",
    homeTeamId: "sweden",
    homeTeamName: "Sweden",
    homeTeamFlag: "🇸🇪",
    awayTeamId: "morocco",
    awayTeamName: "Morocco",
    awayTeamFlag: "🇲🇦",
    homeScore: 1,
    awayScore: 1,
    status: "completed",
    date: "2026-06-12",
    time: "19:00",
    stadiumId: "sofi",
    stadiumName: "SoFi Stadium",
    stats: {
      possession: [56, 44],
      shots: [10, 12],
      shotsOnTarget: [3, 4],
      corners: [7, 5],
      fouls: [11, 15],
      yellowCards: [1, 2],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 33, type: "goal", detail: "Goal! Alexander Isak, Assist: Dejan Kulusevski", teamId: "sweden" },
      { minute: 52, type: "card-yellow", detail: "Yellow Card - Sofyan Amrabat", teamId: "morocco" },
      { minute: 67, type: "goal", detail: "Goal! Youssef En-Nesyri, Assist: Achraf Hakimi", teamId: "morocco" }
    ]
  },
  {
    id: "m5",
    stage: "Group Stage",
    group: "C",
    homeTeamId: "uruguay",
    homeTeamName: "Uruguay",
    homeTeamFlag: "🇺🇾",
    awayTeamId: "uzbekistan",
    awayTeamName: "Uzbekistan",
    awayTeamFlag: "🇺🇿",
    homeScore: 2,
    awayScore: 0,
    status: "completed",
    date: "2026-06-12",
    time: "21:00",
    stadiumId: "att",
    stadiumName: "AT&T Stadium"
  },
  {
    id: "m6",
    stage: "Group Stage",
    group: "C",
    homeTeamId: "canada",
    homeTeamName: "Canada",
    homeTeamFlag: "🇨🇦",
    awayTeamId: "senegal",
    awayTeamName: "Senegal",
    awayTeamFlag: "🇸🇳",
    homeScore: 0,
    awayScore: 0,
    status: "completed",
    date: "2026-06-12",
    time: "22:00",
    stadiumId: "bmo",
    stadiumName: "BMO Field"
  },

  // June 13 - Today (Completed earlier)
  {
    id: "m9",
    stage: "Group Stage",
    group: "E",
    homeTeamId: "brazil",
    homeTeamName: "Brazil",
    homeTeamFlag: "🇧🇷",
    awayTeamId: "new-zealand",
    awayTeamName: "New Zealand",
    awayTeamFlag: "🇳🇿",
    homeScore: 4,
    awayScore: 1,
    status: "completed",
    date: "2026-06-13",
    time: "10:00",
    stadiumId: "hardrock",
    stadiumName: "Hard Rock Stadium",
    stats: {
      possession: [68, 32],
      shots: [22, 5],
      shotsOnTarget: [11, 2],
      corners: [9, 1],
      fouls: [8, 14],
      yellowCards: [0, 2],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 14, type: "goal", detail: "Goal! Vinícius Júnior, Assist: Rodrygo", teamId: "brazil" },
      { minute: 28, type: "goal", detail: "Goal! Rodrygo, Assist: Bruno Guimarães", teamId: "brazil" },
      { minute: 49, type: "goal", detail: "Goal! Chris Wood", teamId: "new-zealand" },
      { minute: 65, type: "goal", detail: "Goal! Endrick, Assist: Raphinha", teamId: "brazil" },
      { minute: 88, type: "goal", detail: "Goal! Vinícius Júnior, Assist: Endrick", teamId: "brazil" }
    ]
  },
  {
    id: "m10",
    stage: "Group Stage",
    group: "E",
    homeTeamId: "ukraine",
    homeTeamName: "Ukraine",
    homeTeamFlag: "🇺🇦",
    awayTeamId: "algeria",
    awayTeamName: "Algeria",
    awayTeamFlag: "🇩🇿",
    homeScore: 2,
    awayScore: 0,
    status: "completed",
    date: "2026-06-13",
    time: "13:00",
    stadiumId: "levis",
    stadiumName: "Levi's Stadium"
  },

  // June 13 - Today (LIVE right now!)
  {
    id: "m11",
    stage: "Group Stage",
    group: "F",
    homeTeamId: "france",
    homeTeamName: "France",
    homeTeamFlag: "🇫🇷",
    awayTeamId: "japan",
    awayTeamName: "Japan",
    awayTeamFlag: "🇯🇵",
    homeScore: 2,
    awayScore: 1,
    status: "live",
    minute: 76,
    date: "2026-06-13",
    time: "18:00",
    stadiumId: "sofi",
    stadiumName: "SoFi Stadium",
    stats: {
      possession: [59, 41],
      shots: [14, 8],
      shotsOnTarget: [6, 4],
      corners: [6, 3],
      fouls: [9, 12],
      yellowCards: [1, 2],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 12, type: "goal", detail: "Goal! Kylian Mbappé, Assist: Ousmane Dembélé", teamId: "france" },
      { minute: 28, type: "card-yellow", detail: "Yellow Card - Wataru Endo (Tactical foul)", teamId: "japan" },
      { minute: 34, type: "card-yellow", detail: "Yellow Card - William Saliba", teamId: "france" },
      { minute: 43, type: "goal", detail: "Goal! Daichi Kamada, Assist: Kaoru Mitoma", teamId: "japan" },
      { minute: 55, type: "sub", detail: "Substitution: Japan (Ritsu Doan in, Takefusa Kubo out)", teamId: "japan" },
      { minute: 61, type: "goal", detail: "Goal! Kylian Mbappé, Assist: Antoine Griezmann", teamId: "france" },
      { minute: 68, type: "var", detail: "VAR Review: France Penalty Appeal - Denied (No handball)", teamId: "france" },
      { minute: 73, type: "sub", detail: "Substitution: France (Marcus Thuram in, Bradley Barcola out)", teamId: "france" }
    ]
  },
  {
    id: "m12",
    stage: "Group Stage",
    group: "F",
    homeTeamId: "colombia",
    homeTeamName: "Colombia",
    homeTeamFlag: "🇨🇴",
    awayTeamId: "ghana",
    awayTeamName: "Ghana",
    awayTeamFlag: "🇬🇭",
    homeScore: 2,
    awayScore: 2,
    status: "live",
    minute: 44,
    date: "2026-06-13",
    time: "18:30",
    stadiumId: "bcplace",
    stadiumName: "BC Place",
    stats: {
      possession: [51, 49],
      shots: [8, 9],
      shotsOnTarget: [4, 5],
      corners: [3, 4],
      fouls: [7, 9],
      yellowCards: [1, 1],
      redCards: [0, 0]
    },
    timeline: [
      { minute: 8, type: "goal", detail: "Goal! Luis Díaz, Assist: James Rodríguez", teamId: "colombia" },
      { minute: 22, type: "goal", detail: "Goal! Inaki Williams, Assist: Mohammed Kudus", teamId: "ghana" },
      { minute: 31, type: "card-yellow", detail: "Yellow Card - Thomas Partey", teamId: "ghana" },
      { minute: 37, type: "goal", detail: "Goal! James Rodríguez, Assist: Richard Ríos", teamId: "colombia" },
      { minute: 41, type: "goal", detail: "Goal! Mohammed Kudus (Freekick)", teamId: "ghana" }
    ]
  },

  // June 13 - Today (Upcoming)
  {
    id: "m13",
    stage: "Group Stage",
    group: "G",
    homeTeamId: "england",
    homeTeamName: "England",
    homeTeamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    awayTeamId: "mali",
    awayTeamName: "Mali",
    awayTeamFlag: "🇲🇱",
    status: "upcoming",
    date: "2026-06-13",
    time: "20:00",
    stadiumId: "metlife",
    stadiumName: "MetLife Stadium"
  },
  {
    id: "m14",
    stage: "Group Stage",
    group: "G",
    homeTeamId: "ecuador",
    homeTeamName: "Ecuador",
    homeTeamFlag: "🇪🇨",
    awayTeamId: "saudi-arabia",
    awayTeamName: "Saudi Arabia",
    awayTeamFlag: "🇸🇦",
    status: "upcoming",
    date: "2026-06-13",
    time: "22:00",
    stadiumId: "mercedes",
    stadiumName: "Mercedes-Benz Stadium"
  },

  // June 14 - Tomorrow (Upcoming)
  {
    id: "m15",
    stage: "Group Stage",
    group: "H",
    homeTeamId: "spain",
    homeTeamName: "Spain",
    homeTeamFlag: "🇪🇸",
    awayTeamId: "iran",
    awayTeamName: "Iran",
    awayTeamFlag: "🇮🇷",
    status: "upcoming",
    date: "2026-06-14",
    time: "15:00",
    stadiumId: "akron",
    stadiumName: "Estadio Akron"
  },
  {
    id: "m16",
    stage: "Group Stage",
    group: "H",
    homeTeamId: "chile",
    homeTeamName: "Chile",
    homeTeamFlag: "🇨🇱",
    awayTeamId: "nigeria",
    awayTeamName: "Nigeria",
    awayTeamFlag: "🇳🇬",
    status: "upcoming",
    date: "2026-06-14",
    time: "18:00",
    stadiumId: "bbva",
    stadiumName: "Estadio BBVA"
  },
  {
    id: "m17",
    stage: "Group Stage",
    group: "I",
    homeTeamId: "portugal",
    homeTeamName: "Portugal",
    homeTeamFlag: "🇵🇹",
    awayTeamId: "honduras",
    awayTeamName: "Honduras",
    awayTeamFlag: "🇭🇳",
    status: "upcoming",
    date: "2026-06-14",
    time: "21:00",
    stadiumId: "lumen",
    stadiumName: "Lumen Field"
  },

  // June 15 - (Upcoming)
  {
    id: "m18",
    stage: "Group Stage",
    group: "I",
    homeTeamId: "denmark",
    homeTeamName: "Denmark",
    homeTeamFlag: "🇩🇰",
    awayTeamId: "tunisia",
    awayTeamName: "Tunisia",
    awayTeamFlag: "🇹🇳",
    status: "upcoming",
    date: "2026-06-15",
    time: "15:00",
    stadiumId: "gillette",
    stadiumName: "Gillette Stadium"
  },
  {
    id: "m19",
    stage: "Group Stage",
    group: "J",
    homeTeamId: "italy",
    homeTeamName: "Italy",
    homeTeamFlag: "🇮🇹",
    awayTeamId: "uae",
    awayTeamName: "United Arab Emirates",
    awayTeamFlag: "🇦🇪",
    status: "upcoming",
    date: "2026-06-15",
    time: "18:00",
    stadiumId: "lincoln",
    stadiumName: "Lincoln Financial Field"
  },
  {
    id: "m20",
    stage: "Group Stage",
    group: "J",
    homeTeamId: "peru",
    homeTeamName: "Peru",
    homeTeamFlag: "🇵🇪",
    awayTeamId: "south-africa",
    awayTeamName: "South Africa",
    awayTeamFlag: "🇿🇦",
    status: "upcoming",
    date: "2026-06-15",
    time: "21:00",
    stadiumId: "hardrock",
    stadiumName: "Hard Rock Stadium"
  },

  // June 16 - (Upcoming)
  {
    id: "m21",
    stage: "Group Stage",
    group: "K",
    homeTeamId: "germany",
    homeTeamName: "Germany",
    homeTeamFlag: "🇩🇪",
    awayTeamId: "oman",
    awayTeamName: "Oman",
    awayTeamFlag: "🇴🇲",
    status: "upcoming",
    date: "2026-06-16",
    time: "14:00",
    stadiumId: "att",
    stadiumName: "AT&T Stadium"
  },
  {
    id: "m22",
    stage: "Group Stage",
    group: "K",
    homeTeamId: "switzerland",
    homeTeamName: "Switzerland",
    homeTeamFlag: "🇨🇭",
    awayTeamId: "ivory-coast",
    awayTeamName: "Ivory Coast",
    awayTeamFlag: "🇨🇮",
    status: "upcoming",
    date: "2026-06-16",
    time: "17:00",
    stadiumId: "bcplace",
    stadiumName: "BC Place"
  },
  {
    id: "m23",
    stage: "Group Stage",
    group: "L",
    homeTeamId: "netherlands",
    homeTeamName: "Netherlands",
    homeTeamFlag: "🇳🇱",
    awayTeamId: "china",
    awayTeamName: "China",
    awayTeamFlag: "🇨🇳",
    status: "upcoming",
    date: "2026-06-16",
    time: "20:00",
    stadiumId: "metlife",
    stadiumName: "MetLife Stadium"
  },
  {
    id: "m24",
    stage: "Group Stage",
    group: "L",
    homeTeamId: "croatia",
    homeTeamName: "Croatia",
    homeTeamFlag: "🇭🇷",
    awayTeamId: "panama",
    awayTeamName: "Panama",
    awayTeamFlag: "🇵🇦",
    status: "upcoming",
    date: "2026-06-16",
    time: "22:00",
    stadiumId: "bmo",
    stadiumName: "BMO Field"
  }
];

export interface KnockoutMatchNode {
  id: string;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  label: string;
  homeTeam?: { name: string; flag: string; code: string; score?: number; id: string };
  awayTeam?: { name: string; flag: string; code: string; score?: number; id: string };
  winnerId?: string;
  nextMatchId?: string; // id of the node this feeds into
}

// Interactive Knockout Bracket Seed Data
// NOTE: R32 seeds are derived dynamically from live group standings in knockout/page.tsx.
// This static array provides the bracket structure and seeding labels only.
// No fake pre-filled results — all slots start as TBD and are populated by live data or simulation.
export const knockoutNodes: KnockoutMatchNode[] = [
  // Round of 32 — seeding: 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H, 1I vs 2J, 1K vs 2L,
  //                        1B vs 2A, 1D vs 2C, 1F vs 2E, 1H vs 2G, 1J vs 2I, 1L vs 2K
  // (Official WC 2026 bracket pairing)
  { id: "R32_1",  round: "R32", label: "M1",  nextMatchId: "R16_1" },
  { id: "R32_2",  round: "R32", label: "M2",  nextMatchId: "R16_1" },
  { id: "R32_3",  round: "R32", label: "M3",  nextMatchId: "R16_2" },
  { id: "R32_4",  round: "R32", label: "M4",  nextMatchId: "R16_2" },
  { id: "R32_5",  round: "R32", label: "M5",  nextMatchId: "R16_3" },
  { id: "R32_6",  round: "R32", label: "M6",  nextMatchId: "R16_3" },
  { id: "R32_7",  round: "R32", label: "M7",  nextMatchId: "R16_4" },
  { id: "R32_8",  round: "R32", label: "M8",  nextMatchId: "R16_4" },
  { id: "R32_9",  round: "R32", label: "M9",  nextMatchId: "R16_5" },
  { id: "R32_10", round: "R32", label: "M10", nextMatchId: "R16_5" },
  { id: "R32_11", round: "R32", label: "M11", nextMatchId: "R16_6" },
  { id: "R32_12", round: "R32", label: "M12", nextMatchId: "R16_6" },
  { id: "R32_13", round: "R32", label: "M13", nextMatchId: "R16_7" },
  { id: "R32_14", round: "R32", label: "M14", nextMatchId: "R16_7" },
  { id: "R32_15", round: "R32", label: "M15", nextMatchId: "R16_8" },
  { id: "R32_16", round: "R32", label: "M16", nextMatchId: "R16_8" },

  // Round of 16 — all TBD until R32 completes
  { id: "R16_1", round: "R16", label: "R16 - M1", nextMatchId: "QF_1" },
  { id: "R16_2", round: "R16", label: "R16 - M2", nextMatchId: "QF_1" },
  { id: "R16_3", round: "R16", label: "R16 - M3", nextMatchId: "QF_2" },
  { id: "R16_4", round: "R16", label: "R16 - M4", nextMatchId: "QF_2" },
  { id: "R16_5", round: "R16", label: "R16 - M5", nextMatchId: "QF_3" },
  { id: "R16_6", round: "R16", label: "R16 - M6", nextMatchId: "QF_3" },
  { id: "R16_7", round: "R16", label: "R16 - M7", nextMatchId: "QF_4" },
  { id: "R16_8", round: "R16", label: "R16 - M8", nextMatchId: "QF_4" },

  // Quarter Finals — all TBD
  { id: "QF_1", round: "QF", label: "QF 1", nextMatchId: "SF_1" },
  { id: "QF_2", round: "QF", label: "QF 2", nextMatchId: "SF_1" },
  { id: "QF_3", round: "QF", label: "QF 3", nextMatchId: "SF_2" },
  { id: "QF_4", round: "QF", label: "QF 4", nextMatchId: "SF_2" },

  // Semi Finals — all TBD
  { id: "SF_1", round: "SF", label: "SF 1", nextMatchId: "F" },
  { id: "SF_2", round: "SF", label: "SF 2", nextMatchId: "F" },

  // Grand Final
  { id: "F", round: "F", label: "Grand Final" }
];
