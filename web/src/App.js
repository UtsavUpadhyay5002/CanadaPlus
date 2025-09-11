import React, { useState, useEffect } from 'react';
import './App.css';
import NewsCard from './components/NewsCard';
import StateMessage from './components/StateMessage';
import { fetchFeed } from './api/client';

// Sample fallback article
const SAMPLE_ARTICLE = {
  id: 'sample-1',
  title: 'Welcome to PulseNow',
  summary: 'Your fast, reliable source for global news. We aggregate the latest stories from trusted sources worldwide to keep you informed about what matters most. This is a sample article displayed when the news feed is unavailable.',
  imageUrl: null,
  source: { 
    name: 'PulseNow', 
    url: 'https://example.com' 
  },
  publishedAt: new Date().toISOString()
};

function App() {
  const [state, setState] = useState('loading'); // 'loading', 'error', 'success'
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    setState('loading');
    setError('');
    
    try {
      const result = await fetchFeed();
      
      if (result.ok) {
        setArticles(result.data || []);
        setState('success');
      } else {
        setError(result.error || 'Failed to load news feed');
        setState('error');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setState('error');
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleRetry = () => {
    loadFeed();
  };

  // Render loading state
  if (state === 'loading') {
    return (
      <div className="app">
        <header className="app-header">
          <h1>PulseNow</h1>
          <p>Fast Global News</p>
        </header>
        <main className="app-main">
          <StateMessage type="loading" text="Loading latest news..." />
        </main>
      </div>
    );
  }

  // Render error state
  if (state === 'error') {
    return (
      <div className="app">
        <header className="app-header">
          <h1>PulseNow</h1>
          <p>Fast Global News</p>
        </header>
        <main className="app-main">
          <StateMessage 
            type="error" 
            text={error || "Couldn't load news feed."} 
            onRetry={handleRetry}
          />
        </main>
      </div>
    );
  }

  // Render success state
  const articleToShow = articles.length > 0 ? articles[0] : SAMPLE_ARTICLE;
  const isEmpty = articles.length === 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1>PulseNow</h1>
        <p>Fast Global News</p>
      </header>
      <main className="app-main">
        {isEmpty && (
          <StateMessage 
            type="info" 
            text="No articles available right now. Showing sample content:" 
          />
        )}
        <NewsCard article={articleToShow} />
      </main>
    </div>
  );
}

export default App;