export interface Player {
  id: string;
  name: string;
  age: number;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  nationality: string; // Team ID
  teamName: string;
  teamFlag: string;
  club: string;
  photoUrl: string; // We can use dummy or placeholder pattern
  stats: {
    goals: number;
    assists: number;
    minutesPlayed: number;
    passAccuracy: number;
    tackles: number;
    saves: number;
    yellowCards: number;
    redCards: number;
  };
}

export const players: Player[] = [
  {
    id: "messi",
    name: "Lionel Messi",
    age: 38,
    position: "Forward",
    nationality: "argentina",
    teamName: "Argentina",
    teamFlag: "🇦🇷",
    club: "Inter Miami CF",
    photoUrl: "/players/messi.png",
    stats: { goals: 2, assists: 1, minutesPlayed: 90, passAccuracy: 88.5, tackles: 1, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "mbappe",
    name: "Kylian Mbappé",
    age: 27,
    position: "Forward",
    nationality: "france",
    teamName: "France",
    teamFlag: "🇫🇷",
    club: "Real Madrid",
    photoUrl: "/players/mbappe.png",
    stats: { goals: 3, assists: 0, minutesPlayed: 90, passAccuracy: 86.2, tackles: 0, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "bellingham",
    name: "Jude Bellingham",
    age: 22,
    position: "Midfielder",
    nationality: "england",
    teamName: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    club: "Real Madrid",
    photoUrl: "/players/bellingham.png",
    stats: { goals: 1, assists: 2, minutesPlayed: 88, passAccuracy: 91.0, tackles: 4, saves: 0, yellowCards: 1, redCards: 0 }
  },
  {
    id: "vinicius",
    name: "Vinícius Júnior",
    age: 25,
    position: "Forward",
    nationality: "brazil",
    teamName: "Brazil",
    teamFlag: "🇧🇷",
    club: "Real Madrid",
    photoUrl: "/players/vinicius.png",
    stats: { goals: 2, assists: 1, minutesPlayed: 90, passAccuracy: 82.4, tackles: 2, saves: 0, yellowCards: 1, redCards: 0 }
  },
  {
    id: "yamal",
    name: "Lamine Yamal",
    age: 18,
    position: "Forward",
    nationality: "spain",
    teamName: "Spain",
    teamFlag: "🇪🇸",
    club: "FC Barcelona",
    photoUrl: "/players/yamal.png",
    stats: { goals: 1, assists: 2, minutesPlayed: 82, passAccuracy: 85.0, tackles: 3, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "kane",
    name: "Harry Kane",
    age: 32,
    position: "Forward",
    nationality: "england",
    teamName: "England",
    teamFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    club: "FC Bayern Munich",
    photoUrl: "/players/kane.png",
    stats: { goals: 2, assists: 1, minutesPlayed: 90, passAccuracy: 81.5, tackles: 1, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "pulisic",
    name: "Christian Pulisic",
    age: 27,
    position: "Forward",
    nationality: "usa",
    teamName: "United States",
    teamFlag: "🇺🇸",
    club: "AC Milan",
    photoUrl: "/players/pulisic.png",
    stats: { goals: 2, assists: 1, minutesPlayed: 90, passAccuracy: 84.8, tackles: 2, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "musiala",
    name: "Jamal Musiala",
    age: 23,
    position: "Midfielder",
    nationality: "germany",
    teamName: "Germany",
    teamFlag: "🇩🇪",
    club: "FC Bayern Munich",
    photoUrl: "/players/musiala.png",
    stats: { goals: 1, assists: 1, minutesPlayed: 79, passAccuracy: 89.2, tackles: 2, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "lewandowski",
    name: "Robert Lewandowski",
    age: 37,
    position: "Forward",
    nationality: "poland",
    teamName: "Poland",
    teamFlag: "🇵🇱",
    club: "FC Barcelona",
    photoUrl: "/players/lewandowski.png",
    stats: { goals: 1, assists: 0, minutesPlayed: 90, passAccuracy: 78.4, tackles: 0, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "salah",
    name: "Mohamed Salah",
    age: 33,
    position: "Forward",
    nationality: "egypt",
    teamName: "Egypt",
    teamFlag: "🇪🇬",
    club: "Liverpool FC",
    photoUrl: "/players/salah.png",
    stats: { goals: 1, assists: 0, minutesPlayed: 90, passAccuracy: 80.1, tackles: 1, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "son",
    name: "Son Heung-min",
    age: 33,
    position: "Forward",
    nationality: "south-korea",
    teamName: "South Korea",
    teamFlag: "🇰🇷",
    club: "Tottenham Hotspur FC",
    photoUrl: "/players/son.png",
    stats: { goals: 1, assists: 0, minutesPlayed: 90, passAccuracy: 81.3, tackles: 1, saves: 0, yellowCards: 1, redCards: 0 }
  },
  {
    id: "valverde",
    name: "Federico Valverde",
    age: 27,
    position: "Midfielder",
    nationality: "uruguay",
    teamName: "Uruguay",
    teamFlag: "🇺🇾",
    club: "Real Madrid",
    photoUrl: "/players/valverde.png",
    stats: { goals: 1, assists: 1, minutesPlayed: 90, passAccuracy: 88.0, tackles: 5, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "davies",
    name: "Alphonso Davies",
    age: 25,
    position: "Defender",
    nationality: "canada",
    teamName: "Canada",
    teamFlag: "🇨🇦",
    club: "FC Bayern Munich",
    photoUrl: "/players/davies.png",
    stats: { goals: 0, assists: 1, minutesPlayed: 90, passAccuracy: 83.2, tackles: 4, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "hakimi",
    name: "Achraf Hakimi",
    age: 27,
    position: "Defender",
    nationality: "morocco",
    teamName: "Morocco",
    teamFlag: "🇲🇦",
    club: "Paris Saint-Germain",
    photoUrl: "/players/hakimi.png",
    stats: { goals: 0, assists: 1, minutesPlayed: 90, passAccuracy: 84.1, tackles: 3, saves: 0, yellowCards: 1, redCards: 0 }
  },
  {
    id: "vandijk",
    name: "Virgil van Dijk",
    age: 34,
    position: "Defender",
    nationality: "netherlands",
    teamName: "Netherlands",
    teamFlag: "🇳🇱",
    club: "Liverpool FC",
    photoUrl: "/players/vandijk.png",
    stats: { goals: 0, assists: 0, minutesPlayed: 90, passAccuracy: 90.5, tackles: 5, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "saliba",
    name: "William Saliba",
    age: 25,
    position: "Defender",
    nationality: "france",
    teamName: "France",
    teamFlag: "🇫🇷",
    club: "Arsenal FC",
    photoUrl: "/players/saliba.png",
    stats: { goals: 0, assists: 0, minutesPlayed: 90, passAccuracy: 92.4, tackles: 4, saves: 0, yellowCards: 0, redCards: 0 }
  },
  {
    id: "donnarumma",
    name: "Gianluigi Donnarumma",
    age: 27,
    position: "Goalkeeper",
    nationality: "italy",
    teamName: "Italy",
    teamFlag: "🇮🇹",
    club: "Paris Saint-Germain",
    photoUrl: "/players/donnarumma.png",
    stats: { goals: 0, assists: 0, minutesPlayed: 90, passAccuracy: 81.0, tackles: 0, saves: 5, yellowCards: 0, redCards: 0 }
  },
  {
    id: "alisson",
    name: "Alisson Becker",
    age: 33,
    position: "Goalkeeper",
    nationality: "brazil",
    teamName: "Brazil",
    teamFlag: "🇧🇷",
    club: "Liverpool FC",
    photoUrl: "/players/alisson.png",
    stats: { goals: 0, assists: 0, minutesPlayed: 90, passAccuracy: 83.5, tackles: 0, saves: 4, yellowCards: 0, redCards: 0 }
  },
  {
    id: "williams",
    name: "Ronwen Williams",
    age: 34,
    position: "Goalkeeper",
    nationality: "south-africa",
    teamName: "South Africa",
    teamFlag: "🇿🇦",
    club: "Mamelodi Sundowns FC",
    photoUrl: "/players/williams.png",
    stats: { goals: 0, assists: 0, minutesPlayed: 90, passAccuracy: 75.2, tackles: 0, saves: 6, yellowCards: 0, redCards: 0 }
  }
];
