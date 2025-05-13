// SIAG Regions with their approximate center coordinates
const SIAG_REGIONS = [
    { 
        id: 1, 
        name: "Bolzano, Überetsch and Unterland",
        center: { lat: 46.4983, lng: 11.3548 } // Bolzano coordinates
    },
    { 
        id: 2, 
        name: "Burggrafenamt - Meran and surroundings",
        center: { lat: 46.6729, lng: 11.1611 } // Meran coordinates
    },
    { 
        id: 3, 
        name: "Vinschgau",
        center: { lat: 46.6289, lng: 10.7689 } // Schlanders coordinates
    },
    { 
        id: 4, 
        name: "Eisacktal and Sarntal",
        center: { lat: 46.7167, lng: 11.6667 } // Brixen coordinates
    },
    { 
        id: 5, 
        name: "Wipptal - Sterzing and surroundings",
        center: { lat: 46.9000, lng: 11.4333 } // Sterzing coordinates
    },
    { 
        id: 6, 
        name: "Pustertal",
        center: { lat: 46.8000, lng: 12.1667 } // Bruneck coordinates
    },
    { 
        id: 7, 
        name: "Ladinia - Dolomites",
        center: { lat: 46.5500, lng: 11.8500 } // Corvara coordinates
    }
];

// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find the closest region based on coordinates
function findClosestRegion(lat, lng) {
    let closestRegion = null;
    let minDistance = Infinity;

    for (const region of SIAG_REGIONS) {
        const distance = calculateDistance(
            lat, 
            lng, 
            region.center.lat, 
            region.center.lng
        );
        
        if (distance < minDistance) {
            minDistance = distance;
            closestRegion = region;
        }
    }

    return closestRegion;
}

// Get forecast URL for a region
function getForecastUrl(regionId) {
    return `https://weather.services.siag.it/api/v2/district/${regionId}/bulletin`;
}

// Export the functions
export {
    findClosestRegion,
    getForecastUrl,
    SIAG_REGIONS
}; 