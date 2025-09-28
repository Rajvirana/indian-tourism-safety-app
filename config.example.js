// Configuration example file
// Copy this to config.js and update with your actual values

module.exports = {
    // Server Configuration
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Security
    jwtSecret: process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_change_in_production',
    
    // Database (MongoDB - for production)
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/indian-tourism-safety',
    
    // Email Service (for notifications)
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    },
    
    // SMS Service (for emergency alerts)
    sms: {
        apiKey: process.env.SMS_API_KEY || 'your_sms_api_key',
        apiSecret: process.env.SMS_API_SECRET || 'your_sms_api_secret'
    },
    
    // Weather API (for travel recommendations)
    weatherApiKey: process.env.WEATHER_API_KEY || 'your_openweather_api_key',
    
    // Google Maps API (for location services)
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'your_google_maps_api_key',
    
    // Police Dashboard API
    police: {
        apiEndpoint: process.env.POLICE_API_ENDPOINT || 'https://police-dashboard-api.gov.in',
        apiKey: process.env.POLICE_API_KEY || 'your_police_api_key'
    },
    
    // Push Notifications
    vapid: {
        publicKey: process.env.VAPID_PUBLIC_KEY || 'your_vapid_public_key',
        privateKey: process.env.VAPID_PRIVATE_KEY || 'your_vapid_private_key',
        subject: process.env.VAPID_SUBJECT || 'mailto:admin@your-domain.com'
    }
};
