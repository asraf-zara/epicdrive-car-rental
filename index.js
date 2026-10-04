const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================================================
// EDIT THESE VALUES FOR YOUR BUSINESS
// ======================================================
const BUSINESS_PHONE = '+966 50 000 0000';
const BUSINESS_PHONE_LINK = '+966500000000';
const WHATSAPP_NUMBER = '966500000000';
const BUSINESS_LOCATION = 'Riyadh, Saudi Arabia';

const cars = [
  {
    slug: 'baleno',
    brand: 'Suzuki',
    name: 'Baleno',
    category: 'City',
    tagline: 'Smart. Compact. Efficient.',
    description: 'A refined city car for daily drives, airport runs and comfortable urban travel.',
    price: 'SAR 150 / Day',
    image: '/images/baleno.png',
    seats: '5 Seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    aircon: 'A/C',
    accent: 'red'
  },
  {
    slug: 'ertiga',
    brand: 'Suzuki',
    name: 'Ertiga',
    category: 'Family',
    tagline: 'More room for every journey.',
    description: 'A spacious and practical 7-seater designed for families, groups and longer road trips.',
    price: 'SAR 220 / Day',
    image: '/images/ertiga.png',
    seats: '7 Seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    aircon: 'A/C',
    accent: 'red'
  },
  {
    slug: 'carens-clavis',
    brand: 'Kia',
    name: 'Carens Clavis',
    category: 'Premium',
    tagline: 'Space meets modern style.',
    description: 'A premium 7-seater with bold styling, generous cabin space and a polished road presence.',
    price: 'SAR 300 / Day',
    image: '/images/carens-clavis.png',
    seats: '7 Seats',
    transmission: 'Automatic',
    fuel: 'Petrol',
    aircon: 'Premium A/C',
    accent: 'blue'
  }
];

const site = {
  name: 'EPICDRIVE',
  subtitle: 'CAR RENTALS',
  phone: BUSINESS_PHONE,
  phoneLink: BUSINESS_PHONE_LINK,
  whatsapp: WHATSAPP_NUMBER,
  location: BUSINESS_LOCATION
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make common data available to every EJS page.
app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.cars = cars;
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.render('home', {
    pageTitle: 'Premium Car Rental',
    pageDescription: 'Explore EPICDRIVE premium car rentals and book directly by phone or WhatsApp.'
  });
});

app.get('/cars', (req, res) => {
  res.render('cars', {
    pageTitle: 'Our Cars',
    pageDescription: 'Explore Baleno, Ertiga and Kia Carens Clavis rental options.'
  });
});

app.get('/cars/baleno', (req, res) => {
  const car = cars.find(c => c.slug === 'baleno');
  res.render('baleno', { pageTitle: `${car.brand} ${car.name}`, car });
});

app.get('/cars/ertiga', (req, res) => {
  const car = cars.find(c => c.slug === 'ertiga');
  res.render('ertiga', { pageTitle: `${car.brand} ${car.name}`, car });
});

app.get('/cars/carens-clavis', (req, res) => {
  const car = cars.find(c => c.slug === 'carens-clavis');
  res.render('carens-clavis', { pageTitle: `${car.brand} ${car.name}`, car });
});

app.get('/how-it-works', (req, res) => {
  res.render('how-it-works', {
    pageTitle: 'How It Works',
    pageDescription: 'Choose your car, contact EPICDRIVE and confirm your rental in three simple steps.'
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    pageTitle: 'Contact',
    pageDescription: 'Contact EPICDRIVE Car Rentals by phone or WhatsApp.'
  });
});

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('=============================================');
  console.log('  EPICDRIVE Car Rentals is running');
  console.log(`  Port: ${PORT}`);
  console.log('  Host: 0.0.0.0');
  console.log('=============================================');
  console.log('');
});
