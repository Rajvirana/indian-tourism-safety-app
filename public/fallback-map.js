// Fallback map implementation using Leaflet (works without API keys)
let leafletMap;
let leafletMarkers = new Map();
let leafletAlertMarkers = new Map();
let leafletUserMarker = null;

// Initialize fallback map with OpenStreetMap
function initFallbackMap() {
    // Check if Google Maps failed to load
    if (typeof google === 'undefined' || !google.maps) {
        console.log('Google Maps not available, using fallback map');
        loadLeafletMap();
        return;
    }
    
    // Try to initialize Google Maps
    try {
        initMap();
    } catch (error) {
        console.log('Google Maps initialization failed, using fallback map');
        loadLeafletMap();
    }
}

function loadLeafletMap() {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
    }
    
    if (typeof L === 'undefined') {
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        leafletJS.onload = initLeafletMap;
        document.head.appendChild(leafletJS);
    } else {
        initLeafletMap();
    }
}

function initLeafletMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Clear any existing content
    mapElement.innerHTML = '';
    
    // Initialize Leaflet map
    leafletMap = L.map('map').setView([20.5937, 78.9629], 5); // Center of India
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);
    
    // Add demo data
    addLeafletDemoData();
    
    // Add map controls
    addLeafletControls();
    
    console.log('Fallback map initialized successfully');
}

function addLeafletDemoData() {
    // Demo tourist locations
    const demoTourists = [
        {
            id: 'tourist1',
            name: 'Raj Patel',
            phone: '+91-9876543210',
            userType: 'indian_citizen',
            location: [28.6139, 77.2090], // Delhi
            destination: 'Red Fort',
            status: 'safe'
        },
        {
            id: 'tourist2',
            name: 'Priya Sharma',
            phone: '+91-8765432109',
            userType: 'indian_citizen',
            location: [19.0760, 72.8777], // Mumbai
            destination: 'Gateway of India',
            status: 'alert'
        },
        {
            id: 'tourist3',
            name: 'John Smith',
            phone: '+1-555-123-4567',
            userType: 'foreign_tourist',
            location: [27.1751, 78.0421], // Agra
            destination: 'Taj Mahal',
            status: 'safe'
        },
        {
            id: 'tourist4',
            name: 'Sarah Wilson',
            phone: '+44-20-1234-5678',
            userType: 'foreign_tourist',
            location: [15.2993, 74.1240], // Goa
            destination: 'Goa Beaches',
            status: 'safe'
        },
        {
            id: 'tourist5',
            name: 'Amit Kumar',
            phone: '+91-9123456789',
            userType: 'indian_citizen',
            location: [34.1526, 77.5771], // Ladakh
            destination: 'Ladakh Adventure',
            status: 'tracking'
        }
    ];
    
    // Add tourist markers
    demoTourists.forEach(tourist => {
        addLeafletTouristMarker(tourist);
    });
    
    // Demo emergency alerts
    const demoAlerts = [
        {
            id: 'alert1',
            location: [19.0760, 72.8777], // Mumbai
            type: 'EMERGENCY',
            message: 'Tourist needs immediate assistance',
            severity: 'HIGH',
            touristName: 'Priya Sharma'
        }
    ];
    
    // Add alert markers
    demoAlerts.forEach(alert => {
        addLeafletAlertMarker(alert);
    });
}

function addLeafletTouristMarker(tourist) {
    let iconColor = '#4285f4'; // Default blue
    let iconSymbol = '👤';
    
    // Color coding based on status
    if (tourist.status === 'alert') {
        iconColor = '#ea4335'; // Red
        iconSymbol = '🚨';
    } else if (tourist.status === 'tracking') {
        iconColor = '#34a853'; // Green
        iconSymbol = '📍';
    } else if (tourist.userType === 'foreign_tourist') {
        iconColor = '#fbbc04'; // Yellow
        iconSymbol = '🌍';
    }
    
    // Create custom icon
    const customIcon = L.divIcon({
        html: `<div style="background-color: ${iconColor}; border: 2px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${iconSymbol}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
    
    // Create marker
    const marker = L.marker(tourist.location, { icon: customIcon }).addTo(leafletMap);
    
    // Create popup content
    const popupContent = `
        <div class="p-3 min-w-48">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg">${tourist.name}</h3>
                <span class="px-2 py-1 rounded-full text-xs font-semibold ${
                    tourist.status === 'alert' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }">${tourist.status.toUpperCase()}</span>
            </div>
            <div class="space-y-1 text-sm">
                <p><strong>ID:</strong> ${tourist.id}</p>
                <p><strong>Type:</strong> ${tourist.userType.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Phone:</strong> ${tourist.phone}</p>
                <p><strong>Destination:</strong> ${tourist.destination}</p>
                <p><strong>Status:</strong> ${tourist.status}</p>
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="trackTouristRoute('${tourist.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Track Route
                </button>
                <button onclick="contactTourist('${tourist.id}')" class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Contact
                </button>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    leafletMarkers.set(tourist.id, marker);
}

function addLeafletAlertMarker(alert) {
    // Create emergency icon
    const alertIcon = L.divIcon({
        html: `<div style="background-color: #ea4335; border: 2px solid white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; box-shadow: 0 3px 6px rgba(0,0,0,0.4); animation: pulse 2s infinite;">⚠️</div>`,
        className: 'alert-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    // Create marker
    const marker = L.marker(alert.location, { icon: alertIcon }).addTo(leafletMap);
    
    // Create popup content
    const popupContent = `
        <div class="p-3 min-w-48">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg text-red-600">🚨 EMERGENCY</h3>
                <span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">${alert.severity}</span>
            </div>
            <div class="space-y-1 text-sm">
                <p><strong>Alert ID:</strong> ${alert.id}</p>
                <p><strong>Type:</strong> ${alert.type}</p>
                <p><strong>Tourist:</strong> ${alert.touristName}</p>
                <p><strong>Message:</strong> ${alert.message}</p>
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="respondToAlert('${alert.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Respond
                </button>
                <button onclick="getDirectionsLeaflet(${alert.location[0]}, ${alert.location[1]})" class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Directions
                </button>
            </div>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    
    // Add danger zone circle
    const dangerZone = L.circle(alert.location, {
        color: '#ea4335',
        fillColor: '#ea4335',
        fillOpacity: 0.15,
        radius: 500 // 500 meters
    }).addTo(leafletMap);
    
    leafletAlertMarkers.set(alert.id, { marker, dangerZone });
}

function addLeafletControls() {
    // Add custom control for map actions
    const customControl = L.control({ position: 'topright' });
    
    customControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-control-custom');
        div.innerHTML = `
            <div class="bg-white p-2 rounded shadow-lg space-y-2">
                <button onclick="centerOnIndia()" class="block w-full bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    🇮🇳 Center India
                </button>
                <button onclick="showAllTourists()" class="block w-full bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    👥 Show All Tourists
                </button>
                <button onclick="showEmergencies()" class="block w-full bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                    🚨 Show Emergencies
                </button>
            </div>
        `;
        return div;
    };
    
    customControl.addTo(leafletMap);
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        .leaflet-control-custom {
            background: transparent;
            border: none;
        }
    `;
    document.head.appendChild(style);
}

// Control functions
function centerOnIndia() {
    if (leafletMap) {
        leafletMap.setView([20.5937, 78.9629], 5);
    }
}

function showAllTourists() {
    if (leafletMap && leafletMarkers.size > 0) {
        const group = new L.featureGroup(Array.from(leafletMarkers.values()));
        leafletMap.fitBounds(group.getBounds().pad(0.1));
    }
}

function showEmergencies() {
    if (leafletMap && leafletAlertMarkers.size > 0) {
        const alertMarkers = Array.from(leafletAlertMarkers.values()).map(alert => alert.marker);
        const group = new L.featureGroup(alertMarkers);
        leafletMap.fitBounds(group.getBounds().pad(0.2));
    }
}

function trackTouristRoute(touristId) {
    console.log('Tracking route for tourist:', touristId);
    alert(`Tracking route for ${touristId}. In a real implementation, this would show the tourist's movement history.`);
}

function contactTourist(touristId) {
    console.log('Contacting tourist:', touristId);
    alert(`Contacting ${touristId} via SMS and call...`);
}

function respondToAlert(alertId) {
    console.log('Responding to alert:', alertId);
    alert(`Emergency response team dispatched to alert ${alertId}!`);
}

function getDirectionsLeaflet(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Track user location for fallback map
function trackUserLocationLeaflet() {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (leafletUserMarker) {
            leafletUserMarker.setLatLng([lat, lng]);
        } else {
            const userIcon = L.divIcon({
                html: `<div style="background-color: #4285f4; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                className: 'user-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            leafletUserMarker = L.marker([lat, lng], { icon: userIcon }).addTo(leafletMap);
            leafletUserMarker.bindPopup('Your Location');
        }
    });
}

// Initialize fallback map when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFallbackMap);
} else {
    initFallbackMap();
}
