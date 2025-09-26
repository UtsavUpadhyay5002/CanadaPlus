import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  getDocs,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

export interface Article {
  id: string
  title: string
  summary: string
  sourceName: string
  originalUrl: string
  imageUrl: string
  topics?: string[]
  region?: string
  publishedAt: Date
  priority?: number
  status: 'draft' | 'approved' | 'published'
  createdAt: Date
  updatedAt: Date
}

export interface ArticlesResult {
  articles: Article[]
  lastDoc: QueryDocumentSnapshot | null
  hasMore: boolean
}

// Convert Firestore document to Article
function docToArticle(doc: QueryDocumentSnapshot): Article {
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title,
    summary: data.summary,
    sourceName: data.sourceName,
    originalUrl: data.originalUrl,
    imageUrl: data.imageUrl,
    topics: data.topics || [],
    region: data.region,
    publishedAt: data.publishedAt?.toDate() || new Date(),
    priority: data.priority || 0,
    status: data.status,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

export async function fetchArticles(
  limitCount: number = 12,
  lastDocument?: QueryDocumentSnapshot | null
): Promise<ArticlesResult> {
  try {
    const articlesRef = collection(db, 'articles')
    
    // Build query - only fetch published articles
    let q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )
    
    // Add pagination if lastDocument provided
    if (lastDocument) {
      q = query(
        articlesRef,
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        startAfter(lastDocument),
        limit(limitCount)
      )
    }
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return {
        articles: [],
        lastDoc: null,
        hasMore: false
      }
    }
    
    const articles = snapshot.docs.map(docToArticle)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]
    
    // Check if there are more documents
    const hasMoreQuery = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('publishedAt', 'desc'),
      startAfter(lastDoc),
      limit(1)
    )
    
    const hasMoreSnapshot = await getDocs(hasMoreQuery)
    const hasMore = !hasMoreSnapshot.empty
    
    return {
      articles,
      lastDoc,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw new Error('Failed to fetch articles')
  }
}

// Fetch articles by topic (for future filtering feature)
export async function fetchArticlesByTopic(
  topic: string,
  limitCount: number = 12,
  lastDocument?: QueryDocumentSnapshot | null
): Promise<ArticlesResult> {
  try {
    const articlesRef = collection(db, 'articles')
    
    let q = query(
      articlesRef,
      where('status', '==', 'published'),
      where('topics', 'array-contains', topic),
      orderBy('publishedAt', 'desc'),
      limit(limitCount)
    )
    
    if (lastDocument) {
      q = query(
        articlesRef,
        where('status', '==', 'published'),
        where('topics', 'array-contains', topic),
        orderBy('publishedAt', 'desc'),
        startAfter(lastDocument),
        limit(limitCount)
      )
    }
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) {
      return {
        articles: [],
        lastDoc: null,
        hasMore: false
      }
    }
    
    const articles = snapshot.docs.map(docToArticle)
    const lastDoc = snapshot.docs[snapshot.docs.length - 1]
    
    // Check if there are more documents
    const hasMoreQuery = query(
      articlesRef,
      where('status', '==', 'published'),
      where('topics', 'array-contains', topic),
      orderBy('publishedAt', 'desc'),
      startAfter(lastDoc),
      limit(1)
    )
    
    const hasMoreSnapshot = await getDocs(hasMoreQuery)
    const hasMore = !hasMoreSnapshot.empty
    
    return {
      articles,
      lastDoc,
      hasMore
    }
  } catch (error) {
    console.error('Error fetching articles by topic:', error)
    throw new Error(`Failed to fetch articles for topic: ${topic}`)
  }
}

// Get unique topics (for filter UI)
export async function getAvailableTopics(): Promise<string[]> {
  try {
    const articlesRef = collection(db, 'articles')
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      limit(100) // Reasonable limit for topic extraction
    )
    
    const snapshot = await getDocs(q)
    const topicsSet = new Set<string>()
    
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.topics && Array.isArray(data.topics)) {
        data.topics.forEach((topic: string) => topicsSet.add(topic))
      }
    })
    
    return Array.from(topicsSet).sort()
  } catch (error) {
    console.error('Error fetching topics:', error)
    return []
  }
}