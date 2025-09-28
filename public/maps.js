// Google Maps Integration for Live Tourist Tracking
let map;
let markers = new Map();
let touristMarkers = new Map();
let alertMarkers = new Map();
let userLocationMarker = null;
let routePolylines = new Map();
let geofences = new Map();
let markerClusterer = null;

// Map configuration
const mapConfig = {
    center: { lat: 20.5937, lng: 78.9629 }, // Center of India
    zoom: 5,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

// Initialize Google Maps
function initMap() {
    // Check if Google Maps is available
    if (typeof google === 'undefined' || !google.maps) {
        console.log('Google Maps not available, using fallback map');
        if (typeof initFallbackMap === 'function') {
            initFallbackMap();
        }
        return;
    }
    
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error('Map element not found');
        return;
    }
    
    try {
        map = new google.maps.Map(mapElement, mapConfig);
        
        // Initialize marker clusterer for better performance
        if (typeof MarkerClusterer !== 'undefined') {
            markerClusterer = new MarkerClusterer(map, [], {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        }
        
        // Add map event listeners
        setupMapEventListeners();
        
        // Load initial data
        loadTouristLocations();
        loadEmergencyAlerts();
        
        console.log('Google Maps initialized successfully');
        
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        if (typeof initFallbackMap === 'function') {
            initFallbackMap();
        }
    }
}

function setupMapEventListeners() {
    // Map click handler for adding geofences (police dashboard only)
    if (window.location.pathname.includes('police')) {
        map.addListener('click', (event) => {
            if (event.detail && event.detail.placeId) return; // Ignore place clicks
            
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            if (confirm('Add safety geofence at this location?')) {
                addGeofence(lat, lng, 1000); // 1km radius
            }
        });
    }
    
    // Map bounds changed listener
    map.addListener('bounds_changed', () => {
        updateVisibleMarkers();
    });
}

// Tourist tracking functions
function addTouristMarker(tourist) {
    if (!tourist.location) return;
    
    const position = {
        lat: tourist.location.latitude,
        lng: tourist.location.longitude
    };
    
    // Remove existing marker if exists
    if (touristMarkers.has(tourist.userId)) {
        touristMarkers.get(tourist.userId).setMap(null);
    }
    
    // Create custom marker icon based on user type and status
    const icon = createTouristIcon(tourist);
    
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: tourist.name || 'Tourist',
        icon: icon,
        animation: tourist.isMoving ? google.maps.Animation.BOUNCE : null
    });
    
    // Create info window
    const infoWindow = new google.maps.InfoWindow({
        content: createTouristInfoContent(tourist)
    });
    
    marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
        
        // Highlight tourist route if available
        highlightTouristRoute(tourist.userId);
    });
    
    touristMarkers.set(tourist.userId, marker);
    
    // Add to clusterer if available
    if (markerClusterer) {
        markerClusterer.addMarker(marker);
    }
    
    return marker;
}

function createTouristIcon(tourist) {
    let color = '#4285f4'; // Default blue
    let symbol = '👤';
    
    // Color coding based on status
    if (tourist.hasAlert) {
        color = '#ea4335'; // Red for alerts
        symbol = '🚨';
    } else if (tourist.isTracking) {
        color = '#34a853'; // Green for active tracking
        symbol = '📍';
    } else if (tourist.userType === 'foreign_tourist') {
        color = '#fbbc04'; // Yellow for foreign tourists
        symbol = '🌍';
    }
    
    return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="2"/>
                <text x="20" y="25" text-anchor="middle" font-size="16">${symbol}</text>
            </svg>
        `)}`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
    };
}

function createTouristInfoContent(tourist) {
    const lastUpdate = tourist.lastUpdate ? new Date(tourist.lastUpdate).toLocaleString('en-IN') : 'Unknown';
    const statusBadge = tourist.hasAlert ? 
        '<span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">ALERT</span>' :
        '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">SAFE</span>';
    
    return `
        <div class="p-3 min-w-64">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg">${tourist.name || 'Tourist'}</h3>
                ${statusBadge}
            </div>
            <div class="space-y-1 text-sm">
                <p><strong>ID:</strong> ${tourist.userId}</p>
                <p><strong>Type:</strong> ${tourist.userType?.replace('_', ' ').toUpperCase() || 'Unknown'}</p>
                <p><strong>Phone:</strong> ${tourist.phone || 'Not provided'}</p>
                <p><strong>Last Update:</strong> ${lastUpdate}</p>
                ${tourist.destination ? `<p><strong>Destination:</strong> ${tourist.destination}</p>` : ''}
                ${tourist.emergencyContact ? `<p><strong>Emergency Contact:</strong> ${tourist.emergencyContact}</p>` : ''}
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="trackTourist('${tourist.userId}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Track Route
                </button>
                <button onclick="contactTourist('${tourist.userId}')" class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Contact
                </button>
                ${window.location.pathname.includes('police') ? 
                    `<button onclick="dispatchHelp('${tourist.userId}')" class="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700">
                        Dispatch Help
                    </button>` : ''
                }
            </div>
        </div>
    `;
}

// Emergency alert markers
function addAlertMarker(alert) {
    if (!alert.location) return;
    
    const position = {
        lat: alert.location.latitude,
        lng: alert.location.longitude
    };
    
    // Remove existing alert marker if exists
    if (alertMarkers.has(alert.id)) {
        alertMarkers.get(alert.id).setMap(null);
    }
    
    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: `Emergency Alert: ${alert.type}`,
        icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="23" fill="#ea4335" stroke="white" stroke-width="2"/>
                    <text x="25" y="30" text-anchor="middle" font-size="20" fill="white">⚠️</text>
                </svg>
            `)}`,
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
        },
        animation: google.maps.Animation.BOUNCE
    });
    
    const infoWindow = new google.maps.InfoWindow({
        content: createAlertInfoContent(alert)
    });
    
    marker.addListener('click', () => {
        closeAllInfoWindows();
        infoWindow.open(map, marker);
    });
    
    alertMarkers.set(alert.id, marker);
    
    // Create danger zone circle
    const dangerZone = new google.maps.Circle({
        strokeColor: '#ea4335',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ea4335',
        fillOpacity: 0.15,
        map: map,
        center: position,
        radius: 500 // 500 meter danger zone
    });
    
    // Store danger zone with alert
    alert.dangerZone = dangerZone;
    
    return marker;
}

function createAlertInfoContent(alert) {
    const timestamp = new Date(alert.timestamp).toLocaleString('en-IN');
    const severityColor = alert.severity === 'HIGH' ? 'red' : alert.severity === 'MEDIUM' ? 'yellow' : 'gray';
    
    return `
        <div class="p-3 min-w-64">
            <div class="flex items-center justify-between mb-2">
                <h3 class="font-bold text-lg text-red-600">🚨 EMERGENCY ALERT</h3>
                <span class="bg-${severityColor}-100 text-${severityColor}-800 px-2 py-1 rounded-full text-xs font-semibold">
                    ${alert.severity}
                </span>
            </div>
            <div class="space-y-1 text-sm">
                <p><strong>Alert ID:</strong> ${alert.id}</p>
                <p><strong>Type:</strong> ${alert.type}</p>
                <p><strong>Tourist:</strong> ${alert.userName || 'Unknown'}</p>
                <p><strong>Phone:</strong> ${alert.userPhone || 'Not provided'}</p>
                <p><strong>Time:</strong> ${timestamp}</p>
                <p><strong>Message:</strong> ${alert.message}</p>
                <p><strong>Status:</strong> 
                    <span class="font-semibold ${alert.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'}">
                        ${alert.status}
                    </span>
                </p>
            </div>
            <div class="mt-3 flex gap-2">
                <button onclick="respondToMapAlert('${alert.id}')" class="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                    Respond
                </button>
                <button onclick="getDirections(${alert.location.latitude}, ${alert.location.longitude})" class="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700">
                    Directions
                </button>
                <button onclick="broadcastToArea(${alert.location.latitude}, ${alert.location.longitude})" class="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700">
                    Broadcast
                </button>
            </div>
        </div>
    `;
}

// User location tracking
function trackUserLocation() {
    if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        return;
    }
    
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
            const userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            updateUserLocationMarker(userPos);
            
            // Send location to server if user is logged in
            if (currentUser) {
                updateLocationOnServer(userPos);
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        }
    );
    
    return watchId;
}

function updateUserLocationMarker(position) {
    if (userLocationMarker) {
        userLocationMarker.setPosition(position);
    } else {
        userLocationMarker = new google.maps.Marker({
            position: position,
            map: map,
            title: 'Your Location',
            icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="13" fill="#4285f4" stroke="white" stroke-width="2"/>
                        <circle cx="15" cy="15" r="4" fill="white"/>
                    </svg>
                `)}`,
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 15)
            }
        });
        
        // Add accuracy circle
        const accuracyCircle = new google.maps.Circle({
            strokeColor: '#4285f4',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: '#4285f4',
            fillOpacity: 0.1,
            map: map,
            center: position,
            radius: 100 // Approximate accuracy
        });
        
        userLocationMarker.accuracyCircle = accuracyCircle;
    }
    
    // Update accuracy circle
    if (userLocationMarker.accuracyCircle) {
        userLocationMarker.accuracyCircle.setCenter(position);
    }
}

// Route visualization
function drawTouristRoute(userId, routePoints) {
    // Remove existing route
    if (routePolylines.has(userId)) {
        routePolylines.get(userId).setMap(null);
    }
    
    if (!routePoints || routePoints.length < 2) return;
    
    const path = routePoints.map(point => ({
        lat: point.latitude,
        lng: point.longitude
    }));
    
    const polyline = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#4285f4',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map
    });
    
    routePolylines.set(userId, polyline);
    
    // Add route markers for significant points
    routePoints.forEach((point, index) => {
        if (index % 5 === 0 || index === routePoints.length - 1) { // Every 5th point and last point
            new google.maps.Marker({
                position: { lat: point.latitude, lng: point.longitude },
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: '#4285f4',
                    fillOpacity: 0.8,
                    strokeColor: 'white',
                    strokeWeight: 1
                },
                title: `Route point ${index + 1} - ${new Date(point.timestamp).toLocaleTimeString()}`
            });
        }
    });
}

// Geofencing
function addGeofence(lat, lng, radius, type = 'safety') {
    const geofenceId = Date.now().toString();
    
    const circle = new google.maps.Circle({
        strokeColor: type === 'safety' ? '#34a853' : '#ea4335',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: type === 'safety' ? '#34a853' : '#ea4335',
        fillOpacity: 0.15,
        map: map,
        center: { lat, lng },
        radius: radius,
        editable: true,
        draggable: true
    });
    
    // Add geofence label
    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: `${type === 'safety' ? 'Safety' : 'Danger'} Zone`,
        icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="13" fill="${type === 'safety' ? '#34a853' : '#ea4335'}" stroke="white" stroke-width="2"/>
                    <text x="15" y="20" text-anchor="middle" font-size="12" fill="white">${type === 'safety' ? '🛡️' : '⚠️'}</text>
                </svg>
            `)}`,
            scaledSize: new google.maps.Size(30, 30),
            anchor: new google.maps.Point(15, 15)
        }
    });
    
    geofences.set(geofenceId, { circle, marker, type });
    
    return geofenceId;
}

// Map utility functions
function closeAllInfoWindows() {
    // Close all open info windows
    touristMarkers.forEach(marker => {
        if (marker.infoWindow) {
            marker.infoWindow.close();
        }
    });
    
    alertMarkers.forEach(marker => {
        if (marker.infoWindow) {
            marker.infoWindow.close();
        }
    });
}

function updateVisibleMarkers() {
    const bounds = map.getBounds();
    if (!bounds) return;
    
    // Update marker visibility based on zoom level and bounds
    const zoom = map.getZoom();
    
    touristMarkers.forEach((marker, userId) => {
        const inBounds = bounds.contains(marker.getPosition());
        marker.setVisible(inBounds || zoom > 10);
    });
}

function centerMapOnLocation(lat, lng, zoom = 15) {
    map.setCenter({ lat, lng });
    map.setZoom(zoom);
}

function fitMapToBounds(locations) {
    if (!locations || locations.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
        bounds.extend({ lat: location.latitude, lng: location.longitude });
    });
    
    map.fitBounds(bounds);
}

// Data loading functions
async function loadTouristLocations() {
    try {
        // Simulate loading tourist data
        const mockTourists = [
            {
                userId: 'tourist1',
                name: 'Raj Patel',
                phone: '+91-9876543210',
                userType: 'indian_citizen',
                location: { latitude: 28.6139, longitude: 77.2090 }, // Delhi
                isTracking: true,
                hasAlert: false,
                lastUpdate: new Date().toISOString(),
                destination: 'Red Fort'
            },
            {
                userId: 'tourist2',
                name: 'Priya Sharma',
                phone: '+91-8765432109',
                userType: 'indian_citizen',
                location: { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
                isTracking: true,
                hasAlert: true,
                lastUpdate: new Date(Date.now() - 300000).toISOString(),
                destination: 'Gateway of India'
            },
            {
                userId: 'tourist3',
                name: 'John Smith',
                phone: '+1-555-123-4567',
                userType: 'foreign_tourist',
                location: { latitude: 27.1751, longitude: 78.0421 }, // Agra
                isTracking: true,
                hasAlert: false,
                lastUpdate: new Date(Date.now() - 600000).toISOString(),
                destination: 'Taj Mahal'
            }
        ];
        
        mockTourists.forEach(tourist => {
            addTouristMarker(tourist);
        });
        
    } catch (error) {
        console.error('Error loading tourist locations:', error);
    }
}

async function loadEmergencyAlerts() {
    try {
        // Load alerts from server or use mock data
        const mockAlerts = [
            {
                id: 'alert1',
                userId: 'tourist2',
                userName: 'Priya Sharma',
                userPhone: '+91-8765432109',
                type: 'EMERGENCY',
                message: 'Manual SOS button pressed - immediate assistance required',
                location: { latitude: 19.0760, longitude: 72.8777 },
                timestamp: new Date(Date.now() - 300000).toISOString(),
                severity: 'HIGH',
                status: 'ACTIVE'
            }
        ];
        
        mockAlerts.forEach(alert => {
            addAlertMarker(alert);
        });
        
    } catch (error) {
        console.error('Error loading emergency alerts:', error);
    }
}

// Action handlers
function trackTourist(userId) {
    console.log('Tracking tourist:', userId);
    // Implement route tracking logic
    highlightTouristRoute(userId);
}

function contactTourist(userId) {
    const tourist = Array.from(touristMarkers.keys()).find(id => id === userId);
    if (tourist) {
        alert('Contacting tourist via SMS and call...');
    }
}

function dispatchHelp(userId) {
    console.log('Dispatching help to tourist:', userId);
    alert('Emergency response team dispatched!');
}

function respondToMapAlert(alertId) {
    console.log('Responding to alert:', alertId);
    alert('Response team dispatched to alert location!');
}

function getDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

function broadcastToArea(lat, lng) {
    console.log('Broadcasting to area:', lat, lng);
    alert('Emergency broadcast sent to all tourists in the area!');
}

function highlightTouristRoute(userId) {
    // Mock route data - in real implementation, fetch from server
    const mockRoute = [
        { latitude: 28.6139, longitude: 77.2090, timestamp: Date.now() - 3600000 },
        { latitude: 28.6129, longitude: 77.2080, timestamp: Date.now() - 3000000 },
        { latitude: 28.6119, longitude: 77.2070, timestamp: Date.now() - 2400000 },
        { latitude: 28.6109, longitude: 77.2060, timestamp: Date.now() - 1800000 },
        { latitude: 28.6099, longitude: 77.2050, timestamp: Date.now() - 1200000 }
    ];
    
    drawTouristRoute(userId, mockRoute);
}

async function updateLocationOnServer(position) {
    if (!currentUser) return;
    
    try {
        await fetch('/api/tracking/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                latitude: position.lat,
                longitude: position.lng,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.error('Error updating location:', error);
    }
}

// Initialize map when Google Maps API is loaded
window.initMap = initMap;
