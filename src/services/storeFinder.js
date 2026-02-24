export const findNearbyStores = async (lat, lon, radius = 5000) => {
    // Using Overpass API (OpenStreetMap) to find shops
    // We'll look for: hardware, craft, electronics, stationery, variety_store (general store)
    const query = `
      [out:json][timeout:25];
      (
        node["shop"~"hardware|craft|electronics|doityourself|stationery|general|supermarket"](around:${radius},${lat},${lon});
        way["shop"~"hardware|craft|electronics|doityourself|stationery|general|supermarket"](around:${radius},${lat},${lon});
      );
      out body;
      >;
      out skel qt;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch stores');

        const data = await response.json();
        const elements = data.elements.filter(e => e.tags && e.tags.name); // Only keep named stores

        return elements.map(place => ({
            id: place.id,
            name: place.tags.name,
            type: place.tags.shop,
            lat: place.lat,
            lon: place.lon,
            address: place.tags['addr:street'] ? `${place.tags['addr:street']} ${place.tags['addr:housenumber'] || ''}` : 'Address not available',
            distance: calculateDistance(lat, lon, place.lat, place.lon)
        })).sort((a, b) => a.distance - b.distance).slice(0, 10); // Return top 10 nearest
    } catch (error) {
        console.error("Store search error:", error);
        throw error;
    }
};

// Helper: Haversine distance calculation (in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Distance in km
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
