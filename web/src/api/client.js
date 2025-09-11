/**
 * Fetch news feed from the API
 * @returns {Promise<{ok: boolean, data?: Array, error?: string}>}
 */
export async function fetchFeed() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
  
  try {
    const response = await fetch('/api/feed', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const statusText = response.statusText || 'Unknown error';
      
      if (response.status === 404) {
        return {
          ok: false,
          error: 'News feed not found. API may not be deployed.'
        };
      }
      
      if (response.status >= 500) {
        return {
          ok: false,
          error: 'Server error. Please try again later.'
        };
      }
      
      return {
        ok: false,
        error: `Request failed: ${response.status} ${statusText}`
      };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {
        ok: false,
        error: 'Invalid response format from server.'
      };
    }
    
    const data = await response.json();
    
    // Validate that we got an array
    if (!Array.isArray(data)) {
      return {
        ok: false,
        error: 'Invalid data format from server.'
      };
    }
    
    return {
      ok: true,
      data
    };
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      return {
        ok: false,
        error: 'Request timed out. Please check your connection.'
      };
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        ok: false,
        error: 'Network error. Please check your connection.'
      };
    }
    
    return {
      ok: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}