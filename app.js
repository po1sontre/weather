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
    if (desc) {
        // Clear/Sunny
        if (/sun|clear|klar|heiter|sereno|soleggiato/i.test(desc)) {
            return 0;
        }
        // Partly Cloudy - specifically check for "partly" or partial terms first
        if (/partly cloud|teilweise bewölkt|parzialmente nuvoloso|partly sunny|teilweise sonnig|parzialmente soleggiato/i.test(desc)) {
            return 2;
        }
        // Fully Cloudy/Overcast - check after partly cloudy to avoid overmatching
        if (/cloud|bewölkt|nuvoloso|overcast|bedeckt|coperto/i.test(desc)) {
            return 3;
        }
        // Rain
        if (/rain|regen|pioggia/i.test(desc)) {
            return 61;
        }
        // Snow
        if (/snow|schnee|neve/i.test(desc)) {
            return 71;
        }
        // Fog
        if (/fog|nebel|nebbia/i.test(desc)) {
            return 45;
        }
        // Thunderstorm
        if (/thunder|gewitter|temporale/i.test(desc)) {
            return 95;
        }
    }
    
    // If we have a numeric code, use it directly if it's a valid WMO code
    if (typeof code === 'number' && Object.keys(getSkyconTypeAndColor).includes(code.toString())) {
        return code;
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

// Initialize Skycons when the page loads
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Map codes to icon types and appropriate colors
    const mapping = {
        0: { type: Skycons.CLEAR_DAY, color: 'sun' },           // Clear sky
        1: { type: Skycons.PARTLY_CLOUDY_DAY, color: 'cloud' }, // Mainly clear
        2: { type: Skycons.PARTLY_CLOUDY_DAY, color: 'cloud' }, // Partly cloudy
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
        
        if (temp > 25 && humidity < 50) {
            weatherCode = 0; // Clear sky/sunny for hot and dry
        } else if (temp < 5) {
            weatherCode = 71; // Light snow for cold
        } else if (humidity > 80) {
            weatherCode = 61; // Light rain for high humidity
        } else if (humidity > 60) {
            weatherCode = 3; // Overcast for medium-high humidity
        } else if (humidity > 40) {
            weatherCode = 2; // Partly cloudy for medium humidity
        } else {
            weatherCode = 1; // Mainly clear for low humidity
        }
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


