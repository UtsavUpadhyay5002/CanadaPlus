import React from 'react';
import { formatRelativeTime } from '../utils/time';
import { trimText } from '../utils/text';

function NewsCard({ article }) {
  if (!article) return null;

  const {
    title = 'Untitled',
    summary = '',
    imageUrl,
    source = {},
    publishedAt
  } = article;

  const relativeTime = formatRelativeTime(publishedAt);
  const trimmedSummary = trimText(summary, 150);
  const imageSrc = imageUrl || '/placeholder.png';
  const sourceUrl = source.url || '#';
  const sourceName = source.name || '';

  return (
    <article className="news-card">
      <img 
        src={imageSrc} 
        alt={title}
        className="news-card-image"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/placeholder.png';
        }}
      />
      
      <div className="news-card-content">
        <h2 className="news-card-title">
          <a 
            href={sourceUrl}
            target="_blank" 
            rel="noopener noreferrer"
            aria-label={`Read full article: ${title}`}
          >
            {title}
          </a>
        </h2>
        
        {trimmedSummary && (
          <p className="news-card-summary">
            {trimmedSummary}
          </p>
        )}
        
        <div className="news-card-meta">
          {sourceName && (
            <>
              <span>{sourceName}</span>
              {relativeTime && <span className="news-card-meta-separator">•</span>}
            </>
          )}
          {relativeTime && <span>{relativeTime}</span>}
        </div>
      </div>
    </article>
  );
}

export default NewsCard;