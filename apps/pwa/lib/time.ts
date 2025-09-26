import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns'

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  // Less than 1 minute
  if (diffInMinutes < 1) {
    return 'now'
  }

  // Less than 1 hour
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  // Less than 24 hours
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  // Today
  if (isToday(date)) {
    return format(date, 'h:mm a')
  }

  // Yesterday
  if (isYesterday(date)) {
    return 'yesterday'
  }

  // Less than 7 days
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  // More than a week - show date
  if (diffInDays < 365) {
    return format(date, 'MMM d')
  }

  // More than a year
  return format(date, 'MMM d, yyyy')
}

export function formatPublishDate(date: Date): string {
  return format(date, 'MMMM d, yyyy \'at\' h:mm a')
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours()
  
  if (hour >= 5 && hour < 12) {
    return 'morning'
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon'
  } else if (hour >= 17 && hour < 21) {
    return 'evening'
  } else {
    return 'night'
  }
}

export function getGreeting(): string {
  const timeOfDay = getTimeOfDay()
  const greetings = {
    morning: 'Good morning',
    afternoon: 'Good afternoon', 
    evening: 'Good evening',
    night: 'Good evening'
  }
  
  return greetings[timeOfDay]
}