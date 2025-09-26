import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore'

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample articles data
const sampleArticles = [
  {
    title: "Federal Budget 2024 Introduces New Housing Initiatives",
    summary: "The Canadian government unveils comprehensive housing strategy with $10 billion investment aimed at increasing affordable housing supply across major cities including Toronto, Vancouver, and Montreal.",
    sourceName: "CBC News",
    originalUrl: "https://cbc.ca/news/politics/budget-2024-housing",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    topics: ["Politics", "Housing", "Canada"],
    region: "National",
    status: "published" as const,
    priority: 10,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Toronto Tech Startup Raises $50M for AI Healthcare Platform",
    summary: "MediCore AI secures major funding round led by Canadian pension funds to expand their diagnostic imaging platform across North American hospitals and clinics.",
    sourceName: "The Globe and Mail",
    originalUrl: "https://globeandmail.com/business/technology/toronto-ai-startup",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    topics: ["Technology", "Healthcare", "Business"],
    region: "Ontario",
    status: "published" as const,
    priority: 8,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)), // 4 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "BC Announces Ambitious Climate Action Targets for 2025",
    summary: "British Columbia sets new carbon reduction goals and unveils green technology investments worth $2 billion, positioning the province as a leader in clean energy transition.",
    sourceName: "National Post",
    originalUrl: "https://nationalpost.com/news/canada/bc-climate-targets",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop",
    topics: ["Environment", "Climate", "BC"],
    region: "British Columbia",
    status: "published" as const,
    priority: 7,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000)), // 6 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Canadian Dollar Strengthens Against USD Amid Economic Recovery",
    summary: "The loonie gains momentum as Canada's employment numbers exceed expectations and commodity prices rise, reaching its highest level against the US dollar in six months.",
    sourceName: "Financial Post",
    originalUrl: "https://financialpost.com/markets/currencies/canadian-dollar-usd",
    imageUrl: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=600&h=400&fit=crop",
    topics: ["Economy", "Finance", "Currency"],
    region: "National",
    status: "published" as const,
    priority: 6,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 8 * 60 * 60 * 1000)), // 8 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Montreal's Metro System Gets Major Infrastructure Upgrade",
    summary: "STM announces $1.5 billion modernization project including new trains, improved accessibility features, and expanded service to underserved neighborhoods over the next five years.",
    sourceName: "La Presse",
    originalUrl: "https://lapresse.ca/montreal/metro-infrastructure-upgrade",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
    topics: ["Transportation", "Infrastructure", "Montreal"],
    region: "Quebec",
    status: "published" as const,
    priority: 5,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 12 * 60 * 60 * 1000)), // 12 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Indigenous Leaders Call for Stronger Land Rights Protection",
    summary: "Assembly of First Nations presents comprehensive framework for indigenous sovereignty and environmental stewardship at Ottawa summit, seeking federal government support.",
    sourceName: "APTN News",
    originalUrl: "https://aptnnews.ca/indigenous-land-rights-framework",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    topics: ["Indigenous", "Politics", "Environment"],
    region: "National",
    status: "published" as const,
    priority: 9,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 16 * 60 * 60 * 1000)), // 16 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Canadian Olympic Team Prepares for Upcoming Winter Games",
    summary: "Team Canada unveils roster for international competition with strong representation from figure skating, hockey, and skiing disciplines. Training camps begin next month.",
    sourceName: "Sportsnet",
    originalUrl: "https://sportsnet.ca/olympics/team-canada-winter-roster",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    topics: ["Sports", "Olympics", "Canada"],
    region: "National",
    status: "published" as const,
    priority: 4,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 20 * 60 * 60 * 1000)), // 20 hours ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    title: "Prairie Farmers Adapt to Changing Weather Patterns",
    summary: "Agricultural producers in Saskatchewan and Alberta invest in drought-resistant crops and precision farming technology as climate variability affects traditional growing seasons.",
    sourceName: "CBC Saskatchewan",
    originalUrl: "https://cbc.ca/news/canada/saskatchewan/prairie-farming-climate-adaptation",
    imageUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop",
    topics: ["Agriculture", "Climate", "Prairie"],
    region: "Prairie Provinces",
    status: "published" as const,
    priority: 6,
    publishedAt: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 1 day ago
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
]

async function seedArticles() {
  console.log('Starting to seed articles...')
  
  try {
    const articlesCollection = collection(db, 'articles')
    
    for (const article of sampleArticles) {
      const docRef = await addDoc(articlesCollection, article)
      console.log(`✅ Added article: "${article.title}" with ID: ${docRef.id}`)
    }
    
    console.log(`🎉 Successfully seeded ${sampleArticles.length} articles!`)
  } catch (error) {
    console.error('❌ Error seeding articles:', error)
  }
}

// Run the seeding
seedArticles()