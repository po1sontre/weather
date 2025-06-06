// Location coordinates mapping
const LOCATIONS = {
    'bolzano': { lat: 46.4983, lon: 11.3548, name: 'Bolzano' },
    'merano': { lat: 46.6702, lon: 11.1607, name: 'Merano' },
    'bressanone': { lat: 46.7151, lon: 11.6570, name: 'Bressanone' },
    'brunico': { lat: 46.7972, lon: 11.9383, name: 'Brunico' }
};

// Translations
let TRANSLATIONS = {};

// Function to load translation JSON file for the given language
async function loadTranslations(lang) {
    try {
        const response = await fetch(`/translation/${lang}.json`);
        if (!response.ok) throw new Error('Translation file not found');
        TRANSLATIONS = await response.json();
    } catch (e) {
        console.error('Error loading translations:', e);
        TRANSLATIONS = {};
    }
}

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Helper function to safely parse numerical values
function safeParseFloat(value) {
    if (value === undefined || value === null) return NaN;
    
    // Convert to string if it's not already
    let strValue = String(value);
    
    // Replace comma with dot (European decimal notation)
    strValue = strValue.replace(',', '.');
    
    // Parse and return the result
    return parseFloat(strValue);
}

// Read ad ID from URL immediately
const initialAdId = getUrlParameter('ad');

// Initialize language from URL parameter or use default
async function initializeLanguage() {
    const langParam = getUrlParameter('lang');
    if (langParam && ['en', 'de', 'it'].includes(langParam)) {
        currentLang = langParam;
        document.documentElement.lang = langParam;
    }
    await loadTranslations(currentLang);
    // Update page title and ad banner text with translations
    updatePageTranslations();
    // Set active class on the corresponding language button
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.textContent.toLowerCase();
            btn.classList.toggle('active', btnLang === currentLang);
        });
    });
}

// Function to update all text elements with translations
function updatePageTranslations() {
    // Update page title
    document.getElementById('page-title').textContent = t('weatherApp');
    
    // Only update ad banner if it's empty
    const bigAdBanner = document.getElementById('big-ad-banner');
    if (bigAdBanner && !bigAdBanner.innerHTML.trim()) {
        bigAdBanner.textContent = t('yourBigAdHere');
    }
}

// Current language - will be updated by initializeLanguage()
let currentLang = 'en';

// Function to get district ID for a city
async function getDistrictIdForCity(cityName) {
    try {
        // First, get all districts
        const districtsRes = await fetch('https://api-weather.services.siag.it/api/v2/district');
        const districtsData = await districtsRes.json();
        
        // Use the OpenDataHub Tourism API to get station data
        const stationsRes = await fetch('https://tourism.api.opendatahub.com/v1/Weather/Realtime');
        const stationsData = await stationsRes.json();
        
        // Find the station that matches our city name
        const normalizedCityName = cityName.toLowerCase().trim();
        const matchingStation = stationsData.find(station => 
            station.name.toLowerCase().includes(normalizedCityName)
        );
        
        if (matchingStation) {
            // Find the district that contains this station's coordinates
            const stationLat = safeParseFloat(matchingStation.latitude);
            const stationLon = safeParseFloat(matchingStation.longitude);
            
            // For each district, check if the station is within its bounds
            // For now, we'll use a simple approach: find the district with the closest center
            let closestDistrict = null;
            let minDistance = Infinity;
            
            for (const district of districtsData.rows) {
                // Get the district's bulletin to check its area
                const districtRes = await fetch(`https://api-weather.services.siag.it/api/v2/district/${district.id}/bulletin`);
                const districtData = await districtRes.json();
                
                if (districtData.district) {
                    // Calculate distance between station and district center
                    // This is a simplified approach - in reality, you'd want to check if the point is within the district's polygon
                    const distance = Math.sqrt(
                        Math.pow(stationLat - districtData.district.latitude, 2) +
                        Math.pow(stationLon - districtData.district.longitude, 2)
                    );
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestDistrict = district;
                    }
                }
            }
            
            return closestDistrict ? closestDistrict.id : 1; // Default to Bolzano district if no match found
        }
        
        return 1; // Default to Bolzano district if no match found
    } catch (error) {
        console.error('Error getting district for city:', error);
        return 1; // Default to Bolzano district on error
    }
}

// Function to get district name by ID
async function getDistrictNameById(districtId) {
    try {
        // Try to get translated district name from TRANSLATIONS
        if (TRANSLATIONS.districts && Array.isArray(TRANSLATIONS.districts.rows)) {
            const found = TRANSLATIONS.districts.rows.find(d => d.id === districtId || d.id === Number(districtId));
            if (found && found.name) return found.name;
        }
        // Fallback to API
        const response = await fetch(`https://api-weather.services.siag.it/api/v2/district/${districtId}/bulletin`);
        const data = await response.json();
        return data.district?.name || t('unknownDistrict');
    } catch (error) {
        console.error('Error getting district name:', error);
        return t('unknownDistrict');
    }
}

// Function to get weather description from WMO code
function getWeatherDescription(code, lang = 'en') {
    const weatherCodes = {
        0: { en: 'Clear sky', de: 'Klarer Himmel', it: 'Cielo sereno' },
        1: { en: 'Mainly clear', de: 'Überwiegend klar', it: 'Prevalentemente sereno' },
        2: { en: 'Partly cloudy', de: 'Teilweise bewölkt', it: 'Parzialmente nuvoloso' },
        3: { en: 'Overcast', de: 'Bedeckt', it: 'Coperto' },
        45: { en: 'Foggy', de: 'Neblig', it: 'Nebbia' },
        48: { en: 'Depositing rime fog', de: 'Reifnebel', it: 'Nebbia ghiacciata' },
        51: { en: 'Light drizzle', de: 'Leichter Nieselregen', it: 'Pioviggine leggera' },
        53: { en: 'Moderate drizzle', de: 'Mäßiger Nieselregen', it: 'Pioviggine moderata' },
        55: { en: 'Dense drizzle', de: 'Starker Nieselregen', it: 'Pioviggine intensa' },
        61: { en: 'Slight rain', de: 'Leichter Regen', it: 'Pioggia leggera' },
        63: { en: 'Moderate rain', de: 'Mäßiger Regen', it: 'Pioggia moderata' },
        65: { en: 'Heavy rain', de: 'Starker Regen', it: 'Pioggia intensa' },
        71: { en: 'Slight snow', de: 'Leichter Schneefall', it: 'Neve leggera' },
        73: { en: 'Moderate snow', de: 'Mäßiger Schneefall', it: 'Neve moderata' },
        75: { en: 'Heavy snow', de: 'Starker Schneefall', it: 'Neve intensa' },
        77: { en: 'Snow grains', de: 'Schneegriesel', it: 'Granelli di neve' },
        80: { en: 'Slight rain showers', de: 'Leichte Regenschauer', it: 'Rovesci leggeri' },
        81: { en: 'Moderate rain showers', de: 'Mäßige Regenschauer', it: 'Rovesci moderati' },
        82: { en: 'Violent rain showers', de: 'Starke Regenschauer', it: 'Rovesci intensi' },
        85: { en: 'Slight snow showers', de: 'Leichte Schneeschauer', it: 'Rovesci di neve leggeri' },
        86: { en: 'Heavy snow showers', de: 'Starke Schneeschauer', it: 'Rovesci di neve intensi' },
        95: { en: 'Thunderstorm', de: 'Gewitter', it: 'Temporale' },
        96: { en: 'Thunderstorm with slight hail', de: 'Gewitter mit leichtem Hagel', it: 'Temporale con leggera grandine' },
        99: { en: 'Thunderstorm with heavy hail', de: 'Gewitter mit starkem Hagel', it: 'Temporale con forte grandine' }
    };
    return weatherCodes[code]?.[lang] || weatherCodes[code]?.['en'] || 'Unknown weather';
}

// Function to get weather icon
function getWeatherIcon(code) {
    const iconMap = {
        0: 'sun',
        1: 'cloud-sun',
        2: 'cloud-sun',
        3: 'cloud',
        45: 'smog',
        48: 'smog',
        51: 'cloud-rain',
        53: 'cloud-rain',
        55: 'cloud-showers-heavy',
        61: 'cloud-rain',
        63: 'cloud-showers-heavy',
        65: 'cloud-showers-heavy',
        71: 'snowflake',
        73: 'snowflake',
        75: 'snowflake',
        77: 'snowflake',
        80: 'cloud-rain',
        81: 'cloud-showers-heavy',
        82: 'cloud-showers-heavy',
        85: 'snowflake',
        86: 'snowflake',
        95: 'bolt',
        96: 'bolt',
        99: 'bolt'
    };
    return `fas fa-${iconMap[code] || 'question'}`;
}

// Function to get UV index color
function getUVIndexColor(uvIndex) {
    if (uvIndex <= 2) return '#3EA72D';
    if (uvIndex <= 5) return '#FFF300';
    if (uvIndex <= 7) return '#F18B00';
    if (uvIndex <= 10) return '#E53210';
    return '#B567A4';
}

// Function to get moon phase icon
function getMoonPhaseIcon(phase) {
    const phases = ['new-moon', 'waxing-crescent', 'first-quarter', 'waxing-gibbous', 
                   'full-moon', 'waning-gibbous', 'last-quarter', 'waning-crescent'];
    return `fas fa-${phases[Math.floor(phase * 8)]}`;
}

// Function to change language
async function changeLanguage(lang) {
    if (!['en', 'de', 'it'].includes(lang)) {
        return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;
    // Update URL with the new language
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    // Load new translations and update UI
    await loadTranslations(lang);
    updatePageTranslations();
    fetchWeatherData();
}

// Function to get a short location name
function getShortLocationName(fullName) {
    // Split by comma and take the first part
    const parts = fullName.split(',');
    // Take the first part and remove any district/region information
    let shortName = parts[0].split(' - ')[0].trim();
    // Remove any postal code if present
    shortName = shortName.replace(/\d{5}/, '').trim();
    return shortName;
}

// Function to display weather information
function displayWeather(locationName, weatherData) {
    const content = document.getElementById('weather-content');
    const shortLocationName = getShortLocationName(locationName);
    
    // Update location
    const locationElement = document.querySelector('.location');
    if (locationElement) {
        // Use t helper for city translation
        const translatedCityName = t('cities.' + shortLocationName);
        locationElement.textContent = translatedCityName !== 'cities.' + shortLocationName ? translatedCityName : shortLocationName;
    }
    
    // Update current weather
    document.querySelector('.temperature').textContent = `${Math.round(weatherData.current_weather.temperature)}°C`;
    document.querySelector('.feels-like').textContent = 
        `${TRANSLATIONS[currentLang].feelsLike}: ${Math.round(weatherData.current_weather.temperature)}°C`;
    
    // Set the weather icon using standardized code
    const wmoCode = standardizeWeatherCode(weatherData.current_weather.weathercode);
    setWeatherIcon(wmoCode);
    
    // Update wind information
    document.querySelector('.wind-speed').textContent = 
        `${Math.round(weatherData.current_weather.windspeed)} km/h`;
    
    const windDirection = document.querySelector('.wind-direction');
    windDirection.style.transform = `rotate(${weatherData.current_weather.winddirection}deg)`;
    
    // Update humidity and rain chance
    if (weatherData.hourly.relativehumidity_2m) {
        document.querySelector('.humidity-value').textContent = 
            `${Math.round(weatherData.hourly.relativehumidity_2m[0])}%`;
    }
    
    if (weatherData.hourly.precipitation_probability) {
        document.querySelector('.rain-chance-value').textContent = 
            `${Math.round(weatherData.hourly.precipitation_probability[0])}%`;
    }
    
    // Update today's forecast
    const today = new Date();
    const todayIndex = today.getHours();
    
    if (weatherData.hourly.temperature_2m) {
        const highTemp = Math.max(...weatherData.hourly.temperature_2m.slice(todayIndex, todayIndex + 24));
        const lowTemp = Math.min(...weatherData.hourly.temperature_2m.slice(todayIndex, todayIndex + 24));
        
        document.querySelector('.high-temp').textContent = `${TRANSLATIONS[currentLang].high}: ${Math.round(highTemp)}°C`;
        document.querySelector('.low-temp').textContent = `${TRANSLATIONS[currentLang].low}: ${Math.round(lowTemp)}°C`;
    }
    
    // Update sunrise/sunset
    if (weatherData.daily.sunrise && weatherData.daily.sunset) {
        const sunrise = new Date(weatherData.daily.sunrise[0]);
        const sunset = new Date(weatherData.daily.sunset[0]);
        
        document.querySelector('.sunrise-time').textContent = sunrise.toLocaleTimeString();
        document.querySelector('.sunset-time').textContent = sunset.toLocaleTimeString();
    }
    
    // Update UV index
    if (weatherData.daily.uv_index_max) {
        const uvIndex = weatherData.daily.uv_index_max[0];
        const uvElement = document.querySelector('.uv-value');
        uvElement.textContent = uvIndex;
        uvElement.style.color = getUVIndexColor(uvIndex);
    }
    
    // Update hourly timeline
    const timeline = document.querySelector('.hourly-timeline');
    timeline.innerHTML = '';
    
    if (weatherData.hourly.time && weatherData.hourly.temperature_2m && weatherData.hourly.weathercode) {
        for (let i = 0; i < 24; i += 3) {
            const hour = new Date(weatherData.hourly.time[todayIndex + i]);
            const temp = weatherData.hourly.temperature_2m[todayIndex + i];
            const code = weatherData.hourly.weathercode[todayIndex + i];
            
            const hourElement = document.createElement('div');
            hourElement.className = 'hour-item';
            hourElement.innerHTML = `
                <div>${hour.getHours()}:00</div>
                <i class="${getWeatherIcon(code)}"></i>
                <div>${Math.round(temp)}°C</div>
            `;
            timeline.appendChild(hourElement);
        }
    }
    
    // Calculate moon phase
    const moonPhase = (new Date().getDate() % 29.53) / 29.53;
    const moonIcon = document.querySelector('.moon-phase');
    if (moonIcon) {
        moonIcon.className = `moon-phase ${getMoonPhaseIcon(moonPhase)}`;
    }
}

// Function to display error message
function displayError(message) {
    const content = document.getElementById('weather-content');
    content.innerHTML = `<div class="error">${message}</div>`;
}

// Function to get location name from coordinates
async function getLocationName(lat, lng) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
        );
        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error('Error getting location name:', error);
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

// Function to standardize weather codes from various sources to our WMO-based system
function standardizeWeatherCode(code, desc = '') {
    // First check if we have direct precipitation data
    if (code === 'f') return 61; // rain
    if (code === 'g') return 71; // snow
    
    // Convert SIAG codes or descriptions to standardized WMO codes
    if (typeof code === 'string') {
        // Handle SIAG letter codes
        if (code === 'b') return 0;  // clear/sunny
        if (code === 'c') return 2;  // partly cloudy
        if (code === 'd') return 3;  // overcast/cloudy
        // Keep other codes, removed 'f' and 'g' as handled above
        if (code === 'h') return 45; // fog
        if (code === 'i') return 95; // thunderstorm
    }
    
    // If we have a description but not a code, try to determine from the description
    // Use regex with i flag for case-insensitive matching
    // And include matches for English, German, and Italian terms
    if (desc && desc.length > 0) {
        desc = desc.toLowerCase(); // Convert to lowercase for easier matching
        
        // Snow - check this first since it's most weather-dependent
        if (/\bsnow|\bschnee|\bneve|\bnevica|\bfiocch/i.test(desc)) {
            // Check for heavy snow
            if (/heavy|stark|intens|abbondant|dicht/i.test(desc)) {
                return 75; // Heavy snow
            }
            // Check for light snow
            if (/light|leicht|légèr|legger|schwach/i.test(desc)) {
                return 71; // Light snow
            }
            // Default snow
            return 73; // Moderate snow
        }
        
        // Thunderstorm
        if (/thunder|storm|gewitter|blitz|temporale|tempesta|fulmin/i.test(desc)) {
            if (/hail|hagel|grandine/i.test(desc)) {
                if (/heavy|stark|intens|abbondant/i.test(desc)) {
                    return 99; // Thunderstorm with heavy hail
                }
                return 96; // Thunderstorm with light hail
            }
            return 95; // Regular thunderstorm
        }
        
        // Fog
        if (/fog|nebel|nebbia|mist|nebel|nebelos/i.test(desc)) {
            if (/freez|frost|ghiacci|eis/i.test(desc)) {
                return 48; // Freezing fog
            }
            return 45; // Regular fog
        }
        
        // Rain
        if (/rain|regen|pioggia|pluie|precipit|shower|schauer/i.test(desc)) {
            // Check for heavy rain
            if (/heavy|stark|intens|abbondant|dicht/i.test(desc)) {
                return 65; // Heavy rain
            }
            // Check for light rain/drizzle
            if (/light|leicht|légèr|legger|schwach|drizzle|niesel|piovigg/i.test(desc)) {
                return 51; // Light drizzle
            }
            // Check for shower
            if (/shower|schauer|rovesc/i.test(desc)) {
                return 80; // Rain shower
            }
            // Default rain
            return 61; // Moderate rain
        }
        
        // Clouds - check after rain/snow/etc. to avoid overmatching
        // Partly Cloudy - specifically check for "partly" or partial terms first
        if (/partly cloud|teilweise bewölkt|parzialmente nuvoloso|partly sunny|teilweise sonnig|parzialmente soleggiato/i.test(desc)) {
            return 2;
        }
        // Fully Cloudy/Overcast - check after partly cloudy to avoid overmatching
        if (/cloud|bewölkt|nuvoloso|overcast|bedeckt|coperto/i.test(desc)) {
            return 3;
        }
        
        // Clear/Sunny - check last as it's the default for good weather
        if (/sun|clear|klar|heiter|sereno|soleggiato/i.test(desc)) {
            return 0;
        }
    }
    
    // If we have a numeric code, use it directly if it's a valid WMO code
    if (typeof code === 'number') {
        // These are the valid WMO codes we support
        const validCodes = [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99];
        if (validCodes.includes(code)) {
            return code;
        }
    }
    
    // If we get here and have precipitation in description, use that as a fallback
    if (desc && /rain|regen|pioggia|precipit/i.test(desc)) {
        return 61; // Default to light rain
    }
    
    // Default to partly cloudy if we can't determine
    return 2;
}

// --- Rain detection using 'n' (daily precipitation) and 'lastUpdated' ---
// This function keeps track of the previous precipitation value for each station (by id or name)
// and infers if it is currently raining by checking if 'n' increased since the last update.
// If the last update is recent (e.g., within 15 minutes) and 'n' increased, we guess it's raining now.
const rainDetectionState = {};

function isRainingNow(station) {
    try {
        if (!station) return false;
        
        const key = station.id || station.name;
        if (!key) return false;
        
        const currentN = safeParseFloat(station.n);
        if (isNaN(currentN)) return false;
        
        let currentLastUpdated;
        try {
            currentLastUpdated = new Date(station.lastUpdated);
            if (isNaN(currentLastUpdated.getTime())) return false;
        } catch (e) {
            return false;
        }
        
        const now = new Date();
        const isRecent = (now - currentLastUpdated) < 15 * 60 * 1000;
        
        let isRaining = false;
        if (rainDetectionState[key]) {
            const { prevN, prevLastUpdated } = rainDetectionState[key];
            if (
                typeof prevN === 'number' &&
                currentN > prevN &&
                isRecent
            ) {
                isRaining = true;
            }
        }
        
        rainDetectionState[key] = { 
            prevN: currentN, 
            prevLastUpdated: currentLastUpdated 
        };
        
        return isRaining;
    } catch (error) {
        console.error('Error in rain detection:', error);
        return false;
    }
}

// Main function to fetch and process weather data
async function fetchWeatherData() {
    try {
        // Use the currentLang that was initialized from URL or default
        const lang = currentLang;
        
        // Check for station or city in URL
        const stationParam = getUrlParameter('station');
        const cityParam = getUrlParameter('city');
        const latParam = getUrlParameter('lat');
        const lngParam = getUrlParameter('lng');
        const districtParam = getUrlParameter('district');
        
        let foundStation = null;
        let districtId = districtParam ? parseInt(districtParam, 10) : 1; // Use district from URL parameter if available

        // Fetch stations using the OpenDataHub Tourism API
        const response = await fetch('https://tourism.api.opendatahub.com/v1/Weather/Realtime');
        const stationsData = await response.json();
        
        // Filter to only include valid stations with temperature data
        const validStations = stationsData.filter(station => 
            isValidStation(station) && station.t !== undefined
        );
        
        console.log(`Found ${validStations.length} valid stations with temperature data`);

        if (stationParam || cityParam) {
            if (stationParam) {
                foundStation = validStations.find(s => s.code.toLowerCase() === stationParam.toLowerCase());
            } else if (cityParam) {
                foundStation = validStations.find(s => 
                    s.name.toLowerCase().includes(cityParam.toLowerCase())
                );
                // Only get district ID for the city if not already specified in URL
                if (!districtParam && foundStation) {
                    districtId = await getDistrictIdForCity(cityParam);
                }
            }
            if (foundStation) {
                displayStationWeather(foundStation);
            } else {
                console.log(`No valid station found for ${stationParam || cityParam}, using default`);
                // If specified station/city not found or invalid, use a default valid station
                foundStation = validStations.find(s => 
                    s.name.toLowerCase().includes('bolzano') || 
                    s.name.toLowerCase().includes('bozen')
                ) || validStations[0];
                
                if (foundStation) {
                    displayStationWeather(foundStation);
                    console.log(`Fallback to station: ${foundStation.name}`);
                }
            }
        } else if (latParam && lngParam) {
            // Calculate distances to find nearest station
            const lat = parseFloat(latParam);
            const lng = parseFloat(lngParam);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                // Find stations with valid coordinates
                const stationsWithCoords = validStations.filter(station => {
                    const sLat = safeParseFloat(station.latitude);
                    const sLng = safeParseFloat(station.longitude);
                    return !isNaN(sLat) && !isNaN(sLng);
                });
                
                // Calculate distance for each station
                const stationsWithDistance = stationsWithCoords.map(station => {
                    const sLat = safeParseFloat(station.latitude);
                    const sLng = safeParseFloat(station.longitude);
                    const distance = Math.sqrt(
                        Math.pow(lat - sLat, 2) + 
                        Math.pow(lng - sLng, 2)
                    );
                    return { ...station, distance };
                });
                
                // Sort by distance
                stationsWithDistance.sort((a, b) => a.distance - b.distance);
                
                if (stationsWithDistance.length > 0) {
                    foundStation = stationsWithDistance[0];
                    displayStationWeather(foundStation);
                    console.log(`Using nearest station: ${foundStation.name}`);
                }
            }
        } else {
            // No parameters provided - use default location (Bolzano)
            // Look for Bolzano station among valid stations
            foundStation = validStations.find(s => 
                s.name.toLowerCase().includes('bolzano') || 
                s.name.toLowerCase().includes('bozen')
            );
            
            if (foundStation) {
                displayStationWeather(foundStation);
                console.log("Using default location: Bolzano");
            } else if (validStations.length > 0) {
                // If Bolzano not found, use first valid station
                foundStation = validStations[0];
                displayStationWeather(foundStation);
                console.log(`Using first valid station as default: ${foundStation.name}`);
            } else {
                console.error("No valid stations found with temperature data");
                displayError(TRANSLATIONS[currentLang]?.error || 'No valid weather stations available.');
            }
            
            // Use Bolzano district (ID: 1) by default
            districtId = 1;
        }

        // Show forecast for the district
        const forecastElem = document.querySelector('.forecast-container');
        if (forecastElem) {
            forecastElem.innerHTML = '';
            // Add district information ABOVE the forecast container
            let districtInfo = document.querySelector('.district-info');
            const districtName = await getDistrictNameById(districtId);
            if (!districtInfo) {
                districtInfo = document.createElement('div');
                districtInfo.className = 'district-info';
                forecastElem.parentElement.insertBefore(districtInfo, forecastElem);
            }
            // Create a more stylish district info display
            const cityName = document.querySelector('.location').textContent;
            districtInfo.innerHTML = `
                <div class="district-header">
                    <span class="district-icon"></span>
                    <span class="district-title">${districtName}</span>
                </div>
                <div class="district-subtitle">
                    ${cityName} • ${t('districtForecast')}
                </div>
            `;
            
            console.log(`Using district ID: ${districtId}, name: ${districtName}`);
        }

        const forecastRes = await fetch(`https://api-weather.services.siag.it/api/v2/district/${districtId}/bulletin?format=json&lang=${lang}`);
        const forecastData = await forecastRes.json();
        
        if (forecastData.forecasts && forecastElem) {
            // First remove any existing forecast icons to prevent duplicates
            for (let i = 0; i < 7; i++) {
                const iconId = `forecast-icon-${i}`;
                skycons.default.remove(iconId);
            }
            
            // Always show 4 days of forecasts, regardless of device performance
            const maxDays = 4;
            
            // TV performance optimization: pause animation during updates
            const needsOptimization = devicePerformanceScore <= 3;
            if (needsOptimization && skycons.default) {
                try {
                    skycons.default.pause();
                } catch (e) {
                    console.warn('Could not pause Skycons:', e);
                }
            }
            
            // Create non-animated forecast icons for very low performance devices
            const useSimpleIcons = devicePerformanceScore <= 2;
            
            // Start from index 1 to skip today's forecast
            for (let i = 1; i < Math.min(maxDays + 1, forecastData.forecasts.length); i++) {
                const day = forecastData.forecasts[i];
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString(lang, { weekday: 'short' });
                const formattedDate = date.toLocaleDateString(lang, { day: 'numeric', month: 'short' });
                const code = day.symbol?.code;
                const desc = day.symbol?.description || '';
                const tempMax = day.temperatureMax;
                const tempMin = day.temperatureMin;
                const displayIndex = i - 1; // Adjust index for display (0-based)
                const iconId = `forecast-icon-${displayIndex}`;
                
                // Create forecast day element
                const dayDiv = document.createElement('div');
                dayDiv.className = 'forecast-day';
                
                // For very low performance devices, use static icons instead of animated Skycons
                if (useSimpleIcons) {
                    const staticIconClass = getForecastIconClass(code, desc);
                    dayDiv.innerHTML = `
                        <div class="day-name">${dayName}<span class="forecast-date">${formattedDate}</span></div>
                        <div class="forecast-icon static-icon">
                            <i class="${staticIconClass}"></i>
                        </div>
                        <div class="forecast-temp">${tempMin !== undefined ? Math.round(tempMin) + '°' : ''} / ${tempMax !== undefined ? Math.round(tempMax) + '°' : ''}</div>
                        <div class="forecast-desc">${desc}</div>
                    `;
                } else {
                    dayDiv.innerHTML = `
                        <div class="day-name">${dayName}<span class="forecast-date">${formattedDate}</span></div>
                        <div class="forecast-icon">
                            <canvas id="${iconId}" width="80" height="80"></canvas>
                        </div>
                        <div class="forecast-temp">${tempMin !== undefined ? Math.round(tempMin) + '°' : ''} / ${tempMax !== undefined ? Math.round(tempMax) + '°' : ''}</div>
                        <div class="forecast-desc">${desc}</div>
                    `;
                }
                
                forecastElem.appendChild(dayDiv);
                
                // Standardize and set the weather icon
                const wmoCode = standardizeWeatherCode(code, desc);
                console.log(`Forecast day ${displayIndex}: ${dayName}, code: ${code} → ${wmoCode}, desc: ${desc}`);
                
                // Skip Skycons setup for simple icons mode
                if (useSimpleIcons) continue;
                
                // Get icon type based on the weather code
                let iconType;
                const isNight = false; // Always use day icons for forecast
                
                if (wmoCode <= 1) {
                    iconType = Skycons.CLEAR_DAY;
                } else if (wmoCode === 2) {
                    iconType = Skycons.PARTLY_CLOUDY_DAY;
                } else if (wmoCode === 3) {
                    iconType = Skycons.CLOUDY;
                } else if (wmoCode === 45 || wmoCode === 48) {
                    iconType = Skycons.FOG;
                } else if ((wmoCode >= 51 && wmoCode <= 65) || (wmoCode >= 80 && wmoCode <= 82)) {
                    iconType = Skycons.RAIN;
                } else if ((wmoCode >= 71 && wmoCode <= 77) || (wmoCode >= 85 && wmoCode <= 86)) {
                    iconType = Skycons.SNOW;
                } else if (wmoCode >= 95) {
                    iconType = Skycons.WIND;
                } else {
                    iconType = Skycons.CLOUDY;
                }
                
                // Add icon immediately after creating the element
                const iconElement = document.getElementById(iconId);
                if (iconElement) {
                    // For low performance, use canvas optimization
                    if (needsOptimization && iconElement.getContext) {
                        const ctx = iconElement.getContext('2d');
                        if (ctx) {
                            ctx.imageSmoothingEnabled = false;
                            ctx.imageSmoothingQuality = 'low';
                        }
                    }
                    
                    skycons.default.add(iconId, iconType);
                    console.log(`Added forecast icon ${iconId} with type ${iconType}`);
                } else {
                    console.error(`Could not find element with ID: ${iconId}`);
                }
            }
            
            // Resume animations after all icons are added
            if (needsOptimization && skycons.default) {
                try {
                    // Short delay to let browser process DOM changes
                    setTimeout(() => skycons.default.play(), 100);
                } catch (e) {
                    console.warn('Could not resume Skycons:', e);
                }
            }
        }

        // Update ad text with current language
        updatePageTranslations();
    } catch (error) {
        displayError(TRANSLATIONS[currentLang]?.error || 'Error fetching weather data. Please try again later.');
        console.error('Error:', error);
    }
}

// Function to check if a station has valid weather data
function isValidStation(station) {
    // Basic station validation
    if (!station || !station.name || station.name.trim() === '') {
        console.log('Invalid station or name:', station?.name || 'unknown');
        return false;
    }
    
    try {
        // Temperature validation - must be a valid number in a plausible range
        const temp = safeParseFloat(station.t);
        if (isNaN(temp) || temp === null || temp === undefined || 
            // Check for implausible temperatures (-50°C to +60°C is reasonable range)
            temp < -50 || temp > 60) {
            console.log('Invalid temperature for', station.name, ':', station.t);
            return false;
        }
        
        // Humidity validation - must be a valid percentage
        const humidity = safeParseFloat(station.rh);
        if (isNaN(humidity) || humidity < 0 || humidity > 100) {
            console.log('Invalid humidity for', station.name, ':', station.rh);
            return false;
        }
        
        // Wind speed validation - must be a valid number
        const windSpeed = safeParseFloat(station.ff);
        if (isNaN(windSpeed) || windSpeed < 0 || windSpeed > 200) {
            console.log('Invalid wind speed for', station.name, ':', station.ff);
            return false;
        }
        
        // Coordinate validation
        let lat = station.latitude;
        let lon = station.longitude;
        
        // Handle both string and number formats
        if (typeof lat === 'string') {
            // European format may use commas for decimal points
            lat = lat.replace(',', '.');
        }
        if (typeof lon === 'string') {
            lon = lon.replace(',', '.');
        }
        
        // Convert to numbers
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        
        // Validate coordinates are in reasonable ranges
        // Latitude: -90 to 90, Longitude: -180 to 180
        if (isNaN(lat) || isNaN(lon) || 
            !lat || !lon ||
            lat < -90 || lat > 90 || 
            lon < -180 || lon > 180) {
            console.log('Invalid coordinates for', station.name, ':', station.latitude, station.longitude);
            return false;
        }
        
        // Check for "missing value" indicators like "--" or empty strings
        if (station.t === '--' || station.rh === '--' || station.ff === '--') {
            console.log('Contains placeholder data for', station.name);
            return false;
        }
        
        // Ensure lastUpdated is valid
        if (!station.lastUpdated || typeof station.lastUpdated !== 'string') {
            console.log('Missing or invalid lastUpdated timestamp for', station.name);
            return false;
        }
        
        // Check if timestamp is recent (within last 24 hours)
        const lastUpdated = new Date(station.lastUpdated);
        const now = new Date();
        const diffHours = (now - lastUpdated) / (1000 * 60 * 60);
        
        if (isNaN(lastUpdated.getTime()) || diffHours > 24) {
            console.log('Outdated data for', station.name, ':', station.lastUpdated);
            return false;
        }
        
        // All checks passed
        return true;
    } catch (error) {
        console.error('Error validating station', station.name, error);
        return false;
    }
}

// Function to clean station name
function cleanStationName(name) {
    // Remove any district/region information after comma
    let cleanName = name.split(',')[0];
    // Remove any postal code
    cleanName = cleanName.replace(/\d{5}/, '').trim();
    // Remove any special characters or extra spaces
    cleanName = cleanName.replace(/[^\w\s-]/g, '').replace(/\s+/g, ' ').trim();
    return cleanName;
}

// Function to populate the city dropdown
async function populateCityDropdown() {
    try {
        // Use the OpenDataHub Tourism API for consistency
        const response = await fetch('https://tourism.api.opendatahub.com/v1/Weather/Realtime');
        const stationsData = await response.json();
        
        // Filter for stations with valid data only
        const validStations = stationsData
            .filter(station => 
                // Use our isValidStation function for consistent validation
                isValidStation(station) && 
                // Ensure the required weather properties exist
                station.t !== undefined && 
                station.name && 
                station.name.trim() !== ''
            )
            .map(station => ({
                ...station,
                cleanName: cleanStationName(station.name)
            }))
            .sort((a, b) => a.cleanName.localeCompare(b.cleanName));

        // Remove duplicates (same clean name)
        const uniqueStations = validStations.reduce((acc, current) => {
            const x = acc.find(item => item.cleanName === current.cleanName);
            if (!x) {
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        console.log(`Found ${uniqueStations.length} valid cities with weather data out of ${stationsData.length} total stations`);

        // Update the dropdown
        const citySelect = document.getElementById('city-select');
        if (citySelect) {
            citySelect.innerHTML = `<option value="">${t('selectCity')}</option>`;
            uniqueStations.forEach(station => {
                const option = document.createElement('option');
                const displayCityName = t('cities.' + station.cleanName);
                option.value = station.cleanName;
                option.textContent = displayCityName !== 'cities.' + station.cleanName ? displayCityName : station.cleanName;
                citySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error populating city dropdown:', error);
    }
}

// Create multiple skycons objects with different colors
let skycons = {};
const ICON_COLORS = {
    sun: "#FFD700",     // Gold/yellow for sun
    cloud: "#FFFFFF",   // White for clouds
    rain: "#A4B0BE",    // Blue-gray for rain
    snow: "#FFFFFF",    // White for snow
    fog: "#DADADA",     // Light gray for fog
    thunder: "#F1C40F", // Yellow for lightning
    default: "#FFFFFF"  // White as default
};

// Performance detection variables - Default to extreme low performance for TV devices
let isLowEndDevice = true; // Default to low performance
let devicePerformanceScore = 1; // Default to very low performance (1 out of 10)

// Drastically simplified function to detect device performance
function detectDevicePerformance() {
    // Default score (higher is better)
    let score = 5;
    
    // Check if it's a TV device - most aggressive optimization for TVs
    const userAgent = navigator.userAgent.toLowerCase();
    const isTVDevice = 
        userAgent.includes('tv') || 
        userAgent.includes('smart-tv') || 
        userAgent.includes('smarttv') || 
        userAgent.includes('appletv') || 
        userAgent.includes('googletv') || 
        userAgent.includes('webos') || 
        userAgent.includes('tizen');
    
    if (isTVDevice) {
        // Detected TV - use lowest performance score
        score = 1; // Extreme performance optimization for TVs
        console.log('TV device detected, activating extreme optimizations');
    } else {
        // Check for TV-like screen dimensions
        const width = window.screen.width || window.innerWidth;
        const height = window.screen.height || window.innerHeight;
        const aspectRatio = width / height;
        const isLargeScreen = width >= 1920;
        const isTVRatio = aspectRatio > 1.7 && aspectRatio < 1.8; // Close to 16:9
        
        if (isLargeScreen && isTVRatio) {
            // Likely a TV based on screen size
            score = 2; // Strong optimization
            console.log('TV-like screen detected, applying strong optimizations');
        }
        
        // Check for older browsers that might indicate older hardware
        if (!window.IntersectionObserver || !window.ResizeObserver) {
            score -= 1;
            console.log('Older browser features detected, reducing performance score');
        }
        
        // Check memory (if available)
        if (navigator.deviceMemory) {
            if (navigator.deviceMemory < 4) {
                score -= Math.max(0, 3 - navigator.deviceMemory);
                console.log(`Low memory (${navigator.deviceMemory}GB) detected, reducing performance score`);
            }
        }
        
        // If device has limited hardware, detect it from CPU cores if available
        if (navigator.hardwareConcurrency) {
            if (navigator.hardwareConcurrency < 4) {
                score -= 1;
                console.log(`Limited CPU cores (${navigator.hardwareConcurrency}) detected, reducing performance score`);
            }
        }
    }
    
    // Limit the score range
    score = Math.max(1, Math.min(5, score));
    
    // Update global variable
    devicePerformanceScore = score;
    
    console.log(`Device performance score: ${score}/5`);
    
    // Additional device-specific optimizations
    if (score <= 2) {
        // Extreme optimizations for low-performance devices
        
        // 1. Update body with performance class
        document.body.classList.add('low-performance-device');
        
        // 2. Reduce animation complexity across the app
        document.querySelectorAll('.forecast-day').forEach(day => {
            // Remove hover effects which can cause lag
            day.classList.add('no-hover');
        });
        
        // 3. Force disable any complex animations
        if (window.cloudDecorations) {
            if (score === 1) {
                // Completely disable cloud decorations for extreme cases
                window.cloudDecorations.maxClouds = 0; 
                console.log('Lowest performance device: disabling cloud decorations');
            } else {
                // Limit to 2 clouds for low-performance
                window.cloudDecorations.maxClouds = 2;
                console.log('Low performance device: limiting cloud decorations to 2 clouds');
            }
        }
        
        // 4. Inject CSS optimization
        const style = document.createElement('style');
        style.textContent = `
            /* Optimize for low performance */
            .low-performance-device * {
                transition-duration: 0.5s !important;
                animation-duration: 0.5s !important;
            }
            
            /* Remove hover effects */
            .low-performance-device .no-hover:hover,
            .low-performance-device .forecast-day:hover {
                transform: none !important;
                box-shadow: none !important;
            }
            
            /* Optimize canvas rendering */
            .low-performance-device canvas {
                image-rendering: optimizeSpeed;
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: optimize-contrast;
                image-rendering: pixelated;
            }
        `;
        document.head.appendChild(style);
    }
    
    return score;
}

// Initialize Skycons with optimized settings
function initializeSkycons() {
    // Create only one skycon instance to save memory
    skycons = {
        default: new Skycons({ 
            "color": "#FFFFFF", 
            "resizeClear": true,
            "monochrome": true // Use monochrome for better performance
        })
    };
    
    // TV optimization: reduce frame rate for better performance
    if (devicePerformanceScore <= 3) {
        try {
            // Reduce animation frame rate to improve performance
            skycons.default._frameRate = 10; // Reduce from default 30fps

            // Modify the draw step to update less frequently
            const originalDrawLoop = skycons.default._loop;
            skycons.default._loop = function() {
                if (!this._frameRate) this._frameRate = 30;
                
                // Check if we should update (only every few frames)
                const now = Date.now();
                if (!this._lastUpdate || now - this._lastUpdate >= (1000 / this._frameRate)) {
                    this._lastUpdate = now;
                    originalDrawLoop.call(this);
                } else {
                    // Skip this frame
                    requestAnimationFrame(() => this._loop());
                }
            };
            
            console.log("Using optimized Skycons for TV with reduced frame rate");
        } catch (e) {
            console.warn("Could not optimize Skycons animation:", e);
        }
    }
    
    // Start animation with optimized settings
    skycons.default.play();
    console.log("Initialized optimized Skycons");
}

// Function to set the skycon based on weather code
function setWeatherIcon(code) {
    // Get current icon canvas
    const iconCanvas = document.getElementById('current-icon');
    if (!iconCanvas) return;
    
    // Set weather code in body dataset
    setCurrentWeatherCode(code);
    
    // Determine if it's nighttime to show the night icon variant
    const now = new Date();
    const hour = now.getHours();
    const isNight = hour < 6 || hour >= 20;
    
    // Convert to Skycons icon type
    let iconType;
    
    if (code <= 1) {
        // Clear sky
        iconType = isNight ? Skycons.CLEAR_NIGHT : Skycons.CLEAR_DAY;
    } else if (code === 2) {
        // Partly cloudy
        iconType = isNight ? Skycons.PARTLY_CLOUDY_NIGHT : Skycons.PARTLY_CLOUDY_DAY;
    } else if (code === 3) {
        // Cloudy/overcast
        iconType = Skycons.CLOUDY;
    } else if (code === 45 || code === 48) {
        // Fog
        iconType = Skycons.FOG;
    } else if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) {
        // Rain (drizzle, rain, rain showers)
        iconType = Skycons.RAIN;
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        // Snow (snow, snow grains, snow showers)
        iconType = Skycons.SNOW;
    } else if (code >= 95) {
        // Thunderstorm
        iconType = Skycons.WIND;
    } else {
        // Default to cloudy for unknown codes
        iconType = Skycons.CLOUDY;
    }
    
    // Performance optimization for TV: pause Skycons before changing
    if (devicePerformanceScore <= 3) {
        try {
            skycons.default.pause();
            skycons.default.remove('current-icon');
            
            if (iconCanvas.getContext) {
                const ctx = iconCanvas.getContext('2d');
                if (ctx) {
                    ctx.imageSmoothingEnabled = false;
                    ctx.imageSmoothingQuality = 'low';
                }
            }
            
            skycons.default.add('current-icon', iconType);
            setTimeout(() => skycons.default.play(), 100);
        } catch (e) {
            console.warn("Error during icon optimization:", e);
            skycons.default.remove('current-icon');
            skycons.default.add('current-icon', iconType);
        }
    } else {
        skycons.default.remove('current-icon');
        skycons.default.add('current-icon', iconType);
    }
    
    // Update the weather background
    setWeatherBackground(code);
    
    return iconType;
}

// Function to apply weather background using CSS classes
function setWeatherBackground(code) {
    console.log(`Setting weather background for code: ${code}`);
    
    // Remove all weather classes
    document.body.classList.remove(
        'weather-clear',
        'weather-partly-cloudy',
        'weather-cloudy',
        'weather-rainy',
        'weather-snowy',
        'weather-foggy',
        'weather-thunder'
    );
    
    // Remove night class if it's day time
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour >= 19;
    document.body.classList.toggle('night', isNight);
    
    // Remove any existing weather effects
    const existingEffect = document.querySelector('.weather-effect');
    if (existingEffect) {
        existingEffect.remove();
    }
    
    // Add appropriate weather class and effect
    let weatherClass = '';
    let weatherEffect = '';
    let useVideoBackground = true; // Default to using video for all weather types
    let activeVideoId = '';
    
    if (code >= 0 && code <= 1) {
        weatherClass = 'weather-clear';
        activeVideoId = 'video-clearsky';
    } else if (code === 2) {
        weatherClass = 'weather-partly-cloudy';
        activeVideoId = 'video-partly-cloudy';
    } else if (code === 3) {
        weatherClass = 'weather-cloudy';
        activeVideoId = 'video-cloudy';
    } else if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) {
        weatherClass = 'weather-rainy';
        weatherEffect = 'rain';
        activeVideoId = 'video-rain';
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        weatherClass = 'weather-snowy';
        weatherEffect = 'snow';
        activeVideoId = 'video-snow';
    } else if (code === 45 || code === 48) {
        weatherClass = 'weather-foggy';
        weatherEffect = 'fog';
        useVideoBackground = false; // No video for foggy
    } else if (code >= 95) {
        weatherClass = 'weather-thunder';
        weatherEffect = 'rain';
        activeVideoId = 'video-thunder';
    } else {
        weatherClass = 'weather-clear';
        activeVideoId = 'video-clearsky';
    }
    
    // Add the weather class
    document.body.classList.add(weatherClass);
    
    // Handle all video backgrounds for better TV compatibility
    const allVideos = document.querySelectorAll('.weather-video');
    if (allVideos.length > 0) {
        // First hide all videos
        allVideos.forEach(video => {
            video.style.display = 'none';
            video.setAttribute('autoplay', '');
            video.setAttribute('loop', '');
            video.setAttribute('preload', 'auto');
            video.playbackRate = 0.5;
            
            try {
                video.pause();
                video.currentTime = 0;
            } catch (e) {
                console.warn('Could not reset video:', e);
            }
        });
        
        // Remove cloud decorations when using video background
        if (useVideoBackground) {
            const cloudContainer = document.getElementById('cloud-decorations-container');
            if (cloudContainer) {
                cloudContainer.innerHTML = '';
                cloudContainer.style.display = 'none';
            }
            
            // Handle the active video with enhanced TV support
            const activeVideo = document.getElementById(activeVideoId);
            if (activeVideo) {
                // Make the active video visible
                activeVideo.style.display = 'block';
                
                // For videos that have day/night sections
                if (activeVideoId === 'video-snow' || activeVideoId === 'video-thunder') {
                    const setupVideo = () => {
                        const duration = activeVideo.duration;
                        if (isNight) {
                            activeVideo.currentTime = (duration / 2) + (duration / 6);
                        } else {
                            activeVideo.currentTime = duration / 6;
                        }
                        
                        // Enhanced play attempt with retry
                        const playWithRetry = (retryCount = 0) => {
                            if (retryCount >= 3) return;
                            
                            activeVideo.play().catch(error => {
                                console.warn(`Play attempt ${retryCount + 1} failed:`, error);
                                setTimeout(() => playWithRetry(retryCount + 1), 1000);
                            });
                        };
                        
                        playWithRetry();
                    };
                    
                    if (activeVideo.readyState >= 1) {
                        setupVideo();
                    } else {
                        activeVideo.addEventListener('loadedmetadata', setupVideo, { once: true });
                    }
                } else {
                    // For standard videos
                    const playWithRetry = (retryCount = 0) => {
                        if (retryCount >= 3) return;
                        
                        activeVideo.play().catch(error => {
                            console.warn(`Play attempt ${retryCount + 1} failed:`, error);
                            setTimeout(() => playWithRetry(retryCount + 1), 1000);
                        });
                    };
                    
                    playWithRetry();
                }
            }
        } else {
            // Re-show cloud container for non-video weather conditions
            const cloudContainer = document.getElementById('cloud-decorations-container');
            if (cloudContainer) {
                cloudContainer.style.display = ''; // Reset to default display
            }
            
            // Add weather effect if needed and not using video background
            if (weatherEffect && devicePerformanceScore > 2) {
                const effectDiv = document.createElement('div');
                effectDiv.className = `weather-effect ${weatherEffect}`;
                document.body.appendChild(effectDiv);
            }
            
            // Trigger cloud decorations update if available
            if (window.cloudDecorations) {
                // Wait a short moment for the weather class to apply
                setTimeout(() => {
                    console.log('Triggering cloud decorations generation');
                    
                    // First check if the cloud container exists
                    let container = document.getElementById('cloud-decorations-container');
                    if (!container) {
                        console.log('Cloud container not found, creating it');
                        container = document.createElement('div');
                        container.id = 'cloud-decorations-container';
                        container.style.position = 'fixed';
                        container.style.top = '0';
                        container.style.left = '0';
                        container.style.width = '100%';
                        container.style.height = '100%';
                        container.style.zIndex = '-1';
                        container.style.pointerEvents = 'none';
                        document.body.appendChild(container);
                    }
                    
                    // If clouds.js script is not loaded yet, dynamically add it
                    if (!window.cloudDecorations.generate) {
                        console.log('Cloud decorations not fully loaded, loading script');
                        const script = document.createElement('script');
                        script.src = 'components/decorations/clouds.js';
                        script.onload = function() {
                            console.log('Cloud decorations script loaded, initializing');
                            if (window.cloudDecorations && window.cloudDecorations.init) {
                                window.cloudDecorations.init();
                            }
                        };
                        document.head.appendChild(script);
                    } else {
                        // Clouds script is loaded, generate clouds
                        if (typeof window.cloudDecorations.generate === 'function') {
                            window.cloudDecorations.generate();
                        } else {
                            console.error('Cloud decorations generate function not available');
                        }
                    }
                }, 100);
            }
        }
    }
}

// Update the displayStationWeather function to handle missing data
function displayStationWeather(station) {
    if (!isValidStation(station)) {
        displayError(TRANSLATIONS[currentLang]?.invalidData || 'Invalid station data');
        return;
    }

    console.log("Station data:", station);

    // Parse temperature value (handling comma decimals in EU format)
    let temperature = station.t;
    if (typeof temperature === 'string') {
        // Replace comma with dot for decimal parsing
        temperature = temperature.replace(',', '.');
    }
    // Convert to number and round
    temperature = Math.round(parseFloat(temperature));

    // Location
    const locElem = document.querySelector('.location');
    if (locElem) {
        const cleanName = cleanStationName(station.name);
        const translatedCityName = t('cities.' + cleanName);
        locElem.textContent = translatedCityName !== 'cities.' + cleanName ? translatedCityName : cleanName;
    }

    // Temperature
    const tempElem = document.querySelector('.temperature');
    if (tempElem) tempElem.textContent = `${temperature}°C`;

    // Determine weather condition and set weather icon
    let weatherInfo = "";
    if (station.description) {
        weatherInfo = station.description;
    }
    
    // Get weather code using standardization function or new detection
    let weatherCode;
    
    // Prioritize station.weatherCode and station.description if available
    if (station.weatherCode !== undefined && station.weatherCode !== null && station.weatherCode !== '') {
         // If station.weatherCode is available, use it and standardize
        weatherCode = standardizeWeatherCode(station.weatherCode, weatherInfo);
        console.log(`Using station.weatherCode: ${station.weatherCode} -> standardized to ${weatherCode}`);
    } else if (weatherInfo) {
        // If weatherCode is not available, but description is, use description
        weatherCode = standardizeWeatherCode(null, weatherInfo);
        console.log(`Using station.description: "${weatherInfo}" -> standardized to ${weatherCode}`);
    } else {
         // If neither code nor description is available, use the rain detection
        const isRaining = isRainingNow(station);

        const temp = safeParseFloat(station.t);
        // No need for humidity/hour/isNight here if relying solely on isRainingNow for rain

        if (isRaining) {
            if (temp < 2) {
                weatherCode = 71; // Light snow (if cold enough)
            } else {
                weatherCode = 61; // Light rain (if warmer)
            }
            console.log(`Rain detected via n and lastUpdated: using code ${weatherCode}`);
        } else {
             // If not raining based on n and lastUpdated, fallback to other conditions (humidity/temp)
            const humidity = safeParseFloat(station.rh);
            const hour = new Date().getHours();
            const isNight = hour < 6 || hour >= 19;

            if (temp < 0) {
                // Below freezing
                if (humidity > 80) {
                    weatherCode = 71; // Light snow
                } else {
                    // Cold but clear/partly cloudy
                    weatherCode = isNight ? 1 : 0;
                }
            } else if (temp > 30) {
                // Very hot - likely clear or partly cloudy
                weatherCode = humidity > 50 ? 2 : 0;
            } else if (humidity > 85) {
                // Very humid - likely overcast or foggy
                weatherCode = humidity > 95 ? 45 : 3; // Fog or overcast
            } else if (humidity > 80) {
                // Medium-high humidity - overcast or partly cloudy
                weatherCode = 3; // Overcast
            } else if (humidity > 50) {
                // Medium humidity - partly cloudy
                weatherCode = 2; // Partly cloudy
            } else if (humidity > 30) {
                // Low-medium humidity - mainly clear
                weatherCode = 1; // Mainly clear
            } else {
                // Low humidity - likely clear
                weatherCode = 0; // Clear sky
            }
            console.log(`Determined weather from other conditions: temp=${temp}°C, humidity=${humidity}%, night=${isNight}`);
        }
    }

    console.log(`Final determined weather code: ${weatherCode}`);
    setWeatherIcon(weatherCode);

    // Humidity
    const humidityElem = document.querySelector('.humidity');
    if (humidityElem) {
        if (station.rh) {
            let humidity = station.rh;
            if (typeof humidity === 'string') {
                humidity = humidity.replace(',', '.');
            }
            humidityElem.textContent = `${t('humidity')}: ${Math.round(parseFloat(humidity))}%`;
        } else {
            humidityElem.textContent = '';
        }
    }

    // Wind
    const windElem = document.querySelector('.wind');
    if (windElem) {
        if (station.ff) {
            let windSpeed = station.ff;
            if (typeof windSpeed === 'string') {
                windSpeed = windSpeed.replace(',', '.');
            }
            // Translate wind direction if available
            let windDir = station.dd || '';
            if (windDir) {
                const translatedDir = t('windDirections.' + windDir);
                windDir = translatedDir !== 'windDirections.' + windDir ? translatedDir : windDir;
            }
            const windText = `${t('wind')}: ${Math.round(parseFloat(windSpeed))} ${t('kmh')} ${windDir}`;
            windElem.textContent = windText;
        } else {
            windElem.textContent = '';
        }
    }

    // Remove any existing altitude element
    const existingAltitudeElem = document.querySelector('.altitude');
    if (existingAltitudeElem && existingAltitudeElem.parentNode) {
        existingAltitudeElem.parentNode.removeChild(existingAltitudeElem);
    }

    // Summary/description
    const summaryElem = document.querySelector('.summary');
    if (summaryElem) summaryElem.textContent = '';

    updateCurrentTime();
}

// Auto-refresh every 5 minutes
setInterval(fetchWeatherData, 5 * 60 * 1000);

function updateCurrentTime() {
    // Update the time display in the weather header
    const timeDisplay = document.querySelector('.time-display .current-time');
    if (timeDisplay) {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString(currentLang, {hour: '2-digit', minute:'2-digit'});
    }
    
    // Update the date display in MM/DD format
    const dateDisplay = document.querySelector('.time-display .current-date');
    if (dateDisplay) {
        const now = new Date();
        // Format as MM/DD
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        dateDisplay.textContent = `${month}/${day}`;
    }
}

// Update current time every minute
setInterval(updateCurrentTime, 60000);

function getForecastIconClass(code, desc) {
    // Use our standardization function first
    const wmoCode = standardizeWeatherCode(code, desc);
    
    // Then convert to appropriate icon class
    if (wmoCode === 0) return 'fa-solid fa-sun';              // Clear/sunny
    if (wmoCode === 1) return 'fa-solid fa-sun';              // Mainly clear
    if (wmoCode === 2) return 'fa-solid fa-cloud-sun';        // Partly cloudy
    if (wmoCode === 3) return 'fa-solid fa-cloud';            // Overcast/cloudy
    if (wmoCode === 45 || wmoCode === 48) return 'fa-solid fa-smog'; // Fog
    if (wmoCode >= 51 && wmoCode <= 65) return 'fa-solid fa-cloud-rain'; // Rain
    if (wmoCode >= 71 && wmoCode <= 77) return 'fa-solid fa-snowflake'; // Snow
    if (wmoCode >= 80 && wmoCode <= 82) return 'fa-solid fa-cloud-showers-heavy'; // Rain showers
    if (wmoCode >= 85 && wmoCode <= 86) return 'fa-solid fa-snowflake'; // Snow showers
    if (wmoCode >= 95) return 'fa-solid fa-bolt'; // Thunderstorm
    
    // Fallback to default
    return 'fa-solid fa-cloud';
} 

// Remove setCurrentWeatherCode function and replace with a simpler version
function setCurrentWeatherCode(code) {
    document.body.dataset.currentWeatherCode = code;
}

// Add this function to detect the Lunixo app
function isLunixoApp() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('lunixo') || 
           ua.includes('tv') || 
           ua.includes('tizen') || 
           ua.includes('webos') || 
           window.location.search.includes('lunixo');
}

// Function to detect Tizen TV
function isTizenTV() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('tizen') || ua.includes('samsung') || ua.includes('webos');
}

// Function to get Tizen TV model
function getTizenTVModel() {
    const ua = navigator.userAgent;
    const modelMatch = ua.match(/TIZEN[^)]+/i);
    return modelMatch ? modelMatch[0] : 'unknown';
}

// Function to get video ID for weather code
function getVideoIdForWeatherCode(code) {
    const videoMap = {
        0: 'clearsky_daytime',      // Clear sky
        1: 'clearsky_daytime',      // Mainly clear
        2: 'partly_cloudy_daytime', // Partly cloudy
        3: 'cloudy_daytime',        // Overcast
        45: 'cloudy_daytime',       // Foggy
        48: 'cloudy_daytime',       // Depositing rime fog
        51: 'rain_daytime',         // Light drizzle
        53: 'rain_daytime',         // Moderate drizzle
        55: 'rain_daytime',         // Dense drizzle
        61: 'rain_daytime',         // Slight rain
        63: 'rain_daytime',         // Moderate rain
        65: 'rain_daytime',         // Heavy rain
        71: 'snow_daytime_night',   // Slight snow
        73: 'snow_daytime_night',   // Moderate snow
        75: 'snow_daytime_night',   // Heavy snow
        77: 'snow_daytime_night',   // Snow grains
        80: 'rain_daytime',         // Slight rain showers
        81: 'rain_daytime',         // Moderate rain showers
        82: 'rain_daytime',         // Violent rain showers
        85: 'snow_daytime_night',   // Slight snow showers
        86: 'snow_daytime_night',   // Heavy snow showers
        95: 'rain_thunderstorm_night_day', // Thunderstorm
        96: 'rain_thunderstorm_night_day', // Thunderstorm with slight hail
        99: 'rain_thunderstorm_night_day'  // Thunderstorm with heavy hail
    };
    
    // Log the mapping for debugging
    console.log(`Weather code ${code} maps to video ID: ${videoMap[code] || 'none'}`);
    
    return videoMap[code] || 'clearsky_daytime'; // Default to clear sky if no mapping found
}

async function ensureVideoSource(video, videoId) {
    const source = video.querySelector('source');
    if (!source) {
        console.log(`No source element found for ${videoId}`);
        return false;
    }

    // Get the base video path
    const basePath = `components/decorations/${videoId}.mp4`;
    
    // Set performance-focused attributes
    video.setAttribute('preload', 'metadata');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;
    video.playbackRate = 0.75;
    
    // Set source with cache busting
    source.src = `${basePath}?t=${Date.now()}`;
    
    return new Promise((resolve) => {
        let loadTimeout;
        let hasStartedLoading = false;
        
        const cleanup = () => {
            clearTimeout(loadTimeout);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
        };
        
        const handleLoadedMetadata = () => {
            // Start loading the video data after metadata is loaded
            video.load();
        };
        
        const handleCanPlay = () => {
            cleanup();
            resolve(true);
        };
        
        const handleError = (e) => {
            console.error(`Error loading ${videoId}:`, e.target.error?.message || 'Unknown error');
            cleanup();
            resolve(false);
        };
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
        
        // Load metadata first
        video.load();
        
        // Timeout for metadata loading
        loadTimeout = setTimeout(() => {
            if (!hasStartedLoading) {
                console.log(`Timeout loading metadata for ${videoId}`);
                cleanup();
                resolve(false);
            }
        }, 5000);
    });
}

async function forceReloadVideo(video) {
    if (!video) {
        console.error('No video element provided');
        return false;
    }
    
    // Reset video state
    video.pause();
    video.currentTime = 0;
    video.style.display = 'none';
    
    // Ensure source is set
    const sourceOk = await ensureVideoSource(video, video.id);
    if (!sourceOk) {
        return false;
    }
    
    // Show video and play
    video.style.display = 'block';
    
    try {
        // Wait a short moment before playing
        await new Promise(resolve => setTimeout(resolve, 100));
        await video.play();
        return true;
    } catch (e) {
        console.error(`Failed to play ${video.id}:`, e);
        return false;
    }
}

// Modify setWeatherBackground to be simpler
async function setWeatherBackground(code) {
    // Get the video ID for this weather code
    const videoId = getVideoIdForWeatherCode(code);
    console.log(`Setting weather background for code ${code} -> video ${videoId}`);
    
    // If the current active video is already the correct one, do nothing
    if (currentActiveVideoId === videoId) {
        console.log(`Video ${videoId} is already active. Doing nothing.`);
        return;
    }

    // Hide and pause the previously active video, if any
    if (currentActiveVideoId) {
        const prevVideoElement = document.getElementById(currentActiveVideoId);
        if (prevVideoElement) {
            prevVideoElement.style.display = 'none';
            prevVideoElement.pause();
             // Reset currentTime when hiding/pausing
            prevVideoElement.currentTime = 0;
        }
    }

    // Update the tracking variable
    currentActiveVideoId = videoId;

    // Get and handle the active video
    const videoElement = document.getElementById(videoId);
    if (!videoElement) {
        console.error(`Video element not found: ${videoId}`);
        return;
    }

    try {
        // Show the video
        videoElement.style.display = 'block';
        
        // Get or create source element
        let source = videoElement.querySelector('source');
        if (!source) {
            source = document.createElement('source');
            videoElement.appendChild(source);
        }
        
        // Only set the source and load if it's a new video or source wasn't set
        const basePath = `components/decorations/${videoId}.mp4`;
        if (source.src !== `${window.location.origin}${basePath}?t=${Date.now()}`) { // Avoid unnecessary source updates
             source.src = `${basePath}?t=${Date.now()}`;
             videoElement.load(); // Load the new source
             console.log(`Loading new source for ${videoId}: ${source.src}`);
        }

        // Attempt to play the video
        await videoElement.play();
        console.log(`Attempting to play ${videoId}`);
    } catch (e) {
        console.error(`Failed to play ${videoId}:`, e);
        // You might want to add fallback logic here if play fails
    }
}

// Function to load and display ads
async function loadAds(adIdFromUrl = null) {
    try {
        const response = await fetch('/api/ads');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ads = await response.json();
        
        // Get ad id from URL
        const urlParams = new URLSearchParams(window.location.search);
        const adId = adIdFromUrl || urlParams.get('ad');
        let selectedAd = null;
        if (adId) {
            selectedAd = ads.find(ad => ad.id === adId);
        }
        if (!selectedAd && ads && ads.length > 0) {
            // Fallback to random ad
            selectedAd = ads[Math.floor(Math.random() * ads.length)];
        }
        const adBanner = document.getElementById('big-ad-banner');
        if (adBanner) {
            if (selectedAd) {
                adBanner.innerHTML = `
                    <div class="ad-content">
                        ${selectedAd.imageUrl ? `<a href="${selectedAd.link || '#'}" target="_blank"><img src="${selectedAd.imageUrl}" alt="Advertisement"></a>` : ''}
                    </div>
                `;
                adBanner.style.display = 'block';
                console.log('Ad banner displayed successfully');
            } else {
                adBanner.innerHTML = '';
                adBanner.style.display = 'none';
                console.log('No ads available to display');
            }
        } else {
            console.error('Ad banner element not found');
        }
    } catch (error) {
        console.error('Error loading ads:', error);
    }
}

// Initialize the app with optimized settings
document.addEventListener('DOMContentLoaded', () => {
    // Set extreme low performance for TV devices
    detectDevicePerformance();
    
    // Initialize video handling for TV compatibility
    initializeVideos();
    
    // Initialize a single Skycons instance for all icons
    initializeSkycons();
    
    // Initialize language and fetch weather data
    initializeLanguage();
    populateCityDropdown();
    fetchWeatherData();
    
    // Update time initially and start interval
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
    
    // Load ads, passing the initial ad ID from the URL
    loadAds(initialAdId);
});

// Add video error recovery to initialization
document.addEventListener('DOMContentLoaded', () => {
    // Set up global video error handler
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'VIDEO') {
            console.error('Video error:', e.target.id, e);
            const video = e.target;
            // Try to recover the video
            forceReloadVideo(video).catch(err => {
                console.error('Failed to recover video:', err);
            });
        }
    }, true);
    
    // Rest of initialization code...
});

// Modify initializeVideos to add performance optimizations
function initializeVideos() {
    console.log('Initializing videos with performance optimizations');
    
    const videos = document.querySelectorAll('.weather-video');
    
    videos.forEach(video => {
        // Performance-focused attributes
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata'; // Only load metadata initially
        video.playbackRate = 0.75; // Slightly slower playback for smoother performance
        
        // Hardware acceleration hints
        video.style.transform = 'translateZ(0)';
        video.style.backfaceVisibility = 'hidden';
        video.style.perspective = '1000px';
        
        // Hide initially
        video.style.display = 'none';
        
        // Add error handling
        video.addEventListener('error', (e) => {
            console.error(`Error with video ${video.id}:`, e);
        });
    });
}

// Modify ensureVideoSource for better performance
async function ensureVideoSource(video, videoId) {
    const source = video.querySelector('source');
    if (!source) {
        console.log(`No source element found for ${videoId}`);
        return false;
    }

    // Get the base video path
    const basePath = `components/decorations/${videoId}.mp4`;
    
    // Set performance-focused attributes
    video.setAttribute('preload', 'metadata');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.muted = true;
    video.playbackRate = 0.75;
    
    // Set source with cache busting
    source.src = `${basePath}?t=${Date.now()}`;
    
    return new Promise((resolve) => {
        let loadTimeout;
        let hasStartedLoading = false;
        
        const cleanup = () => {
            clearTimeout(loadTimeout);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('error', handleError);
        };
        
        const handleLoadedMetadata = () => {
            // Start loading the video data after metadata is loaded
            video.load();
        };
        
        const handleCanPlay = () => {
            cleanup();
            resolve(true);
        };
        
        const handleError = (e) => {
            console.error(`Error loading ${videoId}:`, e.target.error?.message || 'Unknown error');
            cleanup();
            resolve(false);
        };
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
        
        // Load metadata first
        video.load();
        
        // Timeout for metadata loading
        loadTimeout = setTimeout(() => {
            if (!hasStartedLoading) {
                console.log(`Timeout loading metadata for ${videoId}`);
                cleanup();
                resolve(false);
            }
        }, 5000);
    });
}

// Modify forceReloadVideo for smoother playback
async function forceReloadVideo(video) {
    if (!video) {
        console.error('No video element provided');
        return false;
    }
    
    // Reset video state
    video.pause();
    video.currentTime = 0;
    video.style.display = 'none';
    
    // Ensure source is set
    const sourceOk = await ensureVideoSource(video, video.id);
    if (!sourceOk) {
        return false;
    }
    
    // Show video and play
    video.style.display = 'block';
    
    try {
        // Wait a short moment before playing
        await new Promise(resolve => setTimeout(resolve, 100));
        await video.play();
        return true;
    } catch (e) {
        console.error(`Failed to play ${video.id}:`, e);
        return false;
    }
}

// Enhanced helper function to safely get a translation string, supporting dot notation for nested keys
function t(key) {
    if (!TRANSLATIONS) return key;
    const keys = key.split('.');
    let value = TRANSLATIONS;
    for (let k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            value = undefined;
            break;
        }
    }
    if (typeof value === 'string') return value;
    // fallback to English if available
    if (window.FALLBACK_TRANSLATIONS && window.FALLBACK_TRANSLATIONS[key]) return window.FALLBACK_TRANSLATIONS[key];
    return key;
}

// Keep track of the currently active video ID
let currentActiveVideoId = null;