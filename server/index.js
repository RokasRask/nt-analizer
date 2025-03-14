const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');
const propertyRoutes = require('./routes/properties');
const scraperService = require('./services/scraperService');

// Aplinkos kintamųjų užkrovimas
dotenv.config();

// Express aplikacijos sukūrimas
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB duomenų bazės prisijungimas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Prisijungta prie MongoDB duomenų bazės');
})
.catch((error) => {
  console.error('MongoDB prisijungimo klaida:', error);
});

// API maršrutai
app.use('/api/properties', propertyRoutes);

// Pagrindinė API informacija
app.get('/api', (req, res) => {
  res.json({
    message: 'Sveiki! Tai Lietuvos NT rinkos analizės API.',
    endpoints: [
      { method: 'GET', path: '/api/properties', description: 'Gauti visus NT objektus' },
      { method: 'GET', path: '/api/properties/:id', description: 'Gauti konkretų NT objektą pagal ID' },
      { method: 'GET', path: '/api/properties/stats', description: 'Gauti NT statistiką' },
      { method: 'GET', path: '/api/properties/trends', description: 'Gauti NT kainų tendencijas' },
    ],
    version: '1.0.0',
  });
});

// Serverio paleidimas
app.listen(PORT, () => {
  console.log(`Serveris veikia portu ${PORT}`);
  
  // Pirmas duomenų scrapinimas paleidus serverį
  if (process.env.RUN_SCRAPER_ON_START === 'true') {
    console.log('Paleidžiamas duomenų scrapinimas...');
    scraperService.runScraper()
      .then(() => console.log('Duomenų scrapinimas baigtas'))
      .catch(err => console.error('Duomenų scrapinimo klaida:', err));
  }
});

// Automatinis duomenų atnaujinimas naudojant cron
// Nustatyta kasdien 3:00 val. nakties
cron.schedule('0 3 * * *', async () => {
  console.log('Pradedamas automatinis duomenų atnaujinimas');
  try {
    await scraperService.runScraper();
    console.log('Automatinis duomenų atnaujinimas baigtas');
  } catch (error) {
    console.error('Automatinio duomenų atnaujinimo klaida:', error);
  }
});

// Tvarkingas išjungimas
process.on('SIGINT', async () => {
  console.log('Serveris išjungiamas...');
  
  try {
    await mongoose.connection.close();
    console.log('MongoDB prisijungimas uždarytas');
    process.exit(0);
  } catch (error) {
    console.error('Klaida uždarant serverį:', error);
    process.exit(1);
  }
});

module.exports = app;