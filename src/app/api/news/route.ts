import { NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  category: 'breaking' | 'preview' | 'report' | 'injury' | 'announcement';
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  readTime: string;
  imageGradient: string;
  tags: string[];
}

const FALLBACK_NEWS: NewsItem[] = [
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

function cleanCdata(str: string): string {
  return str
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function determineCategory(title: string, desc: string): NewsItem['category'] {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('injury') || text.includes('hurt') || text.includes('sidelined') || text.includes('fitness') || text.includes('ruled out')) {
    return 'injury';
  }
  if (text.includes('preview') || text.includes('clash') || text.includes('vs') || text.includes('pre-match')) {
    return 'preview';
  }
  if (text.includes('report') || text.includes('review') || text.includes('defeats') || text.includes('draws') || text.includes('beat') || text.includes('win')) {
    return 'report';
  }
  if (text.includes('fifa') || text.includes('announce') || text.includes('ticket') || text.includes('schedule')) {
    return 'announcement';
  }
  return 'breaking';
}

function getGradient(category: NewsItem['category']): string {
  switch (category) {
    case 'breaking': return 'linear-gradient(135deg, #1e3a8a, #0d9488)';
    case 'preview': return 'linear-gradient(135deg, #0f172a, #d4af37)';
    case 'injury': return 'linear-gradient(135deg, #16a34a, #ca8a04)';
    case 'report': return 'linear-gradient(135deg, #1e40af, #b91c1c)';
    case 'announcement': return 'linear-gradient(135deg, #312e81, #581c87)';
    default: return 'linear-gradient(135deg, #1f2937, #4b5563)';
  }
}

function getPublishedTime(pubDateStr: string): string {
  try {
    const pubDate = new Date(pubDateStr);
    const now = new Date();
    const diffMs = now.getTime() - pubDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return '1h ago';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return '2h ago';
  }
}

function getTags(title: string): string[] {
  const commonCountries = ['USA', 'Mexico', 'Canada', 'Argentina', 'France', 'England', 'Brazil', 'Germany', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Uruguay', 'Croatia', 'Morocco', 'Japan'];
  const tags: string[] = [];
  
  commonCountries.forEach(country => {
    if (title.toLowerCase().includes(country.toLowerCase())) {
      tags.push(country);
    }
  });

  // Extract a few interesting football-related keywords
  const keywords = ['Mbappé', 'Messi', 'Tuchel', 'Pochettino', 'Kane', 'Neymar', 'Bellingham', 'Vinicius', 'VAR', 'Injury', 'Penalty'];
  keywords.forEach(word => {
    if (title.toLowerCase().includes(word.toLowerCase())) {
      tags.push(word);
    }
  });

  if (tags.length === 0) {
    tags.push('FIFA 2026', 'Soccer');
  }

  return Array.from(new Set(tags)).slice(0, 4);
}

export async function GET() {
  try {
    const res = await fetch('https://www.espn.com/espn/rss/soccer/news', {
      next: { revalidate: 300 }, // Cache for 5 mins
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/xml, text/xml'
      }
    });

    if (!res.ok) {
      throw new Error(`Upstream returned ${res.status}`);
    }

    const xmlText = await res.text();
    
    // Parse using regex (extremely lightweight and dependency-free)
    const items: NewsItem[] = [];
    const itemReg = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let index = 0;

    while ((match = itemReg.exec(xmlText)) !== null && index < 8) {
      const itemContent = match[1];
      
      const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) || itemContent.match(/<title>([\s\S]*?)<\/title>/);
      const descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || itemContent.match(/<description>([\s\S]*?)<\/description>/);
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      
      if (titleMatch) {
        const title = cleanCdata(titleMatch[1]);
        const desc = descMatch ? cleanCdata(descMatch[1]) : '';
        const pubDateStr = pubDateMatch ? cleanCdata(pubDateMatch[1]) : '';
        
        const category = determineCategory(title, desc);
        const imageGradient = getGradient(category);
        const publishedAt = getPublishedTime(pubDateStr);
        const tags = getTags(title);

        items.push({
          id: `live-${index}`,
          category,
          title,
          summary: desc.length > 150 ? desc.substring(0, 147) + '...' : desc,
          content: desc,
          publishedAt,
          readTime: `${Math.max(2, Math.ceil(desc.split(' ').length / 180))} min read`,
          imageGradient,
          tags
        });
        index++;
      }
    }

    if (items.length === 0) {
      return NextResponse.json(FALLBACK_NEWS);
    }

    return NextResponse.json(items);
  } catch (err) {
    console.error('[News API] Live RSS fetch failed, falling back to mock data:', err);
    return NextResponse.json(FALLBACK_NEWS);
  }
}
