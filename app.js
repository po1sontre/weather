// Location coordinates mapping
const LOCATIONS = {
    'bolzano': { lat: 46.4983, lon: 11.3548, name: 'Bolzano' },
    'merano': { lat: 46.6702, lon: 11.1607, name: 'Merano' },
    'bressanone': { lat: 46.7151, lon: 11.6570, name: 'Bressanone' },
    'brunico': { lat: 46.7972, lon: 11.9383, name: 'Brunico' }
};

// Translations
const TRANSLATIONS = {
    en: {
        feelsLike: 'Feels like',
        wind: 'Wind',
        humidity: 'Humidity',
        rainChance: 'Rain chance',
        today: 'Today',
        high: 'High',
        low: 'Low',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        uvIndex: 'UV Index',
        nextDays: 'Next 3 Days',
        snowline: 'Snowline',
        airQuality: 'Air Quality',
        moonPhase: 'Moon Phase',
        loading: 'Loading weather data...',
        error: 'Error fetching weather data. Please try again later.',
        districtForecast: 'District Forecast'
    },
    de: {
        feelsLike: 'Gefühlt',
        wind: 'Wind',
        humidity: 'Luftfeuchtigkeit',
        rainChance: 'Regenwahrscheinlichkeit',
        today: 'Heute',
        high: 'Hoch',
        low: 'Tief',
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        uvIndex: 'UV-Index',
        nextDays: 'Nächste 3 Tage',
        snowline: 'Schneegrenze',
        airQuality: 'Luftqualität',
        moonPhase: 'Mondphase',
        loading: 'Wetterdaten werden geladen...',
        error: 'Fehler beim Laden der Wetterdaten. Bitte versuchen Sie es später erneut.',
        districtForecast: 'Bezirksvorhersage'
    },
    it: {
        feelsLike: 'Percepita',
        wind: 'Vento',
        humidity: 'Umidità',
        rainChance: 'Probabilità di pioggia',
        today: 'Oggi',
        high: 'Massima',
        low: 'Minima',
        sunrise: 'Alba',
        sunset: 'Tramonto',
        uvIndex: 'Indice UV',
        nextDays: 'Prossimi 3 giorni',
        snowline: 'Limite neve',
        airQuality: 'Qualità dell\'aria',
        moonPhase: 'Fase lunare',
        loading: 'Caricamento dati meteo...',
        error: 'Errore nel recupero dei dati meteo. Riprova più tardi.',
        districtForecast: 'Previsione del distretto'
    }
};

// Current language
let currentLang = 'en';

// Function to get district ID for a city
async function getDistrictIdForCity(cityName) {
    try {
        // First, get all districts
        const districtsRes = await fetch('https://api-weather.services.siag.it/api/v2/district');
        const districtsData = await districtsRes.json();
        
        // Then, get all stations to map cities to districts
        const stationsRes = await fetch('https://api-weather.services.siag.it/api/v2/station/');
        const stationsData = await stationsRes.json();
        
        // Find the station that matches our city name
        const normalizedCityName = cityName.toLowerCase().trim();
        const matchingStation = stationsData.rows.find(station => 
            station.name.toLowerCase().includes(normalizedCityName)
        );
        
        if (matchingStation) {
            // Find the district that contains this station's coordinates
            const stationLat = matchingStation.latitude;
            const stationLon = matchingStation.longitude;
            
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
        const response = await fetch(`https://api-weather.services.siag.it/api/v2/district/${districtId}/bulletin`);
        const data = await response.json();
        return data.district?.name || 'Unknown District';
    } catch (error) {
        console.error('Error getting district name:', error);
        return 'Unknown District';
    }
}

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
function changeLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
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
    document.querySelector('.location').textContent = shortLocationName;
    
    // Update current weather
    document.querySelector('.temperature').textContent = `${Math.round(weatherData.current_weather.temperature)}°C`;
    document.querySelector('.feels-like').textContent = 
        `${TRANSLATIONS[currentLang].feelsLike}: ${Math.round(weatherData.current_weather.temperature)}°C`;
    
    const weatherIcon = document.querySelector('.weather-icon');
    weatherIcon.className = `weather-icon ${getWeatherIcon(weatherData.current_weather.weathercode)}`;
    
    document.querySelector('.description').textContent = 
        getWeatherDescription(weatherData.current_weather.weathercode, currentLang);
    
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

// Main function to fetch and process weather data
async function fetchWeatherData() {
    try {
        // Get language from URL or default
        const langParam = getUrlParameter('lang')?.toLowerCase();
        const lang = ['de', 'it', 'en'].includes(langParam) ? langParam : 'de';
        currentLang = lang;
        document.documentElement.lang = lang;
        
        // Highlight active language button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
        });

        // Check for station or city in URL
        const stationParam = getUrlParameter('station');
        const cityParam = getUrlParameter('city');
        const latParam = getUrlParameter('lat');
        const lngParam = getUrlParameter('lng');
        let foundStation = null;
        let districtId = 1; // Default to Bolzano district

        if (stationParam || cityParam) {
            // Fetch stations list
            const stationsRes = await fetch('https://api-weather.services.siag.it/api/v2/station/');
            const stationsData = await stationsRes.json();
            if (stationParam) {
                foundStation = stationsData.rows.find(s => s.code.toLowerCase() === stationParam.toLowerCase());
            } else if (cityParam) {
                foundStation = stationsData.rows.find(s => s.name.toLowerCase() === cityParam.toLowerCase());
                // Get district ID for the city
                districtId = await getDistrictIdForCity(cityParam);
            }
            if (foundStation) {
                displayStationWeather(foundStation);
            }
        } else if (latParam && lngParam) {
            // Fetch nearest station by lat/lng
            const stationsRes = await fetch(`https://api-weather.services.siag.it/api/v2/station?longitude=${lngParam}&latitude=${latParam}&numStations=1&visibility=1`);
            const stationsData = await stationsRes.json();
            if (stationsData.rows && stationsData.rows.length > 0) {
                foundStation = stationsData.rows[0];
                displayStationWeather(foundStation);
            }
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
            districtInfo.textContent = `${TRANSLATIONS[currentLang].districtForecast}: ${districtName}`;
        }

        const forecastRes = await fetch(`https://api-weather.services.siag.it/api/v2/district/${districtId}/bulletin?format=json&lang=${lang}`);
        const forecastData = await forecastRes.json();
        
        if (forecastData.forecasts && forecastElem) {
            for (let i = 0; i < forecastData.forecasts.length; i++) {
                const day = forecastData.forecasts[i];
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString(lang, { weekday: 'short' });
                const code = day.symbol?.code;
                const desc = day.symbol?.description || '';
                const tempMax = day.temperatureMax;
                const tempMin = day.temperatureMin;
                const iconClass = getForecastIconClass(code, desc);
                const dayDiv = document.createElement('div');
                dayDiv.className = 'forecast-day';
                dayDiv.innerHTML = `
                    <div class="day-name">${dayName}</div>
                    <i class="forecast-icon ${iconClass}"></i>
                    <div class="forecast-temp">${tempMin !== undefined ? Math.round(tempMin) + '°' : ''} / ${tempMax !== undefined ? Math.round(tempMax) + '°' : ''}</div>
                    <div class="forecast-desc">${desc}</div>
                `;
                forecastElem.appendChild(dayDiv);
            }
        }
        // If no city/station/lat-lng, show nothing or a message
        if (!foundStation && !latParam && !lngParam) {
            const locElem = document.querySelector('.location');
            if (locElem) locElem.textContent = '';
            const tempElem = document.querySelector('.temperature');
            if (tempElem) tempElem.textContent = '';
            const humidityElem = document.querySelector('.humidity');
            if (humidityElem) humidityElem.textContent = '';
            const windElem = document.querySelector('.wind');
            if (windElem) windElem.textContent = '';
            if (forecastElem) forecastElem.innerHTML = '';
            updateCurrentTime();
        }
    } catch (error) {
        displayError(TRANSLATIONS[currentLang]?.error || 'Error fetching weather data. Please try again later.');
        console.error('Error:', error);
    }
}

// Function to check if a station has valid weather data
function isValidStation(station) {
    return station && 
           station.name && 
           station.t !== undefined && 
           station.rh !== undefined && 
           station.ff !== undefined;
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
        const stationsRes = await fetch('https://api-weather.services.siag.it/api/v2/station/');
        const stationsData = await stationsRes.json();
        
        // Filter and sort stations
        const validStations = stationsData.rows
            .filter(isValidStation)
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

        // Update the dropdown
        const citySelect = document.getElementById('city-select');
        if (citySelect) {
            citySelect.innerHTML = '<option value="">Select a city</option>';
            uniqueStations.forEach(station => {
                const option = document.createElement('option');
                option.value = station.cleanName;
                option.textContent = station.cleanName;
                citySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error populating city dropdown:', error);
    }
}

// Update the displayStationWeather function to handle missing data
function displayStationWeather(station) {
    if (!isValidStation(station)) {
        displayError(TRANSLATIONS[currentLang]?.error || 'Invalid station data');
        return;
    }

    // Location
    const locElem = document.querySelector('.location');
    if (locElem) locElem.textContent = cleanStationName(station.name);

    // Temperature
    const tempElem = document.querySelector('.temperature');
    if (tempElem) tempElem.textContent = `${Math.round(station.t)}°C`;

    // Humidity
    const humidityElem = document.querySelector('.humidity');
    if (humidityElem) humidityElem.textContent = station.rh ? `Humidity: ${Math.round(station.rh)}%` : '';

    // Wind
    const windElem = document.querySelector('.wind');
    if (windElem) {
        const windText = station.ff ? 
            `Wind: ${Math.round(station.ff)} km/h ${station.dd || ''}` : 
            '';
        windElem.textContent = windText;
    }

    // Summary/description
    const summaryElem = document.querySelector('.summary');
    if (summaryElem) summaryElem.textContent = '';

    updateCurrentTime();
}

// Call populateCityDropdown when the page loads
document.addEventListener('DOMContentLoaded', () => {
    populateCityDropdown();
    fetchWeatherData();
});

// Auto-refresh every 15 minutes
setInterval(fetchWeatherData, 15 * 60 * 1000);

function updateCurrentTime() {
    const timeElem = document.querySelector('.current-time');
    if (timeElem) {
        const now = new Date();
        timeElem.textContent = `Current time: ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    }
}

// Update current time every minute
setInterval(updateCurrentTime, 60000);

function getForecastIconClass(code, desc) {
    // Map SIAG code or description to Font Awesome icon class
    // Codes: b=Heiter, c=Wolkig, d=Bedeckt, f=Wolkig, mäßiger Regen, etc.
    if (code === 'b' || /heiter/i.test(desc)) return 'fa-solid fa-sun';
    if (code === 'c' || /wolkig/i.test(desc)) return 'fa-solid fa-cloud-sun';
    if (code === 'd' || /bedeckt/i.test(desc)) return 'fa-solid fa-cloud';
    if (code === 'f' || /regen/i.test(desc)) return 'fa-solid fa-cloud-showers-heavy';
    if (/schnee|snow/i.test(desc)) return 'fa-solid fa-snowflake';
    if (/gewitter|thunder/i.test(desc)) return 'fa-solid fa-bolt';
    return 'fa-solid fa-question';
} 


