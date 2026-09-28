// Seed data — same stories as the original static design.
// This is only used the FIRST time the app runs; after that, everything
// (including anything published from the Editor) lives in localStorage.
const now = Date.now()

const seedArticles = [
  {
    id: 1,
    title: 'Lowari Tunnel Cleared for Two-Way Traffic After Successful Winter Maintenance Drive',
    category: 'Chitral',
    author: 'Bureau Report',
    time: 'Updated 35 minutes ago',
    timestamp: now - 35 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    video: '',
    pdf: 'Lowari_Traffic_Schedule_2026.pdf',
    isNew: true,
    views: 1420,
    content:
      'CHITRAL: The National Highway Authority (NHA) has officially announced the complete clearance and resumption of two-way heavy and light traffic through the strategic Lowari Tunnel following comprehensive safety and maintenance procedures. Commuters and local business leaders have lauded the swift execution by engineers, ensuring uninterrupted connectivity between Chitral and Peshawar throughout the autumn season.',
  },
  {
    id: 2,
    title: 'Kalash Valley Spring Festival Receives Record International Tourism Influx',
    category: 'Chitral',
    author: 'Shahzada Tanvir',
    time: 'Updated 1 hour ago',
    timestamp: now - 60 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdf: 'Kalash_Tourism_Report_2026.pdf',
    isNew: true,
    views: 2310,
    content:
      'BUMBORET: The vibrant Kalash valleys are witnessing unprecedented footfall as domestic and international tourists gather for the cultural festivities. District administration has set up special facilitation camps at Ayun and Bamboret to ensure visitor security, hospitality, and cultural preservation.',
  },
  {
    id: 3,
    title: 'PM Shehbaz Highlights Regional Economic Corridor Prospects at Islamabad Summit',
    category: 'Pakistan',
    author: 'Web Desk / Agencies',
    time: 'Updated 2 hours ago',
    timestamp: now - 120 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    video: '',
    pdf: '',
    isNew: true,
    views: 980,
    content:
      'ISLAMABAD: Prime Minister Shehbaz Sharif underscored the imperative of accelerated regional trade integration, emphasizing that infrastructural links through northern passes will redefine economic prosperity for Pakistan and Central Asian neighbors.',
  },
  {
    id: 4,
    title: 'The High Cost of Northern Green Transition: Solar and Hydro Integration in Mountainous Terrain',
    category: 'Articles',
    author: 'Dr. Karimullah Baig',
    time: 'Updated 3 hours ago',
    timestamp: now - 180 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    video: '',
    pdf: 'Northern_Solar_Transition_Research.pdf',
    isNew: false,
    views: 3100,
    content:
      'RESEARCH BRIEF: Transitioning remote high-altitude valleys like Chitral toward distributed solar grids and micro-hydel power units presents unique technical and economic hurdles. This research paper evaluates tariff stabilization and battery durability under sub-zero winter extremes.',
  },
  {
    id: 5,
    title: 'Chitral Polo Team Clinches Dramatic Victory in Shandur Polo Ground Exhibition Match',
    category: 'Sports',
    author: 'Sports Desk',
    time: 'Updated 4 hours ago',
    timestamp: now - 240 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1517649763962-0c6232660102?auto=format&fit=crop&w=800&q=80',
    video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    pdf: '',
    isNew: false,
    views: 1850,
    content:
      "SHANDUR: In a thrilling display of traditional freestyle polo played at the 'Roof of the World', the Chitral team secured a magnificent victory in the closing minutes against rival contenders amidst roaring applause from thousands of spectators.",
  },
  {
    id: 6,
    title: 'Tech Giants Unveil AI-Powered Translation Tool for Endangered Hindukush Languages',
    category: 'Tech',
    author: 'Technology Desk',
    time: 'Updated 5 hours ago',
    timestamp: now - 300 * 60 * 1000,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    video: '',
    pdf: 'Khowar_Language_AI_Brief.pdf',
    isNew: false,
    views: 1120,
    content:
      'SILICON VALLEY / PESHAWAR: Researchers have released open-source language models capable of real-time speech translation for Khowar, Kalasha, and Shina, preserving indigenous oral histories and literature for future digital generations.',
  },
]

export default seedArticles
