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

// Enhanced destination database with detailed information
const destinationDatabase = {
  'jaipur': {
    name: 'Jaipur',
    location: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    description: 'The Pink City - A royal experience with magnificent palaces and forts',
    hotels: [
      { name: 'The Oberoi Rajvilas', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', rating: 5, priceRange: '₹15,000-25,000', location: 'Goner Road' },
      { name: 'Taj Rambagh Palace', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', rating: 5, priceRange: '₹20,000-35,000', location: 'Ram Bagh Circle' },
      { name: 'Hotel Pearl Palace', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 3, priceRange: '₹2,000-4,000', location: 'Hathroi Fort' }
    ],
    attractions: [
      { name: 'Hawa Mahal', image: 'https://images.unsplash.com/photo-1599661046827-dacff0acf861?w=600&h=400&fit=crop', type: 'Palace', entry: '₹50', timings: '9:00 AM - 4:30 PM' },
      { name: 'City Palace', image: 'https://images.unsplash.com/photo-1549180030-48bf079fb38a?w=600&h=400&fit=crop', type: 'Palace', entry: '₹500', timings: '9:00 AM - 5:00 PM' },
      { name: 'Amber Fort', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Fort', entry: '₹500', timings: '8:00 AM - 6:00 PM' },
      { name: 'Jantar Mantar', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', type: 'Observatory', entry: '₹50', timings: '9:00 AM - 4:30 PM' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Laxmi Misthan Bhandar', cuisine: 'Traditional Rajasthani', speciality: 'Pyaz Kachori, Mirchi Bada', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹200-400' },
        { name: 'Rawat Mishtan Bhandar', cuisine: 'Local Snacks', speciality: 'Kachori, Samosa', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', price: '₹150-300' }
      ],
      lunch: [
        { name: 'Chokhi Dhani', cuisine: 'Rajasthani Thali', speciality: 'Dal Baati Churma', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', price: '₹800-1200' },
        { name: 'Handi Restaurant', cuisine: 'Indian', speciality: 'Laal Maas, Gatte ki Sabzi', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹600-1000' }
      ],
      dinner: [
        { name: '1135 AD', cuisine: 'Royal Indian', speciality: 'Maharaja Thali', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹1500-2500' },
        { name: 'Peacock Rooftop Restaurant', cuisine: 'Multi-cuisine', speciality: 'City Palace View Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹1000-1800' }
      ]
    }
  },
  'goa': {
    name: 'Goa',
    location: 'Coastal India',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
    description: 'Beach paradise with Portuguese heritage and vibrant nightlife',
    hotels: [
      { name: 'The Leela Goa', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', rating: 5, priceRange: '₹18,000-30,000', location: 'Cavelossim Beach' },
      { name: 'Taj Exotica Resort & Spa', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop', rating: 5, priceRange: '₹15,000-25,000', location: 'Benaulim' },
      { name: 'Casa De Goa Boutique Resort', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', rating: 4, priceRange: '₹5,000-8,000', location: 'Calangute' }
    ],
    attractions: [
      { name: 'Baga Beach', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', type: 'Beach', entry: 'Free', timings: '24/7' },
      { name: 'Basilica of Bom Jesus', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Church', entry: 'Free', timings: '9:00 AM - 6:30 PM' },
      { name: 'Dudhsagar Falls', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop', type: 'Waterfall', entry: '₹30', timings: '6:00 AM - 6:00 PM' },
      { name: 'Fort Aguada', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Fort', entry: 'Free', timings: '9:30 AM - 6:00 PM' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Infantaria', cuisine: 'Continental', speciality: 'English Breakfast, Pancakes', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', price: '₹400-700' },
        { name: 'Cafe Chocolatti', cuisine: 'Bakery & Cafe', speciality: 'Fresh Croissants, Coffee', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop', price: '₹300-500' }
      ],
      lunch: [
        { name: 'Fishermans Wharf', cuisine: 'Seafood', speciality: 'Fish Curry Rice, Prawns', image: 'https://images.unsplash.com/photo-1559847844-d5b5223ba9b6?w=400&h=300&fit=crop', price: '₹800-1400' },
        { name: 'Vinayak Family Restaurant', cuisine: 'Goan', speciality: 'Fish Thali, Sol Kadhi', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹500-900' }
      ],
      dinner: [
        { name: 'Thalassa', cuisine: 'Greek & Seafood', speciality: 'Cliff-side dining, Fresh catch', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹2000-3500' },
        { name: 'La Plage', cuisine: 'French', speciality: 'Beach dining, Wine selection', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹1800-3000' }
      ]
    }
  },
  'kerala': {
    name: 'Kerala',
    location: 'South India',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop',
    description: 'God\'s Own Country - Backwaters, spices, and serene landscapes',
    hotels: [
      { name: 'Kumarakom Lake Resort', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop', rating: 5, priceRange: '₹12,000-20,000', location: 'Kumarakom' },
      { name: 'Taj Malabar Resort & Spa', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop', rating: 5, priceRange: '₹15,000-25,000', location: 'Cochin' },
      { name: 'Spice Village', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 4, priceRange: '₹8,000-15,000', location: 'Thekkady' }
    ],
    attractions: [
      { name: 'Alleppey Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop', type: 'Backwaters', entry: '₹1,500', timings: '6:00 AM - 8:00 PM' },
      { name: 'Munnar Tea Gardens', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', type: 'Hill Station', entry: '₹100', timings: '8:00 AM - 6:00 PM' },
      { name: 'Fort Kochi', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Historical', entry: 'Free', timings: '24/7' },
      { name: 'Periyar Wildlife Sanctuary', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop', type: 'Wildlife', entry: '₹300', timings: '6:00 AM - 6:00 PM' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Kashi Art Cafe', cuisine: 'Continental & South Indian', speciality: 'Appam with Stew, Fresh Coffee', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', price: '₹300-600' },
        { name: 'Dhe Puttu', cuisine: 'Traditional Kerala', speciality: 'Puttu Varieties, Coconut Chutney', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹200-400' }
      ],
      lunch: [
        { name: 'Kayees Biryani', cuisine: 'Malabar', speciality: 'Biryani, Malabar Fish Curry', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', price: '₹400-800' },
        { name: 'Thalassery Restaurant', cuisine: 'North Malabar', speciality: 'Thalassery Biryani, Banana Leaf Meals', image: 'https://images.unsplash.com/photo-1559847844-d5b5223ba9b6?w=400&h=300&fit=crop', price: '₹350-700' }
      ],
      dinner: [
        { name: 'Casino Hotel', cuisine: 'Fine Dining Kerala', speciality: 'Karimeen Fish, Seafood Platter', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹1200-2000' },
        { name: 'Oceanos Restaurant', cuisine: 'Coastal', speciality: 'Fresh Seafood, Backwater View Dining', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹800-1500' }
      ]
    }
  },
  'delhi': {
    name: 'Delhi',
    location: 'National Capital Territory',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    description: 'India\'s capital - A blend of ancient heritage and modern dynamism',
    hotels: [
      { name: 'The Imperial New Delhi', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', rating: 5, priceRange: '₹20,000-35,000', location: 'Connaught Place' },
      { name: 'The Leela Palace New Delhi', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', rating: 5, priceRange: '₹25,000-40,000', location: 'Chanakyapuri' },
      { name: 'Hotel Godwin Deluxe', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 3, priceRange: '₹3,000-6,000', location: 'Paharganj' }
    ],
    attractions: [
      { name: 'Red Fort', image: 'https://images.unsplash.com/photo-1599661046827-dacff0acf861?w=600&h=400&fit=crop', type: 'Fort', entry: '₹500', timings: '9:30 AM - 4:30 PM' },
      { name: 'India Gate', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', type: 'Memorial', entry: 'Free', timings: '24/7' },
      { name: 'Lotus Temple', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Temple', entry: 'Free', timings: '9:00 AM - 5:30 PM' },
      { name: 'Qutub Minar', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', type: 'UNESCO Site', entry: '₹500', timings: '7:00 AM - 5:00 PM' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Paranthe Wali Gali', cuisine: 'North Indian', speciality: 'Stuffed Parathas, Lassi', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹200-400' },
        { name: 'Khan Chacha', cuisine: 'Mughlai', speciality: 'Rolls, Kebabs', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', price: '₹150-350' }
      ],
      lunch: [
        { name: 'Karim\'s', cuisine: 'Mughlai', speciality: 'Mutton Korma, Biryani', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', price: '₹600-1200' },
        { name: 'Saravana Bhavan', cuisine: 'South Indian', speciality: 'Dosa, Idli, Filter Coffee', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹300-600' }
      ],
      dinner: [
        { name: 'Indian Accent', cuisine: 'Modern Indian', speciality: 'Innovative Indian Cuisine', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹3000-5000' },
        { name: 'Bukhara', cuisine: 'North Indian', speciality: 'Dal Bukhara, Tandoor Items', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹2500-4000' }
      ]
    }
  },
  'agra': {
    name: 'Agra',
    location: 'Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    description: 'City of the Taj - Home to the world\'s most beautiful monument of love',
    hotels: [
      { name: 'The Oberoi Amarvilas', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', rating: 5, priceRange: '₹40,000-70,000', location: '600m from Taj Mahal' },
      { name: 'ITC Mughal', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', rating: 5, priceRange: '₹15,000-25,000', location: 'Taj Ganj' },
      { name: 'Hotel Taj Plaza', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 3, priceRange: '₹2,500-5,000', location: 'Fatehabad Road' }
    ],
    attractions: [
      { name: 'Taj Mahal', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop', type: 'UNESCO Site', entry: '₹1,100', timings: '6:00 AM - 7:00 PM' },
      { name: 'Agra Fort', image: 'https://images.unsplash.com/photo-1599661046827-dacff0acf861?w=600&h=400&fit=crop', type: 'Fort', entry: '₹650', timings: '6:00 AM - 6:00 PM' },
      { name: 'Mehtab Bagh', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Garden', entry: '₹300', timings: '6:00 AM - 6:00 PM' },
      { name: 'Itimad-ud-Daulah', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', type: 'Tomb', entry: '₹310', timings: '6:00 AM - 6:00 PM' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Joney\'s Place', cuisine: 'Continental & Indian', speciality: 'Banana Pancakes, Masala Chai', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', price: '₹300-600' },
        { name: 'Sheroes Hangout', cuisine: 'Cafe', speciality: 'Coffee, Sandwiches', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop', price: '₹200-400' }
      ],
      lunch: [
        { name: 'Pinch of Spice', cuisine: 'North Indian', speciality: 'Mughlai Cuisine, Tandoor', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', price: '₹600-1200' },
        { name: 'Peshawri', cuisine: 'North West Frontier', speciality: 'Kebabs, Dal Peshawri', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹800-1500' }
      ],
      dinner: [
        { name: 'Esphahan', cuisine: 'Mughlai', speciality: 'Royal Mughlai Feast', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹2500-4000' },
        { name: 'Taj Bano', cuisine: 'Indian', speciality: 'Rooftop Taj View Dining', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹1000-2000' }
      ]
    }
  },
  'mumbai': {
    name: 'Mumbai',
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&h=600&fit=crop',
    description: 'The City of Dreams - Bollywood, street food, and endless energy',
    hotels: [
      { name: 'The Taj Mahal Palace', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop', rating: 5, priceRange: '₹25,000-45,000', location: 'Colaba' },
      { name: 'The Oberoi Mumbai', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', rating: 5, priceRange: '₹20,000-35,000', location: 'Nariman Point' },
      { name: 'Hotel Sea Palace', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 3, priceRange: '₹4,000-8,000', location: 'Marine Drive' }
    ],
    attractions: [
      { name: 'Gateway of India', image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600&h=400&fit=crop', type: 'Monument', entry: 'Free', timings: '24/7' },
      { name: 'Marine Drive', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop', type: 'Promenade', entry: 'Free', timings: '24/7' },
      { name: 'Elephanta Caves', image: 'https://images.unsplash.com/photo-1599661046827-dacff0acf861?w=600&h=400&fit=crop', type: 'UNESCO Site', entry: '₹600', timings: '9:00 AM - 5:30 PM' },
      { name: 'Chhatrapati Shivaji Terminus', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', type: 'Railway Station', entry: 'Free', timings: '24/7' }
    ],
    restaurants: {
      breakfast: [
        { name: 'Kyani & Co.', cuisine: 'Irani Cafe', speciality: 'Bun Maska, Irani Chai', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop', price: '₹150-300' },
        { name: 'Britannia & Co.', cuisine: 'Parsi', speciality: 'Berry Pulav, Dhansak', image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&h=300&fit=crop', price: '₹400-800' }
      ],
      lunch: [
        { name: 'Trishna', cuisine: 'Seafood', speciality: 'Koliwada Prawns, Butter Pepper Garlic Crab', image: 'https://images.unsplash.com/photo-1559847844-d5b5223ba9b6?w=400&h=300&fit=crop', price: '₹1200-2500' },
        { name: 'Leopold Cafe', cuisine: 'Continental', speciality: 'Mumbai Institution, Mixed Cuisine', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', price: '₹600-1200' }
      ],
      dinner: [
        { name: 'Khyber Restaurant', cuisine: 'North Indian', speciality: 'Tandoor Specialties, Rajasthani Cuisine', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹1500-3000' },
        { name: 'Zodiac Grill', cuisine: 'Continental', speciality: 'Fine Dining with Harbor Views', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop', price: '₹2500-4500' }
      ]
    }
  }
};

// Tourism data
const touristPlaces = [
  {
    id: 1,
    name: "Jaipur",
    location: "Rajasthan",
    category: "Historical",
    rating: 4.7,
    reviews: 12380,
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    description: "The Pink City - Royal palaces and magnificent forts",
    coordinates: { lat: 26.9124, lng: 75.7873 },
    avgCost: 3200,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop"
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
    avgCost: 3500,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop"
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
    avgCost: 1800,
    image: "https://images.unsplash.com/photo-1588997262374-8d2ac730fc85?w=800&h=600&fit=crop"
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
    avgCost: 4000,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop"
  },
  {
    id: 5,
    name: "Hampi",
    location: "Karnataka",
    category: "Historical",
    rating: 4.6,
    reviews: 9340,
    bestMonths: ["October", "November", "December", "January", "February", "March"],
    description: "Ancient ruins of the Vijayanagara Empire",
    coordinates: { lat: 15.3350, lng: 76.4600 },
    avgCost: 2800,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop"
  }
];

// Seasonal recommendations based on months
const seasonalRecommendations = {
  january: [
    {
      type: "Waterfall",
      name: "Dudhsagar Falls",
      location: "Goa",
      description: "Magnificent 4-tier waterfall at its best after monsoon",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
      bestTime: "Post-monsoon flow, pleasant weather",
      activities: ["Trekking", "Photography", "Swimming"]
    },
    {
      type: "Hill Station",
      name: "Munnar Tea Gardens",
      location: "Kerala",
      description: "Lush green tea plantations with perfect cool weather",
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=600&fit=crop",
      bestTime: "Cool and misty mornings, ideal for trekking",
      activities: ["Tea plantation tours", "Trekking", "Nature walks"]
    }
  ],
  february: [
    {
      type: "Desert Safari",
      name: "Thar Desert",
      location: "Rajasthan",
      description: "Perfect weather for camel safari and desert camping",
      image: "https://images.unsplash.com/photo-1509650859963-297b3457e06c?w=800&h=600&fit=crop",
      bestTime: "Cool desert weather, clear starry nights",
      activities: ["Camel safari", "Desert camping", "Cultural shows"]
    },
    {
      type: "Beach",
      name: "Varkala Cliffs",
      location: "Kerala",
      description: "Stunning cliff beaches with perfect winter weather",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      bestTime: "Ideal beach weather, not too hot",
      activities: ["Beach walks", "Ayurveda spa", "Cliff jumping"]
    }
  ],
  march: [
    {
      type: "Cherry Blossoms",
      name: "Shillong Peak",
      location: "Meghalaya",
      description: "Beautiful cherry blossoms in full bloom",
      image: "https://images.unsplash.com/photo-1522571890686-d6b8d1066ec8?w=800&h=600&fit=crop",
      bestTime: "Cherry blossom season, mild weather",
      activities: ["Photography", "Nature walks", "Local festivals"]
    }
  ],
  april: [
    {
      type: "Hill Station",
      name: "Darjeeling",
      location: "West Bengal",
      description: "Clear mountain views and blooming rhododendrons",
      image: "https://images.unsplash.com/photo-1605538883669-825200433431?w=800&h=600&fit=crop",
      bestTime: "Clear weather, great Himalayan views",
      activities: ["Toy train ride", "Tea gardens", "Sunrise viewing"]
    }
  ],
  may: [
    {
      type: "Mountain Adventure",
      name: "Manali-Rohtang Pass",
      location: "Himachal Pradesh",
      description: "Snow activities and adventure sports begin",
      image: "https://images.unsplash.com/photo-1486162928267-e6274cb3106f?w=800&h=600&fit=crop",
      bestTime: "Road opens, snow activities available",
      activities: ["Skiing", "Snowboarding", "Mountain biking"]
    }
  ],
  june: [
    {
      type: "Hill Station Escape",
      name: "Shimla",
      location: "Himachal Pradesh",
      description: "Perfect escape from summer heat",
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=600&fit=crop",
      bestTime: "Pleasant cool weather, summer retreat",
      activities: ["Mall Road walks", "Toy train", "Cool climate"]
    }
  ],
  july: [
    {
      type: "Monsoon Magic",
      name: "Valley of Flowers",
      location: "Uttarakhand",
      description: "Spectacular wildflower blooms during monsoon",
      image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=600&fit=crop",
      bestTime: "Peak blooming season with monsoon rains",
      activities: ["Trekking", "Photography", "Botanical tours"]
    }
  ],
  august: [
    {
      type: "Lush Landscapes",
      name: "Coorg Coffee Plantations",
      location: "Karnataka",
      description: "Verdant green landscapes at their peak",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=600&fit=crop",
      bestTime: "Monsoon greenery, coffee harvest season",
      activities: ["Coffee plantation tours", "Waterfalls", "Nature walks"]
    }
  ],
  september: [
    {
      type: "Post-Monsoon Beauty",
      name: "Athirapally Falls",
      location: "Kerala",
      description: "Kerala's Niagara at full glory after monsoon",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
      bestTime: "Post-monsoon maximum water flow",
      activities: ["Waterfall viewing", "Nature photography", "Elephant spotting"]
    }
  ],
  october: [
    {
      type: "Perfect Weather",
      name: "Hampi Ruins",
      location: "Karnataka",
      description: "Ideal weather to explore ancient ruins",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop",
      bestTime: "Post-monsoon pleasant weather",
      activities: ["Historical exploration", "Rock climbing", "Photography"]
    },
    {
      type: "Festival Season",
      name: "Mysore Palace",
      location: "Karnataka",
      description: "Dussehra celebrations and pleasant weather",
      image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&h=600&fit=crop",
      bestTime: "Festival season, perfect weather",
      activities: ["Palace tours", "Cultural shows", "Light displays"]
    }
  ],
  november: [
    {
      type: "Golden Season",
      name: "Rajasthan Heritage",
      location: "Jaipur, Udaipur",
      description: "Perfect weather for heritage tours",
      image: "https://images.unsplash.com/photo-1599661046827-dacde6819498?w=800&h=600&fit=crop",
      bestTime: "Peak tourist season, ideal weather",
      activities: ["Palace tours", "Desert safaris", "Cultural experiences"]
    }
  ],
  december: [
    {
      type: "Winter Wonderland",
      name: "Auli Ski Resort",
      location: "Uttarakhand",
      description: "Fresh powder snow for skiing",
      image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop",
      bestTime: "Fresh snowfall, skiing season begins",
      activities: ["Skiing", "Snow sports", "Mountain views"]
    }
  ]
};

const festivals = [
  {
    id: 1,
    name: "Diwali",
    location: "Pan India",
    month: "October/November",
    category: "Religious Festival",
    description: "Festival of lights celebrated with diyas, fireworks, and sweets",
    bestPlaces: ["Varanasi", "Amritsar", "Jaipur", "Delhi"],
    image: "https://images.unsplash.com/photo-1605372570199-c8c7d1b25e15?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Lighting diyas", "Fireworks", "Sweet distribution", "Rangoli making"],
    duration: "5 days"
  },
  {
    id: 2,
    name: "Holi",
    location: "Pan India",
    month: "March",
    category: "Color Festival",
    description: "Festival of colors celebrating the victory of good over evil",
    bestPlaces: ["Mathura", "Vrindavan", "Barsana", "Pushkar"],
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Color throwing", "Water balloons", "Folk music", "Traditional sweets"],
    duration: "2 days"
  },
  {
    id: 3,
    name: "Durga Puja",
    location: "West Bengal",
    month: "September/October",
    category: "Religious Festival",
    description: "Grand celebration of Goddess Durga with elaborate pandals",
    bestPlaces: ["Kolkata", "Siliguri", "Durgapur"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Pandal hopping", "Cultural programs", "Dhak beats", "Pushpanjali"],
    duration: "10 days"
  },
  {
    id: 4,
    name: "Ganesh Chaturthi",
    location: "Maharashtra",
    month: "August/September",
    category: "Religious Festival",
    description: "Celebration of Lord Ganesha with grand processions",
    bestPlaces: ["Mumbai", "Pune", "Nashik"],
    image: "https://images.unsplash.com/photo-1582706019628-b6eeb8013987?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Ganpati installation", "Processions", "Modak making", "Cultural shows"],
    duration: "11 days"
  },
  {
    id: 5,
    name: "Onam",
    location: "Kerala",
    month: "August/September",
    category: "Harvest Festival",
    description: "Kerala's harvest festival with flower carpets and boat races",
    bestPlaces: ["Thiruvananthapuram", "Kochi", "Alleppey"],
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Pookalam making", "Boat races", "Traditional dance", "Sadhya feast"],
    duration: "10 days"
  },
  {
    id: 6,
    name: "Navratri",
    location: "Gujarat",
    month: "September/October",
    category: "Dance Festival",
    description: "Nine nights of traditional dance and celebration",
    bestPlaces: ["Ahmedabad", "Vadodara", "Surat"],
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Garba dance", "Dandiya raas", "Traditional attire", "Live music"],
    duration: "9 days"
  },
  {
    id: 7,
    name: "Karva Chauth",
    location: "North India",
    month: "October/November",
    category: "Cultural Festival",
    description: "Beautiful festival where wives fast for husbands' well-being",
    bestPlaces: ["Delhi", "Jaipur", "Chandigarh"],
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Mehendi application", "Moon sighting", "Traditional songs", "Sargi"],
    duration: "1 day"
  },
  {
    id: 8,
    name: "Eid ul-Fitr",
    location: "Pan India",
    month: "Varies (Lunar)",
    category: "Religious Festival",
    description: "Celebration marking the end of Ramadan with prayers and feasts",
    bestPlaces: ["Delhi", "Hyderabad", "Lucknow", "Mumbai"],
    image: "https://images.unsplash.com/photo-1588946116232-7473de3fb9cb?ixlib=rb-4.0.3&w=500&h=500&fit=crop&auto=format",
    activities: ["Special prayers", "Feast preparation", "Gift giving", "Charity"],
    duration: "3 days"
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

// Get smart recommendations based on current month or specified month
app.get('/api/smart-recommendations', (req, res) => {
  try {
    const requestedMonth = req.query.month;
    const currentDate = new Date();
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                       'july', 'august', 'september', 'october', 'november', 'december'];
    
    let targetMonth;
    if (requestedMonth && monthNames.includes(requestedMonth.toLowerCase())) {
      targetMonth = requestedMonth.toLowerCase();
    } else {
      targetMonth = monthNames[currentDate.getMonth()];
    }
    
    const recommendations = seasonalRecommendations[targetMonth] || [];
    
    res.json({
      month: targetMonth.charAt(0).toUpperCase() + targetMonth.slice(1),
      monthIndex: monthNames.indexOf(targetMonth) + 1,
      recommendations: recommendations,
      message: recommendations.length > 0 
        ? `Perfect time to visit these amazing places in ${targetMonth.charAt(0).toUpperCase() + targetMonth.slice(1)}!` 
        : `No specific recommendations for ${targetMonth}, but India is beautiful year-round!`
    });
  } catch (error) {
    console.error('Smart recommendations error:', error);
    res.status(500).json({ error: 'Failed to get smart recommendations' });
  }
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
app.post('/api/itinerary', (req, res) => {
  try {
    const { destination, duration, interests, budget } = req.body;
    
    // Find destination in enhanced database or fallback to basic
    let destinationData = null;
    const searchKey = destination.toLowerCase();
    
    // Check enhanced database first
    for (const [key, data] of Object.entries(destinationDatabase)) {
      if (searchKey.includes(key) || key.includes(searchKey)) {
        destinationData = data;
        break;
      }
    }
    
    // Fallback to basic tourist places
    if (!destinationData) {
    const place = touristPlaces.find(p => 
        p.name.toLowerCase().includes(searchKey) ||
        p.location.toLowerCase().includes(searchKey)
      );
      
      if (place) {
        destinationData = {
          name: place.name,
          location: place.location,
          image: place.image,
          description: place.description || 'A beautiful destination to explore',
          hotels: [{ name: 'Local Hotel', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop', rating: 3, priceRange: '₹2,000-5,000', location: place.location }],
          attractions: [{ name: place.name, image: place.image, type: 'Tourist Spot', entry: '₹100', timings: '9:00 AM - 6:00 PM' }],
          restaurants: {
            breakfast: [{ name: 'Local Breakfast Place', cuisine: 'Indian', speciality: 'Traditional breakfast', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹200-400' }],
            lunch: [{ name: 'Local Restaurant', cuisine: 'Indian', speciality: 'Regional cuisine', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', price: '₹400-800' }],
            dinner: [{ name: 'Local Dinner Place', cuisine: 'Indian', speciality: 'Traditional dinner', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop', price: '₹600-1200' }]
          }
        };
      } else {
        return res.status(404).json({ error: 'Destination not found. Try popular destinations like Jaipur, Goa, Kerala, etc.' });
      }
    }
    
    // Filter hotels based on budget
    const budgetCategory = budget < 10000 ? 'budget' : budget < 20000 ? 'mid-range' : 'luxury';
    const filteredHotels = destinationData.hotels.filter(hotel => {
      const minPrice = parseInt(hotel.priceRange.split('-')[0].replace(/[₹,]/g, ''));
      if (budgetCategory === 'budget') return minPrice <= 5000;
      if (budgetCategory === 'mid-range') return minPrice <= 15000;
      return true; // luxury - show all
    });

    // Generate comprehensive itinerary
    const itinerary = {
      id: Date.now().toString(),
      destination: destinationData.name,
      location: destinationData.location,
      image: destinationData.image,
      description: destinationData.description,
      duration: parseInt(duration),
      totalBudget: budget,
      estimatedCost: Math.round(budget * 0.8), // Estimate 80% of budget
      hotels: filteredHotels.length > 0 ? filteredHotels : destinationData.hotels,
      budgetCategory: budgetCategory,
      interests: interests,
      days: []
    };
    
    // Generate detailed day-wise itinerary
    for (let day = 1; day <= duration; day++) {
      const dayPlan = {
        day,
        theme: day === 1 ? 'Arrival & Exploration' : day === duration ? 'Departure Day' : `Day ${day} Adventures`,
        meals: {
          breakfast: destinationData.restaurants.breakfast[Math.floor(Math.random() * destinationData.restaurants.breakfast.length)],
          lunch: destinationData.restaurants.lunch[Math.floor(Math.random() * destinationData.restaurants.lunch.length)],
          dinner: destinationData.restaurants.dinner[Math.floor(Math.random() * destinationData.restaurants.dinner.length)]
        },
        activities: [],
        totalDayCost: 0
      };
      
      if (day === 1) {
        // Arrival day
        dayPlan.activities = [
          {
            time: '10:00 AM',
            activity: 'Arrival & Hotel Check-in',
            location: itinerary.hotels[0].name,
            image: itinerary.hotels[0].image,
            description: 'Arrive and settle into your accommodation',
            duration: '2 hours',
            cost: 0,
            type: 'accommodation'
          },
          {
            time: '1:00 PM',
            activity: 'Welcome Lunch',
            location: dayPlan.meals.lunch.name,
            image: dayPlan.meals.lunch.image,
            description: `Enjoy ${dayPlan.meals.lunch.speciality} at this local favorite`,
          duration: '1.5 hours',
          cost: budgetCategory === 'budget' ? 400 : budgetCategory === 'mid-range' ? 600 : 900,
          type: 'dining'
        },
          {
            time: '4:00 PM',
            activity: `Visit ${destinationData.attractions[0].name}`,
            location: destinationData.attractions[0].name,
            image: destinationData.attractions[0].image,
            description: 'Start your journey with the most iconic attraction',
            duration: '3 hours',
            cost: parseInt(destinationData.attractions[0].entry.replace('₹', '').replace('Free', '0')) + 200 || 400,
            type: 'sightseeing'
          },
          {
            time: '8:00 PM',
            activity: 'Welcome Dinner',
            location: dayPlan.meals.dinner.name,
            image: dayPlan.meals.dinner.image,
            description: `Experience ${dayPlan.meals.dinner.speciality}`,
          duration: '2 hours',
          cost: budgetCategory === 'budget' ? 800 : budgetCategory === 'mid-range' ? 1200 : 1800,
          type: 'dining'
          }
        ];
      } else if (day === duration) {
        // Departure day
        dayPlan.activities = [
          {
            time: '8:00 AM',
            activity: 'Farewell Breakfast',
            location: dayPlan.meals.breakfast.name,
            image: dayPlan.meals.breakfast.image,
            description: `Last taste of ${dayPlan.meals.breakfast.speciality}`,
            duration: '1 hour',
          cost: budgetCategory === 'budget' ? 300 : budgetCategory === 'mid-range' ? 400 : 600,
          type: 'dining'
          },
          {
            time: '10:00 AM',
            activity: 'Last-minute Shopping',
            location: 'Local Market',
            image: 'https://images.unsplash.com/photo-1555529902-ce73b7c37ad3?w=600&h=400&fit=crop',
            description: 'Pick up souvenirs and local specialties',
            duration: '2 hours',
            cost: 800,
            type: 'shopping'
          },
          {
            time: '1:00 PM',
            activity: 'Hotel Check-out & Departure',
            location: itinerary.hotels[0].name,
            image: itinerary.hotels[0].image,
            description: 'Check out and head to your next destination',
            duration: '1 hour',
            cost: 0,
            type: 'departure'
          }
        ];
      } else {
        // Regular exploration days - filter attractions based on interests
        let filteredAttractions = [...destinationData.attractions];
        if (interests.includes('nature')) {
          filteredAttractions = destinationData.attractions.filter(att => 
            att.type.toLowerCase().includes('garden') || 
            att.type.toLowerCase().includes('wildlife') || 
            att.type.toLowerCase().includes('hill') ||
            att.type.toLowerCase().includes('beach') ||
            att.type.toLowerCase().includes('waterfall') ||
            att.name.toLowerCase().includes('park') ||
            att.name.toLowerCase().includes('lake')
          );
        } else if (interests.includes('culture')) {
          filteredAttractions = destinationData.attractions.filter(att => 
            att.type.toLowerCase().includes('palace') || 
            att.type.toLowerCase().includes('fort') || 
            att.type.toLowerCase().includes('temple') ||
            att.type.toLowerCase().includes('museum') ||
            att.type.toLowerCase().includes('historical')
          );
        }
        
        // Fallback to all attractions if no specific interests match
        if (filteredAttractions.length === 0) {
          filteredAttractions = destinationData.attractions;
        }
        
        const attraction1 = filteredAttractions[Math.min(day - 2, filteredAttractions.length - 1)];
        const attraction2 = filteredAttractions[Math.min(day - 1, filteredAttractions.length - 1)] || attraction1;
        
        dayPlan.activities = [
          {
            time: '8:00 AM',
            activity: 'Breakfast',
            location: dayPlan.meals.breakfast.name,
            image: dayPlan.meals.breakfast.image,
            description: `Start your day with ${dayPlan.meals.breakfast.speciality}`,
          duration: '1 hour',
            cost: budgetCategory === 'budget' ? 250 : budgetCategory === 'mid-range' ? 350 : 500,
            type: 'dining'
          },
          {
            time: '10:00 AM',
            activity: `Explore ${attraction1.name}`,
            location: attraction1.name,
            image: attraction1.image,
            description: `Discover this ${attraction1.type.toLowerCase()} - ${attraction1.timings}`,
            duration: '3 hours',
            cost: parseInt(attraction1.entry.replace('₹', '').replace('Free', '0')) + 300 || 500,
            type: 'sightseeing'
          },
          {
            time: '1:30 PM',
            activity: 'Lunch Break',
            location: dayPlan.meals.lunch.name,
            image: dayPlan.meals.lunch.image,
            description: `Savor authentic ${dayPlan.meals.lunch.speciality}`,
            duration: '1.5 hours',
            cost: budgetCategory === 'budget' ? 500 : budgetCategory === 'mid-range' ? 700 : 1000,
            type: 'dining'
          },
          {
            time: '4:00 PM',
            activity: `Visit ${attraction2.name}`,
            location: attraction2.name,
            image: attraction2.image,
            description: `Experience this amazing ${attraction2.type.toLowerCase()}`,
            duration: '2.5 hours',
            cost: parseInt(attraction2.entry.replace('₹', '').replace('Free', '0')) + 200 || 400,
            type: 'sightseeing'
          },
          {
            time: '8:00 PM',
            activity: 'Dinner & Local Experience',
            location: dayPlan.meals.dinner.name,
            image: dayPlan.meals.dinner.image,
            description: `End your day with ${dayPlan.meals.dinner.speciality}`,
            duration: '2 hours',
            cost: budgetCategory === 'budget' ? 800 : budgetCategory === 'mid-range' ? 1200 : 1800,
            type: 'dining'
          }
        ];
      }
      
      // Calculate total day cost
      dayPlan.totalDayCost = dayPlan.activities.reduce((sum, activity) => sum + activity.cost, 0);
      itinerary.days.push(dayPlan);
    }
    
    // Update estimated cost based on actual calculations
    itinerary.estimatedCost = itinerary.days.reduce((sum, day) => sum + day.totalDayCost, 0);
    
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
