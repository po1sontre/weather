// Cloud Decorations Manager

// Configuration options
const cloudConfig = {
  cloudTypes: {
    'normal': {
      class: 'normal-cloud',
      showFor: ['weather-partly-cloudy', 'weather-cloudy']
    },
    'rainy': {
      class: 'rainy-cloud',
      showFor: ['weather-rainy']
    },
    'snowy': {
      class: 'snowy-cloud',
      showFor: ['weather-snowy']
    }
  },
  // Define vertical positions - horizontal positions will be handled by animation
  verticalPositions: [
    { name: 'top', y: 15 },
    { name: 'upper-mid', y: 25 },
    { name: 'middle', y: 35 },
    { name: 'lower-mid', y: 45 },
    { name: 'bottom', y: 55 }
  ],
  sizes: ['cloud-small', 'cloud-medium', 'cloud-large']
};

// Track existing clouds
let activeCloudElements = [];

// Create cloud element
function createCloudElement(type) {
  const cloudType = cloudConfig.cloudTypes[type];
  if (!cloudType) return null;
  
  let cloudElement;
  
  // Special case for snowy cloud type
  if (type === 'snowy') {
    // Create snowy cloud structure using the improved design
    cloudElement = document.createElement('div');
    cloudElement.className = `cloud-decoration ${cloudType.class}`;
    
    // For snowy clouds, we only need the cloud itself without inner clouds
    // Add a cloud element with proper class
    if (cloudType.class === 'snowy-cloud') {
      // No need to add an inner cloud div element as the CSS already handles it
    } else {
      // Add a main cloud element
      const cloudMain = document.createElement('div');
      cloudMain.className = 'cloud';
      cloudElement.appendChild(cloudMain);
    }
    
    // Create snowdrops (at least 20 for good visual effect)
    for (let i = 1; i <= 30; i++) {
      const snowdrop = document.createElement('div');
      snowdrop.className = 'drop';
      cloudElement.appendChild(snowdrop);
    }
  } else if (type === 'normal') {
    // For normal clouds, do NOT add inner .cloud div
    cloudElement = document.createElement('div');
    cloudElement.className = `cloud-decoration ${cloudType.class}`;
    
    // The normal-cloud class already has :before and :after pseudo-elements
    // that create the cloud shape, so we don't need an inner div
  } else if (type === 'rainy') {
    // Create rainy cloud structure
    cloudElement = document.createElement('div');
    cloudElement.className = `cloud-decoration ${cloudType.class}`;
    
    // For rainy clouds, we don't need an inner .cloud element
    // The CSS styles in .rainy-cloud already handle the cloud shape
    
    // Create droplets
    for (let i = 1; i <= 6; i++) {
      const droplet = document.createElement('div');
      droplet.className = `droplet droplet${i}`;
      cloudElement.appendChild(droplet);
    }
  }
  
  // Add random size class
  const randomSize = cloudConfig.sizes[Math.floor(Math.random() * cloudConfig.sizes.length)];
  cloudElement.classList.add(randomSize);
  
  return cloudElement;
}

// Generate cloud decorations based on current weather
function generateClouds() {
  // First clear existing clouds
  clearClouds();
  
  // Find the container for clouds
  const container = document.getElementById('cloud-decorations-container');
  if (!container) {
    console.log('Cloud container not found');
    return;
  }
  
  // Define weather classes
  const weatherClasses = ['weather-clear', 'weather-partly-cloudy', 'weather-cloudy', 
                         'weather-rainy', 'weather-snowy', 'weather-foggy', 'weather-thunder'];
  
  // Determine active weather class
  let activeWeatherClass = null;
  
  // First check body class list
  for (const weatherClass of weatherClasses) {
    if (document.body.classList.contains(weatherClass)) {
      activeWeatherClass = weatherClass;
      console.log(`Active weather class detected: ${activeWeatherClass}`);
      break;
    }
  }
  
  // If no class found, check the data-current-weather-code attribute on body
  if (!activeWeatherClass && document.body.dataset.currentWeatherCode) {
    const weatherCode = parseInt(document.body.dataset.currentWeatherCode);
    console.log(`No weather class found, using weather code from dataset: ${weatherCode}`);
    
    // Map the weather code to a weather class
    if (weatherCode <= 1) {
      activeWeatherClass = 'weather-clear';
    } else if (weatherCode === 2) {
      activeWeatherClass = 'weather-partly-cloudy';
    } else if (weatherCode === 3) {
      activeWeatherClass = 'weather-cloudy';
    } else if ((weatherCode >= 51 && weatherCode <= 65) || (weatherCode >= 80 && weatherCode <= 82)) {
      activeWeatherClass = 'weather-rainy';
    } else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) {
      activeWeatherClass = 'weather-snowy';
    } else if (weatherCode >= 95) {
      activeWeatherClass = 'weather-stormy';
    } else {
      // Default to partly cloudy if code doesn't match known patterns
      activeWeatherClass = 'weather-partly-cloudy';
    }
    
    console.log(`Mapped weather code ${weatherCode} to class ${activeWeatherClass}`);
  }
  
  if (!activeWeatherClass) {
    console.log('No active weather class found');
    // Default to partly cloudy if no class or code is found
    activeWeatherClass = 'weather-partly-cloudy';
    console.log('Defaulting to weather-partly-cloudy');
  }
  
  // Get max clouds limit if it exists (for performance optimization)
  const maxCloudsLimit = window.cloudDecorations && window.cloudDecorations.maxClouds 
    ? window.cloudDecorations.maxClouds 
    : 10; // Default max if not specified
  
  console.log(`Using maxClouds limit: ${maxCloudsLimit}`);
  
  // Count how many clouds we've added to respect the max limit
  let totalCloudsAdded = 0;
  
  // Determine which cloud types to show based on active weather class
  for (const [type, config] of Object.entries(cloudConfig.cloudTypes)) {
    if (config.showFor.includes(activeWeatherClass)) {
      console.log(`Generating ${type} clouds for ${activeWeatherClass}`);
      
      // Determine how many clouds to create based on weather type
      let cloudCount;
      
      if (type === 'snowy') {
        // Fewer clouds for snowy weather (reduced from 10)
        cloudCount = 4;
      } else if (type === 'rainy') {
        // Medium amount for rainy
        cloudCount = 6;
      } else {
        // Fewer for normal/partly cloudy
        cloudCount = 4;
      }
      
      // Respect the max clouds limit
      cloudCount = Math.min(cloudCount, maxCloudsLimit - totalCloudsAdded);
      
      // Create clouds distributed across the vertical positions
      for (let i = 0; i < cloudCount && totalCloudsAdded < maxCloudsLimit; i++) {
        // Determine vertical position - distribute evenly across available positions
        const positionIndex = i % cloudConfig.verticalPositions.length;
        const position = cloudConfig.verticalPositions[positionIndex];
        
        // Create cloud element
        const cloudElement = createCloudElement(type);
        
        if (cloudElement) {
          // Apply positioning - only vertical position since horizontal is handled by animation
          cloudElement.style.position = 'absolute';
          
          // Add some variation to vertical position
          const yVariation = Math.random() * 10 - 5; // ±5% variation
          cloudElement.style.top = `${position.y + yVariation}%`;
          
          // Add delay to animation to stagger the clouds
          const delay = Math.random() * 100; // Random delay between 0-100s
          cloudElement.style.animationDelay = `-${delay}s`;
          
          container.appendChild(cloudElement);
          activeCloudElements.push(cloudElement);
          totalCloudsAdded++;
          console.log(`Added ${type} cloud at vertical position ${position.name} (${position.y}%)`);
        }
      }
    }
  }
  
  console.log(`Total clouds added: ${totalCloudsAdded}`);
  
  // If no clouds were added but we should show clouds, add at least one default cloud
  if (totalCloudsAdded === 0 && 
      (activeWeatherClass === 'weather-partly-cloudy' || 
       activeWeatherClass === 'weather-cloudy' ||
       activeWeatherClass === 'weather-rainy' ||
       activeWeatherClass === 'weather-snowy')) {
    console.log('No clouds were added but the weather needs clouds, adding a default cloud');
    
    // Use a normal cloud as default
    const cloudElement = createCloudElement('normal');
    if (cloudElement) {
      cloudElement.style.position = 'absolute';
      cloudElement.style.top = '30%';
      cloudElement.style.animationDelay = '-10s';
      cloudElement.classList.add('cloud-medium');
      
      container.appendChild(cloudElement);
      activeCloudElements.push(cloudElement);
      console.log('Added default normal cloud');
    }
  }
}

// Remove all cloud decorations
function clearClouds() {
  console.log(`Clearing ${activeCloudElements.length} existing clouds`);
  activeCloudElements.forEach(cloud => {
    if (cloud && cloud.parentNode) {
      cloud.parentNode.removeChild(cloud);
    }
  });
  activeCloudElements = [];
}

// Check if clouds need to be initialized
function checkAndInitClouds() {
  console.log('Checking if clouds need to be initialized...');
  // Check if we already have clouds
  const existingClouds = document.querySelectorAll('.cloud-decoration');
  if (existingClouds.length === 0) {
    console.log('No clouds found, initializing...');
    // Generate clouds based on current weather class
    generateClouds();
  } else {
    console.log(`Found ${existingClouds.length} existing clouds`);
  }
}

// Initialize clouds when weather changes
function initCloudDecorations() {
  console.log('Initializing cloud decorations');
  
  // Add CSS file if not already present
  if (!document.querySelector('link[href="components/decorations/clouds.css"]')) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'components/decorations/clouds.css';
    document.head.appendChild(linkElement);
    console.log('Added clouds.css stylesheet');
  }
  
  // Generate initial clouds based on current weather
  generateClouds();
  
  // Create a MutationObserver to watch for weather class changes on the body
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.attributeName === 'class') {
        // Weather class has changed, regenerate clouds
        console.log('Body class changed, regenerating clouds');
        generateClouds();
        break;
      }
    }
  });
  
  // Start observing the body for class changes
  observer.observe(document.body, { attributes: true });
  console.log('Mutation observer set up for body class changes');
  
  // Force check after a short delay to ensure clouds are initialized
  setTimeout(checkAndInitClouds, 1000);
}

// Run initialization now if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('Document already loaded, initializing clouds now');
  initCloudDecorations();
} else {
  // Make sure we initialize when the DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing cloud decorations');
    initCloudDecorations();
    
    // Add a failsafe check after a 3 second delay
    setTimeout(() => {
      console.log('Running failsafe cloud check...');
      const existingClouds = document.querySelectorAll('.cloud-decoration');
      if (existingClouds.length === 0) {
        console.log('No clouds found after delay, forcing generation');
        generateClouds();
      } else {
        console.log(`Found ${existingClouds.length} clouds after delay`);
      }
    }, 3000);
  });
}

// Also re-initialize clouds when window is resized
window.addEventListener('resize', () => {
  // Debounce resizing to avoid too many redraws
  clearTimeout(window.cloudResizeTimer);
  window.cloudResizeTimer = setTimeout(generateClouds, 300);
});

// Export functions for external use
window.cloudDecorations = {
  init: initCloudDecorations,
  generate: generateClouds,
  clear: clearClouds,
  check: checkAndInitClouds,
  maxClouds: 4  // Add this property so it doesn't throw errors when set
}; 