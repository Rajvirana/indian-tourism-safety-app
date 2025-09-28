# Google Maps API Setup Guide

To enable the live tourist tracking map functionality, you need to set up Google Maps API. Follow these steps:

## 1. Get Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
   - Distance Matrix API

4. Create credentials (API Key):
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## 2. Configure API Key

Replace `YOUR_GOOGLE_MAPS_API_KEY` in the following files with your actual API key:

### Main Application (`public/index.html`)
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=geometry"></script>
```

### Police Dashboard (`public/police-dashboard.html`)
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap&libraries=geometry,visualization"></script>
```

## 3. API Key Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions**: Set to "HTTP referrers"
2. **Website restrictions**: Add your domains:
   - `http://localhost:5000/*`
   - `https://yourdomain.com/*`

3. **API restrictions**: Limit to only the APIs you need:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API

## 4. Billing Setup

Google Maps requires a billing account:
1. Set up billing in Google Cloud Console
2. You get $200 free credit per month
3. Most development usage stays within free limits

## 5. Testing Without API Key

For development/testing without an API key, the map will show a "For development purposes only" watermark but will still function.

## 6. Map Features Included

### Main Application Map Features:
- **Real-time user location tracking**
- **Tourist location markers with different icons**
- **Emergency alert markers**
- **Route visualization**
- **Geofencing for safety zones**
- **Location sharing**
- **Multiple map styles (roadmap, satellite, hybrid, terrain)**

### Police Dashboard Map Features:
- **Live tourist monitoring**
- **Emergency alert visualization**
- **Tourist clustering for performance**
- **Heatmap visualization**
- **Geofence management**
- **Route tracking and analysis**
- **Real-time statistics**

## 7. Map Controls

### User Controls:
- **My Location**: Center map on user's current location
- **Enable/Disable Tracking**: Toggle GPS tracking
- **Share Location**: Share location link with family/friends
- **Map Style Selector**: Switch between different map views

### Police Controls:
- **Refresh**: Update all markers and data
- **Heatmap**: Toggle heatmap visualization
- **Layer Controls**: Show/hide tourists, alerts, routes, geofences
- **Statistics**: Real-time counts and metrics

## 8. Offline Map Support

The application includes:
- **Cached map tiles** for offline viewing
- **Offline location storage** when network is unavailable
- **Auto-sync** when connection is restored

## 9. Advanced Features

### Geofencing:
- **Safety Zones**: Green circles for safe areas
- **Danger Zones**: Red circles for restricted/dangerous areas
- **Automatic Alerts**: Triggered when tourists enter/exit zones

### Route Tracking:
- **Breadcrumb Trail**: Shows tourist movement history
- **Route Deviation Detection**: Alerts for unusual route changes
- **Estimated Time Analysis**: Predicts arrival times

### Emergency Response:
- **Instant Alert Markers**: Red pulsing markers for emergencies
- **Response Team Dispatch**: Direct integration with emergency services
- **Danger Zone Creation**: Automatic safety perimeters around incidents

## 10. Performance Optimization

- **Marker Clustering**: Groups nearby markers for better performance
- **Lazy Loading**: Only loads visible map areas
- **Efficient Updates**: Only updates changed markers
- **Memory Management**: Proper cleanup of map objects

## 11. Mobile Optimization

- **Touch Controls**: Optimized for mobile devices
- **Responsive Design**: Adapts to different screen sizes
- **GPS Integration**: Uses device GPS for accurate positioning
- **Offline Capability**: Works without internet connection

## 12. Security Features

- **API Key Protection**: Restricted to specific domains
- **Location Privacy**: User controls location sharing
- **Data Encryption**: All location data is encrypted
- **Access Control**: Role-based map access (tourist vs police)

---

**Note**: The map functionality will work with demo data even without a Google Maps API key, but for production use, you should set up proper API credentials.
