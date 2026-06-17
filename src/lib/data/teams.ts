export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  ranking: number;
  group: string;
  confederation: string;
  coach: string;
  captain: string;
  stats: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
  };
  form: ('W' | 'D' | 'L')[];
  squad?: {
    goalkeepers: string[];
    defenders: string[];
    midfielders: string[];
    forwards: string[];
  };
  avgPossession: number;
  passAccuracy: number;
}

export const teams: Team[] = [
  // Group A
  {
    id: "usa",
    name: "United States",
    squad: {
          "goalkeepers": [
                "Matt Turner",
                "Matt Freese",
                "Chris Brady"
          ],
          "defenders": [
                "Sergiño Dest",
                "Chris Richards",
                "Antonee Robinson",
                "Auston Trusty",
                "Miles Robinson",
                "Tim Ream",
                "Alex Freeman",
                "Max Arfsten",
                "Mark McKenzie",
                "Joe Scally"
          ],
          "midfielders": [
                "Tyler Adams",
                "Giovanni Reyna",
                "Weston McKennie",
                "Sebastian Berhalter",
                "Cristian Roldán",
                "Malik Tillman"
          ],
          "forwards": [
                "Ricardo Pepi",
                "Christian Pulisic",
                "Brenden Aaronson",
                "Haji Wright",
                "Folarin Balogun",
                "Timothy Weah",
                "Alex Zendejas"
          ]
    },
    code: "USA",
    flag: "🇺🇸",
    ranking: 11,
    group: "A",
    confederation: "CONCACAF",
    coach: "Mauricio Pochettino",
    captain: "Christian Pulisic",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "D", "W", "L", "W"],
    avgPossession: 55.4,
    passAccuracy: 84.1
  },
  {
    id: "cameroon",
    name: "Cameroon",
    code: "CMR",
    flag: "🇨🇲",
    ranking: 49,
    group: "A",
    confederation: "CAF",
    coach: "Marc Brys",
    captain: "Vincent Aboubakar",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "W", "D", "W"],
    avgPossession: 48.2,
    passAccuracy: 78.5
  },
  {
    id: "slovakia",
    name: "Slovakia",
    code: "SVK",
    flag: "🇸🇰",
    ranking: 42,
    group: "A",
    confederation: "UEFA",
    coach: "Francesco Calzona",
    captain: "Milan Škriniar",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "L", "W", "D"],
    avgPossession: 51.0,
    passAccuracy: 82.0
  },
  {
    id: "iraq",
    name: "Iraq",
    squad: {
          "goalkeepers": [
                "Fahad Talib",
                "Jalal Hassan",
                "Ahmed Basil"
          ],
          "defenders": [
                "Rebin Ghareeb",
                "Hussein Ali",
                "Zaid Tahseen",
                "Akam Hashim",
                "Munaf Younus",
                "Ahmed Yahya",
                "Merchas Doski",
                "Mustafa Saadoon",
                "Frans Putros"
          ],
          "midfielders": [
                "Youssef Amyn",
                "Ibrahim Bayesh",
                "Zidane Iqbal",
                "Amir Al-Ammari",
                "Kevin Yakob",
                "Aimar Sher",
                "Zaid Ismael"
          ],
          "forwards": [
                "Ali Al-Hamadi",
                "Mohanad Ali",
                "Ahmed Qasim",
                "Ali Yousif",
                "Ali Jasim",
                "Aymen Hussein",
                "Marko Farji"
          ]
    },
    code: "IRQ",
    flag: "🇮🇶",
    ranking: 55,
    group: "A",
    confederation: "AFC",
    coach: "Jesús Casas",
    captain: "Jalal Hassan",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "W", "D", "L"],
    avgPossession: 45.4,
    passAccuracy: 76.8
  },

  // Group B
  {
    id: "mexico",
    name: "Mexico",
    squad: {
          "goalkeepers": [
                "Raúl Rangel",
                "Carlos Acevedo",
                "Guillermo Ochoa"
          ],
          "defenders": [
                "Jorge Sánchez",
                "César Montes",
                "Edson Álvarez",
                "Johan Vásquez",
                "Israel Reyes",
                "Mateo Chávez",
                "Jesús Gallardo"
          ],
          "midfielders": [
                "Erik Lira",
                "Luis Romo",
                "Álvaro Fidalgo",
                "Orbelín Piñeda",
                "Obed Vargas",
                "Gilberto Mora",
                "Luis Chávez",
                "Brian Gutiérrez"
          ],
          "forwards": [
                "Raúl Jiménez",
                "Alexis Vega",
                "Santiago Giménez",
                "Armando González",
                "Julián Quiñones",
                "César Huerta",
                "Guillermo Martínez",
                "Roberto Alvarado"
          ]
    },
    code: "MEX",
    flag: "🇲🇽",
    ranking: 16,
    group: "B",
    confederation: "CONCACAF",
    coach: "Javier Aguirre",
    captain: "Edson Álvarez",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "W", "D", "L"],
    avgPossession: 53.0,
    passAccuracy: 81.5
  },
  {
    id: "sweden",
    name: "Sweden",
    squad: {
          "goalkeepers": [
                "Jacob Zetterström",
                "Viktor Johansson",
                "Kristoffer Nordfeldt"
          ],
          "defenders": [
                "Gustaf Lagerbielke",
                "Victor Lindelöf",
                "Isak Hien",
                "Gabriel Gudmundsson",
                "Herman Johansson",
                "Daniel Svensson",
                "Hjalmar Ekdal",
                "Carl Starfelt",
                "Eric Smith",
                "Alexander Bernhardsson",
                "Elliot Stroud"
          ],
          "midfielders": [
                "Lucas Bergvall",
                "Benjamin Nygren",
                "Ken Sema",
                "Jesper Karlström",
                "Yasin Ayari",
                "Mattias Svanberg",
                "Besfort Zeneli"
          ],
          "forwards": [
                "Alexander Isak",
                "Anthony Elanga",
                "Viktor Gyökeres",
                "Gustaf Nilsson",
                "Taha Ali"
          ]
    },
    code: "SWE",
    flag: "🇸🇪",
    ranking: 22,
    group: "B",
    confederation: "UEFA",
    coach: "Jon Dahl Tomasson",
    captain: "Victor Lindelöf",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "W", "L", "W"],
    avgPossession: 56.8,
    passAccuracy: 85.3
  },
  {
    id: "morocco",
    name: "Morocco",
    squad: {
          "goalkeepers": [
                "Yassine Bounou",
                "Munir El Kajoui",
                "Ahmed Tagnaouti"
          ],
          "defenders": [
                "Achraf Hakimi",
                "Noussair Mazraoui",
                "Nayef Aguerd",
                "Zakaria El Ouahdi",
                "Issa Diop",
                "Chadi Riad",
                "Youssef Belammari",
                "Redouane Halhal",
                "Anass Salah-Eddine"
          ],
          "midfielders": [
                "Sofyan Amrabat",
                "Ayyoub Bouaddi",
                "Chemsdine Talbi",
                "Azzedine Ounahi",
                "Ismaël Saibari",
                "Samir El Mourabet",
                "Gessime Yassine",
                "Bilal El Khannouss",
                "Neil El Aynaoui"
          ],
          "forwards": [
                "Soufiane Rahimi",
                "Brahim Díaz",
                "Abde Ezzalzouli",
                "Ayoub El Kaabi",
                "Ayoub Amaimouni"
          ]
    },
    code: "MAR",
    flag: "🇲🇦",
    ranking: 13,
    group: "B",
    confederation: "CAF",
    coach: "Walid Regragui",
    captain: "Achraf Hakimi",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "L", "W", "W"],
    avgPossession: 50.2,
    passAccuracy: 80.9
  },
  {
    id: "south-korea",
    name: "South Korea",
    squad: {
          "goalkeepers": [
                "Seunggyu Kim",
                "Bumkeun Song",
                "Hyeonwoo Jo"
          ],
          "defenders": [
                "Hanbeom Lee",
                "Minjae Kim",
                "Taehyeon Kim",
                "Taeseok Lee",
                "Wije Cho",
                "Moonhwan Kim",
                "Jinseob Park",
                "Youngwoo Seol",
                "Jens Castrop"
          ],
          "midfielders": [
                "Gihyuk Lee",
                "Inbeom Hwang",
                "Seungho Paik",
                "Jaesung Lee",
                "Heechan Hwang",
                "Junho Bae",
                "Kangin Lee",
                "Hyunjun Yang",
                "Jingyu Kim",
                "Jisung Eom",
                "Donggyeong Lee"
          ],
          "forwards": [
                "Heungmin Son",
                "Guesung Cho",
                "Hyeongyu Oh"
          ]
    },
    code: "KOR",
    flag: "🇰🇷",
    ranking: 23,
    group: "B",
    confederation: "AFC",
    coach: "Hong Myung-bo",
    captain: "Son Heung-min",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "W", "D", "W"],
    avgPossession: 52.1,
    passAccuracy: 83.4
  },

  // Group C
  {
    id: "canada",
    name: "Canada",
    squad: {
          "goalkeepers": [
                "Dayne St. Clair",
                "Maxime Crépeau",
                "Owen Goodman"
          ],
          "defenders": [
                "Alistair Johnston",
                "Alfie Jones",
                "Luc de Fougerolles",
                "Joel Waterman",
                "Derek Cornelius",
                "Moïse Bombito",
                "Alphonso Davies",
                "Richie Laryea",
                "Niko Sigur"
          ],
          "midfielders": [
                "Mathieu Choinière",
                "Stephen Eustaquio",
                "Ismaël Koné",
                "Liam Millar",
                "Jacob Shaffelburg",
                "Jonathan Osorio",
                "Nathan Saliba",
                "Marcelo Flores"
          ],
          "forwards": [
                "Cyle Larin",
                "Jonathan David",
                "Tani Oluwaseyi",
                "Tajon Buchanan",
                "Ali Ahmed",
                "Promise David"
          ]
    },
    code: "CAN",
    flag: "🇨🇦",
    ranking: 35,
    group: "C",
    confederation: "CONCACAF",
    coach: "Jesse Marsch",
    captain: "Alphonso Davies",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "L", "D", "W"],
    avgPossession: 49.5,
    passAccuracy: 79.2
  },
  {
    id: "uruguay",
    name: "Uruguay",
    squad: {
          "goalkeepers": [
                "Sergio Rochet",
                "Santiago Mele",
                "Fernando Muslera"
          ],
          "defenders": [
                "José Giménez",
                "Sebastián Cáceres",
                "Ronald Araújo",
                "Guillermo Varela",
                "Mathías Olivera",
                "Matías Viña",
                "Santiago Bueno"
          ],
          "midfielders": [
                "Manuel Ugarte",
                "Rodrigo Bentancur",
                "Nicolás de la Cruz",
                "Federico Valverde",
                "Giorgian de Arrascaeta",
                "Agustín Canobbio",
                "Emiliano Martínez",
                "Maximiliano Araújo",
                "Joaquín Piquerez",
                "Juan Sanabria",
                "Rodrigo Zalazar"
          ],
          "forwards": [
                "Darwin Núñez",
                "Facundo Pellistri",
                "Brian Rodríguez",
                "Rodrigo Aguirre",
                "Federico Viñas"
          ]
    },
    code: "URU",
    flag: "🇺🇾",
    ranking: 14,
    group: "C",
    confederation: "CONMEBOL",
    coach: "Marcelo Bielsa",
    captain: "Federico Valverde",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "D", "L", "W", "W"],
    avgPossession: 58.2,
    passAccuracy: 82.6
  },
  {
    id: "senegal",
    name: "Senegal",
    squad: {
          "goalkeepers": [
                "Yehvann Diouf",
                "Édouard Mendy",
                "Mory Diaw"
          ],
          "defenders": [
                "Mamadou Sarr",
                "Kalidou Koulibaly",
                "Abdoulaye Seck",
                "Ismail Jakobs",
                "Krepin Diatta",
                "Moussa Niakhaté",
                "Antoine Mendy",
                "El Hadji Diouf"
          ],
          "midfielders": [
                "Idrissa Gueye",
                "Pathé Ciss",
                "Lamine Camara",
                "Pape Sarr",
                "Habib Diarra",
                "Bara Ndiaye",
                "Pape Gueye"
          ],
          "forwards": [
                "Assane Diao",
                "Bamba Dieng",
                "Sadio Mané",
                "Nicolas Jackson",
                "Chérif Ndiaye",
                "Iliman Ndiaye",
                "Ismaïla Sarr",
                "Ibrahim Mbaye"
          ]
    },
    code: "SEN",
    flag: "🇸🇳",
    ranking: 20,
    group: "C",
    confederation: "CAF",
    coach: "Pape Thiaw",
    captain: "Kalidou Koulibaly",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "W", "L", "D"],
    avgPossession: 52.0,
    passAccuracy: 81.0
  },
  {
    id: "uzbekistan",
    name: "Uzbekistan",
    squad: {
          "goalkeepers": [
                "Utkir Yusupov",
                "Abduvohid Nematov",
                "Botirali Ergashev"
          ],
          "defenders": [
                "Abdukodir Khusanov",
                "Khojiakbar Alijonov",
                "Farrukh Sayfiev",
                "Rustam Ashurmatov",
                "Sherzod Nasrullaev",
                "Umar Eshmurodov",
                "Abdulla Abdullaev",
                "Behruzjon Karimov",
                "Avazbek Ulmasaliyev",
                "Jakhongir Urozov"
          ],
          "midfielders": [
                "Akmal Mozgovoy",
                "Otabek Shukurov",
                "Jamshid Iskanderov",
                "Odiljon Xamrobekov",
                "Jaloliddin Masharipov",
                "Oston Urunov",
                "Dostonbek Khamdamov",
                "Azizjon Ganiev",
                "Abbosbek Fayzullaev",
                "Sherzod Esanov"
          ],
          "forwards": [
                "Eldor Shomurodov",
                "Azizbek Amonov",
                "Igor Sergeev"
          ]
    },
    code: "UZB",
    flag: "🇺🇿",
    ranking: 58,
    group: "C",
    confederation: "AFC",
    coach: "Srečko Katanec",
    captain: "Eldor Shomurodov",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "W", "L"],
    avgPossession: 44.1,
    passAccuracy: 75.3
  },

  // Group D
  {
    id: "argentina",
    name: "Argentina",
    squad: {
          "goalkeepers": [
                "Juan Musso",
                "Gerónimo Rulli",
                "Emiliano Martínez"
          ],
          "defenders": [
                "Leonardo Balerdi",
                "Nicolás Tagliafico",
                "Gonzalo Montiel",
                "Lisandro Martínez",
                "Cristian Romero",
                "Nicolás Otamendi",
                "Facundo Medina",
                "Nahuel Molina"
          ],
          "midfielders": [
                "Leandro Paredes",
                "Rodrigo de Paul",
                "Valentín Barco",
                "Giovani Lo Celso",
                "Exequiel Palacios",
                "Nicolás González",
                "Alexis Mac Allister",
                "Enzo Fernández"
          ],
          "forwards": [
                "Julián Álvarez",
                "Lionel Messi",
                "Thiago Almada",
                "Giuliano Simeone",
                "Nicolás Paz",
                "José López",
                "Lautaro Martínez"
          ]
    },
    code: "ARG",
    flag: "🇦🇷",
    ranking: 1,
    group: "D",
    confederation: "CONMEBOL",
    coach: "Lionel Scaloni",
    captain: "Lionel Messi",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "W", "D", "W"],
    avgPossession: 62.4,
    passAccuracy: 89.5
  },
  {
    id: "poland",
    name: "Poland",
    code: "POL",
    flag: "🇵🇱",
    ranking: 30,
    group: "D",
    confederation: "UEFA",
    coach: "Michał Probierz",
    captain: "Robert Lewandowski",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "W", "D", "W"],
    avgPossession: 47.9,
    passAccuracy: 80.2
  },
  {
    id: "egypt",
    name: "Egypt",
    squad: {
          "goalkeepers": [
                "Mohamed Elshenawy",
                "Mahdy Soliman",
                "Mostafa Shoubir",
                "Mohamed Alaa"
          ],
          "defenders": [
                "Yasser Ibrahim",
                "Mohamed Hany",
                "Hossam Abdelmaguid",
                "Ramy Rabia",
                "Mohamed Abdelmoneim",
                "Ahmed Fatouh",
                "Karim Hafez",
                "Tarek Alaa"
          ],
          "midfielders": [
                "Emam Ashour",
                "Mostafa Zico",
                "Hamdy Fathy",
                "Mohanad Lashin",
                "Nabil Donga",
                "Marawan Attia",
                "Mahmoud Saber"
          ],
          "forwards": [
                "Mahmoud Hassan",
                "Hamza Abdelkarim",
                "Mohamed Salah",
                "Haissem Hassan",
                "Ibrahim Adel",
                "Omar Marmoush",
                "Mahmoud Hamdy"
          ]
    },
    code: "EGY",
    flag: "🇪🇬",
    ranking: 32,
    group: "D",
    confederation: "CAF",
    coach: "Hossam Hassan",
    captain: "Mohamed Salah",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "W", "W"],
    avgPossession: 50.5,
    passAccuracy: 81.3
  },
  {
    id: "australia",
    name: "Australia",
    squad: {
          "goalkeepers": [
                "Mathew Ryan",
                "Paul Izzo",
                "Patrick Beach"
          ],
          "defenders": [
                "Miloš Degenek",
                "Alessandro Circati",
                "Jacob Italiano",
                "Jordan Bos",
                "Jason Geria",
                "Kai Trewin",
                "Aziz Behich",
                "Harry Souttar",
                "Cameron Burgess",
                "Lucas Herrington"
          ],
          "midfielders": [
                "Connor Metcalfe",
                "Aiden O'Neill",
                "Cameron Devlin",
                "Jackson Irvine",
                "Paul Okon-Engstler"
          ],
          "forwards": [
                "Mathew Leckie",
                "Mohamed Touré",
                "Ajdin Hrustić",
                "Awer Mabil",
                "Nestory Irankunda",
                "Cristian Volpato",
                "Nishan Velupillay",
                "Tete Yengi"
          ]
    },
    code: "AUS",
    flag: "🇦🇺",
    ranking: 24,
    group: "D",
    confederation: "AFC",
    coach: "Tony Popovic",
    captain: "Mathew Ryan",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "L", "W"],
    avgPossession: 48.0,
    passAccuracy: 78.9
  },

  // Group E
  {
    id: "brazil",
    name: "Brazil",
    squad: {
          "goalkeepers": [
                "Alisson Becker",
                "Weverton Caldeira",
                "Ederson Moraes"
          ],
          "defenders": [
                "Wesley",
                "Gabriel Magalhães",
                "Marcos Corrêa",
                "Alex Sandro",
                "Danilo Luiz",
                "Bremer",
                "Léo Pereira",
                "Douglas Santos",
                "Roger Ibanez"
          ],
          "midfielders": [
                "Carlos Casimiro",
                "Bruno Guimarães",
                "Fábio Tavares",
                "Danilo Santos",
                "Lucas Paquetá"
          ],
          "forwards": [
                "Vinícius Júnior",
                "Matheus Cunha",
                "Neymar Santos",
                "Raphael Belloli",
                "Endrick Sousa",
                "Luiz Henrique",
                "Gabriel Martinelli",
                "Igor Thiago",
                "Rayan"
          ]
    },
    code: "BRA",
    flag: "🇧🇷",
    ranking: 5,
    group: "E",
    confederation: "CONMEBOL",
    coach: "Dorival Júnior",
    captain: "Danilo",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "L"],
    avgPossession: 60.1,
    passAccuracy: 87.8
  },
  {
    id: "ukraine",
    name: "Ukraine",
    code: "UKR",
    flag: "🇺🇦",
    ranking: 25,
    group: "E",
    confederation: "UEFA",
    coach: "Serhiy Rebrov",
    captain: "Andriy Yarmolenko",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "W", "W", "D"],
    avgPossession: 54.0,
    passAccuracy: 83.9
  },
  {
    id: "algeria",
    name: "Algeria",
    squad: {
          "goalkeepers": [
                "Melvin Mastil",
                "Oussama Benbot",
                "Luca Zidane"
          ],
          "defenders": [
                "Aïssa Mandi",
                "Achraf Abada",
                "Mohamed Tougaï",
                "Zineddine Belaïd",
                "Jaouen Hadjam",
                "Rayan Aït-Nouri",
                "Rafik Belghali",
                "Ramy Bensebaini",
                "Samir Chergui"
          ],
          "midfielders": [
                "Ramiz Zerrouki",
                "Houssem Aouar",
                "Fares Chaïbi",
                "Hicham Boudaoui",
                "Nabil Bentaleb",
                "Ibrahim Maza",
                "Yassine Titraoui"
          ],
          "forwards": [
                "Riyad Mahrez",
                "Amine Gouiri",
                "Anis Hadj Moussa",
                "Nadhir Benbouali",
                "Mohamed Amoura",
                "Adil Boulbina",
                "Fares Ghedjemis"
          ]
    },
    code: "ALG",
    flag: "🇩🇿",
    ranking: 41,
    group: "E",
    confederation: "CAF",
    coach: "Vladimir Petković",
    captain: "Riyad Mahrez",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "W", "L"],
    avgPossession: 49.3,
    passAccuracy: 79.8
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    squad: {
          "goalkeepers": [
                "Max Crocombe",
                "Alex Paulsen",
                "Michael Woud"
          ],
          "defenders": [
                "Tim Payne",
                "Francis de Vries",
                "Tyler Bindon",
                "Michael Boxall",
                "Liberato Cacace",
                "Nando Pijnaker",
                "Finn Surman",
                "Callan Elliot",
                "Tommy Smith"
          ],
          "midfielders": [
                "Joe Bell",
                "Matthew Garbett",
                "Marko Stamenić",
                "Sarpreet Singh",
                "Elijah Just",
                "Alex Rufer",
                "Ben Old",
                "Callum McCowatt",
                "Ryan Thomas",
                "Lachlan Bayliss"
          ],
          "forwards": [
                "Chris Wood",
                "Kosta Barbarouses",
                "Ben Waine",
                "Jesse Randall"
          ]
    },
    code: "NZL",
    flag: "🇳🇿",
    ranking: 94,
    group: "E",
    confederation: "OFC",
    coach: "Darren Bazeley",
    captain: "Chris Wood",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "L", "D", "W"],
    avgPossession: 41.5,
    passAccuracy: 73.1
  },

  // Group F
  {
    id: "france",
    name: "France",
    squad: {
          "goalkeepers": [
                "Brice Samba",
                "Mike Maignan",
                "Robin Risser"
          ],
          "defenders": [
                "Malo Gusto",
                "Lucas Digne",
                "Dayot Upamecano",
                "Jules Koundé",
                "Ibrahima Konaté",
                "William Saliba",
                "Théo Hernandez",
                "Lucas Hernandez",
                "Maxence Lacroix"
          ],
          "midfielders": [
                "Manu Koné",
                "Aurélien Tchouaméni",
                "N'Golo Kanté",
                "Adrien Rabiot",
                "Warren Zaïre-Emery",
                "Rayan Cherki",
                "Maghnes Akliouche"
          ],
          "forwards": [
                "Ousmane Dembélé",
                "Marcus Thuram",
                "Kylian Mbappé",
                "Michaël Olise",
                "Bradley Barcola",
                "Désiré Doué",
                "Jean-Philippe Mateta"
          ]
    },
    code: "FRA",
    flag: "🇫🇷",
    ranking: 2,
    group: "F",
    confederation: "UEFA",
    coach: "Didier Deschamps",
    captain: "Kylian Mbappé",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "L", "W", "W"],
    avgPossession: 58.7,
    passAccuracy: 88.2
  },
  {
    id: "colombia",
    name: "Colombia",
    squad: {
          "goalkeepers": [
                "David Ospina",
                "Camilo Vargas",
                "Álvaro Montero"
          ],
          "defenders": [
                "Daniel Muñoz",
                "Jhon Lucumí",
                "Santiago Arias",
                "Yerry Mina",
                "Gustavo Puerta",
                "Johan Mojica",
                "Willer Ditta",
                "Deiver Machado",
                "Dávinson Sánchez"
          ],
          "midfielders": [
                "Kevin Castaño",
                "Richard Ríos",
                "Jorge Carrascal",
                "James Rodríguez",
                "Jhon Arias",
                "Juan Portilla",
                "Jefferson Lerma",
                "Juan Quintero"
          ],
          "forwards": [
                "Luis Díaz",
                "Jhon Córdoba",
                "Juan Hernández",
                "Leandro Campaz",
                "Luis Suárez",
                "Andrés Gómez"
          ]
    },
    code: "COL",
    flag: "🇨🇴",
    ranking: 9,
    group: "F",
    confederation: "CONMEBOL",
    coach: "Néstor Lorenzo",
    captain: "James Rodríguez",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "W"],
    avgPossession: 53.6,
    passAccuracy: 83.5
  },
  {
    id: "ghana",
    name: "Ghana",
    squad: {
          "goalkeepers": [
                "Lawrence Zigi",
                "Joseph Anang",
                "Benjamin Asare"
          ],
          "defenders": [
                "Alidu Seidu",
                "Jonas Adjetey",
                "Abdul Mumin",
                "Gideon Mensah",
                "Baba Rahman",
                "Jerome Opoku",
                "Kojo Oppong",
                "Derrick Luckassen",
                "Marvin Senaya"
          ],
          "midfielders": [
                "Caleb Yirenkyi",
                "Thomas Partey",
                "Kwasi Sibo",
                "Antoine Semenyo",
                "Elisha Owusu",
                "Augustine Boakye"
          ],
          "forwards": [
                "Fatawu Issahaku",
                "Jordan Ayew",
                "Brandon Thomas-Asante",
                "Christopher Baah",
                "Iñaki Williams",
                "Kamaldeen Sulemana",
                "Ernest Nuamah",
                "Prince Adu"
          ]
    },
    code: "GHA",
    flag: "🇬🇭",
    ranking: 73,
    group: "F",
    confederation: "CAF",
    coach: "Otto Addo",
    captain: "Thomas Partey",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "L", "W", "D", "W"],
    avgPossession: 46.8,
    passAccuracy: 77.2
  },
  {
    id: "japan",
    name: "Japan",
    squad: {
          "goalkeepers": [
                "Zion Suzuki",
                "Keisuke Osako",
                "Tomoki Hayakawa"
          ],
          "defenders": [
                "Yukinari Sugawara",
                "Shogo Taniguchi",
                "Kou Itakura",
                "Yuto Nagatomo",
                "Tsuyoshi Watanabe",
                "Ayumu Seko",
                "Hiroki Ito",
                "Takehiro Tomiyasu",
                "Junnosuke Suzuki"
          ],
          "midfielders": [
                "Wataru Endo",
                "Ao Tanaka",
                "Takefusa Kubo",
                "Ritsu Doan",
                "Daizen Maeda",
                "Keito Nakamura",
                "Junya Ito",
                "Daichi Kamada",
                "Yuito Suzuki",
                "Kaishu Sano"
          ],
          "forwards": [
                "Keisuke Goto",
                "Ayase Ueda",
                "Koki Ogawa",
                "Kento Shiogai"
          ]
    },
    code: "JPN",
    flag: "🇯🇵",
    ranking: 15,
    group: "F",
    confederation: "AFC",
    coach: "Hajime Moriyasu",
    captain: "Wataru Endo",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "W", "D", "W"],
    avgPossession: 52.3,
    passAccuracy: 82.7
  },

  // Group G
  {
    id: "england",
    name: "England",
    squad: {
          "goalkeepers": [
                "Jordan Pickford",
                "Dean Henderson",
                "James Trafford"
          ],
          "defenders": [
                "Ezri Konsa",
                "Nico O'Reilly",
                "John Stones",
                "Marc Guéhi",
                "Valentino Livramento",
                "Daniel Burn",
                "Reece James",
                "Djed Spence",
                "Jarell Quansah"
          ],
          "midfielders": [
                "Declan Rice",
                "Elliot Anderson",
                "Jude Bellingham",
                "Jordan Henderson",
                "Kobbie Mainoo",
                "Morgan Rogers",
                "Eberechi Eze"
          ],
          "forwards": [
                "Bukayo Saka",
                "Harry Kane",
                "Marcus Rashford",
                "Anthony Gordon",
                "Oliver Watkins",
                "Noni Madueke",
                "Ivan Toney"
          ]
    },
    code: "ENG",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    ranking: 4,
    group: "G",
    confederation: "UEFA",
    coach: "Thomas Tuchel",
    captain: "Harry Kane",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "L", "W"],
    avgPossession: 59.2,
    passAccuracy: 87.0
  },
  {
    id: "ecuador",
    name: "Ecuador",
    squad: {
          "goalkeepers": [
                "Hernán Galíndez",
                "Moisés Ramírez",
                "Gonzalo Valle"
          ],
          "defenders": [
                "Félix Torres",
                "Piero Hincapié",
                "Joel Ordóñez",
                "Willian Pacho",
                "Pervis Estupiñán",
                "Ángelo Preciado",
                "Jackson Porozo",
                "Yaimar Medina"
          ],
          "midfielders": [
                "Jordy Alcívar",
                "Anthony Valencia",
                "Kendry Páez",
                "Alan Minda",
                "Pedro Vite",
                "Denil Castillo",
                "Alan Franco",
                "Moisés Caicedo"
          ],
          "forwards": [
                "John Yeboah",
                "Kevin Rodríguez",
                "Enner Valencia",
                "Jordy Caicedo",
                "Gonzalo Plata",
                "Nilson Angulo",
                "Jeremy Arévalo"
          ]
    },
    code: "ECU",
    flag: "🇪🇨",
    ranking: 27,
    group: "G",
    confederation: "CONMEBOL",
    coach: "Sebastián Beccacece",
    captain: "Enner Valencia",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "D", "W", "L", "W"],
    avgPossession: 50.1,
    passAccuracy: 80.4
  },
  {
    id: "mali",
    name: "Mali",
    code: "MLI",
    flag: "🇲🇱",
    ranking: 54,
    group: "G",
    confederation: "CAF",
    coach: "Tom Saintfiet",
    captain: "Hamari Traoré",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "W", "D"],
    avgPossession: 47.5,
    passAccuracy: 78.1
  },
  {
    id: "saudi-arabia",
    name: "Saudi Arabia",
    squad: {
          "goalkeepers": [
                "Nawaf Al-Aqidi",
                "Mohammed Al-Owais",
                "Ahmed Al-Kassar"
          ],
          "defenders": [
                "Ali Majrashi",
                "Ali Lajami",
                "Abdulelah Al-Amri",
                "Hassan Al-Tambakti",
                "Saud Abdulhamid",
                "Nawaf Bu Washl",
                "Hassan Kadish",
                "Moteb Al-Harbi",
                "Jehad Thikri",
                "Mohammed Abu Alshamat"
          ],
          "midfielders": [
                "Nasser Al-Dawsari",
                "Musab Al-Juwayr",
                "Abdullah Al-Khaibari",
                "Ziyad Al-Johani",
                "Ala Al-Hajji",
                "Mohamed Kanno"
          ],
          "forwards": [
                "Aiman Yahya",
                "Feras Al-Brikan",
                "Salem Al-Dawsari",
                "Saleh Al-Shehri",
                "Khalid Al-Ghannam",
                "Abdullah Al-Hamddan",
                "Sultan Mandash"
          ]
    },
    code: "KSA",
    flag: "🇸🇦",
    ranking: 56,
    group: "G",
    confederation: "AFC",
    coach: "Hervé Renard",
    captain: "Salem Al-Dawsari",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "D", "L", "W", "W"],
    avgPossession: 49.8,
    passAccuracy: 79.5
  },

  // Group H
  {
    id: "spain",
    name: "Spain",
    squad: {
          "goalkeepers": [
                "David Raya",
                "Joan García",
                "Unai Simón"
          ],
          "defenders": [
                "Marc Pubill",
                "Álex Grimaldo",
                "Eric García",
                "Marcos Llorente",
                "Pedro Porro",
                "Aymeric Laporte",
                "Pau Cubarsí",
                "Marc Cucurella"
          ],
          "midfielders": [
                "Mikel Merino",
                "Fabián Ruiz",
                "Pablo Gavira",
                "Álex Baena",
                "Rodrigo Hernández",
                "Martín Zubimendi",
                "Pedro López"
          ],
          "forwards": [
                "Ferran Torres",
                "Dani Olmo",
                "Yeremy Pino",
                "Nico Williams",
                "Lamine Yamal",
                "Mikel Oyarzabal",
                "Víctor Muñoz",
                "Borja Iglesias"
          ]
    },
    code: "ESP",
    flag: "🇪🇸",
    ranking: 3,
    group: "H",
    confederation: "UEFA",
    coach: "Luis de la Fuente",
    captain: "Alvaro Morata",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "W", "W", "D"],
    avgPossession: 64.2,
    passAccuracy: 90.1
  },
  {
    id: "chile",
    name: "Chile",
    code: "CHI",
    flag: "🇨🇱",
    ranking: 40,
    group: "H",
    confederation: "CONMEBOL",
    coach: "Ricardo Gareca",
    captain: "Mauricio Isla",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "L", "W", "D", "L"],
    avgPossession: 48.9,
    passAccuracy: 79.3
  },
  {
    id: "nigeria",
    name: "Nigeria",
    code: "NGA",
    flag: "🇳🇬",
    ranking: 36,
    group: "H",
    confederation: "CAF",
    coach: "Augustine Eguavoen",
    captain: "William Troost-Ekong",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "L", "D", "W"],
    avgPossession: 51.5,
    passAccuracy: 81.2
  },
  {
    id: "iran",
    name: "Iran",
    squad: {
          "goalkeepers": [
                "Alireza Beiranvand",
                "Payam Niazmand",
                "Hossein Hosseini"
          ],
          "defenders": [
                "Saleh Hardani",
                "Ehsan Hajisafi",
                "Shoja Khalilzadeh",
                "Milad Mohammadi",
                "Hossein Kanani",
                "Arya Yousefi",
                "Ali Nemati",
                "Ramin Rezaeian",
                "Danial Iri"
          ],
          "midfielders": [
                "Saeid Ezatolahi",
                "Alireza Jahanbakhsh",
                "Mohammad Mohebbi",
                "Saman Ghoddos",
                "Roozbeh Cheshmi",
                "Mehdi Torabi",
                "Mohammad Ghorbani",
                "Amirmohammad Razaghinia"
          ],
          "forwards": [
                "Mehdi Taremi",
                "Mehdi Ghayedi",
                "Ali Alipour",
                "Amirhossein Hosseinzadeh",
                "Shahriyar Moghanloo",
                "Dennis Dargahi"
          ]
    },
    code: "IRN",
    flag: "🇮🇷",
    ranking: 19,
    group: "H",
    confederation: "AFC",
    coach: "Amir Ghalenoei",
    captain: "Alireza Jahanbakhsh",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "W", "D", "W"],
    avgPossession: 50.8,
    passAccuracy: 80.0
  },

  // Group I
  {
    id: "portugal",
    name: "Portugal",
    squad: {
          "goalkeepers": [
                "Diogo Costa",
                "José Sá",
                "Rui Silva"
          ],
          "defenders": [
                "Nelson Semedo",
                "Rúben Dias",
                "Tomás Araújo",
                "Diogo Dalot",
                "Renato Veiga",
                "Gonçalo Inácio",
                "João Cancelo",
                "Samu Costa",
                "Nuno Mendes"
          ],
          "midfielders": [
                "Matheus Nunes",
                "Bruno Fernandes",
                "Bernardo Silva",
                "João Neves",
                "Rúben Neves",
                "Vítor Ferreira"
          ],
          "forwards": [
                "Cristiano Ronaldo",
                "Gonçalo Ramos",
                "João Félix",
                "Francisco Trincão",
                "Rafael Leão",
                "Pedro Neto",
                "Gonçalo Guedes",
                "Francisco Conceição"
          ]
    },
    code: "POR",
    flag: "🇵🇹",
    ranking: 7,
    group: "I",
    confederation: "UEFA",
    coach: "Roberto Martínez",
    captain: "Cristiano Ronaldo",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "L"],
    avgPossession: 61.5,
    passAccuracy: 88.5
  },
  {
    id: "denmark",
    name: "Denmark",
    code: "DEN",
    flag: "🇩🇰",
    ranking: 12,
    group: "I",
    confederation: "UEFA",
    coach: "Brian Riemer",
    captain: "Pierre-Emile Højbjerg",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "D", "W", "D"],
    avgPossession: 54.3,
    passAccuracy: 84.6
  },
  {
    id: "tunisia",
    name: "Tunisia",
    squad: {
          "goalkeepers": [
                "Mouhib Chamakh",
                "Aymen Dahmen",
                "Sabri Ben Hessen"
          ],
          "defenders": [
                "Ali Abdi",
                "Montassar Talbi",
                "Omar Rekik",
                "Adam Arous",
                "Dylan Bronn",
                "Mortadha Ben Ouanes",
                "Yan Valery",
                "Mohamed Ben Hmida",
                "Moutaz Neffati",
                "Raed Chikhaoui"
          ],
          "midfielders": [
                "Hannibal Mejbri",
                "Ismaël Gharbi",
                "Rani Khedira",
                "Khalil Ayari",
                "Mohamed Hadj Mahmoud",
                "Ellyes Skhiri",
                "Anis Slimane",
                "Sebastian Tounekti"
          ],
          "forwards": [
                "Elias Achouri",
                "Elias Saad",
                "Hazem Mastouri",
                "Rayan Elloumi",
                "Firas Chaouat"
          ]
    },
    code: "TUN",
    flag: "🇹🇳",
    ranking: 47,
    group: "I",
    confederation: "CAF",
    coach: "Kais Yaâkoubi",
    captain: "Yassine Meriah",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "D", "W", "L", "W"],
    avgPossession: 46.0,
    passAccuracy: 78.4
  },
  {
    id: "honduras",
    name: "Honduras",
    code: "HON",
    flag: "🇭🇳",
    ranking: 77,
    group: "I",
    confederation: "CONCACAF",
    coach: "Reinaldo Rueda",
    captain: "Anthony Lozano",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "L", "W", "D"],
    avgPossession: 45.2,
    passAccuracy: 76.1
  },

  // Group J
  {
    id: "italy",
    name: "Italy",
    code: "ITA",
    flag: "🇮🇹",
    ranking: 10,
    group: "J",
    confederation: "UEFA",
    coach: "Luciano Spalletti",
    captain: "Gianluigi Donnarumma",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "L"],
    avgPossession: 57.0,
    passAccuracy: 86.9
  },
  {
    id: "peru",
    name: "Peru",
    code: "PER",
    flag: "🇵🇪",
    ranking: 38,
    group: "J",
    confederation: "CONMEBOL",
    coach: "Jorge Fossati",
    captain: "Luis Advíncula",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "L", "D", "W", "W"],
    avgPossession: 48.5,
    passAccuracy: 78.8
  },
  {
    id: "south-africa",
    name: "South Africa",
    squad: {
          "goalkeepers": [
                "Ronwen Williams",
                "Sipho Chaine",
                "Ricardo Goss"
          ],
          "defenders": [
                "Thabang Matuludi",
                "Khulumani Ndamane",
                "Aubrey Modiba",
                "Mbekezeli Mbokazi",
                "Samukelo Kabini",
                "Nkosinathi Sibisi",
                "Khuliso Mudau",
                "Ime Okon",
                "Olwethu Makhanya",
                "Bradley Cross"
          ],
          "midfielders": [
                "Teboho Mokoena",
                "Thalente Mbatha",
                "Themba Zwane",
                "Sphephelo Sithole",
                "Jayden Adams"
          ],
          "forwards": [
                "Oswin Appollis",
                "Tshepang Moremi",
                "Lyle Foster",
                "Relebohile Mofokeng",
                "Thapelo Maseko",
                "Iqraam Rayners",
                "Evidence Makgopa",
                "Kamogelo Sebelebele"
          ]
    },
    code: "RSA",
    flag: "🇿🇦",
    ranking: 60,
    group: "J",
    confederation: "CAF",
    coach: "Hugo Broos",
    captain: "Ronwen Williams",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "W", "D", "L"],
    avgPossession: 51.2,
    passAccuracy: 80.5
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    code: "UAE",
    flag: "🇦🇪",
    ranking: 68,
    group: "J",
    confederation: "AFC",
    coach: "Paulo Bento",
    captain: "Khalid Eisa",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "D", "L", "W"],
    avgPossession: 47.3,
    passAccuracy: 77.9
  },

  // Group K
  {
    id: "germany",
    name: "Germany",
    squad: {
          "goalkeepers": [
                "Manuel Neuer",
                "Oliver Baumann",
                "Alexander Nübel"
          ],
          "defenders": [
                "Antonio Rüdiger",
                "Waldemar Anton",
                "Jonathan Tah",
                "Joshua Kimmich",
                "Nico Schlotterbeck",
                "Nathaniel Brown",
                "David Raum",
                "Malick Thiaw"
          ],
          "midfielders": [
                "Aleksandar Pavlović",
                "Leon Goretzka",
                "Jamie Leweling",
                "Jamal Musiala",
                "Pascal Groß",
                "Angelo Stiller",
                "Florian Wirtz",
                "Leroy Sané",
                "Nadiem Amiri",
                "Felix Nmecha",
                "Lennart Karl"
          ],
          "forwards": [
                "Kai Havertz",
                "Nick Woltemade",
                "Maximilian Beier",
                "Deniz Undav"
          ]
    },
    code: "GER",
    flag: "🇩🇪",
    ranking: 6,
    group: "K",
    confederation: "UEFA",
    coach: "Julian Nagelsmann",
    captain: "Joshua Kimmich",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "D"],
    avgPossession: 62.1,
    passAccuracy: 89.1
  },
  {
    id: "switzerland",
    name: "Switzerland",
    squad: {
          "goalkeepers": [
                "Gregor Kobel",
                "Yvon Mvogo",
                "Marvin Keller"
          ],
          "defenders": [
                "Miro Muheim",
                "Silvan Widmer",
                "Nico Elvedi",
                "Manuel Akanji",
                "Ricardo Rodríguez",
                "Eray Cömert",
                "Aurèle Amenda",
                "Luca Jaquez"
          ],
          "midfielders": [
                "Denis Zakaria",
                "Remo Freuler",
                "Johan Manzambi",
                "Granit Xhaka",
                "Ardon Jashari",
                "Djibril Sow",
                "Michel Aebischer",
                "Fabian Rieder"
          ],
          "forwards": [
                "Breel Embolo",
                "Dan Ndoye",
                "Christian Fassnacht",
                "Rubén Vargas",
                "Noah Okafor",
                "Zeki Amdouni",
                "Cédric Itten"
          ]
    },
    code: "SUI",
    flag: "🇨🇭",
    ranking: 15,
    group: "K",
    confederation: "UEFA",
    coach: "Murat Yakin",
    captain: "Granit Xhaka",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "L", "W", "D", "W"],
    avgPossession: 53.2,
    passAccuracy: 83.0
  },
  {
    id: "ivory-coast",
    name: "Ivory Coast",
    squad: {
          "goalkeepers": [
                "Yahia Fofana",
                "Mohamed Koné",
                "Alban Lafont"
          ],
          "defenders": [
                "Ousmane Diomandé",
                "Ghislain Konan",
                "Wilfried Singo",
                "Odilon Kossounou",
                "Christopher Operi",
                "Guela Doué",
                "Emmanuel Agbadou",
                "Evan Ndicka"
          ],
          "midfielders": [
                "Jean Séri",
                "Seko Fofana",
                "Franck Kessié",
                "Ibrahim Sangaré",
                "Parfait Guiagon",
                "Christ Oulai"
          ],
          "forwards": [
                "Ange-Yoan Bonny",
                "Simon Adingra",
                "Yan Diomandé",
                "Elye Wahi",
                "Oumar Diakité",
                "Amad Diallo",
                "Nicolas Pépé",
                "Evann Guessand",
                "Bazoumana Touré"
          ]
    },
    code: "CIV",
    flag: "🇨🇮",
    ranking: 33,
    group: "K",
    confederation: "CAF",
    coach: "Emerse Faé",
    captain: "Franck Kessié",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "W", "W", "D", "L"],
    avgPossession: 51.8,
    passAccuracy: 81.6
  },
  {
    id: "oman",
    name: "Oman",
    code: "OMA",
    flag: "🇴🇲",
    ranking: 76,
    group: "K",
    confederation: "AFC",
    coach: "Rashid Jaber",
    captain: "Harib Al-Saadi",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "L", "W", "D", "L"],
    avgPossession: 44.0,
    passAccuracy: 76.5
  },

  // Group L
  {
    id: "netherlands",
    name: "Netherlands",
    squad: {
          "goalkeepers": [
                "Bart Verbruggen",
                "Robin Roefs",
                "Mark Flekken"
          ],
          "defenders": [
                "Jurriën Timber",
                "Virgil van Dijk",
                "Nathan Aké",
                "Jan-Paul van Hecke",
                "Mats Wieffer",
                "Micky van de Ven",
                "Denzel Dumfries",
                "Jorrel Hato"
          ],
          "midfielders": [
                "Marten de Roon",
                "Justin Kluivert",
                "Ryan Gravenberch",
                "Tijjani Reijnders",
                "Guus Til",
                "Teun Koopmeiners",
                "Frenkie de Jong",
                "Quinten Timber"
          ],
          "forwards": [
                "Wout Weghorst",
                "Memphis Depay",
                "Cody Gakpo",
                "Noa Lang",
                "Donyell Malen",
                "Brian Brobbey",
                "Crysencio Summerville"
          ]
    },
    code: "NED",
    flag: "🇳🇱",
    ranking: 8,
    group: "L",
    confederation: "UEFA",
    coach: "Ronald Koeman",
    captain: "Virgil van Dijk",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["W", "W", "D", "W", "L"],
    avgPossession: 59.8,
    passAccuracy: 86.4
  },
  {
    id: "croatia",
    name: "Croatia",
    squad: {
          "goalkeepers": [
                "Dominik Livaković",
                "Ivor Pandur",
                "Dominik Kotarski"
          ],
          "defenders": [
                "Josip Stanišić",
                "Marin Pongračić",
                "Joško Gvardiol",
                "Duje Čaleta-Car",
                "Josip Šutalo",
                "Kristijan Jakić",
                "Luka Vušković",
                "Martin Erlić"
          ],
          "midfielders": [
                "Nikola Moro",
                "Mateo Kovačić",
                "Luka Modrić",
                "Nikola Vlašić",
                "Mario Pašalić",
                "Martin Baturina",
                "Petar Sučić",
                "Toni Fruk",
                "Luka Sučić"
          ],
          "forwards": [
                "Andrej Kramarić",
                "Ante Budimir",
                "Ivan Perišić",
                "Igor Matanović",
                "Marco Pašalić",
                "Petar Musa"
          ]
    },
    code: "CRO",
    flag: "🇭🇷",
    ranking: 12,
    group: "L",
    confederation: "UEFA",
    coach: "Zlatko Dalić",
    captain: "Luka Modrić",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "W", "D", "W"],
    avgPossession: 55.6,
    passAccuracy: 85.0
  },
  {
    id: "panama",
    name: "Panama",
    squad: {
          "goalkeepers": [
                "Luis Mejía",
                "César Samudio",
                "Orlando Mosquera"
          ],
          "defenders": [
                "César Blackman",
                "José Córdoba",
                "Fidel Escobar",
                "Edgardo Farina",
                "Jiovany Ramos",
                "Carlos Harvey",
                "Eric Davis",
                "Andrés Andrade",
                "Amir Murillo",
                "Roderick Miller",
                "Jorge Gutiérrez"
          ],
          "midfielders": [
                "Cristian Martínez",
                "José Rodríguez",
                "Adalberto Carrasquilla",
                "Ismael Díaz",
                "Edgar Bárcenas",
                "Alberto Quintero",
                "Aníbal Godoy",
                "César Yanis"
          ],
          "forwards": [
                "Tomás Rodríguez",
                "José Fajardo",
                "Cecilio Waterman",
                "Azarías Londoño"
          ]
    },
    code: "PAN",
    flag: "🇵🇦",
    ranking: 39,
    group: "L",
    confederation: "CONCACAF",
    coach: "Thomas Christiansen",
    captain: "Aníbal Godoy",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["D", "W", "L", "W", "D"],
    avgPossession: 48.0,
    passAccuracy: 79.0
  },
  {
    id: "china",
    name: "China",
    code: "CHN",
    flag: "🇨🇳",
    ranking: 90,
    group: "L",
    confederation: "AFC",
    coach: "Branko Ivanković",
    captain: "Wu Lei",
    stats: { played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 },
    form: ["L", "L", "W", "D", "L"],
    avgPossession: 42.4,
    passAccuracy: 74.8
  }
];
