export interface NewsItem {
  id: string;
  category: 'breaking' | 'preview' | 'report' | 'injury' | 'announcement';
  title: string;
  summary: string;
  content: string;
  publishedAt: string; // e.g. "2 hours ago"
  readTime: string;
  imageGradient: string; // Background gradient for news cards
  tags: string[];
}

export const news: NewsItem[] = [
  {
    id: "news1",
    category: "breaking",
    title: "Mbappé Shines as France Edges Past Spirited Japan in LA",
    summary: "A thrilling encounter at the SoFi Stadium saw Kylian Mbappé score a brace to secure France's opening victory.",
    content: "Kylian Mbappé showed exactly why he is regarded as one of the world's best, netting twice in a tight 2-1 victory over Japan. Japan fought valiantly, with Daichi Kamada equalizing in the 43rd minute, but Mbappé's clinical 61st-minute strike secured all three points for Didier Deschamps' side in front of 70,000 fans in Los Angeles.",
    publishedAt: "30m ago",
    readTime: "4 min read",
    imageGradient: "linear-gradient(135deg, #1e3a8a, #0d9488)",
    tags: ["France", "Japan", "Mbappé", "Group F"]
  },
  {
    id: "news2",
    category: "preview",
    title: "Match Preview: England vs Mali - Three Lions Begin 2026 Campaign",
    summary: "Thomas Tuchel's England side launches their quest for World Cup glory tonight against a highly physical Mali squad.",
    content: "All eyes are on MetLife Stadium tonight as England begins their World Cup journey under the management of Thomas Tuchel. Harry Kane is fit to lead the line, supported by Bukayo Saka and Jude Bellingham. Mali, however, present a formidable opening test, boasting a robust midfield anchored by Yves Bissouma.",
    publishedAt: "2h ago",
    readTime: "6 min read",
    imageGradient: "linear-gradient(135deg, #0f172a, #d4af37)",
    tags: ["England", "Mali", "Preview", "Thomas Tuchel"]
  },
  {
    id: "news3",
    category: "injury",
    title: "Injury Update: Militao Cleared for Brazil's Matchday 2",
    summary: "Brazil medical team confirms Eder Militao has recovered from a minor thigh strain and will be available.",
    content: "Eder Militao has been given the green light by Brazil's medical staff after recovering from a thigh injury sustained during training. This is a massive boost for Dorival Júnior's defense ahead of their second Group E clash, following their impressive 4-1 victory over New Zealand.",
    publishedAt: "4h ago",
    readTime: "3 min read",
    imageGradient: "linear-gradient(135deg, #16a34a, #ca8a04)",
    tags: ["Brazil", "Injury Update", "Eder Militao"]
  },
  {
    id: "news4",
    category: "report",
    title: "USA 3-1 Iraq: Pulisic and Balogun Secure Opening Day Joy",
    summary: "The United States men's national team starts their home tournament with a dominant victory in New Jersey.",
    content: "Mauricio Pochettino's era got off to the perfect competitive start as the USA defeated Iraq 3-1 in East Rutherford. Christian Pulisic opened the scoring from the penalty spot, and despite a second-half scare from Iraq's Aymen Hussein, goals from Timothy Weah and Folarin Balogun sealed a crucial opening Group A win.",
    publishedAt: "1d ago",
    readTime: "5 min read",
    imageGradient: "linear-gradient(135deg, #1e40af, #b91c1c)",
    tags: ["USA", "Iraq", "Match Report", "Pulisic"]
  },
  {
    id: "news5",
    category: "announcement",
    title: "FIFA Announces Record Ticket Sales for World Cup 2026",
    summary: "Over 3 million tickets have already been distributed across the 16 host cities in North America.",
    content: "FIFA has announced that the 2026 World Cup has officially broken all prior ticketing records, with over 3 million tickets distributed. With the expansion to 48 teams and 104 matches, fan attendance is expected to surpass 5.5 million across the USA, Canada, and Mexico.",
    publishedAt: "2d ago",
    readTime: "2 min read",
    imageGradient: "linear-gradient(135deg, #312e81, #581c87)",
    tags: ["FIFA", "Ticket Sales", "Announcement"]
  }
];
