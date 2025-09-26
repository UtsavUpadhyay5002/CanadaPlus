import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Clock } from 'lucide-react'
import { Article } from '../lib/articlesApi'
import { formatRelativeTime } from '../lib/time'

interface CardProps {
  article: Article
  isActive: boolean
}

function Card({ article, isActive }: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const handleReadOriginal = (e: React.MouseEvent) => {
    e.preventDefault()
    // Open in new tab with noopener for security
    window.open(article.originalUrl, '_blank', 'noopener,noreferrer')
  }

  // Generate fallback gradient based on article title
  const getGradientFromTitle = (title: string) => {
    const colors = [
      'from-red-500 to-orange-500',
      'from-blue-500 to-purple-500', 
      'from-green-500 to-teal-500',
      'from-purple-500 to-pink-500',
      'from-indigo-500 to-blue-500',
      'from-yellow-500 to-red-500'
    ]
    const index = title.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="h-screen relative flex items-end">
      {/* Background Image or Gradient */}
      <div className="absolute inset-0">
        {!imageError && article.imageUrl ? (
          <>
            <img
              src={article.imageUrl}
              alt=""
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-800 animate-pulse" />
            )}
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradientFromTitle(article.title)}`} />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0.9, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 p-6 pb-8 w-full max-w-2xl mx-auto"
      >
        {/* Topics */}
        {article.topics && article.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {article.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
          {article.title}
        </h1>

        {/* Summary */}
        <p className="text-lg text-white/90 mb-4 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-white/80 mb-4">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{article.sourceName}</span>
            {article.region && (
              <span className="text-white/60">• {article.region}</span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
        </div>

        {/* Read Original Button */}
        <button
          onClick={handleReadOriginal}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20"
          aria-label={`Read full article: ${article.title}`}
        >
          <span>Read original</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Scroll indicator - only show on first card */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <div className="flex flex-col items-center space-y-1">
            <div className="w-1 h-8 bg-white/40 rounded-full" />
            <div className="text-xs">Swipe up</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Card