import { findClosestRegion, getForecastUrl } from './utils.js';

// ... existing code ...

async function fetchForecast(stationData) {
    try {
        // Find the closest region based on station coordinates
        const closestRegion = findClosestRegion(
            stationData.latitude,
            stationData.longitude
        );

        if (!closestRegion) {
            throw new Error('Could not determine region for forecast');
        }

        // Get the forecast URL for the closest region
        const forecastUrl = getForecastUrl(closestRegion.id);
        
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }
        
        const data = await response.json();
        return {
            forecasts: data.forecasts,
            regionName: closestRegion.name
        };
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

// Update the displayForecast function to show the region name
function displayForecast(forecastData) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = `
        <h2>${translations[lang].forecast} - ${forecastData.regionName}</h2>
        <div class="forecast-grid">
            ${forecastData.forecasts.map(day => `
                <div class="forecast-card">
                    <div class="forecast-date">${formatDate(day.date)}</div>
                    <div class="forecast-icon">
                        <img src="${day.symbol.imageUrl}" alt="${day.symbol.description}">
                    </div>
                    <div class="forecast-temp">
                        <span class="max">${Math.round(day.temperatureMax)}°</span>
                        <span class="min">${Math.round(day.temperatureMin)}°</span>
                    </div>
                    <div class="forecast-desc">${day.symbol.description}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ... rest of existing code ... 