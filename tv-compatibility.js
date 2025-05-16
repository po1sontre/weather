/**
 * TV Compatibility Script
 * This file contains workarounds for common issues with TV browsers
 */

// Check if we're likely on a TV
function detectTV() {
    // Check for common TV user agents
    const ua = navigator.userAgent.toLowerCase();
    const isTVUA = /smart-tv|smarttv|tv|tizen|webos|nettv|viera|netcast|roku/i.test(ua);
    
    // Check for TV-like resolutions (typically 16:9 and large)
    const width = window.screen.width || window.innerWidth;
    const height = window.screen.height || window.innerHeight;
    const aspectRatio = width / height;
    const isLargeScreen = width >= 1280;
    const isTVRatio = aspectRatio > 1.7 && aspectRatio < 1.8; // Close to 16:9
    
    // Either user agent or resolution suggests TV
    return isTVUA || (isLargeScreen && isTVRatio);
}

// Apply TV-specific fixes
function applyTVFixes() {
    if (!detectTV()) return;
    
    console.log('TV detected, applying compatibility fixes');
    
    // Add TV identifier class
    document.body.classList.add('tv-browser');
    
    // Force video loading and playback
    const fixVideos = () => {
        document.querySelectorAll('.weather-video').forEach(video => {
            // Ensure proper attributes
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.setAttribute('playsinline', '');
            video.muted = true;
            
            // Add event listener for user interaction
            video.addEventListener('click', () => {
                if (video.style.display === 'block' && video.paused) {
                    video.play().catch(e => console.warn('Play on click failed:', e));
                }
            });
            
            // Many TV browsers need a periodic check for video playback
            if (video.style.display === 'block' && video.paused) {
                video.play().catch(e => console.warn('Auto-resume failed:', e));
            }
        });
    };
    
    // Apply fixes immediately and then periodically
    fixVideos();
    setInterval(fixVideos, 10000);
    
    // Common TV browser fix: handle visibility change events
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // When tab becomes visible again, refresh video playback
            setTimeout(() => {
                const activeVideo = document.querySelector('.weather-video[style*="display: block"]');
                if (activeVideo && activeVideo.paused) {
                    activeVideo.play().catch(e => console.warn('Visibility change play failed:', e));
                }
            }, 1000);
        }
    });
    
    // Fallback method: use an intersection observer to monitor visibility
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.paused) {
                    entry.target.play().catch(e => console.warn('Observer play failed:', e));
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all videos
        document.querySelectorAll('.weather-video').forEach(video => {
            observer.observe(video);
        });
    }
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', applyTVFixes);

// Additional check after everything is loaded
window.addEventListener('load', () => {
    setTimeout(applyTVFixes, 2000);
}); 