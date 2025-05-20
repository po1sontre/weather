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
        districtForecast: 'District Forecast',
        selectCity: 'Select a city',
        unknown: 'Unknown',
        unknownDistrict: 'Unknown District',
        temperature: 'Temperature',
        forecast: 'Forecast',
        weatherDetails: 'Weather Details',
        currentWeather: 'Current Weather',
        invalidData: 'Invalid station data',
        yourAdHere: 'Your Ad Here',
        yourBigAdHere: 'SOUTH TYROL WEATHER - ADVERTISEMENT SPACE AVAILABLE',
        kmh: 'km/h',
        day: 'Day',
        night: 'Night',
        min: 'Min',
        max: 'Max',
        weatherApp: 'Weather App',
        direction: 'Direction',
        pressure: 'Pressure',
        hPa: 'hPa',
        visibility: 'Visibility',
        km: 'km',
        precipitation: 'Precipitation',
        mm: 'mm',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
        forecastNote: 'Note: This forecast covers the entire district, not just'
    },
    de: {
        feelsLike: 'Gefühlt',
        wind: 'Wind',
        humidity: 'Luftfeuchtigkeit',
        rainChance: 'Regenwahrscheinlichkeit',
        today: 'Heute',
        high: 'Höchstwert',
        low: 'Tiefstwert',
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        uvIndex: 'UV-Index',
        nextDays: 'Nächste 3 Tage',
        snowline: 'Schneegrenze',
        airQuality: 'Luftqualität',
        moonPhase: 'Mondphase',
        loading: 'Wetterdaten werden geladen...',
        error: 'Fehler beim Laden der Wetterdaten. Bitte versuchen Sie es später erneut.',
        districtForecast: 'Bezirksvorhersage',
        selectCity: 'Stadt auswählen',
        unknown: 'Unbekannt',
        unknownDistrict: 'Unbekannter Bezirk',
        temperature: 'Temperatur',
        forecast: 'Vorhersage',
        weatherDetails: 'Wetterdetails',
        currentWeather: 'Aktuelles Wetter',
        invalidData: 'Ungültige Stationsdaten',
        yourAdHere: 'Ihre Werbung Hier',
        yourBigAdHere: 'SÜDTIROL WETTER - WERBEFLÄCHE VERFÜGBAR',
        kmh: 'km/h',
        day: 'Tag',
        night: 'Nacht',
        min: 'Min',
        max: 'Max',
        weatherApp: 'Wetter App',
        direction: 'Richtung',
        pressure: 'Luftdruck',
        hPa: 'hPa',
        visibility: 'Sichtweite',
        km: 'km',
        precipitation: 'Niederschlag',
        mm: 'mm',
        monday: 'Montag',
        tuesday: 'Dienstag',
        wednesday: 'Mittwoch',
        thursday: 'Donnerstag',
        friday: 'Freitag',
        saturday: 'Samstag',
        sunday: 'Sonntag',
        january: 'Januar',
        february: 'Februar',
        march: 'März',
        april: 'April',
        may: 'Mai',
        june: 'Juni',
        july: 'Juli',
        august: 'August',
        september: 'September',
        october: 'Oktober',
        november: 'November',
        december: 'Dezember',
        forecastNote: 'Hinweis: Diese Vorhersage gilt für den gesamten Bezirk, nicht nur für'
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
        districtForecast: 'Previsione del distretto',
        selectCity: 'Seleziona una città',
        unknown: 'Sconosciuto',
        unknownDistrict: 'Distretto sconosciuto',
        temperature: 'Temperatura',
        forecast: 'Previsione',
        weatherDetails: 'Dettagli meteo',
        currentWeather: 'Meteo attuale',
        invalidData: 'Dati della stazione non validi',
        yourAdHere: 'Il tuo annuncio qui',
        yourBigAdHere: 'METEO ALTO ADIGE - SPAZIO PUBBLICITARIO DISPONIBILE',
        kmh: 'km/h',
        day: 'Giorno',
        night: 'Notte',
        min: 'Min',
        max: 'Max',
        weatherApp: 'App Meteo',
        direction: 'Direzione',
        pressure: 'Pressione',
        hPa: 'hPa',
        visibility: 'Visibilità',
        km: 'km',
        precipitation: 'Precipitazioni',
        mm: 'mm',
        monday: 'Lunedì',
        tuesday: 'Martedì',
        wednesday: 'Mercoledì',
        thursday: 'Giovedì',
        friday: 'Venerdì',
        saturday: 'Sabato',
        sunday: 'Domenica',
        january: 'Gennaio',
        february: 'Febbraio',
        march: 'Marzo',
        april: 'Aprile',
        may: 'Maggio',
        june: 'Giugno',
        july: 'Luglio',
        august: 'Agosto',
        september: 'Settembre',
        october: 'Ottobre',
        november: 'Novembre',
        december: 'Dicembre',
        forecastNote: 'Nota: Questa previsione copre l\'intero distretto, non solo'
    }
};

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

// Initialize language from URL parameter or use default
function initializeLanguage() {
    const langParam = getUrlParameter('lang');
    if (langParam && ['en', 'de', 'it'].includes(langParam)) {
        currentLang = langParam;
        document.documentElement.lang = langParam;
    }
    
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
    document.getElementById('page-title').textContent = TRANSLATIONS[currentLang].weatherApp;
    
    // Only update ad banner if it's empty
    const bigAdBanner = document.getElementById('big-ad-banner');
    if (bigAdBanner && !bigAdBanner.innerHTML.trim()) {
        bigAdBanner.textContent = TRANSLATIONS[currentLang].yourBigAdHere;
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
        const response = await fetch(`https://api-weather.services.siag.it/api/v2/district/${districtId}/bulletin`);
        const data = await response.json();
        return data.district?.name || TRANSLATIONS[currentLang].unknownDistrict;
    } catch (error) {
        console.error('Error getting district name:', error);
        return TRANSLATIONS[currentLang].unknownDistrict;
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
function changeLanguage(lang) {
    if (!['en', 'de', 'it'].includes(lang)) {
        return;
    }
    
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update URL with the new language
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);
    
    // Update UI elements with new translations
    updatePageTranslations();
    
    // Update weather data with new language
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
    // Convert SIAG codes or descriptions to standardized WMO codes
    if (typeof code === 'string') {
        // Handle SIAG letter codes
        if (code === 'b') return 0;  // clear/sunny
        if (code === 'c') return 2;  // partly cloudy
        if (code === 'd') return 3;  // overcast/cloudy
        if (code === 'f') return 61; // rain
        if (code === 'g') return 71; // snow
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
    
    // Default to partly cloudy if we can't determine
    return 2;
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
                    ${cityName} • ${TRANSLATIONS[currentLang].districtForecast}
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
            citySelect.innerHTML = `<option value="">${TRANSLATIONS[currentLang].selectCity}</option>`;
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
    if (locElem) locElem.textContent = cleanStationName(station.name);

    // Temperature
    const tempElem = document.querySelector('.temperature');
    if (tempElem) tempElem.textContent = `${temperature}°C`;

    // Determine weather condition and set weather icon
    let weatherInfo = "";
    if (station.description) {
        weatherInfo = station.description;
    }
    
    // Get weather code using standardization function
    let weatherCode;
    if (station.weatherCode !== undefined) {
        weatherCode = standardizeWeatherCode(station.weatherCode, weatherInfo);
    } else {
        // If no weather code, determine from station data
        const temp = safeParseFloat(station.t);
        
        // Parse humidity, handling potential string values
        let humidity = station.rh;
        if (typeof humidity === 'string') {
            humidity = humidity.replace(',', '.');
        }
        humidity = parseFloat(humidity);
        
        // Check if we have precipitation data
        const hasPrecipitation = station.precipitationSum !== undefined && station.precipitationSum > 0;
        
        // Get current time to check if it's night
        const now = new Date();
        const hour = now.getHours();
        const isNight = hour < 6 || hour >= 19;
        
        // Enhanced weather code determination based on multiple conditions
        if (hasPrecipitation) {
            if (temp < 2) {
                // Precipitation when cold - likely snow
                weatherCode = 71; // Light snow
            } else {
                // Precipitation when warmer - rain
                weatherCode = 61; // Light rain
            }
        } else if (temp < 0) {
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
        } else if (humidity > 70) {
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
        
        console.log(`Determined weather from conditions: temp=${temp}°C, humidity=${humidity}%, precipitation=${hasPrecipitation}, night=${isNight}`);
    }
    
    console.log(`Determined weather code: ${weatherCode}`);
    setWeatherIcon(weatherCode);

    // Humidity
    const humidityElem = document.querySelector('.humidity');
    if (humidityElem) {
        if (station.rh) {
            let humidity = station.rh;
            if (typeof humidity === 'string') {
                humidity = humidity.replace(',', '.');
            }
            humidityElem.textContent = `${TRANSLATIONS[currentLang].humidity}: ${Math.round(parseFloat(humidity))}%`;
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
            const windText = `${TRANSLATIONS[currentLang].wind}: ${Math.round(parseFloat(windSpeed))} ${TRANSLATIONS[currentLang].kmh} ${station.dd || ''}`;
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

// Auto-refresh every 15 minutes
setInterval(fetchWeatherData, 15 * 60 * 1000);

function updateCurrentTime() {
    // Update the top right time (if present)
    const topRightTime = document.querySelector('.top-right-time .current-time');
    if (topRightTime) {
        const now = new Date();
        topRightTime.textContent = now.toLocaleTimeString(currentLang, {hour: '2-digit', minute:'2-digit'});
    }
    
    // Update the date display in MM/DD format
    const dateDisplay = document.querySelector('.top-right-time .current-date');
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
    
    // Hide all videos first
    document.querySelectorAll('.weather-video').forEach(video => {
        video.style.display = 'none';
        video.pause();
    });

    // Get and handle the active video
    const videoElement = document.getElementById(videoId);
    if (videoElement) {
        videoElement.style.display = 'block';
        await forceReloadVideo(videoElement);
    }
}

// Function to load and display ads
async function loadAds() {
    try {
        const response = await fetch('/api/ads');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ads = await response.json();
        
        if (ads && ads.length > 0) {
            // Randomly select an ad to display
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            const adBanner = document.getElementById('big-ad-banner');
            
            if (adBanner) {
                adBanner.innerHTML = `
                    <div class="ad-content">
                        ${randomAd.imageUrl ? `<a href="${randomAd.link || '#'}" target="_blank"><img src="${randomAd.imageUrl}" alt="Advertisement"></a>` : ''}
                    </div>
                `;
                
                // Show the ad banner
                adBanner.style.display = 'block';
                console.log('Ad banner displayed successfully');
            } else {
                console.error('Ad banner element not found');
            }
        } else {
            console.log('No ads available to display');
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
    
    // Load ads
    loadAds();
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

// Modify initializeVideos to add better performance optimizations
function initializeVideos() {
    console.log('Initializing videos with performance optimizations');
    
    const videos = document.querySelectorAll('.weather-video');
    
    videos.forEach(video => {
        // Performance-focused attributes
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.playbackRate = 0.75;
        
        // Hardware acceleration hints
        video.style.transform = 'translateZ(0)';
        video.style.backfaceVisibility = 'hidden';
        video.style.perspective = '1000px';
        
        // Hide initially
        video.style.display = 'none';
        
        // Add smooth looping handler
        video.addEventListener('timeupdate', () => {
            // When video is near the end (last 0.5 seconds), prepare for smooth loop
            if (video.duration - video.currentTime < 0.5) {
                // For weak devices, reduce quality during transition
                if (devicePerformanceScore <= 2) {
                    video.playbackRate = 0.5;
                }
            } else if (video.playbackRate !== 0.75) {
                // Reset playback rate after transition
                video.playbackRate = 0.75;
            }
        });

        // Handle loop event for smoother transition
        video.addEventListener('ended', () => {
            if (devicePerformanceScore <= 2) {
                // For weak devices, use a small delay before restarting
                setTimeout(() => {
                    video.currentTime = 0;
                    video.play().catch(console.error);
                }, 50);
            } else {
                // For better devices, restart immediately
                video.currentTime = 0;
                video.play().catch(console.error);
            }
        });

        // Add error handling
        video.addEventListener('error', (e) => {
            console.error(`Error with video ${video.id}:`, e);
        });
    });
}

// Modify forceReloadVideo for smoother playback and better looping
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
        // For weak devices, add a small delay before playing
        if (devicePerformanceScore <= 2) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Start playback
        await video.play();
        
        // For weak devices, implement pre-buffering
        if (devicePerformanceScore <= 2) {
            // When video is playing, start pre-buffering the next loop
            video.addEventListener('timeupdate', function preBuffer() {
                if (video.currentTime > video.duration * 0.7) { // When 70% through
                    // Create a new video element for pre-buffering
                    const preBufferVideo = document.createElement('video');
                    preBufferVideo.style.display = 'none';
                    preBufferVideo.muted = true;
                    preBufferVideo.src = video.src;
                    preBufferVideo.load();
                    
                    // Remove the listener after pre-buffering starts
                    video.removeEventListener('timeupdate', preBuffer);
                }
            });
        }
        
        return true;
    } catch (e) {
        console.error(`Failed to play ${video.id}:`, e);
        return false;
    }
}

// Modify setWeatherBackground for better performance
async function setWeatherBackground(code) {
    // Get the video ID for this weather code
    const videoId = getVideoIdForWeatherCode(code);
    console.log(`Setting weather background for code ${code} -> video ${videoId}`);
    
    // Hide all videos first with a fade effect for smoother transition
    const allVideos = document.querySelectorAll('.weather-video');
    allVideos.forEach(video => {
        if (video.style.display !== 'none') {
            // Add fade out effect
            video.style.opacity = '0';
            setTimeout(() => {
                video.style.display = 'none';
                video.pause();
                video.style.opacity = '1';
            }, 300);
        } else {
            video.pause();
        }
    });

    // Get and handle the active video
    const videoElement = document.getElementById(videoId);
    if (!videoElement) {
        console.error(`Video element not found: ${videoId}`);
        return;
    }

    try {
        // Show the video with fade in effect
        videoElement.style.display = 'block';
        videoElement.style.opacity = '0';
        
        // Get or create source element
        let source = videoElement.querySelector('source');
        if (!source) {
            source = document.createElement('source');
            videoElement.appendChild(source);
        }
        
        // Set the source with cache busting
        const basePath = `components/decorations/${videoId}.mp4`;
        source.src = `${basePath}?t=${Date.now()}`;
        
        // For weak devices, use lower quality settings
        if (devicePerformanceScore <= 2) {
            videoElement.playbackRate = 0.5;
            // Reduce video quality if possible
            if (videoElement.videoWidth > 720) {
                videoElement.style.width = '100%';
                videoElement.style.height = 'auto';
            }
        }
        
        // Load and play with fade in
        videoElement.load();
        await videoElement.play();
        
        // Fade in the video
        requestAnimationFrame(() => {
            videoElement.style.transition = 'opacity 0.3s ease-in-out';
            videoElement.style.opacity = '1';
        });
        
        console.log(`Successfully playing ${videoId}`);
    } catch (e) {
        console.error(`Failed to play ${videoId}:`, e);
    }
}