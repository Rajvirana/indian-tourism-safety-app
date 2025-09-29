// Global variables
let currentUser = null;
let socket = null;
let trackingActive = false;
let currentLanguage = 'en';
let isOffline = false;
let offlineData = {};
let chatbotOpen = false;

// Translations object
const translations = {
    en: {
        app_name: "GuardianGo",
        loading: "Loading...",
        profile: "Profile",
        logout: "Logout",
        welcome: "Welcome to GuardianGo",
        auth_subtitle: "Your digital travel companion for India",
        back_to_home: "Back to Home",
        login: "Login",
        register: "Register",
        sign_in: "Sign In",
        create_account: "Create Account",
        explore_india: "Discover Incredible India",
        hero_subtitle: "Experience the beauty, culture, and heritage of India with personalized travel planning",
        start_exploring: "Start Exploring",
        generate_trip: "Generate My Trip",
        generate_perfect_trip: "Generate My Perfect Trip",
        enable_tracking: "Enable Tracking",
        features_title: "Your Travel Companion Features",
        features_subtitle: "Everything you need for an amazing travel experience",
        qr_verification: "Digital Travel ID",
        qr_description: "Quick verification for seamless entry at attractions and hotels",
        live_tracking: "Location Sharing",
        tracking_description: "Share your journey with family and explore with confidence", 
        smart_recommendations: "Smart Recommendations",
        recommendations_description: "AI-powered travel suggestions based on weather, season, and preferences",
        multilingual: "Multilingual Support",
        multilingual_description: "Experience India in 12+ local languages with cultural insights",
        quick_actions: "Quick Actions",
        explore_places: "Explore Places",
        places_description: "Discover top-rated destinations and hidden gems",
        festivals: "Festivals & Events",
        festivals_description: "Find cultural celebrations and local events",
        plan_itinerary: "Plan Itinerary",
        itinerary_description: "Create personalized travel plans",
        smart_rec_description: "AI-powered seasonal suggestions",
        your_qr_code: "Your Verification QR Code",
        qr_instructions: "Show this QR code for identity verification",
        close: "Close",
        offline_mode: "Offline Mode Active",
        emergency_sos: "Emergency SOS",
        sos_sent: "SOS Alert Sent Successfully",
        tracking_started: "Location Tracking Started",
        tracking_stopped: "Location Tracking Stopped",
        travel_assistant: "Travel Assistant",
        chatbot_welcome: "Hi! I'm your travel assistant. How can I help you explore India safely?",
        emergency_help: "Emergency Help",
        find_places: "Find Places",
        weather_info: "Weather Info",
        transport_info: "Transport",
        smart_recommendations: "Smart Recommendations",
        type_message: "Type your message...",
        live_tourist_tracking: "Live Tourist Tracking Map",
        map_legend: "Map Legend",
        active_tourists: "Active Tourists",
        emergency_alerts: "Emergency Alerts", 
        foreign_tourists: "Foreign Tourists",
        safe_zones: "Safe Zones",
        my_location: "My Location",
        disable_tracking: "Disable Tracking",
        enable_tracking: "Enable Tracking",
        share_location: "Share Location",
        map_style: "Map Style:",
        roadmap: "Roadmap",
        satellite: "Satellite",
        hybrid: "Hybrid", 
        terrain: "Terrain",
        qr_enhanced_title: "Your Digital Travel ID",
        qr_airport_benefits: "Skip long queues at airports, attractions, and security checkpoints",
        qr_how_to_use: "How to Use Your QR Code:",
        qr_step1: "Show at airport security for priority lanes",
        qr_step2: "Fast-track entry at monuments and attractions", 
        qr_step3: "Quick verification at hotels and transport",
        qr_step4: "Emergency contact access for authorities",
        download_qr: "Download QR Code",
        share_qr: "Share QR Code",
        generating_qr: "Generating your secure travel ID...",
        tracking_started: "Location tracking started",
        tracking_stopped: "Location tracking stopped"
    },
    hi: {
        app_name: "गार्डियनगो",
        loading: "लोड हो रहा है...",
        profile: "प्रोफाइल",
        logout: "लॉग आउट",
        welcome: "गार्डियनगो में आपका स्वागत है",
        auth_subtitle: "भारत के लिए आपका डिजिटल यात्रा साथी",
        back_to_home: "होम पर वापस जाएं",
        login: "लॉगिन",
        register: "पंजीकरण",
        sign_in: "साइन इन",
        create_account: "खाता बनाएं",
        explore_india: "अतुल्य भारत की खोज करें",
        hero_subtitle: "व्यक्तिगत यात्रा योजना के साथ भारत की सुंदरता, संस्कृति और विरासत का अनुभव करें",
        start_exploring: "यात्रा शुरू करें",
        generate_trip: "मेरी यात्रा बनाएं",
        generate_perfect_trip: "मेरी सही यात्रा बनाएं",
        enable_tracking: "ट्रैकिंग सक्षम करें",
        offline_mode: "ऑफलाइन मोड सक्रिय",
        travel_assistant: "यात्रा सहायक",
        chatbot_welcome: "नमस्ते! मैं आपका यात्रा सहायक हूं। भारत की सुरक्षित यात्रा में मैं आपकी कैसे मदद कर सकता हूं?",
        emergency_help: "आपातकालीन सहायता",
        find_places: "स्थान खोजें",
        weather_info: "मौसम जानकारी",
        transport_info: "परिवहन",
        smart_recommendations: "स्मार्ट सिफारिशें",
        smart_rec_description: "AI-संचालित मौसमी सुझाव",
        type_message: "अपना संदेश टाइप करें...",
        welcome: "गार्डियनगो में आपका स्वागत है",
        auth_subtitle: "सुरक्षित अन्वेषण के लिए आपका सत्यापित यात्रा साथी",
        login: "लॉगिन",
        register: "पंजीकरण",
        sign_in: "साइन इन",
        create_account: "खाता बनाएं",
        explore_india: "भारत को सुरक्षित रूप से देखें",
        hero_subtitle: "सत्यापित पहचान और रियल-टाइम सुरक्षा ट्रैकिंग के साथ अद्भुत स्थानों की खोज करें",
        features_title: "आपके यात्रा साथी की विशेषताएं",
        features_subtitle: "अद्भुत यात्रा अनुभव के लिए आवश्यक सब कुछ",
        qr_verification: "डिजिटल यात्रा पहचान",
        qr_description: "आकर्षण और होटलों में निर्बाध प्रवेश के लिए त्वरित सत्यापन",
        live_tracking: "स्थान साझाकरण",
        tracking_description: "परिवार के साथ अपनी यात्रा साझा करें और आत्मविश्वास से खोज करें",
        multilingual: "बहुभाषी समर्थन",
        multilingual_description: "सांस्कृतिक अंतर्दृष्टि के साथ 12+ स्थानीय भाषाओं में भारत का अनुभव करें",
        quick_actions: "त्वरित क्रियाएं",
        explore_places: "स्थान खोजें",
        places_description: "शीर्ष-रेटेड गंतव्य और छुपे हुए रत्न खोजें",
        festivals: "त्योहार और कार्यक्रम",
        festivals_description: "सांस्कृतिक उत्सव और स्थानीय कार्यक्रम खोजें",
        plan_itinerary: "यात्रा कार्यक्रम बनाएं",
        itinerary_description: "व्यक्तिगत यात्रा योजनाएं बनाएं",
        your_qr_code: "आपका सत्यापन QR कोड",
        qr_instructions: "पहचान सत्यापन के लिए यह QR कोड दिखाएं",
        close: "बंद करें",
        live_tourist_tracking: "लाइव पर्यटक ट्रैकिंग मैप",
        map_legend: "मैप लीजेंड",
        active_tourists: "सक्रिय पर्यटक",
        emergency_alerts: "आपातकालीन अलर्ट",
        foreign_tourists: "विदेशी पर्यटक",
        safe_zones: "सुरक्षित क्षेत्र",
        my_location: "मेरा स्थान",
        disable_tracking: "ट्रैकिंग बंद करें",
        enable_tracking: "ट्रैकिंग सक्षम करें",
        share_location: "स्थान साझा करें",
        map_style: "मैप शैली:",
        roadmap: "रोडमैप",
        satellite: "सैटेलाइट",
        hybrid: "हाइब्रिड",
        terrain: "भूभाग",
        qr_enhanced_title: "आपकी डिजिटल यात्रा पहचान",
        qr_airport_benefits: "हवाई अड्डों, आकर्षणों और सुरक्षा चेकपॉइंट्स पर लंबी कतारें छोड़ें",
        qr_how_to_use: "अपना QR कोड कैसे उपयोग करें:",
        qr_step1: "प्राथमिकता लेन के लिए हवाई अड्डा सुरक्षा पर दिखाएं",
        qr_step2: "स्मारकों और आकर्षणों पर फास्ट-ट्रैक प्रवेश",
        qr_step3: "होटल और परिवहन पर त्वरित सत्यापन",
        qr_step4: "अधिकारियों के लिए आपातकालीन संपर्क पहुंच",
        download_qr: "QR कोड डाउनलोड करें",
        share_qr: "QR कोड साझा करें",
        generating_qr: "आपकी सुरक्षित यात्रा पहचान बनाई जा रही है...",
        tracking_started: "स्थान ट्रैकिंग शुरू की गई",
        tracking_stopped: "स्थान ट्रैकिंग बंद की गई"
    }
    // Add more languages as needed
};

// Chatbot responses
const chatbotResponses = {
    en: {
        emergency: {
            text: "🚨 For immediate emergencies, click the red SOS button below. For non-urgent help:",
            quickReplies: ["Police Numbers", "Hospital Info", "Embassy Contacts", "Lost & Found"]
        },
        places: {
            text: "🏛️ I can help you discover amazing places in India! What interests you?",
            quickReplies: ["Historical Sites", "Beaches", "Mountains", "Temples", "Cultural Sites"]
        },
        weather: {
            text: "🌤️ Let me help you with weather information. Which city are you visiting?",
            quickReplies: ["Delhi", "Mumbai", "Bangalore", "Goa", "Current Location"]
        },
        transport: {
            text: "🚗 I can help with transportation options in India:",
            quickReplies: ["Trains", "Flights", "Buses", "Local Transport", "Cab Services"]
        },
        smart: {
            text: "🧠 Let me show you the best places to visit this month based on weather, seasons, and special attractions!",
            quickReplies: ["This Month", "Next Month", "Seasonal Guide", "Weather Based"]
        },
        police: {
            text: "🚔 Emergency Police Numbers:\n• National Emergency: 112\n• Police: 100\n• Women Helpline: 1091\n• Tourist Helpline: 1363",
            quickReplies: ["SOS Button", "Report Issue", "Safety Tips"]
        },
        hospitals: {
            text: "🏥 Medical Emergency Numbers:\n• Ambulance: 108\n• Medical Emergency: 102\nFor specific hospitals near you, please share your location.",
            quickReplies: ["Share Location", "Blood Banks", "Pharmacy", "Insurance"]
        },
        trains: {
            text: "🚂 Indian Railways Information:\n• Book tickets: IRCTC app/website\n• PNR Status: SMS PNR to 139\n• Railway Enquiry: 139\n• Reservation: 139",
            quickReplies: ["Book Tickets", "Check PNR", "Station Info", "Train Status"]
        },
        safety_tips: {
            text: "🛡️ Safety Tips for India:\n• Always carry ID\n• Share location with family\n• Use verified transport\n• Keep emergency contacts handy\n• Trust your instincts",
            quickReplies: ["Emergency Contacts", "Safety Checklist", "Travel Documents"]
        },
        historical: {
            text: "🏛️ Popular Historical Sites:\n• Taj Mahal, Agra\n• Red Fort, Delhi\n• Ajanta Caves, Maharashtra\n• Hampi, Karnataka\n• Konark Temple, Odisha",
            quickReplies: ["More Details", "Booking Info", "Best Time to Visit", "Travel Tips"]
        },
        help: {
            text: "ℹ️ I'm your travel assistant for India! I can help with:\n• Emergency information\n• Tourist places\n• Transportation\n• Weather\n• Safety tips\n\nYou can also use keyboard shortcuts:\n• Alt+C: Toggle chatbot\n• Alt+S: SOS (when logged in)",
            quickReplies: ["Get Started", "Emergency Info", "Tourism Info", "Login Help"]
        },
        login_help: {
            text: "🔐 To access full features like SOS, location tracking, and personalized recommendations, please register or login above. Registration includes:\n• Verified identity with QR code\n• Real-time location tracking\n• Emergency SOS alerts\n• Family notifications",
            quickReplies: ["Registration Benefits", "Safety Features", "How to Register"]
        }
    },
    hi: {
        emergency: {
            text: "🚨 तत्काल आपातकाल के लिए, नीचे लाल SOS बटन दबाएं। गैर-जरूरी सहायता के लिए:",
            quickReplies: ["पुलिस नंबर", "अस्पताल जानकारी", "दूतावास संपर्क", "खोया पाया"]
        },
        places: {
            text: "🏛️ मैं आपको भारत में अद्भुत स्थानों की खोज में मदद कर सकता हूं! आपकी क्या रुचि है?",
            quickReplies: ["ऐतिहासिक स्थल", "समुद्र तट", "पहाड़", "मंदिर", "सांस्कृतिक स्थल"]
        }
    }
};

// Utility functions
function translate(key) {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

function updateLanguage(lang) {
    currentLanguage = lang;
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translatedText = translate(key);
        
        // Handle elements that might contain HTML (like icons)
        if (element.querySelector('i') || element.querySelector('span')) {
            // If element contains icons or spans, find text nodes only
            const textNode = Array.from(element.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (textNode) {
                textNode.textContent = translatedText;
            } else {
                // If no direct text node, check for spans without icons
                const textSpan = element.querySelector('span:not([class*="fa"])');
                if (textSpan && !textSpan.querySelector('i')) {
                    textSpan.textContent = translatedText;
                } else {
                    // Fallback: replace entire text content
                    element.textContent = translatedText;
                }
            }
        } else {
            element.textContent = translatedText;
        }
    });
    
    // Update placeholder texts
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Update button innerHTML that have icons
    document.querySelectorAll('button[data-translate]').forEach(button => {
        const key = button.getAttribute('data-translate');
        const translatedText = translate(key);
        const icon = button.querySelector('i');
        
        if (icon) {
            // Preserve the icon and update only text
            const iconHTML = icon.outerHTML;
            const restOfContent = button.innerHTML.replace(icon.outerHTML, '').trim();
            button.innerHTML = `${iconHTML}<span data-translate="${key}">${translatedText}</span>`;
        }
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

// Chatbot functions
function toggleChatbot() {
    console.log('Chatbot toggle clicked!');
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    
    if (chatbotOpen) {
        container.style.display = 'none';
        chatbotOpen = false;
        console.log('Chatbot closed');
    } else {
        container.style.display = 'flex';
        chatbotOpen = true;
        console.log('Chatbot opened');
        // Focus input when opening
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.focus();
        }
    }
}

function addMessage(message, isUser = false) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        const textDiv = document.createElement('div');
        textDiv.textContent = message.text || message;
        messageDiv.appendChild(textDiv);
        
        if (message.quickReplies) {
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'quick-replies';
            
            message.quickReplies.forEach(reply => {
                const replySpan = document.createElement('span');
                replySpan.className = 'quick-reply';
                replySpan.textContent = reply;
                replySpan.onclick = () => handleQuickReply(reply);
                repliesDiv.appendChild(replySpan);
            });
            
            messageDiv.appendChild(repliesDiv);
        }
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleQuickReply(reply) {
    addMessage(reply, true);
    
    // Handle specific quick replies
    const lowerReply = reply.toLowerCase();
    
    if (lowerReply.includes('police') || lowerReply.includes('पुलिस')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('police'));
        }, 500);
    } else if (lowerReply.includes('hospital') || lowerReply.includes('अस्पताल')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('hospitals'));
        }, 500);
    } else if (lowerReply.includes('train') || lowerReply.includes('रेल')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('trains'));
        }, 500);
    } else if (lowerReply.includes('safety') || lowerReply.includes('सुरक्षा')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('safety_tips'));
        }, 500);
    } else if (lowerReply.includes('historical') || lowerReply.includes('ऐतिहासिक')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('historical'));
        }, 500);
    } else if (lowerReply.includes('smart') || lowerReply.includes('recommendation') || lowerReply.includes('this month') || lowerReply.includes('seasonal')) {
        setTimeout(() => {
            if (lowerReply.includes('this month')) {
                loadSmartRecommendations();
            } else {
                addMessage({
                    text: "🧠 Smart recommendations coming right up! I'll show you the perfect places to visit based on the current season and weather conditions.",
                    quickReplies: ["Show This Month", "Browse All Months", "Seasonal Guide"]
                });
            }
        }, 500);
    } else if (lowerReply.includes('sos')) {
        setTimeout(() => {
            addMessage({
                text: "🚨 The SOS button is the red button at the bottom right. Click it only in real emergencies. It will send your location to local authorities and your emergency contacts.",
                quickReplies: ["How does SOS work?", "Test SOS", "Emergency Contacts"]
            });
        }, 500);
    } else if (lowerReply.includes('login') || lowerReply.includes('help')) {
        setTimeout(() => {
            addMessage(getChatbotResponse('login_help'));
        }, 500);
    } else if (lowerReply.includes('get started') || lowerReply.includes('started')) {
        setTimeout(() => {
            addMessage({
                text: "🚀 Great! Let's get started with your India travel experience:\n\n1️⃣ For basic information, you can ask me anything\n2️⃣ For full features, register/login above\n3️⃣ Emergency? Use the red SOS button\n\nWhat interests you most?",
                quickReplies: ["Tourism Info", "Safety Tips", "Register Now", "Emergency Numbers"]
            });
        }, 500);
    } else if (lowerReply.includes('show this month') || lowerReply.includes('browse all months') || lowerReply.includes('seasonal guide')) {
        setTimeout(() => {
            loadSmartRecommendations();
        }, 500);
    } else if (lowerReply.includes('tourism') || lowerReply.includes('info')) {
        setTimeout(() => {
            addMessage({
                text: "🏛️ India Tourism Highlights:\n• 38 UNESCO World Heritage Sites\n• Diverse landscapes from Himalayas to beaches\n• Rich cultural festivals year-round\n• Ancient temples and modern cities\n• Incredible cuisine and hospitality\n\nWhat type of places interest you?",
                quickReplies: ["Historical Sites", "Beaches", "Mountains", "Cultural Sites", "Food Tourism"]
            });
        }, 500);
    } else {
        // Default response for unhandled quick replies
        setTimeout(() => {
            addMessage({
                text: `I understand you're asking about "${reply}". Let me help you with more specific information.`,
                quickReplies: ["Emergency Help", "Find Places", "Transport Info", "Safety Tips"]
            });
        }, 500);
    }
}

function getChatbotResponse(query) {
    const responses = chatbotResponses[currentLanguage] || chatbotResponses.en;
    return responses[query] || {
        text: "I'm sorry, I didn't understand that. How can I help you with your travel to India?",
        quickReplies: ["Emergency Help", "Find Places", "Weather Info", "Transport Info"]
    };
}

function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Help keywords
    if (lowerMessage.includes('help') && !lowerMessage.includes('emergency')) {
        return getChatbotResponse('help');
    }
    
    // Login/registration help
    if (lowerMessage.includes('login') || lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
        return getChatbotResponse('login_help');
    }
    
    // Emergency keywords
    if (lowerMessage.includes('emergency') || lowerMessage.includes('sos') || lowerMessage.includes('urgent')) {
        return getChatbotResponse('emergency');
    }
    
    // Places keywords
    if (lowerMessage.includes('place') || lowerMessage.includes('visit') || lowerMessage.includes('tourist') || lowerMessage.includes('destination') || lowerMessage.includes('attraction')) {
        return getChatbotResponse('places');
    }
    
    // Weather keywords
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature') || lowerMessage.includes('rain') || lowerMessage.includes('climate') || lowerMessage.includes('forecast')) {
        return getChatbotResponse('weather');
    }
    
    // Transport keywords
    if (lowerMessage.includes('transport') || lowerMessage.includes('travel') || lowerMessage.includes('train') || lowerMessage.includes('flight') || lowerMessage.includes('bus') || lowerMessage.includes('taxi') || lowerMessage.includes('cab')) {
        return getChatbotResponse('transport');
    }
    
    // Safety keywords
    if (lowerMessage.includes('safe') || lowerMessage.includes('security') || lowerMessage.includes('tip') || lowerMessage.includes('precaution')) {
        return getChatbotResponse('safety_tips');
    }
    
    // Greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('namaste')) {
        return {
            text: "Hello! Welcome to GuardianGo! 🇮🇳 I'm here to help make your journey safe and memorable. What can I assist you with today?",
            quickReplies: ["Emergency Help", "Find Places", "Weather Info", "Transport Info", "Safety Tips"]
        };
    }
    
    // Default response
    return {
        text: "I'm here to help with your travel in India! I can assist with emergencies, places to visit, weather information, transportation, and safety tips. What would you like to know?",
        quickReplies: ["Emergency Help", "Find Places", "Weather Info", "Transport Info", "Safety Tips"]
    };
}

function sendChatMessage() {
    console.log('Send chat message called');
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    console.log('User message:', message);
    
    if (!message) {
        console.log('Empty message, returning');
        return;
    }
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Show typing indicator (optional)
    setTimeout(() => {
        const response = processUserMessage(message);
        console.log('Bot response:', response);
        addMessage(response);
    }, 1000);
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
    document.getElementById('chatbotToggle').classList.remove('hidden'); // Show chatbot even on auth screen
    document.getElementById('chatbotContainer').style.display = 'none';
    document.getElementById('profileBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');
    chatbotOpen = false;
    
    // Stop hero slideshow when leaving dashboard
    stopHeroSlideshow();
}

function showDashboard() {
    // Close any open modals first
    closeAllModals();
    
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('sosBtn').classList.remove('hidden');
    document.getElementById('chatbotToggle').classList.remove('hidden');
    document.getElementById('profileBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');
    
    // Initialize hero background slideshow and buttons
    setTimeout(() => {
        if (document.getElementById('heroBackground')) {
            // Set initial background
            changeHeroBackground(0);
            // Start slideshow
            startHeroSlideshow();
            
            // Add click listeners to indicators
            document.querySelectorAll('[data-slide]').forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    currentSlide = index;
                    changeHeroBackground(index);
                    // Restart slideshow
                    stopHeroSlideshow();
                    startHeroSlideshow();
                });
            });
        }
        
        // Attach hero button event listeners here when dashboard is shown
        attachHeroButtonListeners();
    }, 100);
}

// Function to attach hero button listeners
function attachHeroButtonListeners() {
    console.log('Attaching hero button listeners...');
    
    const exploreBtn = document.getElementById('exploreBtn');
    const trackingBtn = document.getElementById('trackingBtn');
    
    console.log('Hero buttons found:', { 
        exploreBtn: !!exploreBtn, 
        trackingBtn: !!trackingBtn 
    });
    
    // Also check if the target pages exist
    console.log('Target pages found:', {
        trackingPage: !!document.getElementById('trackingPage'),
        explorePage: !!document.getElementById('explorePage'),
        dashboard: !!document.getElementById('dashboard')
    });
    
    // Remove any existing listeners by cloning the buttons
    if (exploreBtn) {
        const newExploreBtn = exploreBtn.cloneNode(true);
        exploreBtn.parentNode.replaceChild(newExploreBtn, exploreBtn);
        newExploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Explore button clicked!');
            showExplorePage();
        });
    }
    
    if (trackingBtn) {
        const newTrackingBtn = trackingBtn.cloneNode(true);
        trackingBtn.parentNode.replaceChild(newTrackingBtn, trackingBtn);
        newTrackingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Tracking button clicked!');
            showTrackingPage();
        });
    }
}

// Generate Magical Trip Function
function generateMagicalTrip() {
    console.log('Generating magical trip...');
    
    // Create loading modal
    const loadingModal = document.createElement('div');
    loadingModal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
    loadingModal.style.zIndex = '9999';
    
    loadingModal.innerHTML = `
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div class="mb-6">
                <div class="w-20 h-20 mx-auto mb-4 relative">
                    <div class="w-full h-full rounded-full border-4 border-orange-200 animate-spin border-t-orange-500"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="fas fa-magic text-orange-500 text-2xl animate-pulse"></i>
                    </div>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Unlocking Wonders</h3>
                <p class="text-gray-600">Discovering India's hidden gems just for you...</p>
            </div>
            <div class="flex justify-center space-x-1">
                <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                <div class="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingModal);
    
    // Show loading for 3 seconds, then show hidden gems
    setTimeout(() => {
        document.body.removeChild(loadingModal);
        showHiddenGemsModal();
    }, 3000);
}

// Show Hidden Gems Modal
function showHiddenGemsModal() {
    console.log('Showing hidden gems modal...');
    
    const hiddenGems = [
        {
            name: "Hampi, Karnataka",
            description: "Ancient ruins and boulder landscapes that transport you to the Vijayanagara Empire",
            image: "https://images.unsplash.com/photo-1575378834432-7ded0b0e1b7c?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "UNESCO World Heritage Site",
            bestTime: "October to February",
            uniqueFeature: "Sunrise from Matanga Hill"
        },
        {
            name: "Spiti Valley, Himachal Pradesh",
            description: "A high-altitude desert mountain valley with ancient monasteries",
            image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "Cold Desert",
            bestTime: "May to October",
            uniqueFeature: "Key Monastery at 4,166m altitude"
        },
        {
            name: "Majuli Island, Assam",
            description: "World's largest river island with unique Vaishnavite culture",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "Cultural Hotspot",
            bestTime: "November to April",
            uniqueFeature: "Traditional mask-making and pottery"
        },
        {
            name: "Khajjiar, Himachal Pradesh",
            description: "Mini Switzerland of India with lush green meadows",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "Switzerland of India",
            bestTime: "April to June, September to November",
            uniqueFeature: "9-hole golf course surrounded by cedar forests"
        },
        {
            name: "Ziro Valley, Arunachal Pradesh",
            description: "Picturesque valley home to the Apatani tribe with unique agriculture",
            image: "https://images.unsplash.com/photo-1566055255797-1b0f9bb17c25?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "UNESCO World Heritage Site (Tentative)",
            bestTime: "March to October",
            uniqueFeature: "Traditional bamboo and cane crafts"
        },
        {
            name: "Sandakphu, West Bengal",
            description: "Highest peak in West Bengal offering views of 4 tallest peaks in the world",
            image: "https://images.unsplash.com/photo-1464822759844-d150ad6cba19?w=500&h=300&fit=crop&crop=entropy&auto=format&q=80",
            highlight: "Trekker's Paradise",
            bestTime: "October to December, March to May",
            uniqueFeature: "View of Everest, Kanchenjunga, Lhotse, and Makalu"
        }
    ];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.style.zIndex = '9999';
    
    modal.innerHTML = `
        <div class="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-t-3xl">
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">🏔️ Hidden Gems of India</h2>
                        <p class="opacity-90">Discover India's best-kept secrets</p>
                    </div>
                    <button id="closeHiddenGems" class="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <!-- Content -->
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${hiddenGems.map((gem, index) => `
                        <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div class="relative">
                                <img src="${gem.image}" alt="${gem.name}" class="w-full h-48 object-cover">
                                <div class="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    ${gem.highlight}
                                </div>
                            </div>
                            <div class="p-4">
                                <h3 class="text-xl font-bold text-gray-800 mb-2">${gem.name}</h3>
                                <p class="text-gray-600 text-sm mb-3 leading-relaxed">${gem.description}</p>
                                
                                <div class="space-y-2 mb-4">
                                    <div class="flex items-center text-sm">
                                        <i class="fas fa-calendar-alt text-green-500 mr-2"></i>
                                        <span class="text-gray-700"><strong>Best Time:</strong> ${gem.bestTime}</span>
                                    </div>
                                    <div class="flex items-center text-sm">
                                        <i class="fas fa-star text-yellow-500 mr-2"></i>
                                        <span class="text-gray-700"><strong>Special:</strong> ${gem.uniqueFeature}</span>
                                    </div>
                                </div>
                                
                                <button class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all font-medium">
                                    <i class="fas fa-map-marker-alt mr-2"></i>Add to My Trip
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Footer -->
                <div class="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl text-center">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Ready to Explore?</h3>
                    <p class="text-gray-600 mb-4">Create a personalized itinerary with these amazing destinations</p>
                    <button id="createFullItinerary" class="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-semibold shadow-lg">
                        <i class="fas fa-route mr-2"></i>Create Full Itinerary
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('#closeHiddenGems').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#createFullItinerary').addEventListener('click', () => {
        document.body.removeChild(modal);
        createItinerary(); // Use existing itinerary function
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Clean up any open modals
function closeAllModals() {
    // Remove any fixed overlay modals
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        if (modal.style.zIndex === '9999' || modal.id.includes('Modal') || modal.innerHTML.includes('modal')) {
            modal.remove();
        }
    });
    
    // Clean up specific modal containers
    const modalContainer = document.getElementById('modalContainer');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}

// Page Navigation Functions
function showTrackingPage() {
    console.log('showTrackingPage called');
    
    // Close any open modals first
    closeAllModals();
    
    // Hide all other pages
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('explorePage').classList.add('hidden');
    
    // Show tracking page
    const trackingPage = document.getElementById('trackingPage');
    if (trackingPage) {
        trackingPage.classList.remove('hidden');
        console.log('Tracking page shown');
        
        // Attach back button listener
        setTimeout(() => {
            const backBtn = document.getElementById('backFromTrackingBtn');
            if (backBtn) {
                // Remove existing listeners by cloning
                const newBackBtn = backBtn.cloneNode(true);
                backBtn.parentNode.replaceChild(newBackBtn, backBtn);
                newBackBtn.addEventListener('click', () => {
                    console.log('Back from tracking clicked!');
                    showHomePage();
                });
            }
        }, 50);
    } else {
        console.error('trackingPage element not found!');
    }
    
    // Initialize map if not already initialized
    setTimeout(() => {
        if (typeof initializeMap === 'function') {
            initializeMap();
        }
    }, 100);
}

function showExplorePage() {
    console.log('showExplorePage called');
    
    // Close any open modals first
    closeAllModals();
    
    // Hide all other pages
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('trackingPage').classList.add('hidden');
    
    // Show explore page
    const explorePage = document.getElementById('explorePage');
    if (explorePage) {
        explorePage.classList.remove('hidden');
        console.log('Explore page shown');
        
        // Attach back button listener
        setTimeout(() => {
            const backBtn = document.getElementById('backFromExploreBtn');
            if (backBtn) {
                // Remove existing listeners by cloning
                const newBackBtn = backBtn.cloneNode(true);
                backBtn.parentNode.replaceChild(newBackBtn, backBtn);
                newBackBtn.addEventListener('click', () => {
                    console.log('Back from explore clicked!');
                    showHomePage();
                });
            }
        }, 50);
    } else {
        console.error('explorePage element not found!');
    }
}

function showHomePage() {
    console.log('showHomePage called');
    
    // Close any open modals first
    closeAllModals();
    
    // Hide all other pages
    document.getElementById('trackingPage').classList.add('hidden');
    document.getElementById('explorePage').classList.add('hidden');
    
    // Show dashboard
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.remove('hidden');
        console.log('Dashboard shown');
    } else {
        console.error('Dashboard element not found!');
    }
    
    // Restart hero slideshow when returning to home
    setTimeout(() => {
        if (document.getElementById('heroBackground')) {
            changeHeroBackground(0);
            startHeroSlideshow();
        }
    }, 100);
}

function showQRCode() {
    // Generate QR code data for current user
    const userData = {
        name: localStorage.getItem('userName') || 'Guardian Traveler',
        id: localStorage.getItem('userId') || Date.now().toString(),
        timestamp: new Date().toISOString(),
        travelId: 'GT-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    };
    
    // Create enhanced QR modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold" data-translate="qr_enhanced_title">Your Digital Travel ID</h2>
                        <p class="text-blue-100 text-sm" data-translate="qr_airport_benefits">Skip long queues at airports, attractions, and security checkpoints</p>
                    </div>
                    <button id="closeQRModal" class="text-white hover:text-gray-200 text-2xl">&times;</button>
                </div>
            </div>
            
            <!-- QR Code Section -->
            <div class="p-6 text-center">
                <div id="qrLoadingState" class="mb-4">
                    <div class="animate-pulse flex flex-col items-center">
                        <div class="w-48 h-48 bg-gray-200 rounded-lg mb-4"></div>
                        <p class="text-gray-500" data-translate="generating_qr">Generating your secure travel ID...</p>
                    </div>
                </div>
                
                <div id="qrActiveState" class="hidden">
                    <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl mb-4">
                        <div id="qrCodeDisplay" class="w-48 h-48 mx-auto cursor-pointer hover:scale-105 transition-transform rounded-lg shadow-lg bg-white flex items-center justify-center"
                             onclick="openQRInNewTab()">
                            <i class="fas fa-qrcode text-4xl text-gray-400"></i>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">Click to view full size</p>
                        <div class="mt-3 text-xs text-gray-600">
                            <p><strong>Travel ID:</strong> ${userData.travelId}</p>
                            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <!-- Benefits -->
                    <div class="text-left bg-green-50 rounded-xl p-4 mb-4">
                        <h3 class="font-semibold text-green-800 mb-3" data-translate="qr_how_to_use">How to Use Your QR Code:</h3>
                        <ul class="space-y-2 text-sm text-green-700">
                            <li class="flex items-start">
                                <span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
                                <span data-translate="qr_step1">Show at airport security for priority lanes</span>
                            </li>
                            <li class="flex items-start">
                                <span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
                                <span data-translate="qr_step2">Fast-track entry at monuments and attractions</span>
                            </li>
                            <li class="flex items-start">
                                <span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
                                <span data-translate="qr_step3">Quick verification at hotels and transport</span>
                            </li>
                            <li class="flex items-start">
                                <span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span>
                                <span data-translate="qr_step4">Emergency contact access for authorities</span>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="downloadQR()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                            <i class="fas fa-download mr-2"></i>
                            <span data-translate="download_qr">Download</span>
                        </button>
                        <button onclick="shareQR()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center">
                            <i class="fas fa-share-alt mr-2"></i>
                            <span data-translate="share_qr">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Apply translations to the modal content
    updateLanguage();
    
    // Generate actual QR code
    setTimeout(async () => {
        try {
            const response = await fetch('/api/generate-qr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: JSON.stringify(userData) })
            });
            
            if (response.ok) {
                const { qrCodeData } = await response.json();
                const qrDisplay = document.getElementById('qrCodeDisplay');
                if (qrDisplay) {
                    qrDisplay.innerHTML = `<img src="${qrCodeData}" alt="QR Code" class="w-full h-full object-contain rounded-lg">`;
                }
            } else {
                // Fallback: show a placeholder QR
                const qrDisplay = document.getElementById('qrCodeDisplay');
                if (qrDisplay) {
                    qrDisplay.innerHTML = `
                        <div class="text-center">
                            <i class="fas fa-qrcode text-6xl text-blue-500 mb-2"></i>
                            <p class="text-xs text-gray-600">QR Code Ready</p>
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('QR Generation Error:', error);
            // Show fallback QR display
            const qrDisplay = document.getElementById('qrCodeDisplay');
            if (qrDisplay) {
                qrDisplay.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-qrcode text-6xl text-orange-500 mb-2"></i>
                        <p class="text-xs text-orange-600">Travel QR Active</p>
                    </div>
                `;
            }
        }
        
        // Show the QR section
        document.getElementById('qrLoadingState').classList.add('hidden');
        document.getElementById('qrActiveState').classList.remove('hidden');
    }, 1000);
    
    // Close modal event
    document.getElementById('closeQRModal').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// QR utility functions
function openQRInNewTab() {
    if (currentUser?.user?.qrCode) {
        window.open(currentUser.user.qrCode, '_blank');
    }
}

function downloadQR() {
    if (!currentUser?.user?.qrCode) return;
    
    const link = document.createElement('a');
    link.href = currentUser.user.qrCode;
    link.download = `GuardianGo-QR-${currentUser.user.name || currentUser.user.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('QR Code downloaded successfully!', 'success');
}

function shareQR() {
    if (!currentUser?.user?.qrCode) return;
    
    if (navigator.share) {
        fetch(currentUser.user.qrCode)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'guardiango-qr.png', { type: 'image/png' });
                return navigator.share({
                    title: 'My GuardianGo Travel ID',
                    text: 'Here\'s my verified travel QR code for quick entry at airports and attractions!',
                    files: [file]
                });
            })
            .catch(err => {
                // Fallback to URL sharing
                navigator.share({
                    title: 'My GuardianGo Travel ID',
                    text: 'Check out my verified travel QR code!',
                    url: currentUser.user.qrCode
                }).catch(console.error);
            });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(currentUser.user.qrCode)
            .then(() => showNotification('QR Code URL copied to clipboard!', 'success'))
            .catch(() => showNotification('Unable to share QR Code', 'error'));
    }
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

async function loadSmartRecommendations(month = null) {
    try {
        // Prevent calling if not logged in or if already loading
        if (!currentUser) {
            console.log('Please log in to view smart recommendations');
            return;
        }
        
        // Check if modal is already open
        if (document.getElementById('smartRecommendationsModal')) {
            console.log('Smart recommendations modal is already open');
            return;
        }
        
        console.log('Loading smart recommendations...');
        const url = month ? `/api/smart-recommendations?month=${month}` : '/api/smart-recommendations';
        const data = await apiCall(url);
        
        // Only show modal if data is valid
        if (data && (data.recommendations || data.message)) {
            showSmartRecommendationsModal(data);
        } else {
            showNotification('No recommendations available', 'info');
        }
    } catch (error) {
        console.error('Smart recommendations error:', error);
        showNotification('Failed to load smart recommendations: ' + error.message, 'error');
    }
}

function showPlacesModal(places) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-5xl max-h-full overflow-y-auto">
            <!-- Header with gradient -->
            <div class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                    </button>
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-map-marked-alt mr-3"></i>Popular Destinations in India
                </h2>
                <p class="text-lg opacity-90">Discover amazing places to visit across incredible India</p>
                </div>
            
            <!-- Search Section -->
            <div class="p-6 bg-gray-50 border-b">
                <div class="relative max-w-md mx-auto">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i class="fas fa-search text-gray-400"></i>
            </div>
                    <input type="text" id="placesSearchInput" 
                           placeholder="Search destinations... (e.g. Goa, Mumbai, Kerala)" 
                           class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div class="flex justify-center mt-4 space-x-2">
                    <button onclick="filterPlacesByCategory('all')" class="category-filter active bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition">
                        All Places
                    </button>
                    <button onclick="filterPlacesByCategory('Historical')" class="category-filter bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition">
                        Historical
                    </button>
                    <button onclick="filterPlacesByCategory('Beach')" class="category-filter bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition">
                        Beaches
                    </button>
                    <button onclick="filterPlacesByCategory('Hill Station')" class="category-filter bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition">
                        Hill Stations
                    </button>
                    <button onclick="filterPlacesByCategory('Cultural')" class="category-filter bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-300 transition">
                        Cultural
                    </button>
                </div>
            </div>
            
            <!-- Places Grid -->
            <div class="p-6">
                <div id="placesResultsCount" class="mb-4 text-sm text-gray-600">
                    Showing ${places.length} destinations
                </div>
                <div id="placesGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${renderPlacesHTML(places)}
                </div>
                <div id="noPlacesFound" class="hidden text-center py-12">
                    <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
                    <p class="text-gray-500">Try searching for a different destination or clear your search.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Store places data for searching
    window.allPlaces = places;
    
    // Add search event listener
    const searchInput = document.getElementById('placesSearchInput');
    searchInput.addEventListener('input', (e) => {
        filterPlaces(e.target.value);
    });
    
    // Add enter key support for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterPlaces(e.target.value);
        }
    });
}

function renderPlacesHTML(places) {
    return places.map(place => `
        <div class="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            ${place.image ? `
                <div class="relative h-48 bg-gray-200">
                    <img src="${place.image}" alt="${place.name}" class="w-full h-full object-cover" loading="lazy">
                    <div class="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${place.category}
                    </div>
                </div>
            ` : `
                <div class="h-48 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <div class="text-center text-white">
                        <i class="fas fa-map-marker-alt text-4xl mb-2"></i>
                        <p class="text-sm font-medium">${place.category}</p>
                    </div>
                </div>
            `}
            <div class="p-5">
                <h3 class="text-xl font-bold mb-2 text-gray-800">${place.name}</h3>
                <p class="text-gray-600 mb-2 flex items-center">
                    <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>${place.location}
                </p>
                <div class="flex items-center mb-3">
                                <div class="flex text-yellow-400 mr-2">
                        ${'★'.repeat(Math.floor(place.rating))}${'☆'.repeat(5 - Math.floor(place.rating))}
                                </div>
                                <span class="text-sm text-gray-500">${place.rating} (${place.reviews} reviews)</span>
                            </div>
                <p class="text-sm text-gray-700 mb-4 leading-relaxed">${place.description}</p>
                            <div class="flex justify-between items-center">
                    <div class="text-center">
                        <p class="text-lg font-bold text-green-600">₹${place.avgCost}</p>
                        <p class="text-xs text-gray-500">per person</p>
                    </div>
                    <button onclick="createItinerary('${place.name}')" class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <i class="fas fa-route mr-2"></i>Plan Trip
                                </button>
                            </div>
                        </div>
        </div>
    `).join('');
}

function filterPlaces(searchTerm) {
    const allPlaces = window.allPlaces || [];
    const activeCategory = document.querySelector('.category-filter.active')?.textContent?.trim() || 'All Places';
    
    let filteredPlaces = allPlaces;
    
    // Filter by category first
    if (activeCategory !== 'All Places') {
        filteredPlaces = filteredPlaces.filter(place => 
            place.category === activeCategory || 
            place.category.toLowerCase().includes(activeCategory.toLowerCase())
        );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filteredPlaces = filteredPlaces.filter(place =>
            place.name.toLowerCase().includes(term) ||
            place.location.toLowerCase().includes(term) ||
            place.description.toLowerCase().includes(term) ||
            place.category.toLowerCase().includes(term)
        );
    }
    
    // Update the display
    const placesGrid = document.getElementById('placesGrid');
    const noPlacesFound = document.getElementById('noPlacesFound');
    const resultsCount = document.getElementById('placesResultsCount');
    
    if (filteredPlaces.length === 0) {
        placesGrid.classList.add('hidden');
        noPlacesFound.classList.remove('hidden');
        resultsCount.textContent = 'No destinations found';
    } else {
        placesGrid.classList.remove('hidden');
        noPlacesFound.classList.add('hidden');
        placesGrid.innerHTML = renderPlacesHTML(filteredPlaces);
        resultsCount.textContent = `Showing ${filteredPlaces.length} destination${filteredPlaces.length !== 1 ? 's' : ''}`;
    }
}

function filterPlacesByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    event.target.classList.add('active', 'bg-blue-500', 'text-white');
    event.target.classList.remove('bg-gray-200', 'text-gray-700');
    
    // Trigger search with current search term
    const searchInput = document.getElementById('placesSearchInput');
    filterPlaces(searchInput?.value || '');
}

function showFestivalsModal(festivals) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-6xl max-h-full overflow-y-auto">
            <!-- Header with gradient -->
            <div class="relative bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-xl">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                    </button>
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-calendar-alt mr-3"></i>Indian Festivals & Cultural Events
                </h2>
                <p class="text-lg opacity-90">Discover India's rich cultural celebrations throughout the year</p>
                </div>
            
            <!-- Festivals Grid -->
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${festivals.map(festival => `
                        <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <!-- Festival Image -->
                            <div class="relative h-48 overflow-hidden bg-gradient-to-br from-orange-500 to-red-500">
                                ${festival.image ? `
                                    <img src="${festival.image}" 
                                         alt="${festival.name}" 
                                         class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                         loading="lazy"
                                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                    <div class="w-full h-full flex items-center justify-center text-white absolute inset-0" style="display:none;">
                                        <div class="text-center">
                                            <i class="fas fa-calendar-alt text-4xl mb-3"></i>
                                            <h3 class="text-xl font-bold mb-2">${festival.name}</h3>
                                            <p class="text-lg font-semibold">${festival.category}</p>
                                        </div>
                                    </div>
                                ` : `
                                    <div class="w-full h-full flex items-center justify-center text-white">
                                        <div class="text-center">
                                            <i class="fas fa-calendar-alt text-4xl mb-3"></i>
                                            <h3 class="text-xl font-bold mb-2">${festival.name}</h3>
                                            <p class="text-lg font-semibold">${festival.category}</p>
                                        </div>
                                    </div>
                                `}
                                <div class="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                    ${festival.category}
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                                    <h3 class="text-white text-xl font-bold drop-shadow-lg">${festival.name}</h3>
                                    <p class="text-white text-sm opacity-90 drop-shadow-md">
                                        <i class="fas fa-map-marker-alt mr-1"></i>${festival.location}
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Festival Content -->
                            <div class="p-5">
                                <div class="flex items-center justify-between mb-3">
                                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        <i class="fas fa-calendar mr-1"></i>${festival.month}
                                    </span>
                                    ${festival.duration ? `
                                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            <i class="fas fa-clock mr-1"></i>${festival.duration}
                                        </span>
                                    ` : ''}
                                </div>
                                
                                <p class="text-gray-700 mb-4 leading-relaxed">${festival.description}</p>
                                
                                <!-- Activities -->
                                ${festival.activities ? `
                                    <div class="mb-4">
                                        <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                            <i class="fas fa-star mr-2 text-yellow-500"></i>Key Activities
                                        </h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${festival.activities.map(activity => `
                                                <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    ${activity}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                ` : ''}
                                
                                <!-- Best Places -->
                                <div class="mb-4">
                                    <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                        <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>Best Places to Celebrate
                                    </h4>
                                    <div class="flex flex-wrap gap-1">
                                    ${festival.bestPlaces.map(place => `
                                            <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">${place}</span>
                                    `).join('')}
                                    </div>
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

function showSmartRecommendationsModal(data) {
    // Check if user is logged in and on the right page
    if (!currentUser) {
        console.log('Smart recommendations requires login');
        return;
    }
    
    // Close any existing modals first
    const existingModals = document.querySelectorAll('.fixed.inset-0');
    existingModals.forEach(modal => {
        if (modal.innerHTML.includes('Smart Recommendations') || modal.innerHTML.includes('smart-recommendations')) {
            modal.remove();
        }
    });
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    modal.id = 'smartRecommendationsModal';
    
    // Store original data
    window.smartRecData = data;
    window.selectedMoods = [];
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-6xl max-h-full overflow-y-auto">
            <!-- Header with gradient -->
            <div class="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
                <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-30 rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                    </button>
                <h2 class="text-3xl font-bold mb-2">
                    <i class="fas fa-brain mr-3"></i><span data-translate="smart_recommendations">Smart Recommendations</span>
                </h2>
                <p class="text-lg opacity-90">${data.message}</p>
                <div class="mt-4 flex items-center space-x-4">
                    <span class="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                        <i class="fas fa-calendar-alt mr-2"></i>${data.month} ${new Date().getFullYear()}
                    </span>
                    <span class="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium">
                        <i class="fas fa-thermometer-half mr-2"></i>Perfect Season
                    </span>
                </div>
            </div>

            <!-- What's On Your Mind Section -->
            <div class="p-6 bg-white border-b">
                <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">
                    <i class="fas fa-heart mr-2 text-pink-500"></i>What's on your mind?
                </h3>
                <p class="text-center text-gray-600 mb-6">Select your mood and vibe to get personalized recommendations</p>
                
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <button onclick="toggleMoodTag('sunset-hikes', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #ea580c !important; color: white !important; border-color: #c2410c !important;">
                        <i class="fas fa-mountain-sun text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Sunset Hikes</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('forest-peace', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #16a34a !important; color: white !important; border-color: #15803d !important;">
                        <i class="fas fa-tree text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Forest Peace</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('beach-vibes', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #2563eb !important; color: white !important; border-color: #1d4ed8 !important;">
                        <i class="fas fa-waves text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Beach Vibes</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('spiritual-journey', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #9333ea !important; color: white !important; border-color: #7c3aed !important;">
                        <i class="fas fa-om text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Spiritual Journey</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('adventure-rush', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #dc2626 !important; color: white !important; border-color: #b91c1c !important;">
                        <i class="fas fa-fire text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Adventure Rush</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('cultural-dive', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #d97706 !important; color: white !important; border-color: #b45309 !important;">
                        <i class="fas fa-mosque text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Cultural Dive</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('royal-heritage', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #d97706 !important; color: white !important; border-color: #92400e !important;">
                        <i class="fas fa-crown text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Royal Heritage</span>
                    </button>
                    
                    <button onclick="toggleMoodTag('mountain-escape', this)" class="mood-tag px-4 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 text-center border-2 hover:scale-105 shadow-xl font-bold" style="background-color: #374151 !important; color: white !important; border-color: #111827 !important;">
                        <i class="fas fa-mountain text-xl mb-2 block" style="color: white !important;"></i>
                        <span class="text-sm font-bold" style="color: white !important;">Mountain Escape</span>
                    </button>
                </div>
                
                <div class="text-center">
                    <button id="generatePersonalizedRecs" onclick="generatePersonalizedRecommendations()" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50">
                        <i class="fas fa-magic mr-2"></i><span data-translate="generate_perfect_trip">Generate My Perfect Trip</span>
                    </button>
                    <p class="text-xs text-gray-500 mt-2">Select one or more moods above to get personalized recommendations</p>
                </div>
            </div>
            
            <!-- Recommendations Grid -->
            <div class="p-6">
                ${data.recommendations.length > 0 ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${data.recommendations.map(rec => `
                            <div class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div class="relative h-48 overflow-hidden">
                                    <img src="${rec.image}" alt="${rec.name}" class="w-full h-full object-cover">
                                    <div class="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        ${rec.type}
                                    </div>
                                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                                        <h3 class="text-white text-xl font-bold">${rec.name}</h3>
                                        <p class="text-white text-sm opacity-90">
                                            <i class="fas fa-map-marker-alt mr-1"></i>${rec.location}
                                        </p>
                                    </div>
                                </div>
                                <div class="p-5">
                                    <p class="text-gray-700 mb-3 leading-relaxed">${rec.description}</p>
                                    
                                    <!-- Best Time -->
                                    <div class="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                        <p class="text-green-800 text-sm">
                                            <i class="fas fa-leaf mr-2"></i><strong>Best Time:</strong> ${rec.bestTime}
                                        </p>
                                    </div>
                                    
                                    <!-- Activities -->
                                    <div class="mb-4">
                                        <h4 class="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                                            <i class="fas fa-star mr-2 text-yellow-500"></i>Top Activities
                                        </h4>
                                        <div class="flex flex-wrap gap-2">
                                            ${rec.activities.map(activity => `
                                                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                    ${activity}
                                                </span>
                                    `).join('')}
                                </div>
                                    </div>
                                    
                                    <!-- Action Button -->
                                    <button onclick="createItinerary('${rec.name}')" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center">
                                        <i class="fas fa-route mr-2"></i>Plan Your Trip
                                    </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : `
                    <div class="text-center py-12">
                        <i class="fas fa-calendar-times text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No specific recommendations for ${data.month}</h3>
                        <p class="text-gray-500">But India has amazing places to visit year-round!</p>
                        <button onclick="this.closest('.fixed').remove(); loadPlaces();" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Explore All Places
                        </button>
                    </div>
                `}
                
                <!-- Month Navigation -->
                <div class="mt-8 bg-gray-50 rounded-xl p-4">
                    <h4 class="text-lg font-semibold mb-4 text-center text-gray-800">
                        <i class="fas fa-calendar-alt mr-2"></i>Explore Other Months
                    </h4>
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-2">
                        ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => `
                            <button onclick="this.closest('.fixed').remove(); loadSmartRecommendations('${['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'][index]}')" 
                                    class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${data.monthIndex === index + 1 ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 hover:bg-purple-100'}">
                                ${month}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Apply translations to the modal content
    updateLanguage();
}

function toggleMoodTag(mood, element) {
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // Remove selection
        element.classList.remove('selected', 'ring-4', 'ring-yellow-400', 'scale-105', 'border-yellow-400');
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
        window.selectedMoods = window.selectedMoods.filter(m => m !== mood);
    } else {
        // Add selection
        element.classList.add('selected', 'ring-4', 'ring-yellow-400', 'scale-105', 'border-yellow-400');
        element.style.transform = 'scale(1.05)';
        element.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
        window.selectedMoods.push(mood);
    }
    
    // Update button state
    const generateBtn = document.getElementById('generatePersonalizedRecs');
    if (window.selectedMoods.length > 0) {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<i class="fas fa-magic mr-2"></i>Generate My Perfect Trip (${window.selectedMoods.length} mood${window.selectedMoods.length > 1 ? 's' : ''} selected)`;
    } else {
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<i class="fas fa-magic mr-2"></i>Generate My Perfect Trip`;
    }
}

function generatePersonalizedRecommendations() {
    if (window.selectedMoods.length === 0) {
        showNotification('Please select at least one mood tag!', 'warning');
        return;
    }
    
    // Close the Smart Recommendations modal
    const smartModal = document.getElementById('smartRecommendationsModal');
    if (smartModal) {
        smartModal.remove();
    }
    
    // Show the magical trip generation with loading
    generateMagicalTrip();
}

function getMoodDisplayName(mood) {
    const moodNames = {
        'sunset-hikes': '🌅 Sunset Hikes',
        'forest-peace': '🌲 Forest Peace',
        'beach-vibes': '🌊 Beach Vibes', 
        'spiritual-journey': '🕉️ Spiritual Journey',
        'adventure-rush': '🔥 Adventure Rush',
        'cultural-dive': '🕌 Cultural Dive',
        'royal-heritage': '👑 Royal Heritage',
        'mountain-escape': '⛰️ Mountain Escape'
    };
    return moodNames[mood] || mood;
}

function getPersonalizedRecommendations(month, moods) {
    // Mood-based recommendation database
    const moodRecommendations = {
        'sunset-hikes': [
            {
                name: 'Hampi Sunset Point',
                location: 'Karnataka',
                type: 'Hill Station',
                description: 'Ancient ruins silhouetted against golden sunsets. Trek through boulder landscapes and historic temples.',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
                bestTime: 'October to March',
                activities: ['Sunset photography', 'Rock climbing', 'Historical exploration'],
                moodTags: ['Sunset views', 'Photography', 'Adventure'],
                matchScore: 95
            },
            {
                name: 'Tiger Hill Darjeeling',
                location: 'West Bengal',
                type: 'Mountain View',
                description: 'Famous sunrise and sunset views over Kanchenjunga. Perfect for golden hour photography.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                bestTime: 'April to June, October to December',
                activities: ['Sunrise viewing', 'Tea garden walks', 'Mountain photography'],
                moodTags: ['Mountain sunrise', 'Peace', 'Photography'],
                matchScore: 92
            }
        ],
        'forest-peace': [
            {
                name: 'Silent Valley National Park',
                location: 'Kerala',
                type: 'Forest Reserve',
                description: 'Untouched tropical rainforest with rare species and complete tranquility. Perfect for nature meditation.',
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
                bestTime: 'December to April',
                activities: ['Forest walks', 'Bird watching', 'Nature meditation'],
                moodTags: ['Deep forest', 'Silence', 'Wildlife'],
                matchScore: 98
            },
            {
                name: 'Coorg Coffee Plantations',
                location: 'Karnataka',
                type: 'Hill Station',
                description: 'Misty coffee plantations surrounded by dense Western Ghats forests. Perfect for peaceful retreats.',
                image: 'https://images.unsplash.com/photo-1588946116232-7473de3fb9cb?w=800&h=600&fit=crop',
                bestTime: 'October to March',
                activities: ['Coffee plantation walks', 'Forest trekking', 'Ayurvedic spa'],
                moodTags: ['Coffee aroma', 'Mist', 'Relaxation'],
                matchScore: 94
            }
        ],
        'beach-vibes': [
            {
                name: 'Andaman Radhanagar Beach',
                location: 'Andaman Islands',
                type: 'Beach Paradise',
                description: 'Pristine white sand beaches with crystal clear turquoise waters. Perfect for ultimate beach relaxation.',
                image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
                bestTime: 'November to April',
                activities: ['Snorkeling', 'Beach walks', 'Water sports'],
                moodTags: ['Pristine beaches', 'Crystal waters', 'Tropical paradise'],
                matchScore: 97
            },
            {
                name: 'Varkala Cliff Beach',
                location: 'Kerala',
                type: 'Coastal Beauty',
                description: 'Dramatic red cliffs overlooking the Arabian Sea. Perfect blend of beach and spirituality.',
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
                bestTime: 'November to February',
                activities: ['Cliff walking', 'Beach yoga', 'Ayurvedic treatments'],
                moodTags: ['Cliffs', 'Waves', 'Spirituality'],
                matchScore: 89
            }
        ],
        'spiritual-journey': [
            {
                name: 'Rishikesh Yoga Capital',
                location: 'Uttarakhand',
                type: 'Spiritual Center',
                description: 'World yoga capital on the banks of sacred Ganges. Perfect for spiritual awakening and inner peace.',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
                bestTime: 'February to June, September to November',
                activities: ['Yoga retreats', 'Meditation', 'Ganga Aarti'],
                moodTags: ['Sacred river', 'Yoga', 'Meditation'],
                matchScore: 99
            },
            {
                name: 'Bodh Gaya Sacred Site',
                location: 'Bihar',
                type: 'Buddhist Pilgrimage',
                description: 'Where Buddha attained enlightenment. Most sacred Buddhist site with profound spiritual energy.',
                image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
                bestTime: 'November to February',
                activities: ['Temple visits', 'Meditation sessions', 'Buddhist prayers'],
                moodTags: ['Enlightenment', 'Buddhism', 'Sacred'],
                matchScore: 96
            }
        ],
        'adventure-rush': [
            {
                name: 'Ladakh Bike Adventure',
                location: 'Ladakh',
                type: 'Adventure Sports',
                description: 'High-altitude desert adventure with world\'s highest motorable passes. Ultimate thrill for adventure seekers.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                bestTime: 'June to September',
                activities: ['Motorcycle touring', 'High-altitude trekking', 'White water rafting'],
                moodTags: ['High altitude', 'Extreme sports', 'Desert roads'],
                matchScore: 98
            },
            {
                name: 'Rishikesh Adventure Hub',
                location: 'Uttarakhand', 
                type: 'Adventure Capital',
                description: 'Adventure sports capital with river rafting, bungee jumping, and mountain activities.',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
                bestTime: 'September to April',
                activities: ['White water rafting', 'Bungee jumping', 'Rock climbing'],
                moodTags: ['Adrenaline', 'River sports', 'Heights'],
                matchScore: 95
            }
        ],
        'cultural-dive': [
            {
                name: 'Khajuraho Temple Complex',
                location: 'Madhya Pradesh',
                type: 'Cultural Heritage',
                description: 'UNESCO World Heritage site with exquisite temple architecture and sculptural art.',
                image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&h=600&fit=crop',
                bestTime: 'October to March',
                activities: ['Temple architecture tour', 'Cultural festivals', 'Archaeological exploration'],
                moodTags: ['Ancient art', 'Sculpture', 'Architecture'],
                matchScore: 94
            },
            {
                name: 'Varanasi Cultural Immersion',
                location: 'Uttar Pradesh',
                type: 'Ancient City',
                description: 'Oldest living city in the world. Experience ancient traditions, ghats, and spiritual culture.',
                image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop',
                bestTime: 'November to February',
                activities: ['Ganga Aarti ceremony', 'Silk weaving workshops', 'Classical music'],
                moodTags: ['Ancient traditions', 'Spirituality', 'River culture'],
                matchScore: 97
            }
        ],
        'royal-heritage': [
            {
                name: 'Jaipur Pink City',
                location: 'Rajasthan',
                type: 'Royal City',
                description: 'Pink City with magnificent palaces, forts, and royal heritage. Experience Rajput grandeur.',
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
                bestTime: 'November to February',
                activities: ['Palace tours', 'Royal dining', 'Cultural performances'],
                moodTags: ['Royal palaces', 'Rajput culture', 'Grandeur'],
                matchScore: 96
            },
            {
                name: 'Udaipur City of Lakes',
                location: 'Rajasthan',
                type: 'Royal Destination',
                description: 'Most romantic royal city with beautiful lakes and palatial hotels. Venice of the East.',
                image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
                bestTime: 'October to March',
                activities: ['Lake palace visit', 'Boat rides', 'Royal heritage walk'],
                moodTags: ['Lakes', 'Palaces', 'Romance'],
                matchScore: 98
            }
        ],
        'mountain-escape': [
            {
                name: 'Manali Mountain Retreat',
                location: 'Himachal Pradesh',
                type: 'Hill Station',
                description: 'Serene mountain valleys surrounded by snow-capped peaks. Perfect for mountain peace.',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
                bestTime: 'March to June, October to February',
                activities: ['Mountain trekking', 'River rafting', 'Paragliding'],
                moodTags: ['Snow peaks', 'Valleys', 'Fresh air'],
                matchScore: 93
            },
            {
                name: 'Spiti Valley Remote Beauty',
                location: 'Himachal Pradesh',
                type: 'High Altitude Desert',
                description: 'Cold desert mountain valley with Buddhist monasteries and dramatic landscapes.',
                image: 'https://images.unsplash.com/photo-1599661046827-dacff0acf861?w=800&h=600&fit=crop',
                bestTime: 'June to October',
                activities: ['High altitude trekking', 'Monastery visits', 'Star gazing'],
                moodTags: ['Remote beauty', 'Buddhism', 'Astronomy'],
                matchScore: 91
            }
        ]
    };
    
    // Get recommendations based on selected moods
    let personalizedRecs = [];
    
    moods.forEach(mood => {
        if (moodRecommendations[mood]) {
            personalizedRecs = personalizedRecs.concat(moodRecommendations[mood]);
        }
    });
    
    // Remove duplicates and sort by match score
    const uniqueRecs = personalizedRecs.filter((rec, index, self) => 
        index === self.findIndex(r => r.name === rec.name)
    );
    
    return uniqueRecs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 6); // Return top 6 matches
}

function showItineraryModal(itinerary) {
    console.log('showItineraryModal function called with itinerary:', itinerary);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-6xl w-full max-h-full overflow-y-auto">
            <!-- Header with Hero Image -->
            <div class="relative h-64">
                <img src="${itinerary.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'}" 
                     alt="${itinerary.destination}" class="w-full h-full object-cover rounded-t-xl">
                <div class="absolute inset-0 bg-black bg-opacity-50 rounded-t-xl flex items-center justify-center">
                    <div class="text-center text-white">
                        <h1 class="text-4xl font-bold mb-2">${itinerary.destination}</h1>
                        <p class="text-xl opacity-90 mb-4">${itinerary.description}</p>
                        <div class="flex items-center justify-center space-x-8 text-sm bg-black bg-opacity-30 px-6 py-3 rounded-lg">
                            <span><i class="fas fa-map-marker-alt mr-2"></i>${itinerary.location}</span>
                            <span><i class="fas fa-calendar-alt mr-2"></i>${itinerary.duration} Days</span>
                            <span><i class="fas fa-rupee-sign mr-2"></i>₹${itinerary.estimatedCost.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <!-- Hotels Section -->
            ${itinerary.hotels && itinerary.hotels.length > 0 ? `
            <div class="p-6 border-b bg-gray-50">
                <h3 class="text-xl font-bold mb-4 flex items-center">
                    <i class="fas fa-hotel text-blue-600 mr-2"></i>Recommended Accommodations
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${itinerary.hotels.map(hotel => `
                        <div class="bg-white rounded-lg p-4 shadow-md">
                            <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-32 object-cover rounded-lg mb-3">
                            <h4 class="font-semibold">${hotel.name}</h4>
                            <div class="flex items-center mb-1">
                                ${Array(hotel.rating).fill('').map(() => '<i class="fas fa-star text-yellow-400"></i>').join('')}
                                <span class="ml-2 text-sm text-gray-600">${hotel.rating} Star</span>
                            </div>
                            <p class="text-sm text-gray-600">${hotel.location}</p>
                            <p class="text-sm font-medium text-green-600">${hotel.priceRange}/night</p>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <!-- Daily Itinerary -->
            <div class="p-6">
                <h3 class="text-2xl font-bold mb-6 flex items-center">
                    <i class="fas fa-route text-purple-600 mr-2"></i>Your Day-by-Day Journey
                </h3>
                
                ${itinerary.days.map((day, index) => `
                    <div class="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border-l-4 ${
                        day.day === 1 ? 'border-green-500' : 
                        day.day === itinerary.duration ? 'border-red-500' : 
                        'border-blue-500'
                    }">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-2xl font-bold text-gray-800">Day ${day.day}</h4>
                            <div class="bg-white px-4 py-2 rounded-full shadow-sm">
                                <span class="text-lg font-semibold text-purple-600">${day.theme || 'Exploration Day'}</span>
                            </div>
                        </div>
                        
                        <!-- Meals Section -->
                        ${day.meals ? `
                        <div class="mb-6 bg-white rounded-lg p-4 shadow-sm">
                            <h5 class="font-bold text-gray-800 mb-3 flex items-center">
                                <i class="fas fa-utensils text-orange-500 mr-2"></i>Today's Dining Experience
                            </h5>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                ${['breakfast', 'lunch', 'dinner'].map(mealType => {
                                    const meal = day.meals[mealType];
                                    return meal ? `
                                        <div class="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200">
                                            <div class="flex items-center mb-2">
                                                <i class="fas fa-${mealType === 'breakfast' ? 'coffee' : mealType === 'lunch' ? 'hamburger' : 'wine-glass'} text-orange-600 mr-2"></i>
                                                <h6 class="font-semibold text-gray-800 capitalize">${mealType}</h6>
                                            </div>
                                            <img src="${meal.image}" alt="${meal.name}" class="w-20 h-20 object-cover rounded mb-2 mx-auto">
                                            <p class="font-medium text-sm">${meal.name}</p>
                                            <p class="text-xs text-gray-600 mb-1">${meal.cuisine}</p>
                                            <p class="text-xs font-medium text-green-600">${meal.speciality}</p>
                                            <p class="text-xs text-orange-600 font-medium">${meal.price}</p>
                                        </div>
                                    ` : '';
                                }).join('')}
                            </div>
                        </div>
                        ` : ''}
                        
                        <!-- Activities -->
                        <div class="space-y-4">
                            ${day.activities.map(activity => {
                                const activityIcon = getActivityIcon(activity.activity);
                                const typeColors = {
                                    'dining': 'orange',
                                    'sightseeing': 'blue',
                                    'accommodation': 'green',
                                    'shopping': 'purple',
                                    'departure': 'red'
                                };
                                const color = typeColors[activity.type] || 'blue';
                                
                                return `
                                <div class="bg-white rounded-lg p-4 shadow-md border-l-4 border-${color}-400 hover:shadow-lg transition-shadow">
                                    <div class="flex items-start space-x-4">
                                        <div class="flex items-center justify-center w-14 h-14 bg-${color}-100 rounded-full flex-shrink-0">
                                            <i class="${activityIcon} text-${color}-600 text-xl"></i>
                                        </div>
                                        
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-${color}-600 font-bold text-xl">${activity.time}</span>
                                                ${activity.cost > 0 ? 
                                                    `<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">₹${activity.cost}</span>` : 
                                                    '<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">Free</span>'
                                                }
                                            </div>
                                            
                                            <h5 class="font-bold text-gray-800 text-lg mb-2">${activity.activity}</h5>
                                            
                                            <div class="flex items-center text-gray-600 text-sm mb-2">
                                                <i class="fas fa-map-marker-alt mr-2"></i>
                                                <span class="font-medium">${activity.location}</span>
                                                <i class="fas fa-clock ml-4 mr-2"></i>
                                                <span>${activity.duration}</span>
                                            </div>
                                            
                                            ${activity.description ? `
                                                <p class="text-gray-700 text-sm bg-gray-50 p-2 rounded italic">${activity.description}</p>
                                            ` : ''}
                                            
                                            ${activity.image ? `
                                                <img src="${activity.image}" alt="${activity.activity}" 
                                                     class="w-32 h-32 object-cover rounded-lg mt-3 shadow-sm mx-auto">
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <!-- Day Summary -->
                        <div class="mt-4 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-gray-700">Day ${day.day} Total Cost:</span>
                                <span class="text-xl font-bold text-green-600">₹${day.totalDayCost.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <!-- Trip Summary -->
                <div class="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
                    <h4 class="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-chart-line text-purple-600 mr-2"></i>Trip Summary
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="text-center bg-white rounded-lg p-4 shadow-sm">
                            <i class="fas fa-calendar-check text-3xl text-blue-600 mb-2"></i>
                            <p class="text-2xl font-bold text-gray-800">${itinerary.duration}</p>
                            <p class="text-sm text-gray-600">Days of Adventure</p>
                        </div>
                        <div class="text-center bg-white rounded-lg p-4 shadow-sm">
                            <i class="fas fa-rupee-sign text-3xl text-green-600 mb-2"></i>
                            <p class="text-2xl font-bold text-gray-800">₹${itinerary.estimatedCost.toLocaleString()}</p>
                            <p class="text-sm text-gray-600">Total Estimated Cost</p>
                        </div>
                        <div class="text-center bg-white rounded-lg p-4 shadow-sm">
                            <i class="fas fa-map-marked-alt text-3xl text-purple-600 mb-2"></i>
                            <p class="text-2xl font-bold text-gray-800">${itinerary.days.reduce((total, day) => total + day.activities.length, 0)}</p>
                            <p class="text-sm text-gray-600">Amazing Experiences</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function createItinerary(destination) {
    console.log('createItinerary function called with destination:', destination);
    
    // Prevent default behavior and event bubbling
    if (event && event.preventDefault) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6 border-b">
                <h2 class="text-2xl font-bold">Plan Your Trip</h2>
            </div>
            <form id="itineraryForm" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <input type="text" name="destination" value="${destination}" placeholder="Enter destination (e.g., Jaipur, Goa, Kerala)" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <p class="text-xs text-gray-500 mt-1">Enter any Indian city or region you'd like to visit</p>
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
    
    // Wait for form to be added to DOM before adding event listener
    setTimeout(() => {
        const form = document.getElementById('itineraryForm');
        if (form) {
            console.log('Adding form event listener...');
            form.addEventListener('submit', async (e) => {
        e.preventDefault();
                console.log('Form submitted!');
                
        const formData = new FormData(e.target);
        const interests = Array.from(formData.getAll('interests'));
        
        try {
                    const customDestination = formData.get('destination') || destination;
                    console.log('Creating itinerary for:', { destination: customDestination, budget: formData.get('budget'), interests });
                    
            const itinerary = await apiCall('/api/itinerary', {
                method: 'POST',
                body: JSON.stringify({
                            destination: customDestination,
                    duration: formData.get('duration'),
                    budget: parseInt(formData.get('budget')),
                    interests
                })
            });
            
                    console.log('Received itinerary:', itinerary);
            modal.remove();
                    
                    if (itinerary && itinerary.itinerary) {
                        console.log('Showing itinerary modal...');
            showItineraryModal(itinerary.itinerary);
                    } else {
                        console.error('No itinerary data received:', itinerary);
                        showNotification('No itinerary data received', 'error');
                    }
        } catch (error) {
                    console.error('Error creating itinerary:', error);
                    showNotification('Failed to create itinerary: ' + error.message, 'error');
                }
            });
        } else {
            console.error('Form not found!');
        }
    }, 100);
}

// Helper function to get activity icon based on activity type
function getActivityIcon(activity) {
    const lowerActivity = activity.toLowerCase();
    
    if (lowerActivity.includes('temple') || lowerActivity.includes('worship') || lowerActivity.includes('prayer')) return 'fas fa-pray';
    if (lowerActivity.includes('museum') || lowerActivity.includes('gallery') || lowerActivity.includes('exhibition')) return 'fas fa-university';
    if (lowerActivity.includes('market') || lowerActivity.includes('shopping') || lowerActivity.includes('bazaar')) return 'fas fa-shopping-bag';
    if (lowerActivity.includes('food') || lowerActivity.includes('dining') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner') || lowerActivity.includes('breakfast')) return 'fas fa-utensils';
    if (lowerActivity.includes('boat') || lowerActivity.includes('cruise') || lowerActivity.includes('sailing')) return 'fas fa-ship';
    if (lowerActivity.includes('trekking') || lowerActivity.includes('hiking') || lowerActivity.includes('climbing')) return 'fas fa-mountain';
    if (lowerActivity.includes('beach') || lowerActivity.includes('swimming') || lowerActivity.includes('sunbathing')) return 'fas fa-umbrella-beach';
    if (lowerActivity.includes('spa') || lowerActivity.includes('massage') || lowerActivity.includes('wellness')) return 'fas fa-spa';
    if (lowerActivity.includes('photography') || lowerActivity.includes('photo') || lowerActivity.includes('sightseeing')) return 'fas fa-camera';
    if (lowerActivity.includes('transport') || lowerActivity.includes('travel') || lowerActivity.includes('departure') || lowerActivity.includes('arrival')) return 'fas fa-car';
    if (lowerActivity.includes('hotel') || lowerActivity.includes('check') || lowerActivity.includes('accommodation')) return 'fas fa-bed';
    if (lowerActivity.includes('fort') || lowerActivity.includes('palace') || lowerActivity.includes('monument')) return 'fas fa-chess-rook';
    if (lowerActivity.includes('garden') || lowerActivity.includes('park') || lowerActivity.includes('nature')) return 'fas fa-leaf';
    if (lowerActivity.includes('sunset') || lowerActivity.includes('sunrise')) return 'fas fa-sun';
    if (lowerActivity.includes('night') || lowerActivity.includes('evening')) return 'fas fa-moon';
    
    return 'fas fa-map-marked-alt'; // default icon
}

// Helper function to get place image
function getPlaceImage(destinationName) {
    // Map of destinations to their image URLs
    const placeImages = {
        "Taj Mahal": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
        "Kerala Backwaters": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
        "Golden Temple": "https://images.unsplash.com/photo-1588997262374-8d2ac730fc85?w=800&h=600&fit=crop",
        "Goa Beaches": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
        "Ladakh": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    };
    
    return placeImages[destinationName] || null;
}

// Hero Background Slideshow - Using diverse, reliable Indian culture images
const heroImages = [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', // Taj Mahal
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', // Ladakh mountains
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', // Indian coastal scene
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80', // Golden Temple Amritsar
    'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=1920&h=1080&fit=crop&crop=entropy&auto=format&q=80'  // Mumbai cityscape
];

// Fallback images in case primary images fail
const fallbackImages = [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=1080&fit=crop&crop=center&auto=format&q=75', // India Gate
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&h=1080&fit=crop&crop=center&auto=format&q=75', // Kerala
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=75', // Jaipur
    'https://images.unsplash.com/photo-1524654458049-e36be0721fa2?w=1920&h=1080&fit=crop&crop=center&auto=format&q=75', // Golden Temple fallback
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop&crop=center&auto=format&q=75'  // Heritage
];

let currentSlide = 0;
let slideInterval;

function changeHeroBackground(slideIndex) {
    const heroBackground = document.getElementById('heroBackground');
    const indicators = document.querySelectorAll('[data-slide]');
    
    if (heroBackground) {
        const primaryImageUrl = heroImages[slideIndex];
        const fallbackImageUrl = fallbackImages[slideIndex];
        
        // Preload primary image to check if it exists
        const img = new Image();
        img.onload = function() {
            heroBackground.style.backgroundImage = `url('${primaryImageUrl}')`;
            console.log(`Successfully loaded primary image: ${primaryImageUrl}`);
        };
        
        img.onerror = function() {
            console.log(`Failed to load primary image: ${primaryImageUrl}, trying fallback`);
            
            // Try fallback image
            const fallbackImg = new Image();
            fallbackImg.onload = function() {
                heroBackground.style.backgroundImage = `url('${fallbackImageUrl}')`;
                console.log(`Successfully loaded fallback image: ${fallbackImageUrl}`);
            };
            
            fallbackImg.onerror = function() {
                console.log(`Failed to load fallback image: ${fallbackImageUrl}, using gradient`);
                // Use beautiful gradient as final fallback
                heroBackground.style.backgroundImage = 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 25%, #4ecdc4 50%, #45b7d1 75%, #96ceb4 100%)';
            };
            
            fallbackImg.src = fallbackImageUrl;
        };
        
        img.src = primaryImageUrl;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === slideIndex) {
                indicator.classList.add('bg-opacity-100');
                indicator.classList.remove('bg-opacity-50');
            } else {
                indicator.classList.remove('bg-opacity-100');
                indicator.classList.add('bg-opacity-50');
            }
        });
    }
}

function startHeroSlideshow() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % heroImages.length;
        changeHeroBackground(currentSlide);
    }, 6000); // Change every 6 seconds
}

function stopHeroSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
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
    
    // Ensure chatbot toggle is always visible
    const chatbotToggle = document.getElementById('chatbotToggle');
    if (chatbotToggle) {
        chatbotToggle.classList.remove('hidden');
        chatbotToggle.style.display = 'flex'; // Ensure it's visible
        chatbotToggle.style.position = 'fixed';
        chatbotToggle.style.bottom = '100px';
        chatbotToggle.style.right = '20px';
        chatbotToggle.style.zIndex = '10000';
        chatbotToggle.style.pointerEvents = 'auto';
        
        console.log('Chatbot toggle button configured:', {
            element: chatbotToggle,
            computed: window.getComputedStyle(chatbotToggle),
            visible: chatbotToggle.offsetWidth > 0 && chatbotToggle.offsetHeight > 0,
            position: {
                bottom: chatbotToggle.style.bottom,
                right: chatbotToggle.style.right,
                zIndex: chatbotToggle.style.zIndex
            }
        });
    } else {
        console.error('Chatbot toggle element not found during initialization!');
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
    
    // Dashboard buttons - Quick Actions
    const placesBtn = document.getElementById('placesBtn');
    const festivalsBtn = document.getElementById('festivalsBtn');
    const itineraryBtn = document.getElementById('itineraryBtn');
    const smartBtn = document.getElementById('smartRecommendationsBtn');
    
    // Debug: Check if buttons exist
    // console.log('Button elements found:', {placesBtn: !!placesBtn, festivalsBtn: !!festivalsBtn, itineraryBtn: !!itineraryBtn, smartBtn: !!smartBtn});
    
    if (placesBtn) {
        placesBtn.addEventListener('click', (e) => {
            console.log('Places button clicked!');
            e.preventDefault();
            loadPlaces();
        });
    }
    
    if (festivalsBtn) {
        festivalsBtn.addEventListener('click', (e) => {
            console.log('Festivals button clicked!');
            e.preventDefault();
            loadFestivals();
        });
    }
    
    if (itineraryBtn) {
        itineraryBtn.addEventListener('click', (e) => {
            console.log('Itinerary button clicked!');
            e.preventDefault();
            e.stopPropagation();
            createItinerary('');
        });
    }
    
    if (smartBtn) {
        smartBtn.addEventListener('click', (e) => {
            console.log('Smart Recommendations button clicked!');
            e.preventDefault();
            loadSmartRecommendations();
        });
    }
    
    // Event delegation fallback for all buttons
    document.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        
        console.log('Button clicked via delegation:', target.id);
        
        switch(target.id) {
            case 'placesBtn':
                e.preventDefault();
                console.log('Loading places via delegation...');
                loadPlaces();
                break;
            case 'festivalsBtn':
                e.preventDefault();
                console.log('Loading festivals via delegation...');
                loadFestivals();
                break;
            case 'itineraryBtn':
                e.preventDefault();
                console.log('Creating itinerary via delegation...');
                createItinerary('');
                break;
            case 'smartRecommendationsBtn':
                e.preventDefault();
                console.log('Loading smart recommendations via delegation...');
                loadSmartRecommendations();
                break;
        }
    });
    
    // Hero buttons now navigate to separate pages - legacy handlers removed
    
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
            document.getElementById('trackingToggleBtn').innerHTML = `<i class="fas fa-satellite-dish mr-2"></i><span data-translate="disable_tracking">${translate('disable_tracking')}</span>`;
            document.getElementById('trackingToggleBtn').classList.remove('bg-green-600', 'hover:bg-green-700');
            document.getElementById('trackingToggleBtn').classList.add('bg-red-600', 'hover:bg-red-700');
        } else {
            trackingActive = false;
            showNotification(translate('tracking_stopped'), 'info');
            document.getElementById('trackingToggleBtn').innerHTML = `<i class="fas fa-satellite-dish mr-2"></i><span data-translate="enable_tracking">${translate('enable_tracking')}</span>`;
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
    
    // Chatbot event listeners
    const chatbotToggleBtn = document.getElementById('chatbotToggle');
    const closeChatbotBtn = document.getElementById('closeChatbot');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    console.log('Chatbot elements found:', {
        toggle: !!chatbotToggleBtn,
        close: !!closeChatbotBtn,
        send: !!sendMessageBtn
    });
    
    if (chatbotToggleBtn) {
        chatbotToggleBtn.addEventListener('click', (e) => {
            console.log('Chatbot toggle button clicked!');
            e.preventDefault();
            e.stopPropagation();
            toggleChatbot();
        });
        
        // Add visual feedback on hover/click
        chatbotToggleBtn.addEventListener('mousedown', (e) => {
            console.log('Chatbot button mouse down');
            chatbotToggleBtn.style.transform = 'scale(0.95)';
        });
        
        chatbotToggleBtn.addEventListener('mouseup', (e) => {
            console.log('Chatbot button mouse up');
            chatbotToggleBtn.style.transform = 'scale(1)';
        });
        
        // Add a test click area around the button for debugging
        chatbotToggleBtn.addEventListener('mouseover', () => {
            console.log('Mouse over chatbot button - it\'s detectable!');
            chatbotToggleBtn.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.8)';
        });
        
        chatbotToggleBtn.addEventListener('mouseout', () => {
            chatbotToggleBtn.style.boxShadow = '';
        });
        
    } else {
        console.error('Chatbot toggle button not found!');
    }
    
    
    // Alternative keyboard shortcut for testing
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'b') {
            console.log('Ctrl+B pressed - opening chatbot');
            e.preventDefault();
            toggleChatbot();
        }
    });
    
    // Global click detector for debugging
    document.addEventListener('click', (e) => {
        const clickedElement = e.target;
        const elementInfo = {
            id: clickedElement.id,
            className: clickedElement.className,
            tagName: clickedElement.tagName,
            position: {
                x: e.clientX,
                y: e.clientY
            }
        };
        console.log('Click detected on:', elementInfo);
        
        // Special logging for our buttons
        if (clickedElement.id === 'chatbotToggle') {
            console.log('🎯 CHATBOT BUTTON CLICKED!', elementInfo);
        }
    });
    
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener('click', toggleChatbot);
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
    }
    
    // Chatbot input enter key
    document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Quick reply handlers for initial chatbot message
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            const query = e.target.getAttribute('data-query');
            const text = e.target.textContent;
            
            if (query) {
                // Handle predefined queries
                addMessage(text, true);
                setTimeout(() => {
                    addMessage(getChatbotResponse(query));
                }, 500);
            } else {
                // Handle dynamic quick replies
                handleQuickReply(text);
            }
        }
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
    
    // Hero button and back button event listeners will be attached when respective pages are shown
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
    if (e.key === 'Escape') {
        // Escape key to close modals
        e.preventDefault();
        closeAllModals();
    } else if (e.altKey && e.key === 's') {
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
    } else if (e.altKey && e.key === 'c') {
        // Alt+C for chatbot toggle
        e.preventDefault();
        toggleChatbot(); // Allow chatbot toggle even without login
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
