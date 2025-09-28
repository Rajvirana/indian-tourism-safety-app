// Global variables
let currentUser = null;
let socket = null;
let trackingActive = false;
let currentLanguage = 'en';
let isOffline = false;
let offlineData = {};

// Translations object
const translations = {
    en: {
        app_name: "Indian Tourism & Safety",
        loading: "Loading...",
        profile: "Profile",
        logout: "Logout",
        welcome: "Welcome to Indian Tourism & Safety",
        auth_subtitle: "Your verified travel companion for safe exploration",
        login: "Login",
        register: "Register",
        sign_in: "Sign In",
        create_account: "Create Account",
        explore_india: "Explore India Safely",
        hero_subtitle: "Discover amazing places with verified identity and real-time safety tracking",
        start_exploring: "Start Exploring",
        enable_tracking: "Enable Tracking",
        features_title: "Your Travel Companion Features",
        features_subtitle: "Everything you need for a safe and memorable journey",
        qr_verification: "QR Verification",
        qr_description: "Verified identity with Aadhar/Passport linked QR codes",
        live_tracking: "Live Tracking",
        tracking_description: "Real-time location sharing with family and automatic SOS",
        smart_recommendations: "Smart Recommendations",
        recommendations_description: "AI-powered suggestions based on weather, cost, and preferences",
        multilingual: "Multilingual",
        multilingual_description: "Support for 12+ Indian languages with accessibility features",
        quick_actions: "Quick Actions",
        explore_places: "Explore Places",
        places_description: "Discover top-rated destinations and hidden gems",
        festivals: "Festivals & Events",
        festivals_description: "Find cultural celebrations and local events",
        plan_itinerary: "Plan Itinerary",
        itinerary_description: "Create personalized travel plans",
        your_qr_code: "Your Verification QR Code",
        qr_instructions: "Show this QR code for identity verification",
        close: "Close",
        offline_mode: "Offline Mode Active",
        emergency_sos: "Emergency SOS",
        sos_sent: "SOS Alert Sent Successfully",
        tracking_started: "Location Tracking Started",
        tracking_stopped: "Location Tracking Stopped"
    },
    hi: {
        app_name: "भारतीय पर्यटन और सुरक्षा",
        loading: "लोड हो रहा है...",
        profile: "प्रोफाइल",
        logout: "लॉग आउट",
        welcome: "भारतीय पर्यटन और सुरक्षा में आपका स्वागत है",
        auth_subtitle: "सुरक्षित अन्वेषण के लिए आपका सत्यापित यात्रा साथी",
        login: "लॉगिन",
        register: "पंजीकरण",
        sign_in: "साइन इन",
        create_account: "खाता बनाएं",
        explore_india: "भारत को सुरक्षित रूप से देखें",
        hero_subtitle: "सत्यापित पहचान और रियल-टाइम सुरक्षा ट्रैकिंग के साथ अद्भुत स्थानों की खोज करें",
        start_exploring: "अन्वेषण शुरू करें",
        enable_tracking: "ट्रैकिंग सक्षम करें",
        offline_mode: "ऑफलाइन मोड सक्रिय"
    }
    // Add more languages as needed
};

// Utility functions
function translate(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function updateLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translate(key);
    });
    localStorage.setItem('preferredLanguage', lang);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white max-w-sm ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function saveToOfflineStorage(key, data) {
    if (!offlineData[key]) offlineData[key] = [];
    offlineData[key].push({
        data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
}

function loadOfflineData() {
    const saved = localStorage.getItem('offlineData');
    if (saved) {
        offlineData = JSON.parse(saved);
    }
}

function checkOnlineStatus() {
    const wasOffline = isOffline;
    isOffline = !navigator.onLine;
    
    const indicator = document.getElementById('offlineIndicator');
    if (isOffline && !wasOffline) {
        indicator.style.display = 'block';
        showNotification('You are now offline. Limited functionality available.', 'warning');
    } else if (!isOffline && wasOffline) {
        indicator.style.display = 'none';
        showNotification('You are back online!', 'success');
        syncOfflineData();
    }
}

async function syncOfflineData() {
    if (isOffline || !currentUser) return;
    
    // Sync any offline data when back online
    for (const [key, items] of Object.entries(offlineData)) {
        for (const item of items) {
            try {
                if (key === 'locations') {
                    await fetch('/api/tracking/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currentUser.token}`
                        },
                        body: JSON.stringify(item.data)
                    });
                } else if (key === 'sos') {
                    await fetch('/api/sos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currentUser.token}`
                        },
                        body: JSON.stringify(item.data)
                    });
                }
            } catch (error) {
                console.error('Sync error:', error);
            }
        }
    }
    
    // Clear synced data
    offlineData = {};
    localStorage.removeItem('offlineData');
}

// API functions
async function apiCall(endpoint, options = {}) {
    if (isOffline) {
        throw new Error('Currently offline');
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(currentUser?.token && { 'Authorization': `Bearer ${currentUser.token}` })
        }
    };
    
    const response = await fetch(endpoint, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
}

// Authentication functions
async function login(email, password) {
    try {
        const response = await apiCall('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        initializeSocket();
        showDashboard();
        showNotification('Login successful!', 'success');
        
        return response;
    } catch (error) {
        showNotification(error.message, 'error');
        throw error;
    }
}

async function register(userData) {
    try {
        const response = await apiCall('/api/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        
        currentUser = response;
        localStorage.setItem('currentUser', JSON.stringify(response));
        
        initializeSocket();
        showDashboard();
        showNotification('Registration successful!', 'success');
        
        return response;
    } catch (error) {
        showNotification(error.message, 'error');
        throw error;
    }
}

function logout() {
    currentUser = null;
    trackingActive = false;
    localStorage.removeItem('currentUser');
    
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    
    showAuthContainer();
    showNotification('Logged out successfully', 'success');
}

// Socket.io functions
function initializeSocket() {
    if (!currentUser) return;
    
    socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('join_tracking', { userId: currentUser.user.id });
    });
    
    socket.on('police_alert', (alert) => {
        if (currentUser.user.userType === 'police') {
            showNotification(`New emergency alert: ${alert.message}`, 'error');
        }
    });
    
    socket.on(`family_alert_${currentUser.user.id}`, (alert) => {
        showNotification(`Family Alert: ${alert.message}`, 'warning');
    });
    
    socket.on(`family_emergency_${currentUser.user.id}`, (alert) => {
        showNotification(`EMERGENCY: ${alert.message}`, 'error');
    });
    
    socket.on(`location_update_${currentUser.user.id}`, (data) => {
        console.log('Location update received:', data);
    });
}

// UI functions
function showAuthContainer() {
    document.getElementById('authContainer').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('sosBtn').classList.add('hidden');
    document.getElementById('profileBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('sosBtn').classList.remove('hidden');
    document.getElementById('profileBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
}

function showQRCode() {
    if (!currentUser?.user?.qrCode) return;
    
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrCodeContainer');
    
    container.innerHTML = `<img src="${currentUser.user.qrCode}" alt="QR Code" class="w-64 h-64 mx-auto">`;
    modal.classList.remove('hidden');
}

// Location tracking functions
function startLocationTracking() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by this browser', 'error');
        return;
    }
    
    trackingActive = true;
    
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    
    navigator.geolocation.watchPosition(
        (position) => {
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date().toISOString()
            };
            
            if (isOffline) {
                saveToOfflineStorage('locations', locationData);
            } else {
                updateLocation(locationData);
            }
        },
        (error) => {
            console.error('Location error:', error);
            showNotification('Location tracking error', 'error');
        },
        options
    );
    
    showNotification(translate('tracking_started'), 'success');
}

async function updateLocation(locationData) {
    try {
        await apiCall('/api/tracking/update', {
            method: 'POST',
            body: JSON.stringify(locationData)
        });
    } catch (error) {
        console.error('Location update error:', error);
        if (!isOffline) {
            saveToOfflineStorage('locations', locationData);
        }
    }
}

async function sendSOS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const sosData = {
                    type: 'EMERGENCY',
                    message: 'Emergency assistance required',
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                };
                
                try {
                    if (isOffline) {
                        saveToOfflineStorage('sos', sosData);
                        showNotification('SOS saved for when you\'re back online', 'warning');
                    } else {
                        await apiCall('/api/sos', {
                            method: 'POST',
                            body: JSON.stringify(sosData)
                        });
                        showNotification(translate('sos_sent'), 'success');
                    }
                } catch (error) {
                    showNotification('Failed to send SOS', 'error');
                    saveToOfflineStorage('sos', sosData);
                }
            },
            (error) => {
                // Send SOS without location if geolocation fails
                const sosData = {
                    type: 'EMERGENCY',
                    message: 'Emergency assistance required - location unavailable'
                };
                
                if (isOffline) {
                    saveToOfflineStorage('sos', sosData);
                } else {
                    apiCall('/api/sos', {
                        method: 'POST',
                        body: JSON.stringify(sosData)
                    }).then(() => {
                        showNotification(translate('sos_sent'), 'success');
                    }).catch(() => {
                        showNotification('Failed to send SOS', 'error');
                        saveToOfflineStorage('sos', sosData);
                    });
                }
            }
        );
    }
}

// Content loading functions
async function loadPlaces() {
    try {
        const places = await apiCall('/api/places');
        showPlacesModal(places);
    } catch (error) {
        showNotification('Failed to load places', 'error');
    }
}

async function loadFestivals() {
    try {
        const festivals = await apiCall('/api/festivals');
        showFestivalsModal(festivals);
    } catch (error) {
        showNotification('Failed to load festivals', 'error');
    }
}

function showPlacesModal(places) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-4xl max-h-full overflow-y-auto">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Popular Destinations</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${places.map(place => `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition">
                            <h3 class="text-xl font-semibold mb-2">${place.name}</h3>
                            <p class="text-gray-600 mb-2">${place.location}</p>
                            <div class="flex items-center mb-2">
                                <div class="flex text-yellow-400 mr-2">
                                    ${'★'.repeat(Math.floor(place.rating))}
                                </div>
                                <span class="text-sm text-gray-500">${place.rating} (${place.reviews} reviews)</span>
                            </div>
                            <p class="text-sm text-gray-700 mb-3">${place.description}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-green-600 font-semibold">₹${place.avgCost}/person</span>
                                <button onclick="createItinerary('${place.name}')" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                                    Plan Trip
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function showFestivalsModal(festivals) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-4xl max-h-full overflow-y-auto">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">Indian Festivals & Events</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${festivals.map(festival => `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition">
                            <h3 class="text-xl font-semibold mb-2">${festival.name}</h3>
                            <p class="text-gray-600 mb-2">${festival.location}</p>
                            <p class="text-sm text-blue-600 mb-2">${festival.month}</p>
                            <p class="text-sm text-gray-700 mb-3">${festival.description}</p>
                            <div class="mb-3">
                                <span class="text-sm font-medium text-gray-700">Best Places:</span>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    ${festival.bestPlaces.map(place => `
                                        <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${place}</span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function createItinerary(destination) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6 border-b">
                <h2 class="text-2xl font-bold">Plan Your Trip</h2>
            </div>
            <form id="itineraryForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <input type="text" value="${destination}" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <select name="duration" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="2">2 Days</option>
                        <option value="3">3 Days</option>
                        <option value="5">5 Days</option>
                        <option value="7">1 Week</option>
                        <option value="10">10 Days</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                    <input type="number" name="budget" placeholder="10000" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                    <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center">
                            <input type="checkbox" name="interests" value="culture" class="mr-2">
                            <span class="text-sm">Culture</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="interests" value="adventure" class="mr-2">
                            <span class="text-sm">Adventure</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="interests" value="nature" class="mr-2">
                            <span class="text-sm">Nature</span>
                        </label>
                        <label class="flex items-center">
                            <input type="checkbox" name="interests" value="food" class="mr-2">
                            <span class="text-sm">Food</span>
                        </label>
                    </div>
                </div>
                <div class="flex gap-3 pt-4">
                    <button type="submit" class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Create Itinerary
                    </button>
                    <button type="button" onclick="this.closest('.fixed').remove()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('itineraryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const interests = Array.from(formData.getAll('interests'));
        
        try {
            const itinerary = await apiCall('/api/itinerary', {
                method: 'POST',
                body: JSON.stringify({
                    destination,
                    duration: formData.get('duration'),
                    budget: parseInt(formData.get('budget')),
                    interests
                })
            });
            
            modal.remove();
            showItineraryModal(itinerary.itinerary);
        } catch (error) {
            showNotification('Failed to create itinerary', 'error');
        }
    });
}

function showItineraryModal(itinerary) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-4xl max-h-full overflow-y-auto">
            <div class="p-6 border-b">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">${itinerary.destination} Itinerary</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <p class="text-gray-600">${itinerary.location} • ${itinerary.duration} days • ₹${itinerary.estimatedCost} estimated</p>
            </div>
            <div class="p-6">
                ${itinerary.days.map(day => `
                    <div class="mb-8 border-l-4 border-blue-500 pl-4">
                        <h3 class="text-xl font-semibold mb-4">Day ${day.day}</h3>
                        <div class="space-y-3">
                            ${day.activities.map(activity => `
                                <div class="flex items-start bg-gray-50 p-3 rounded-lg">
                                    <div class="text-blue-600 font-medium mr-4 min-w-0">${activity.time}</div>
                                    <div class="flex-1">
                                        <h4 class="font-medium">${activity.activity}</h4>
                                        <p class="text-sm text-gray-600">${activity.location} • ${activity.duration}</p>
                                        ${activity.cost > 0 ? `<span class="text-sm text-green-600">₹${activity.cost}</span>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mt-3 text-right">
                            <span class="text-sm font-medium text-gray-700">Day Total: ₹${day.totalDayCost}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 1000);
    
    // Load saved user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        initializeSocket();
        showDashboard();
    } else {
        showAuthContainer();
    }
    
    // Load preferred language
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
        document.getElementById('languageSelect').value = savedLanguage;
        updateLanguage(savedLanguage);
    }
    
    // Load offline data
    loadOfflineData();
    
    // Check online status
    checkOnlineStatus();
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);
    
    // Language selector
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        updateLanguage(e.target.value);
    });
    
    // Auth form toggles
    document.getElementById('loginTab').addEventListener('click', () => {
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginTab').className = 'flex-1 py-2 px-4 rounded-lg bg-white shadow text-blue-600 font-medium';
        document.getElementById('registerTab').className = 'flex-1 py-2 px-4 rounded-lg text-gray-600 font-medium';
    });
    
    document.getElementById('registerTab').addEventListener('click', () => {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
        document.getElementById('registerTab').className = 'flex-1 py-2 px-4 rounded-lg bg-white shadow text-blue-600 font-medium';
        document.getElementById('loginTab').className = 'flex-1 py-2 px-4 rounded-lg text-gray-600 font-medium';
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await login(email, password);
        } catch (error) {
            console.error('Login error:', error);
        }
    });
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            password: document.getElementById('registerPassword').value,
            userType: document.getElementById('userType').value,
            aadharNumber: document.getElementById('aadharNumber').value,
            passportNumber: document.getElementById('passportNumber').value,
            emergencyContact: document.getElementById('emergencyContact').value
        };
        
        try {
            await register(userData);
        } catch (error) {
            console.error('Register error:', error);
        }
    });
    
    // Navigation buttons
    document.getElementById('profileBtn').addEventListener('click', showQRCode);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Dashboard buttons
    document.getElementById('exploreBtn').addEventListener('click', loadPlaces);
    document.getElementById('trackingBtn').addEventListener('click', () => {
        if (!trackingActive) {
            startLocationTracking();
        } else {
            trackingActive = false;
            showNotification(translate('tracking_stopped'), 'info');
        }
    });
    
    // Map control buttons
    document.getElementById('myLocationBtn')?.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (typeof centerMapOnLocation === 'function') {
                    centerMapOnLocation(userPos.lat, userPos.lng);
                }
                if (typeof updateUserLocationMarker === 'function') {
                    updateUserLocationMarker(userPos);
                }
            });
        }
    });
    
    document.getElementById('trackingToggleBtn')?.addEventListener('click', () => {
        if (!trackingActive) {
            startLocationTracking();
            if (typeof trackUserLocation === 'function') {
                trackUserLocation();
            }
            document.getElementById('trackingToggleBtn').innerHTML = '<i class="fas fa-satellite-dish mr-2"></i>Disable Tracking';
            document.getElementById('trackingToggleBtn').classList.remove('bg-green-600', 'hover:bg-green-700');
            document.getElementById('trackingToggleBtn').classList.add('bg-red-600', 'hover:bg-red-700');
        } else {
            trackingActive = false;
            showNotification(translate('tracking_stopped'), 'info');
            document.getElementById('trackingToggleBtn').innerHTML = '<i class="fas fa-satellite-dish mr-2"></i>Enable Tracking';
            document.getElementById('trackingToggleBtn').classList.remove('bg-red-600', 'hover:bg-red-700');
            document.getElementById('trackingToggleBtn').classList.add('bg-green-600', 'hover:bg-green-700');
        }
    });
    
    document.getElementById('shareLocationBtn')?.addEventListener('click', () => {
        if (navigator.share && currentUser) {
            navigator.share({
                title: 'My Location - Indian Tourism Safety',
                text: `I'm sharing my location for safety. Track me at:`,
                url: `${window.location.origin}?track=${currentUser.user.id}`
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            if (currentUser) {
                navigator.clipboard.writeText(`${window.location.origin}?track=${currentUser.user.id}`)
                    .then(() => showNotification('Location sharing link copied to clipboard', 'success'))
                    .catch(() => showNotification('Could not copy link', 'error'));
            }
        }
    });
    
    document.getElementById('mapStyleSelect')?.addEventListener('change', (e) => {
        if (typeof map !== 'undefined' && map) {
            map.setMapTypeId(e.target.value);
        }
    });
    
    // Quick action buttons
    document.getElementById('placesBtn').addEventListener('click', loadPlaces);
    document.getElementById('festivalsBtn').addEventListener('click', loadFestivals);
    document.getElementById('itineraryBtn').addEventListener('click', () => {
        createItinerary('');
    });
    
    // SOS button
    document.getElementById('sosBtn').addEventListener('click', () => {
        if (confirm('Send emergency SOS alert?')) {
            sendSOS();
        }
    });
    
    // QR Modal close
    document.getElementById('closeQrModal').addEventListener('click', () => {
        document.getElementById('qrModal').classList.add('hidden');
    });
    
    // User type change handler
    document.getElementById('userType').addEventListener('change', (e) => {
        const aadhar = document.getElementById('aadharNumber');
        const passport = document.getElementById('passportNumber');
        
        if (e.target.value === 'indian_citizen') {
            aadhar.required = true;
            passport.required = false;
            aadhar.placeholder = 'Aadhar Number (Required)';
            passport.placeholder = 'Passport Number (Optional)';
        } else {
            aadhar.required = false;
            passport.required = true;
            aadhar.placeholder = 'Aadhar Number (Optional)';
            passport.placeholder = 'Passport Number (Required)';
        }
    });
});

// Voice accessibility support
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        speechSynthesis.speak(utterance);
    }
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 's') {
        // Alt+S for SOS
        e.preventDefault();
        if (currentUser && confirm('Send emergency SOS alert?')) {
            sendSOS();
        }
    } else if (e.altKey && e.key === 'q') {
        // Alt+Q for QR code
        e.preventDefault();
        if (currentUser) {
            showQRCode();
        }
    } else if (e.altKey && e.key === 't') {
        // Alt+T for tracking toggle
        e.preventDefault();
        if (currentUser) {
            if (!trackingActive) {
                startLocationTracking();
            } else {
                trackingActive = false;
                showNotification(translate('tracking_stopped'), 'info');
            }
        }
    }
});

// Service Worker for offline functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service Worker registered:', registration);
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });
}
