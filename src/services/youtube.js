// YouTube API Service
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Extract YouTube video ID from various URL formats
 */
export const getYouTubeVideoId = (url) => {
    if (!url) return null;

    try {
        // Handle short URLs: https://youtu.be/ID
        if (url.includes('youtu.be/')) {
            return url.split('youtu.be/')[1].split(/[?#]/)[0];
        }
        // Handle standard URLs: https://youtube.com/watch?v=ID
        if (url.includes('v=')) {
            return url.split('v=')[1].split('&')[0].split(/[?#]/)[0];
        }
        // Handle embed links: https://youtube.com/embed/ID
        if (url.includes('embed/')) {
            return url.split('embed/')[1].split(/[?#]/)[0];
        }
        // If it looks like a raw ID (11 characters)
        if (url.trim().length === 11) {
            return url.trim();
        }
    } catch (e) {
        console.error('Error parsing YouTube URL:', e);
    }

    return null;
};

/**
 * Fetch video details from YouTube Data API
 */
export const fetchYouTubeVideoDetails = async (videoId) => {
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        console.warn('YouTube API key not configured');
        return null;
    }

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch video details');
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const video = data.items[0];
            return {
                id: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                thumbnail: video.snippet.thumbnails.high.url,
                channelTitle: video.snippet.channelTitle,
                publishedAt: video.snippet.publishedAt,
                duration: video.contentDetails.duration
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching YouTube video details:', error);
        return null;
    }
};

/**
 * Get video thumbnail URL without API call
 */
export const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

/**
 * Get embed URL for iframe
 */
export const getYouTubeEmbedUrl = (videoId) => {
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
};

/**
 * Format ISO 8601 duration to readable format (e.g., "PT5M30S" -> "5:30")
 */
export const formatDuration = (duration) => {
    if (!duration) return '';

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
        return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

export default {
    getYouTubeVideoId,
    fetchYouTubeVideoDetails,
    getYouTubeThumbnail,
    getYouTubeEmbedUrl,
    formatDuration
};
