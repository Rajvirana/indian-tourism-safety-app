const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demo (replace with MongoDB in production)
const users = [];
const locations = [];
const trackingData = new Map();
const sosAlerts = [];

// Tourism data
const touristPlaces = [
  {
    id: 1,
    name: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    category: "Historical Monument",
    rating: 4.8,
    reviews: 15420,
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    description: "One of the Seven Wonders of the World",
    coordinates: { lat: 27.1751, lng: 78.0421 },
    avgCost: 2500
  },
  {
    id: 2,
    name: "Kerala Backwaters",
    location: "Alleppey, Kerala",
    category: "Natural Beauty",
    rating: 4.7,
    reviews: 8932,
    bestMonths: ["November", "December", "January", "February", "March"],
    description: "Serene backwaters and houseboats",
    coordinates: { lat: 9.4981, lng: 76.3388 },
    avgCost: 3500
  },
  {
    id: 3,
    name: "Golden Temple",
    location: "Amritsar, Punjab",
    category: "Religious Site",
    rating: 4.9,
    reviews: 12450,
    bestMonths: ["October", "November", "December", "January", "February", "March", "April"],
    description: "Sacred Sikh pilgrimage site",
    coordinates: { lat: 31.6200, lng: 74.8765 },
    avgCost: 1800
  },
  {
    id: 4,
    name: "Goa Beaches",
    location: "Goa",
    category: "Beach Destination",
    rating: 4.6,
    reviews: 18750,
    bestMonths: ["November", "December", "January", "February", "March"],
    description: "Beautiful beaches and vibrant nightlife",
    coordinates: { lat: 15.2993, lng: 74.1240 },
    avgCost: 4000
  },
  {
    id: 5,
    name: "Ladakh",
    location: "Ladakh, Jammu & Kashmir",
    category: "Adventure",
    rating: 4.8,
    reviews: 7890,
    bestMonths: ["May", "June", "July", "August", "September"],
    description: "High altitude desert with stunning landscapes",
    coordinates: { lat: 34.1526, lng: 77.5771 },
    avgCost: 8000
  }
];

const festivals = [
  {
    id: 1,
    name: "Diwali",
    location: "Pan India",
    month: "October/November",
    category: "Religious Festival",
    description: "Festival of Lights celebrated across India",
    bestPlaces: ["Varanasi", "Jaipur", "Mumbai", "Delhi"]
  },
  {
    id: 2,
    name: "Holi",
    location: "North India",
    month: "March",
    category: "Cultural Festival",
    description: "Festival of Colors",
    bestPlaces: ["Mathura", "Vrindavan", "Jaipur", "Delhi"]
  },
  {
    id: 3,
    name: "Durga Puja",
    location: "West Bengal",
    month: "September/October",
    category: "Religious Festival",
    description: "Grand celebration in honor of Goddess Durga",
    bestPlaces: ["Kolkata", "Howrah", "Siliguri"]
  },
  {
    id: 4,
    name: "Onam",
    location: "Kerala",
    month: "August/September",
    category: "Harvest Festival",
    description: "Kerala's harvest festival with boat races",
    bestPlaces: ["Kochi", "Thiruvananthapuram", "Alleppey"]
  }
];

// Utility functions
const generateQRCode = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (err) {
    console.error('QR Code generation error:', err);
    return null;
  }
};

const generateJWT = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      aadharNumber, 
      passportNumber, 
      userType, 
      emergencyContact 
    } = req.body;

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique user ID
    const userId = Date.now().toString();

    // Create QR code data
    const qrData = {
      userId,
      name,
      aadharNumber: aadharNumber || null,
      passportNumber: passportNumber || null,
      userType,
      verified: true,
      timestamp: new Date().toISOString()
    };

    const qrCodeImage = await generateQRCode(qrData);

    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      phone,
      aadharNumber: aadharNumber || null,
      passportNumber: passportNumber || null,
      userType,
      emergencyContact,
      qrCode: qrCodeImage,
      qrData,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = generateJWT(userId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        userType,
        qrCode: qrCodeImage,
        isVerified: true
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateJWT(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        qrCode: user.qrCode,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get Tourist Places
app.get('/api/places', (req, res) => {
  const { category, month, maxCost } = req.query;
  
  let filteredPlaces = [...touristPlaces];
  
  if (category) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  if (month) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.bestMonths.some(m => m.toLowerCase() === month.toLowerCase())
    );
  }
  
  if (maxCost) {
    filteredPlaces = filteredPlaces.filter(place => place.avgCost <= parseInt(maxCost));
  }
  
  // Sort by rating
  filteredPlaces.sort((a, b) => b.rating - a.rating);
  
  res.json(filteredPlaces);
});

// Get Festivals
app.get('/api/festivals', (req, res) => {
  const { month, location } = req.query;
  
  let filteredFestivals = [...festivals];
  
  if (month) {
    filteredFestivals = filteredFestivals.filter(festival => 
      festival.month.toLowerCase().includes(month.toLowerCase())
    );
  }
  
  if (location) {
    filteredFestivals = filteredFestivals.filter(festival => 
      festival.location.toLowerCase().includes(location.toLowerCase()) ||
      festival.bestPlaces.some(place => place.toLowerCase().includes(location.toLowerCase()))
    );
  }
  
  res.json(filteredFestivals);
});

// Travel Recommendations
app.post('/api/recommendations', authenticateToken, (req, res) => {
  try {
    const { preferences, budget, duration, travelMonth } = req.body;
    
    let recommendations = [...touristPlaces];
    
    // Filter by month
    if (travelMonth) {
      recommendations = recommendations.filter(place => 
        place.bestMonths.some(m => m.toLowerCase() === travelMonth.toLowerCase())
      );
    }
    
    // Filter by budget
    if (budget) {
      recommendations = recommendations.filter(place => place.avgCost <= budget);
    }
    
    // Filter by preferences
    if (preferences && preferences.length > 0) {
      recommendations = recommendations.filter(place => 
        preferences.some(pref => 
          place.category.toLowerCase().includes(pref.toLowerCase()) ||
          place.description.toLowerCase().includes(pref.toLowerCase())
        )
      );
    }
    
    // Add weather and cost analysis
    recommendations = recommendations.map(place => ({
      ...place,
      weatherScore: place.bestMonths.includes(travelMonth) ? 5 : 3,
      costEffectiveness: budget ? (budget - place.avgCost) / budget : 1,
      recommendation: place.bestMonths.includes(travelMonth) ? 'Highly Recommended' : 'Good Option'
    }));
    
    // Sort by rating and weather score
    recommendations.sort((a, b) => (b.rating + b.weatherScore) - (a.rating + a.weatherScore));
    
    res.json({
      recommendations: recommendations.slice(0, 10),
      travelTips: [
        `${travelMonth} is ${recommendations[0]?.weatherScore === 5 ? 'an excellent' : 'a decent'} time to travel`,
        `Budget of ₹${budget} allows you to visit ${recommendations.filter(r => r.avgCost <= budget).length} recommended places`,
        'Book accommodations in advance for better rates',
        'Consider local transportation for cost savings'
      ]
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Create Itinerary
app.post('/api/itinerary', authenticateToken, (req, res) => {
  try {
    const { destination, duration, interests, budget } = req.body;
    
    const place = touristPlaces.find(p => 
      p.name.toLowerCase().includes(destination.toLowerCase()) ||
      p.location.toLowerCase().includes(destination.toLowerCase())
    );
    
    if (!place) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    // Generate sample itinerary
    const itinerary = {
      id: Date.now().toString(),
      destination: place.name,
      location: place.location,
      duration: parseInt(duration),
      totalBudget: budget,
      estimatedCost: place.avgCost * duration,
      days: []
    };
    
    // Generate day-wise itinerary
    for (let day = 1; day <= duration; day++) {
      const dayPlan = {
        day,
        activities: [
          {
            time: '09:00 AM',
            activity: day === 1 ? 'Arrival and Check-in' : 'Morning Exploration',
            location: place.name,
            duration: '2 hours',
            cost: day === 1 ? 0 : 500
          },
          {
            time: '11:30 AM',
            activity: 'Local Sightseeing',
            location: 'Main Attractions',
            duration: '3 hours',
            cost: 800
          },
          {
            time: '02:30 PM',
            activity: 'Lunch Break',
            location: 'Local Restaurant',
            duration: '1 hour',
            cost: 400
          },
          {
            time: '04:00 PM',
            activity: interests.includes('adventure') ? 'Adventure Activities' : 'Cultural Experience',
            location: 'Activity Center',
            duration: '2.5 hours',
            cost: 1200
          },
          {
            time: '07:00 PM',
            activity: 'Evening Leisure',
            location: 'Local Market/Beach',
            duration: '2 hours',
            cost: 300
          }
        ],
        totalDayCost: 3200
      };
      
      if (day === duration) {
        dayPlan.activities.push({
          time: '10:00 AM',
          activity: 'Departure',
          location: 'Transportation Hub',
          duration: '1 hour',
          cost: 0
        });
      }
      
      itinerary.days.push(dayPlan);
    }
    
    res.json({
      message: 'Itinerary created successfully',
      itinerary
    });
  } catch (error) {
    console.error('Itinerary creation error:', error);
    res.status(500).json({ error: 'Failed to create itinerary' });
  }
});

// Start Location Tracking
app.post('/api/tracking/start', authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    const { familyMembers, destination } = req.body;
    
    const trackingSession = {
      userId,
      sessionId: Date.now().toString(),
      destination,
      familyMembers: familyMembers || [],
      startTime: new Date().toISOString(),
      isActive: true,
      lastLocation: null,
      route: [],
      alerts: []
    };
    
    trackingData.set(userId, trackingSession);
    
    // Notify family members via socket
    familyMembers.forEach(member => {
      io.emit(`tracking_started_${member}`, {
        message: `${users.find(u => u.id === userId)?.name} started location tracking`,
        sessionId: trackingSession.sessionId
      });
    });
    
    res.json({
      message: 'Location tracking started',
      sessionId: trackingSession.sessionId
    });
  } catch (error) {
    console.error('Tracking start error:', error);
    res.status(500).json({ error: 'Failed to start tracking' });
  }
});

// Update Location
app.post('/api/tracking/update', authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    const { latitude, longitude, timestamp } = req.body;
    
    const session = trackingData.get(userId);
    if (!session || !session.isActive) {
      return res.status(404).json({ error: 'No active tracking session' });
    }
    
    const location = { latitude, longitude, timestamp };
    session.lastLocation = location;
    session.route.push(location);
    
    // Check for unusual patterns (simplified logic)
    if (session.route.length > 5) {
      const recentLocations = session.route.slice(-5);
      const distances = recentLocations.map((loc, index) => {
        if (index === 0) return 0;
        const prev = recentLocations[index - 1];
        return Math.sqrt(
          Math.pow(loc.latitude - prev.latitude, 2) + 
          Math.pow(loc.longitude - prev.longitude, 2)
        );
      });
      
      const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
      
      // Trigger SOS if unusual movement pattern detected
      if (avgDistance > 0.01) { // Threshold for unusual movement
        const sosAlert = {
          id: Date.now().toString(),
          userId,
          type: 'UNUSUAL_MOVEMENT',
          location,
          timestamp: new Date().toISOString(),
          severity: 'MEDIUM',
          status: 'ACTIVE'
        };
        
        sosAlerts.push(sosAlert);
        session.alerts.push(sosAlert.id);
        
        // Notify police dashboard
        io.emit('police_alert', sosAlert);
        
        // Notify family members
        session.familyMembers.forEach(member => {
          io.emit(`family_alert_${member}`, {
            type: 'UNUSUAL_MOVEMENT',
            message: 'Unusual movement pattern detected',
            location
          });
        });
      }
    }
    
    trackingData.set(userId, session);
    
    // Broadcast location to family members
    session.familyMembers.forEach(member => {
      io.emit(`location_update_${member}`, {
        userId,
        location,
        timestamp
      });
    });
    
    res.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

// Emergency SOS
app.post('/api/sos', authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    const { type, message, location } = req.body;
    
    const user = users.find(u => u.id === userId);
    const sosAlert = {
      id: Date.now().toString(),
      userId,
      userName: user?.name || 'Unknown',
      userPhone: user?.phone || 'Unknown',
      type: type || 'EMERGENCY',
      message: message || 'Emergency assistance required',
      location,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
      status: 'ACTIVE'
    };
    
    sosAlerts.push(sosAlert);
    
    // Notify police dashboard immediately
    io.emit('police_alert', sosAlert);
    
    // Notify family members if tracking is active
    const trackingSession = trackingData.get(userId);
    if (trackingSession && trackingSession.familyMembers) {
      trackingSession.familyMembers.forEach(member => {
        io.emit(`family_emergency_${member}`, {
          type: 'SOS_ALERT',
          message: `Emergency SOS from ${user?.name}`,
          location,
          contact: user?.phone
        });
      });
    }
    
    // Send to emergency contact
    if (user?.emergencyContact) {
      io.emit(`emergency_contact_${user.emergencyContact}`, {
        type: 'SOS_ALERT',
        message: `Emergency SOS from ${user.name}`,
        location,
        userPhone: user.phone
      });
    }
    
    res.json({
      message: 'SOS alert sent successfully',
      alertId: sosAlert.id
    });
  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({ error: 'Failed to send SOS alert' });
  }
});

// Get User Profile
app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    const { userId } = req.user;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      qrCode: user.qrCode,
      isVerified: user.isVerified,
      emergencyContact: user.emergencyContact
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Police Dashboard - Get Active Alerts
app.get('/api/police/alerts', (req, res) => {
  try {
    const activeAlerts = sosAlerts.filter(alert => alert.status === 'ACTIVE');
    res.json(activeAlerts);
  } catch (error) {
    console.error('Police alerts error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_tracking', (data) => {
    socket.join(`tracking_${data.userId}`);
    console.log(`User ${data.userId} joined tracking room`);
  });
  
  socket.on('join_police', () => {
    socket.join('police_dashboard');
    console.log('Police dashboard connected');
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Police Dashboard Route
app.get('/police', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'police-dashboard.html'));
});

// Serve static files from React build
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Tourist places loaded: ${touristPlaces.length}`);
  console.log(`Festivals loaded: ${festivals.length}`);
});
