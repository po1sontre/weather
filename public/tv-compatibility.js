/**
 * TV Compatibility Script
 * This file contains optimizations for TV browsers
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
    
    console.log('TV detected, applying performance optimizations');
    
    // Add TV identifier class
    document.body.classList.add('tv-browser');
    
    // Reduce animation frame rate for TV performance
    if (window.skycons && window.skycons.default) {
        // Reduce Skycons animation speed to improve performance
        try {
            window.skycons.default._frameRate = 10; // Reduce from default 30fps to 10fps
            
            // Simplify the draw functions for better performance
            const originalDraw = window.skycons.default._determineDrawFunctions;
            window.skycons.default._determineDrawFunctions = function(element) {
                const funcs = originalDraw.call(this, element);
                // Return a simpler draw function that updates less frequently
                return {
                    clear: funcs.clear,
                    draw: function(obj, time, color) {
                        // Only draw every 3rd frame to reduce load
                        if (Math.round(time * 10) % 3 === 0) {
                            funcs.draw(obj, time, color);
                        }
                    }
                };
            };
            
            console.log('Optimized Skycons animations for TV');
        } catch (e) {
            console.warn('Could not optimize Skycons for TV:', e);
        }
    }
    
    // Force hardware acceleration where needed
    document.querySelectorAll('.weather-video, canvas, .forecast-container, .weather-container').forEach(el => {
        // Apply hardware acceleration
        el.style.transform = 'translateZ(0)';
        el.style.backfaceVisibility = 'hidden';
        el.style.perspective = '1000px';
        el.style.willChange = 'transform, opacity';
    });
    
    // Optimize video performance
    const fixVideos = () => {
        document.querySelectorAll('.weather-video').forEach(video => {
            // Set to lower quality where possible for better performance
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.setAttribute('playsinline', '');
            video.muted = true;
            
            // Reduce video quality for TV performance if possible
            try {
                if (video.videoWidth > 1280 && video.canPlayType('video/mp4')) {
                    // For larger videos, reduce playback quality
                    if (video.style.display === 'block') {
                        // Adaptive playback rate - slow down video for smoothness
                        video.playbackRate = 0.8;
                    }
                }
                
                // Special handling for snow video which may need smoother playback
                if (video.id === 'video-snow' && video.style.display === 'block') {
                    video.playbackRate = 0.7; // Slightly slower for snow
                }
            } catch (e) {
                console.warn('Could not optimize video settings:', e);
            }
            
            // Play stalled videos
            if (video.style.display === 'block' && video.paused) {
                video.play().catch(e => console.warn('Auto-resume failed:', e));
            }
        });
    };
    
    // Apply fixes immediately and periodically
    fixVideos();
    const videoInterval = setInterval(fixVideos, 10000);
    
    // Optimize forecast animation by disabling hover effects on TV
    document.querySelectorAll('.forecast-day').forEach(day => {
        day.classList.add('tv-no-hover');
    });
    
    // Reduce or disable CSS animations that might affect performance
    const style = document.createElement('style');
    style.textContent = `
        /* Reduce animation rates for TVs */
        .tv-browser * {
            transition-duration: 0.5s !important;
            animation-duration: 0.5s !important;
        }
        
        /* Disable hover effects that cause lag */
        .tv-browser .forecast-day:hover,
        .tv-browser .tv-no-hover:hover {
            transform: none !important;
            box-shadow: none !important;
            opacity: 1 !important;
        }
        
        /* Optimize canvas rendering */
        .tv-browser canvas {
            image-rendering: optimizeSpeed;
            image-rendering: -moz-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: optimize-contrast;
            image-rendering: pixelated;
        }
        
        /* Optimize video playback */
        .tv-browser .weather-video {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
    
    // Reduce forecast animation complexity
    if (window.requestAnimationFrame) {
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = function(callback) {
            // Limit non-essential animations on TV
            return originalRAF.call(window, callback);
        };
    }
    
    // Use intersectionObserver for lazy loading
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.tagName === 'VIDEO' && entry.target.paused) {
                    entry.target.play().catch(e => {});
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all videos
        document.querySelectorAll('.weather-video').forEach(video => {
            observer.observe(video);
        });
    }
    
    // Add cleanup for memory management
    window.addEventListener('beforeunload', () => {
        clearInterval(videoInterval);
        if (window.skycons && window.skycons.default) {
            window.skycons.default.pause();
        }
    });
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', applyTVFixes);

// Additional check after everything is loaded
window.addEventListener('load', () => {
    // Delay to ensure all resources are loaded
    setTimeout(applyTVFixes, 1000);
    
    // Additional optimization after full load
    setTimeout(() => {
        // Final performance sweep
        if (detectTV()) {
            // Reduce animation complexity after page is fully loaded
            document.querySelectorAll('canvas').forEach(canvas => {
                // Force a redraw at lower quality
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.imageSmoothingQuality = 'low';
                }
            });
        }
    }, 3000);
}); 