/**
 * Trims text to approximately the specified word count without breaking words
 * @param {string} text - Text to trim
 * @param {number} maxWords - Maximum number of words (approximate)
 * @returns {string} - Trimmed text with ellipsis if truncated
 */
export function trimText(text, maxWords = 150) {
  if (!text || typeof text !== 'string') return '';
  
  const words = text.trim().split(/\s+/);
  
  if (words.length <= maxWords) {
    return text;
  }
  
  const trimmed = words.slice(0, maxWords).join(' ');
  return trimmed + '...';
}

/**
 * Safely truncates text by characters while avoiding word breaks
 * @param {string} text - Text to truncate  
 * @param {number} maxLength - Maximum character length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 300) {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;
  
  // Find the last space before maxLength to avoid breaking words
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}