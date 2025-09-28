# Indian Tourism & Safety Application

A comprehensive web application designed to promote safe tourism across India with verified user identity, real-time tracking, smart recommendations, and multilingual support.

## 🌟 Features

### 1. Verified User Identity System
- **QR Code Verification**: Each user gets a unique QR code linked to their Aadhar card or Passport
- **Identity Types**: Support for Indian Citizens (Aadhar), NRI users (Passport), and Foreign Tourists (Passport)
- **Temporary IDs**: Special provisions for NRI users with temporary identification
- **Anti-Fraud Protection**: Prevents fake identities and maintains user safety records

### 2. Tourism Recommendations Engine
- **Smart Destination Suggestions**: AI-powered recommendations based on user preferences
- **Festival Calendar**: Comprehensive database of Indian festivals and cultural events
- **Weather-Based Planning**: Travel suggestions based on seasonal weather patterns
- **Cost Optimization**: Budget-friendly recommendations with price comparisons
- **Review Integration**: Real user reviews and ratings for destinations

### 3. Intelligent Travel Planning
- **Date Recommendations**: Optimal travel dates based on weather, costs, and crowd levels
- **Dynamic Pricing**: Real-time cost analysis for accommodations and transportation
- **Area Status Monitoring**: Current safety and accessibility status of destinations
- **Personalized Itineraries**: Custom travel plans based on duration, budget, and interests

### 4. Live Safety Tracking System
- **Real-Time Location Sharing**: GPS tracking with family member notifications
- **Automatic SOS Alerts**: AI-powered detection of unusual movement patterns
- **Police Dashboard Integration**: Direct alerts to local police for emergency response
- **Geofencing**: Alerts when users deviate from planned routes
- **Family Monitoring**: Shared tracking for group travel safety

### 5. Multilingual Accessibility
- **12+ Indian Languages**: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, and English
- **Voice Navigation**: Text-to-speech support for visually impaired users
- **Screen Reader Compatibility**: Full accessibility compliance
- **Keyboard Navigation**: Alt key shortcuts for quick access

### 6. Offline Emergency Features
- **Offline SOS**: Emergency alerts work without internet connectivity
- **Cached Maps**: Essential location data stored locally
- **Offline Itineraries**: Access to travel plans without internet
- **Auto-Sync**: Data synchronization when connectivity is restored

## 🚀 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **Socket.io** for real-time communication
- **JWT** authentication with bcrypt password hashing
- **QR Code** generation and verification
- **Geolocation** services with automatic SOS detection

### Frontend
- **Vanilla JavaScript** with modern ES6+ features
- **Tailwind CSS** for responsive design
- **Font Awesome** icons
- **Service Worker** for offline functionality
- **Web Speech API** for accessibility

### Database (Production Ready)
- **MongoDB** for user data and tourism information
- **In-memory storage** for development/demo
- **IndexedDB** for offline data storage

## 📱 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up configuration**
   ```bash
   cp config.example.js config.js
   # Edit config.js with your API keys and settings
   ```

4. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Open your browser to `http://localhost:5000`
   - The application will be ready to use

### Environment Configuration

Create a `config.js` file based on `config.example.js` and configure:

- **JWT Secret**: For secure authentication
- **MongoDB URI**: Database connection (optional for demo)
- **Email Service**: For notifications
- **SMS API**: For emergency alerts
- **Weather API**: For travel recommendations
- **Google Maps API**: For location services
- **Police API**: For emergency response integration

## 🎯 User Journey

### Registration Process
1. **User Registration**: Choose user type (Indian Citizen/NRI/Foreign Tourist)
2. **Identity Verification**: Enter Aadhar number or Passport details
3. **QR Code Generation**: Unique QR code created and linked to identity
4. **Emergency Contact**: Set up emergency contact for safety alerts

### Travel Planning
1. **Destination Search**: Browse popular places and festivals
2. **Smart Recommendations**: Get AI-powered suggestions
3. **Itinerary Creation**: Build personalized travel plans
4. **Weather & Cost Analysis**: Optimize travel dates

### Safety Features
1. **Location Tracking**: Enable real-time GPS sharing
2. **Family Monitoring**: Share location with family members
3. **Automatic Alerts**: AI detects unusual patterns
4. **Emergency SOS**: One-tap emergency assistance

## 🛡️ Security Features

### Data Protection
- **Encrypted Storage**: All sensitive data encrypted
- **Secure Authentication**: JWT tokens with expiration
- **Input Validation**: Protection against injection attacks
- **CORS Protection**: Secure cross-origin requests

### Privacy Measures
- **Opt-in Tracking**: Users control location sharing
- **Data Minimization**: Only necessary data collected
- **Temporary Sessions**: Automatic logout for security
- **Anonymous Analytics**: No personal data in analytics

## 🌐 Accessibility Features

### Visual Accessibility
- **High Contrast Mode**: Better visibility for low vision users
- **Large Text Support**: Scalable fonts and UI elements
- **Screen Reader Support**: Full ARIA compliance
- **Keyboard Navigation**: Complete keyboard accessibility

### Language Support
- **Native Scripts**: Support for regional language scripts
- **Voice Commands**: Speech recognition for hands-free use
- **Audio Feedback**: Voice prompts and confirmations
- **Cultural Localization**: Region-specific content

## 🚨 Emergency Response System

### Automatic SOS Triggers
- **Movement Pattern Analysis**: AI detects unusual behavior
- **Geofence Violations**: Alerts when leaving safe areas
- **Manual SOS Button**: One-touch emergency activation
- **Offline Emergency**: Works without internet connection

### Response Chain
1. **Immediate Family Alert**: Notify emergency contacts
2. **Police Dashboard**: Direct alert to local authorities
3. **Location Broadcasting**: Share precise GPS coordinates
4. **Status Updates**: Real-time incident tracking

## 🗺️ Tourism Database

### Destinations Covered
- **Historical Monuments**: Taj Mahal, Red Fort, Qutub Minar
- **Natural Wonders**: Kerala Backwaters, Ladakh, Goa Beaches
- **Religious Sites**: Golden Temple, Varanasi, Tirupati
- **Adventure Destinations**: Rishikesh, Manali, Leh
- **Cultural Hubs**: Rajasthan, Gujarat, Tamil Nadu

### Festival Calendar
- **National Festivals**: Diwali, Holi, Eid, Christmas
- **Regional Celebrations**: Durga Puja, Onam, Baisakhi
- **Cultural Events**: Pushkar Fair, Hornbill Festival
- **Seasonal Festivals**: Kumbh Mela, Rann Utsav

## 📊 Analytics & Insights

### User Analytics
- **Travel Patterns**: Popular destinations and routes
- **Safety Metrics**: Incident rates and response times
- **User Satisfaction**: Ratings and feedback analysis
- **Usage Statistics**: Feature adoption and engagement

### Tourism Insights
- **Seasonal Trends**: Peak and off-season analysis
- **Cost Variations**: Price fluctuations and predictions
- **Weather Impact**: Climate effects on travel patterns
- **Regional Preferences**: State-wise tourism data

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `GET /api/profile` - Get user profile

### Tourism Endpoints
- `GET /api/places` - Get tourist destinations
- `GET /api/festivals` - Get festival information
- `POST /api/recommendations` - Get personalized recommendations
- `POST /api/itinerary` - Create travel itinerary

### Safety Endpoints
- `POST /api/tracking/start` - Start location tracking
- `POST /api/tracking/update` - Update location
- `POST /api/sos` - Send emergency SOS
- `GET /api/police/alerts` - Police dashboard alerts

## 🤝 Contributing

We welcome contributions to improve the Indian Tourism & Safety Application:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

### Development Guidelines
- Follow JavaScript ES6+ standards
- Use meaningful variable and function names
- Add comments for complex logic
- Test all features before submitting
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Government of India** tourism data and guidelines
- **Indian Railways** for transportation integration
- **Weather services** for climate data
- **Open source community** for tools and libraries
- **Accessibility guidelines** from W3C and other organizations

## 📞 Support

For support and queries:
- **Email**: support@indian-tourism-safety.com
- **Phone**: +91-1800-XXX-XXXX (24/7 Emergency Helpline)
- **Documentation**: Visit our comprehensive help center
- **Community**: Join our user community forum

## 🚀 Future Roadmap

### Upcoming Features
- **AR Navigation**: Augmented reality for tourist guidance
- **Blockchain Verification**: Enhanced identity verification
- **IoT Integration**: Smart device connectivity
- **Machine Learning**: Advanced predictive analytics
- **Government Integration**: Direct API connections with tourism boards

### Expansion Plans
- **International Tourism**: Support for neighboring countries
- **Business Travel**: Corporate travel management features
- **Group Tours**: Enhanced group coordination tools
- **Educational Tours**: School and college trip management

---

**Made with ❤️ for safer tourism in Incredible India**
