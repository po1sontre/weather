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
        yourBigAdHere: 'Your Big Ad Here',
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
        december: 'December'
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
        yourBigAdHere: 'Ihre Große Werbung Hier',
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
        december: 'Dezember'
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
        yourBigAdHere: 'Il tuo grande annuncio qui',
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
        december: 'Dicembre'
    }
};

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
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
    
    // Update ad banners
    const adBanner = document.getElementById('ad-banner');
    if (adBanner) adBanner.textContent = TRANSLATIONS[currentLang].yourAdHere;
    
    const bigAdBanner = document.getElementById('big-ad-banner');
    if (bigAdBanner) bigAdBanner.textContent = TRANSLATIONS[currentLang].yourBigAdHere;
}

// Current language - will be updated by initializeLanguage()
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
            // First remove any existing forecast icons to prevent duplicates
            for (let i = 0; i < 7; i++) {
                const iconId = `forecast-icon-${i}`;
                Object.values(skycons).forEach(skycon => {
                    skycon.remove(iconId);
                });
            }
            
            for (let i = 0; i < forecastData.forecasts.length; i++) {
                const day = forecastData.forecasts[i];
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString(lang, { weekday: 'short' });
                const code = day.symbol?.code;
                const desc = day.symbol?.description || '';
                const tempMax = day.temperatureMax;
                const tempMin = day.temperatureMin;
                const iconId = `forecast-icon-${i}`;
                
                // Create forecast day element
                const dayDiv = document.createElement('div');
                dayDiv.className = 'forecast-day';
                dayDiv.innerHTML = `
                    <div class="day-name">${dayName}</div>
                    <div class="forecast-icon">
                        <canvas id="${iconId}" width="64" height="64"></canvas>
                    </div>
                    <div class="forecast-temp">${tempMin !== undefined ? Math.round(tempMin) + '°' : ''} / ${tempMax !== undefined ? Math.round(tempMax) + '°' : ''}</div>
                    <div class="forecast-desc">${desc}</div>
                `;
                forecastElem.appendChild(dayDiv);
                
                // Set the weather icon using the standardized code
                const wmoCode = standardizeWeatherCode(code, desc);
                
                console.log(`Forecast day ${i}: ${dayName}, code: ${code} → ${wmoCode}, desc: ${desc}`);
                
                // Use setTimeout to ensure the canvas element is properly rendered before adding the icon
                setTimeout(() => {
                    const iconElement = document.getElementById(iconId);
                    if (iconElement) {
                        const { type, color } = getSkyconTypeAndColor(wmoCode);
                        // Add icon with appropriate color
                        skycons[color].add(iconId, type);
                        skycons[color].play(); // Ensure animation is running
                        console.log(`Added forecast icon ${iconId} with type ${type} and color ${color}`);
                    } else {
                        console.error(`Could not find element with ID: ${iconId}`);
                    }
                }, 100);
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

        // Update ad text with current language
        updatePageTranslations();
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

// Performance detection variables
let isLowEndDevice = true; // Changed to true as default
let devicePerformanceScore = 3; // Default to low performance (3 out of 10)

// Function to detect device performance
function detectDevicePerformance() {
    // Check URL parameter first - this allows forcing high performance mode
    const performanceParam = getUrlParameter('performance');
    if (performanceParam === 'high') {
        console.log("High performance mode forced by URL parameter");
        isLowEndDevice = false;
        devicePerformanceScore = 10;
        return; // Skip other detection methods
    }
    
    // Default is now low performance, so we'll only change if specifically
    // detecting a high-performance device AND no 'low' parameter is set
    if (performanceParam === 'low') {
        // Keep default low performance
        console.log("Low performance mode forced by URL parameter");
        return;
    }
    
    // The rest of the function is now only to detect if we should use high performance
    // instead of the default low performance mode
    
    // Start with default low score
    let detectedScore = 3;
    let shouldUseHighPerformance = false;
    
    // Check for TV devices - always use low performance
    if (navigator.userAgent.toLowerCase().includes('tv') || 
        navigator.userAgent.toLowerCase().includes('smart-tv') || 
        navigator.userAgent.toLowerCase().includes('tizen')) {
        console.log("TV device detected");
        return; // Keep default low performance
    }
    
    // Check for desktop devices with good specs
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("Desktop device detected");
        detectedScore = 8; // Assume decent performance for desktops
        shouldUseHighPerformance = true;
    }
    
    // Check for maximum memory (available in some browsers)
    if (navigator.deviceMemory) {
        console.log("Device memory:", navigator.deviceMemory, "GB");
        if (navigator.deviceMemory >= 4) {
            detectedScore = Math.max(detectedScore, 8);
            shouldUseHighPerformance = true;
        } else if (navigator.deviceMemory >= 2) {
            detectedScore = Math.max(detectedScore, 6);
            shouldUseHighPerformance = true;
        }
    }

    // Check for logical CPU cores (available in some browsers)
    if (navigator.hardwareConcurrency) {
        console.log("CPU cores:", navigator.hardwareConcurrency);
        if (navigator.hardwareConcurrency >= 8) {
            detectedScore = Math.max(detectedScore, 9);
            shouldUseHighPerformance = true;
        } else if (navigator.hardwareConcurrency >= 4) {
            detectedScore = Math.max(detectedScore, 7);
            shouldUseHighPerformance = true;
        }
    }
    
    // Run a simple performance test - how long it takes to do some basic calculations
    const startTime = performance.now();
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
        sum += Math.sqrt(i);
    }
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log("Performance test duration:", duration, "ms");
    
    // Adjust based on performance test
    if (duration < 50) {
        detectedScore = Math.max(detectedScore, 9);
        shouldUseHighPerformance = true;
    } else if (duration < 100) {
        detectedScore = Math.max(detectedScore, 7);
        shouldUseHighPerformance = true;
    }
    
    // Only switch to high performance if we're confident this is a high-end device
    if (shouldUseHighPerformance && detectedScore >= 7) {
        isLowEndDevice = false;
        devicePerformanceScore = detectedScore;
        console.log("High performance mode activated based on device detection");
    } else {
        console.log("Keeping default low performance mode");
    }
}

// Replace the setupPerformanceToggle function with a no-op since we're not using the toggle anymore
function setupPerformanceToggle() {
    // No-op: We removed the toggle button and now control performance only via URL parameter
    console.log("Performance mode is set to:", isLowEndDevice ? "LOW" : "HIGH");
}

// Set current weather code in body dataset for re-application when toggling performance mode
function setCurrentWeatherCode(code) {
    document.body.dataset.currentWeatherCode = code;
}

// Function to set the skycon based on weather code
function setWeatherIcon(code) {
    console.log(`Setting weather icon for code: ${code}`);
    
    // Ensure code is a number and has a valid mapping
    const numericCode = parseInt(code, 10) || 2; // Default to partly cloudy (2) if parsing fails
    const { type, color } = getSkyconTypeAndColor(numericCode);
    
    console.log(`Using icon type: ${type} with color: ${color}`);
    
    // Clear any existing icon before setting new one
    Object.values(skycons).forEach(skycon => {
        skycon.remove("current-icon");
    });
    
    // Add the icon with appropriate color
    skycons[color].add("current-icon", type);
    skycons[color].play(); // Ensure animation is running
    
    // Store the weather code for performance mode toggling
    setCurrentWeatherCode(numericCode);
    
    // Apply atmospheric effect based on weather code
    setWeatherAtmosphere(numericCode);
}

// Initialize Skycons when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Run device performance detection
    detectDevicePerformance();
    
    // Initialize different colored skycons
    skycons = {
        sun: new Skycons({ "color": ICON_COLORS.sun, "resizeClear": true }),
        cloud: new Skycons({ "color": ICON_COLORS.cloud, "resizeClear": true }),
        rain: new Skycons({ "color": ICON_COLORS.rain, "resizeClear": true }),
        snow: new Skycons({ "color": ICON_COLORS.snow, "resizeClear": true }),
        fog: new Skycons({ "color": ICON_COLORS.fog, "resizeClear": true }),
        thunder: new Skycons({ "color": ICON_COLORS.thunder, "resizeClear": true }),
        default: new Skycons({ "color": ICON_COLORS.default, "resizeClear": true })
    };
    
    // Start all animations
    Object.values(skycons).forEach(skycon => {
        skycon.play();
    });
    
    console.log("Skycons initialized with natural colors");
    
    initializeLanguage();
    populateCityDropdown();
    fetchWeatherData();
});

// Function to map weather codes to Skycons types and colors
function getSkyconTypeAndColor(code) {
    // Skycons types: CLEAR_DAY, CLEAR_NIGHT, PARTLY_CLOUDY_DAY, PARTLY_CLOUDY_NIGHT, 
    // CLOUDY, RAIN, SLEET, SNOW, WIND, FOG
    
    // Check if it's night time
    const now = new Date();
    const hour = now.getHours();
    const isNight = hour < 6 || hour >= 19; // Night time between 7PM and 6AM
    
    // Map codes to icon types and appropriate colors with day/night variations
    const mapping = {
        0: { 
            type: isNight ? Skycons.CLEAR_NIGHT : Skycons.CLEAR_DAY, 
            color: 'sun' 
        },
        1: { 
            type: isNight ? Skycons.CLEAR_NIGHT : Skycons.CLEAR_DAY, 
            color: 'sun' 
        },
        2: { 
            type: isNight ? Skycons.PARTLY_CLOUDY_NIGHT : Skycons.PARTLY_CLOUDY_DAY, 
            color: 'cloud' 
        },
        3: { type: Skycons.CLOUDY, color: 'cloud' },            // Overcast
        45: { type: Skycons.FOG, color: 'fog' },                // Foggy
        48: { type: Skycons.FOG, color: 'fog' },                // Depositing rime fog
        51: { type: Skycons.RAIN, color: 'rain' },              // Light drizzle
        53: { type: Skycons.RAIN, color: 'rain' },              // Moderate drizzle
        55: { type: Skycons.RAIN, color: 'rain' },              // Dense drizzle
        61: { type: Skycons.RAIN, color: 'rain' },              // Slight rain
        63: { type: Skycons.RAIN, color: 'rain' },              // Moderate rain
        65: { type: Skycons.RAIN, color: 'rain' },              // Heavy rain
        71: { type: Skycons.SNOW, color: 'snow' },              // Slight snow
        73: { type: Skycons.SNOW, color: 'snow' },              // Moderate snow
        75: { type: Skycons.SNOW, color: 'snow' },              // Heavy snow
        77: { type: Skycons.SNOW, color: 'snow' },              // Snow grains
        80: { type: Skycons.RAIN, color: 'rain' },              // Slight rain showers
        81: { type: Skycons.RAIN, color: 'rain' },              // Moderate rain showers
        82: { type: Skycons.RAIN, color: 'rain' },              // Violent rain showers
        85: { type: Skycons.SNOW, color: 'snow' },              // Slight snow showers
        86: { type: Skycons.SNOW, color: 'snow' },              // Heavy snow showers
        95: { type: Skycons.RAIN, color: 'thunder' },           // Thunderstorm
        96: { type: Skycons.SLEET, color: 'thunder' },          // Thunderstorm with slight hail
        99: { type: Skycons.SLEET, color: 'thunder' }           // Thunderstorm with heavy hail
    };
    
    return mapping[code] || { type: Skycons.CLOUDY, color: 'default' };
}

// Function to apply weather atmosphere using Vanta.js
function setWeatherAtmosphere(code) {
    console.log(`Setting weather atmosphere for code: ${code}`);
    
    // Destroy previous Vanta effect if it exists
    if (window.vantaEffect) {
        window.vantaEffect.destroy();
    }
    
    // Scale quality based on device performance
    // These factors will reduce particle count, complexity, etc.
    const qualityMultiplier = devicePerformanceScore / 10;
    const animationSpeed = isLowEndDevice ? 0.5 : 1.0;
    
    // For very low-end devices, use much simpler settings
    const particleMultiplier = isLowEndDevice ? 0.3 : qualityMultiplier;
    
    // Get current time to adjust colors based on time of day
    const now = new Date();
    const hour = now.getHours();
    const isNight = hour < 6 || hour >= 19; // Night time between 7PM and 6AM
    const isEvening = hour >= 17 && hour < 19; // Evening time between 5PM and 7PM
    const isMorning = hour >= 6 && hour < 9; // Morning time between 6AM and 9AM
    
    // Get current temperature if available
    let temperature = null;
    const tempElement = document.querySelector('.temperature');
    if (tempElement && tempElement.textContent) {
        // Extract the temperature value from "XX°C" format
        const tempMatch = tempElement.textContent.match(/(-?\d+)°/);
        if (tempMatch) {
            temperature = parseInt(tempMatch[1]);
            console.log(`Current temperature: ${temperature}°C`);
        }
    }
    
    // Apply appropriate atmosphere and effects based on weather code
    if (code === 0) {
        // Clear sky - Sunny, adjust based on time of day
        if (isNight) {
            // Night clear sky - darker blue, stars
            window.vantaEffect = VANTA.NET({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x4169e1, // Royal blue for stars
                backgroundColor: 0x0a1a30, // Very dark blue for night
                points: Math.max(5, Math.floor(15 * particleMultiplier)), // More stars at night
                maxDistance: 20.00,
                spacing: 17.00 + (10 * (1 - qualityMultiplier)),
                showDots: true
            });
        } else if (isEvening) {
            // Evening clear sky - sunset tones
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false, 
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0xd35400, // Sunset orange
                cloudColor: 0xf1c40f, // Golden clouds
                cloudShadowColor: 0x992900,
                sunGlareColor: 0xff9500,
                sunlightColor: 0xffb347,
                speed: 0.5 * animationSpeed,
                coverage: 0.3,
                sunPosition: new THREE.Vector3(-1, -0.5, 0) // Setting sun position
            });
        } else if (isMorning) {
            // Morning clear sky - sunrise tones
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x6495ed, // Cornflower blue
                cloudColor: 0xffd39b, // Warm light clouds
                cloudShadowColor: 0x102e7a,
                sunGlareColor: 0xffa07a, // Light salmon
                sunlightColor: 0xffa500, // Orange
                speed: 0.6 * animationSpeed,
                coverage: 0.2,
                sunPosition: new THREE.Vector3(0, 0, 1) // Rising sun position
            });
        } else {
            // Daytime clear sky
            window.vantaEffect = VANTA.NET({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x3e90e0,
                backgroundColor: 0x1e4575, // Darker blue
                points: Math.max(3, Math.floor(10 * particleMultiplier)),
                maxDistance: 25.00,
                spacing: 17.00 + (10 * (1 - qualityMultiplier)), // Increase spacing on low-end
                showDots: isLowEndDevice ? false : true
            });
        }
    } 
    else if (code === 1) {
        // Mainly clear with some clouds - adjust based on time of day
        if (isNight) {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x0c1445, // Dark night blue
                cloudColor: 0x283966, // Dark clouds
                cloudShadowColor: 0x000000,
                speed: 0.4 * animationSpeed,
                coverage: 0.4,
                sunPosition: new THREE.Vector3(-100, -100, -100) // No sun at night
            });
        } else {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x1e64c8, // Deeper blue for clear sky
                cloudColor: 0xffffff, // White clouds
                cloudShadowColor: 0x092147,
                sunGlareColor: 0xf1c056, // Warm sun
                sunlightColor: 0xf1c056,
                speed: 0.6 * animationSpeed, // Slower clouds for clear day
                sunPosition: new THREE.Vector3(1, 2, 1) // Higher sun position
            });
        }
    }
    else if (code === 2) {
        // Partly cloudy - adjust based on time of day
        if (isNight) {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x0e1a2d, // Very dark blue
                cloudColor: 0x1e293b, // Dark gray-blue clouds
                cloudShadowColor: 0x000000,
                speed: 0.5 * animationSpeed,
                coverage: 0.5,
                sunPosition: new THREE.Vector3(-100, -100, -100) // No sun at night
            });
        } else {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x2a4d78, // Darker blue
                cloudColor: 0xdedede, // Slightly grayer clouds
                cloudShadowColor: 0x111927,
                sunGlareColor: 0xf1c056, // Warm sun
                sunlightColor: 0xf1c056,
                speed: 0.8 * animationSpeed,
                coverage: 0.5, // More cloud coverage
                sunPosition: new THREE.Vector3(0, 1, 0) // Lower sun position
            });
        }
    }
    else if (code === 3) {
        // Fully cloudy / overcast - adjust slightly for time of day
        if (isNight) {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x141926, // Darker night sky
                cloudColor: 0x2c3e50, // Very dark clouds
                cloudShadowColor: 0x000000,
                speed: 0.3 * animationSpeed,
                coverage: 0.8,
                sunPosition: new THREE.Vector3(-100, -100, -100) // No sun at night
            });
        } else {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x303f54, // Dark sky
                cloudColor: 0xb0b0b0, // Gray clouds
                cloudShadowColor: 0x1a1a1a,
                speed: 0.4 * animationSpeed,
                coverage: 0.8, // Heavy cloud coverage
                sunPosition: new THREE.Vector3(-5, -1, 0) // Almost hidden sun
            });
        }
    }
    else if ((code >= 51 && code <= 55) || (code === 61)) {
        // Light rain / drizzle - adjust for time of day
        if (isNight) {
            window.vantaEffect = VANTA.WAVES({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x1c2331,
                shininess: 25.00 * qualityMultiplier,
                waveHeight: 10.00,
                waveSpeed: 0.65 * animationSpeed,
                zoom: 0.95
            });
        } else {
            window.vantaEffect = VANTA.WAVES({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x2f4a75,
                shininess: 35.00 * qualityMultiplier,
                waveHeight: 13.00,
                waveSpeed: 0.75 * animationSpeed,
                zoom: 0.88
            });
        }
    }
    else if ((code >= 63 && code <= 65) || (code >= 80 && code <= 82)) {
        // Moderate to heavy rain - minimal time of day adjustment
        if (isNight) {
            window.vantaEffect = VANTA.WAVES({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x1a2639, // Darker for night
                shininess: 50.00 * qualityMultiplier,
                waveHeight: 18.00,
                waveSpeed: 0.95 * animationSpeed,
                zoom: 0.70
            });
        } else {
            window.vantaEffect = VANTA.WAVES({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x253242, // Darker
                shininess: 60.00 * qualityMultiplier,
                waveHeight: 20.00,
                waveSpeed: 1.05 * animationSpeed,
                zoom: 0.65
            });
        }
    }
    else if ((code >= 71 && code <= 75)) {
        // Snow (light to heavy) - consider temperature too
        const coldSnow = temperature !== null && temperature < -5; // Extra cold snow
        const warmSnow = temperature !== null && temperature > 0; // Near melting point
        
        if (isNight) {
            window.vantaEffect = VANTA.FOG({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: coldSnow ? 0x9eacb8 : 0xb3c0c8, // Colder blue for very cold
                midtoneColor: coldSnow ? 0x4a5c6a : 0x5c6870,
                lowlightColor: 0x2a3438,
                baseColor: 0x232a34,
                speed: 1.20 * animationSpeed,
                blurFactor: 0.8
            });
        } else {
            // Adjust cloud colors based on temperature
            let cloudColor = 0xebebeb; // Default light gray clouds
            let skyColor = 0x404a54; // Default gray-blue sky
            
            if (coldSnow) {
                // Colder blue tones for very cold snow
                cloudColor = 0xd6e4f0;
                skyColor = 0x2c3e50;
            } else if (warmSnow) {
                // Warmer gray tones for snow near melting point
                cloudColor = 0xf5f5f5;
                skyColor = 0x4d5d6c;
            }
            
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: skyColor,
                cloudColor: cloudColor,
                cloudShadowColor: 0x393f46,
                speed: 0.6 * animationSpeed,
                coverage: 0.7 // Higher coverage for snow
            });
        }
    }
    else if ((code === 77) || (code >= 85 && code <= 86)) {
        // Snow grains / Snow showers - consider temperature too
        const isCold = temperature !== null && temperature < -5;
        
        window.vantaEffect = VANTA.FOG({
            el: "#vanta-background",
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: isCold ? 0xa4bcd0 : 0xb3c0c8, // Bluer for colder temps
            midtoneColor: isCold ? 0x4e6378 : 0x5c6870,
            lowlightColor: isCold ? 0x303c48 : 0x3e4648,
            baseColor: isCold ? 0x2a3541 : 0x404a54,
            speed: 1.50 * animationSpeed,
            blurFactor: 0.6
        });
    }
    else if (code === 45 || code === 48) {
        // Fog - slight adjustments for time of day
        if (isNight) {
            window.vantaEffect = VANTA.FOG({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0x5a6269, // Darker for night
                midtoneColor: 0x353a3c,
                lowlightColor: 0x171a1b,
                baseColor: 0x20252a,
                speed: 0.50 * animationSpeed,
                blurFactor: 0.98
            });
        } else {
            window.vantaEffect = VANTA.FOG({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                highlightColor: 0x8a9496, // Darker highlight
                midtoneColor: 0x464e50, // Darker midtone
                lowlightColor: 0x212526, // Darker lowlight
                baseColor: 0x383c3d, // Dark base
                speed: 0.60 * animationSpeed,
                blurFactor: 0.95
            });
        }
    }
    else if (code >= 95) {
        // Thunderstorm - minimal adjustments for time of day
        if (isLowEndDevice) {
            // Use CLOUDS instead of TRUNK for low-end devices
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: isNight ? 0x0d0f10 : 0x1a1f21, // Darker for night
                cloudColor: isNight ? 0x1a1c1d : 0x3a3e3f,
                cloudShadowColor: 0x000000,
                speed: 1.5 * animationSpeed,
                coverage: 0.9
            });
        } else {
            window.vantaEffect = VANTA.TRUNK({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: isNight ? 0x1e4e94 : 0x2269bd,
                backgroundColor: isNight ? 0x0d1115 : 0x1a1f21,
                spacing: 5.00 + (10 * (1 - qualityMultiplier)), 
                chaos: 4.50 * qualityMultiplier
            });
        }
    }
    else {
        // Default to calm clouds for any other codes - adjust for time of day
        if (isNight) {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x1a222e, // Dark night sky
                cloudColor: 0x3d4855, // Dark night clouds
                cloudShadowColor: 0x111518,
                speed: 0.5 * animationSpeed
            });
        } else {
            window.vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                skyColor: 0x384352, // Darker sky
                cloudColor: 0x9a9a9a, // Darker clouds
                cloudShadowColor: 0x293545,
                speed: 0.7 * animationSpeed
            });
        }
    }

    // Add a performance info indicator when in low performance mode
    if (isLowEndDevice) {
        let performanceIndicator = document.getElementById('performance-indicator');
        if (!performanceIndicator) {
            performanceIndicator = document.createElement('div');
            performanceIndicator.id = 'performance-indicator';
            performanceIndicator.style.position = 'fixed';
            performanceIndicator.style.bottom = '10px';
            performanceIndicator.style.right = '10px';
            performanceIndicator.style.backgroundColor = 'rgba(0,0,0,0.5)';
            performanceIndicator.style.color = 'white';
            performanceIndicator.style.padding = '5px 10px';
            performanceIndicator.style.borderRadius = '5px';
            performanceIndicator.style.fontSize = '12px';
            performanceIndicator.style.zIndex = '1000';
            performanceIndicator.textContent = 'Low performance mode';
            document.body.appendChild(performanceIndicator);
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

    // Location
    const locElem = document.querySelector('.location');
    if (locElem) locElem.textContent = cleanStationName(station.name);

    // Temperature
    const tempElem = document.querySelector('.temperature');
    if (tempElem) tempElem.textContent = `${Math.round(station.t)}°C`;

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
        const temp = station.t;
        const humidity = station.rh;
        
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
    if (humidityElem) humidityElem.textContent = station.rh ? `${TRANSLATIONS[currentLang].humidity}: ${Math.round(station.rh)}%` : '';

    // Wind
    const windElem = document.querySelector('.wind');
    if (windElem) {
        const windText = station.ff ? 
            `${TRANSLATIONS[currentLang].wind}: ${Math.round(station.ff)} ${TRANSLATIONS[currentLang].kmh} ${station.dd || ''}` : 
            '';
        windElem.textContent = windText;
    }

    // Summary/description
    const summaryElem = document.querySelector('.summary');
    if (summaryElem) summaryElem.textContent = '';

    updateCurrentTime();
}

// Auto-refresh every 15 minutes
setInterval(fetchWeatherData, 15 * 60 * 1000);

function updateCurrentTime() {
    // Update the top bar time (if present)
    const topBarTime = document.querySelector('.top-bar-time .current-time');
    if (topBarTime) {
        const now = new Date();
        topBarTime.textContent = now.toLocaleTimeString(currentLang, {hour: '2-digit', minute:'2-digit'});
    }
    // Update the card's .current-time (if present)
    const cardTime = document.querySelector('.location-header .current-time');
    if (cardTime) {
        const now = new Date();
        cardTime.textContent = now.toLocaleDateString(currentLang, { weekday: 'long', month: 'long', day: 'numeric' });
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


