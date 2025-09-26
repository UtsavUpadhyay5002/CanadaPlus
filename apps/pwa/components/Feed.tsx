import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import { Article, fetchArticles } from '../lib/articlesApi'
import { Loader2 } from 'lucide-react'

const INITIAL_LOAD_COUNT = 12
const LOAD_MORE_COUNT = 8

function Feed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const feedRef = useRef<HTMLDivElement>(null)
  const isLoadingMoreRef = useRef(false)

  // Initial load
  useEffect(() => {
    loadInitialArticles()
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        scrollToNext()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        scrollToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, articles.length])

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setCurrentIndex(index)
            
            // Load more when near end
            if (index >= articles.length - 3 && hasMore && !isLoadingMoreRef.current) {
              loadMoreArticles()
            }
          }
        })
      },
      { 
        rootMargin: '0px 0px -50% 0px',
        threshold: 0.5 
      }
    )

    const cards = feedRef.current?.querySelectorAll('.article-card')
    cards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [articles.length, hasMore])

  const loadInitialArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchArticles(INITIAL_LOAD_COUNT)
      setArticles(result.articles)
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      console.error('Error loading articles:', err)
      setError('Failed to load articles. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const loadMoreArticles = async () => {
    if (isLoadingMoreRef.current || !hasMore) return
    
    isLoadingMoreRef.current = true
    setLoadingMore(true)
    
    try {
      const result = await fetchArticles(LOAD_MORE_COUNT, lastDoc)
      setArticles(prev => [...prev, ...result.articles])
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      console.error('Error loading more articles:', err)
    } finally {
      setLoadingMore(false)
      isLoadingMoreRef.current = false
    }
  }

  const scrollToNext = () => {
    const nextIndex = Math.min(currentIndex + 1, articles.length - 1)
    const nextCard = feedRef.current?.children[nextIndex] as HTMLElement
    nextCard?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToPrevious = () => {
    const prevIndex = Math.max(currentIndex - 1, 0)
    const prevCard = feedRef.current?.children[prevIndex] as HTMLElement
    prevCard?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleRetry = () => {
    loadInitialArticles()
  }

  // Reduce motion for accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto" />
          <p className="text-gray-400">Loading stories...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="text-4xl mb-4">📰</div>
          <h2 className="text-xl font-semibold">No stories yet</h2>
          <p className="text-gray-400">Check back soon for the latest Canadian news</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={feedRef}
      className="h-full overflow-y-auto scroll-smooth"
      style={{
        scrollSnapType: 'y mandatory',
        scrollPadding: '0',
      }}
    >
      <AnimatePresence initial={false}>
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : index * 0.1 }}
            className="article-card"
            data-index={index}
            style={{ scrollSnapAlign: 'start' }}
          >
            <Card 
              article={article}
              isActive={index === currentIndex}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-red-500 mx-auto" />
            <p className="text-gray-400 text-sm">Loading more stories...</p>
          </div>
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && articles.length > 0 && (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-2xl">🍁</div>
            <p className="text-gray-400">You're all caught up!</p>
            <p className="text-sm text-gray-500">Check back later for more stories</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Feed