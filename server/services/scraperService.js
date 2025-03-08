const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Property = require('../models/Property');
const axios = require('axios');
const cheerio = require('cheerio');
const { geocodeAddress } = require('./geocodingService');

// Konfigūracija
const SCRAPER_TIMEOUT = 30 * 60 * 1000; // 30 minučių
const BATCH_SIZE = 100; // Kiek objektų apdoroti vienu metu
const SCRAPER_PATH = path.join(__dirname, '../../scripts/scraper');

/**
 * Paleidžia Aruodas.lt scraper'į
 */
const runScraper = async () => {
  console.log('Paleidžiamas Aruodas.lt scraper...');
  
  // Patikrinti, ar galima naudoti aruodas-lt-scraper
  try {
    // Bandoma naudoti aruodas-lt-scraper per Python
    await runPythonScraper();
    console.log('Python scraper\'is baigė darbą');
  } catch (pythonError) {
    console.error('Klaida paleidžiant Python scraper\'į:', pythonError);
    console.log('Bandoma naudoti vidinį scraper\'į...');
    
    try {
      // Jei Python scraper'is nepavyko, naudojamas vidinis scraper'is
      await runInternalScraper();
      console.log('Vidinis scraper\'is baigė darbą');
    } catch (internalError) {
      console.error('Klaida paleidžiant vidinį scraper\'į:', internalError);
      throw new Error('Nepavyko paleisti nei vieno scraper\'io');
    }
  }

  // Apdoroti surinktus duomenis
  try {
    await processScrapedData();
    console.log('Duomenų apdorojimas baigtas');
    return true;
  } catch (error) {
    console.error('Klaida apdorojant surinktus duomenis:', error);
    throw error;
  }
};

/**
 * Paleidžia Python scraper'į
 */
const runPythonScraper = () => {
  return new Promise((resolve, reject) => {
    // Tikriname, ar yra scraper'io aplankas
    if (!fs.existsSync(SCRAPER_PATH)) {
      return reject(new Error(`Scraper'io aplankas nerastas: ${SCRAPER_PATH}`));
    }

    // Sukuriame command vykdymui (python arba python3)
    const python = spawn('python', [
      path.join(SCRAPER_PATH, 'aruodas_scraper.py'),
      '--output', path.join(SCRAPER_PATH, 'output.json'),
      '--city', 'Vilnius,Kaunas,Klaipėda,Šiauliai,Panevėžys',
      '--property-type', 'flat,house,land'
    ]);

    let dataString = '';
    let errorString = '';

    // Duomenų surinkimas iš scraper'io išvesties
    python.stdout.on('data', (data) => {
      dataString += data.toString();
      console.log(`Scraper'io išvestis: ${data}`);
    });

    // Klaidų surinkimas
    python.stderr.on('data', (data) => {
      errorString += data.toString();
      console.error(`Scraper'io klaida: ${data}`);
    });

    // Užbaigimo apdorojimas
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Scraper'is baigė darbą su klaidos kodu ${code}: ${errorString}`));
      } else {
        resolve(dataString);
      }
    });

    // Timeout nustatymas
    setTimeout(() => {
      python.kill();
      reject(new Error(`Scraper'io timeout po ${SCRAPER_TIMEOUT / 1000 / 60} minučių`));
    }, SCRAPER_TIMEOUT);
  });
};

/**
 * Vidinis scraper'is (jei Python scraper'is nepasiekiamas)
 */
const runInternalScraper = async () => {
  console.log('Paleidžiamas vidinis scraper...');
  
  try {
    // Miestai ir NT tipai, kuriuos scrapinsime
    const cities = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys'];
    const propertyTypes = [
      { type: 'flat', url: 'butai' },
      { type: 'house', url: 'namai' },
      { type: 'land', url: 'sklypai' }
    ];
    
    let allProperties = [];
    
    // Scrapinti kiekvieną miestą ir tipą
    for (const city of cities) {
      for (const propType of propertyTypes) {
        const cityUrl = encodeURIComponent(city.toLowerCase());
        const baseUrl = `https://www.aruodas.lt/${propType.url}/${cityUrl}/`;
        
        console.log(`Scrapinamas: ${city} - ${propType.type} (${baseUrl})`);
        
        try {
          const properties = await scrapAruodasPage(baseUrl, city, propType.type);
          allProperties = [...allProperties, ...properties];
          console.log(`Surinkta ${properties.length} objektų iš ${city} (${propType.type})`);
        } catch (error) {
          console.error(`Klaida scrapinant ${city} ${propType.type}:`, error);
        }
        
        // Pauzė tarp užklausų
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Išsaugoti rezultatus į failą
    const outputPath = path.join(SCRAPER_PATH, 'output.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProperties, null, 2));
    
    console.log(`Iš viso surinkta ${allProperties.length} objektų. Išsaugota į ${outputPath}`);
    return allProperties;
    
  } catch (error) {
    console.error('Vidinio scraper\'io klaida:', error);
    throw error;
  }
};

/**
 * Scrapinti Aruodas.lt puslapį
 */
const scrapAruodasPage = async (baseUrl, city, propertyType, pageLimit = 3) => {
  let properties = [];
  
  try {
    // Scrapinti pirmus kelis puslapius
    for (let page = 1; page <= pageLimit; page++) {
      const pageUrl = page === 1 ? baseUrl : `${baseUrl}puslapis/${page}/`;
      console.log(`Scrapinamas puslapis: ${pageUrl}`);
      
      const response = await axios.get(pageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const listings = $('.list-row');
      
      listings.each((i, element) => {
        try {
          const title = $(element).find('.list-line-1').text().trim();
          const priceText = $(element).find('.list-price-main').text().trim();
          const price = parseInt(priceText.replace(/[^0-9]/g, ''));
          
          const detailsText = $(element).find('.list-line-2').text().trim();
          
          // Plotas
          let area = 0;
          const areaMatch = detailsText.match(/(\d+(\.\d+)?)\s*m²/);
          if (areaMatch) {
            area = parseFloat(areaMatch[1]);
          }
          
          // Kambarių skaičius (jei tai butas arba namas)
          let rooms = null;
          if (propertyType === 'flat' || propertyType === 'house') {
            const roomsMatch = detailsText.match(/(\d+)\s*kamb/);
            if (roomsMatch) {
              rooms = parseInt(roomsMatch[1]);
            }
          }
          
          // URL
          const url = $(element).find('a.item-url').attr('href') || '';
          
          // Nuotraukos URL
          const imageUrl = $(element).find('img').attr('src') || '';
          
          // Adresas
          const address = $(element).find('.list-address').text().trim();
          
          // Sukuriamas objektas
          const property = {
            title,
            price,
            area,
            rooms,
            city,
            district: '', // Bus išskirta vėliau
            propertyType,
            url,
            listedDate: new Date(),
            images: imageUrl ? [imageUrl] : []
          };
          
          // Adresas apdorojamas
          if (address) {
            const addressParts = address.split(',').map(part => part.trim());
            if (addressParts.length > 1) {
              property.district = addressParts[0];
              property.street = addressParts[1];
            } else {
              property.district = address;
            }
          }
          
          properties.push(property);
        } catch (error) {
          console.error('Klaida apdorojant skelbimą:', error);
        }
      });
      
      // Pauzė tarp puslapių
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return properties;
  } catch (error) {
    console.error(`Klaida scrapinant puslapį ${baseUrl}:`, error);
    return properties; // Grąžinti tai, ką jau turime
  }
};

/**
 * Apdoroti surinktus duomenis ir išsaugoti duomenų bazėje
 */
const processScrapedData = async () => {
  const outputPath = path.join(SCRAPER_PATH, 'output.json');
  
  // Patikrinti, ar yra rezultatų failas
  if (!fs.existsSync(outputPath)) {
    throw new Error(`Rezultatų failas nerastas: ${outputPath}`);
  }
  
  // Nuskaityti rezultatus
  const properties = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  console.log(`Nuskaityti ${properties.length} objektai iš failo`);
  
  // Apdoroti duomenis paketuose
  let processedCount = 0;
  let updatedCount = 0;
  let newCount = 0;
  
  for (let i = 0; i < properties.length; i += BATCH_SIZE) {
    const batch = properties.slice(i, i + BATCH_SIZE);
    console.log(`Apdorojamas paketas ${i + 1}-${Math.min(i + BATCH_SIZE, properties.length)} iš ${properties.length}`);
    
    await Promise.all(batch.map(async (property) => {
      try {
        // Patikrinti, ar objektas jau egzistuoja (pagal URL arba pavadinimą ir miestą)
        let existingProperty = null;
        
        if (property.url) {
          existingProperty = await Property.findOne({ url: property.url });
        }
        
        if (!existingProperty && property.title && property.city) {
          existingProperty = await Property.findOne({
            title: property.title,
            city: property.city,
            area: property.area
          });
        }
        
        // Jei objektas jau egzistuoja, atnaujinti jį
        if (existingProperty) {
          // Patikrinti, ar kaina pasikeitė, ir įtraukti į istorijos įrašus
          const priceChanged = existingProperty.addPriceToHistory(property.price);
          
          // Atnaujinti kitą informaciją
          existingProperty.area = property.area || existingProperty.area;
          existingProperty.rooms = property.rooms || existingProperty.rooms;
          existingProperty.district = property.district || existingProperty.district;
          existingProperty.street = property.street || existingProperty.street;
          existingProperty.images = property.images || existingProperty.images;
          existingProperty.updatedDate = new Date();
          existingProperty.active = true;
          
          await existingProperty.save();
          updatedCount++;
        } 
        // Jei objektas naujas, sukurti jį
        else {
          // Pridėti geografines koordinates jei įmanoma
          if (property.city && (property.district || property.street)) {
            try {
              const address = `${property.street || ''}, ${property.district || ''}, ${property.city}, Lietuva`.trim();
              const coordinates = await geocodeAddress(address);
              
              if (coordinates) {
                property.location = {
                  type: 'Point',
                  coordinates: [coordinates.lng, coordinates.lat]
                };
              }
            } catch (geocodeError) {
              console.error('Klaida geokoduojant adresą:', geocodeError);
            }
          }
          
          // Naujo objekto sukūrimas
          const newProperty = new Property({
            ...property,
            active: true,
            listedDate: new Date(),
            updatedDate: new Date()
          });
          
          await newProperty.save();
          newCount++;
        }
        
        processedCount++;
      } catch (error) {
        console.error('Klaida apdorojant objektą:', error);
      }
    }));
    
    // Pauzė tarp paketų
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`Apdorojimas baigtas: ${processedCount} apdorota, ${newCount} naujų, ${updatedCount} atnaujinta`);
  
  // Pažymėti nerastus objektus kaip neaktyvius
  try {
    const inactiveDate = new Date();
    inactiveDate.setDate(inactiveDate.getDate() - 7); // Senesni nei 7 dienos
    
    const inactiveResult = await Property.updateMany(
      { updatedDate: { $lt: inactiveDate }, active: true },
      { $set: { active: false } }
    );
    
    console.log(`Pažymėta neaktyviais: ${inactiveResult.nModified} objektai`);
  } catch (error) {
    console.error('Klaida žymint neaktyvius objektus:', error);
  }
  
  return {
    total: properties.length,
    processed: processedCount,
    new: newCount,
    updated: updatedCount
  };
};

/**
 * Išvalyti senus duomenis (pagalbinė funkcija testavimui)
 */
const clearData = async () => {
  try {
    const result = await Property.deleteMany({});
    console.log(`Išvalyta ${result.deletedCount} objektų`);
    return result.deletedCount;
  } catch (error) {
    console.error('Klaida valant duomenis:', error);
    throw error;
  }
};

module.exports = {
  runScraper,
  processScrapedData,
  clearData
};