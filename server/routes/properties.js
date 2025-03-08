const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { calculateDistance } = require('../services/geocodingService');

/**
 * GET /api/properties
 * Gauti visus NT objektus su filtravimo galimybėmis
 */
router.get('/', async (req, res) => {
  try {
    // Filtravimo parametrai
    const {
      city,
      district,
      propertyType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      rooms,
      active,
      limit = 20,
      offset = 0,
      sort = 'listedDate',
      order = 'desc'
    } = req.query;

    // Filtravimo sąlygos
    const query = {};

    // Objektų filtravimas
    if (city && city !== 'all') {
      query.city = city;
    }

    if (district && district !== 'all') {
      query.district = district;
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    if (minPrice) {
      query.price = { ...query.price, $gte: parseInt(minPrice) };
    }

    if (maxPrice) {
      query.price = { ...query.price, $lte: parseInt(maxPrice) };
    }

    if (minArea) {
      query.area = { ...query.area, $gte: parseFloat(minArea) };
    }

    if (maxArea) {
      query.area = { ...query.area, $lte: parseFloat(maxArea) };
    }

    if (rooms && rooms !== 'all') {
      query.rooms = parseInt(rooms);
    }

    // Aktyvūs/neaktyvūs objektai
    if (active === 'true') {
      query.active = true;
    } else if (active === 'false') {
      query.active = false;
    }

    // Rikiavimo nustatymai
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Vykdyti užklausą
    const properties = await Property.find(query)
      .sort(sortOptions)
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    // Bendras skaičius (be limit/offset)
    const total = await Property.countDocuments(query);

    res.json({
      totalCount: total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      properties
    });
  } catch (error) {
    console.error('Klaida gaunant NT objektus:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant NT objektus' });
  }
});

/**
 * GET /api/properties/:id
 * Gauti konkretų NT objektą pagal ID
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: 'NT objektas nerastas' });
    }

    res.json(property);
  } catch (error) {
    console.error('Klaida gaunant NT objektą:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant NT objektą' });
  }
});

/**
 * GET /api/properties/stats
 * Gauti NT rinkos statistiką
 */
router.get('/stats/general', async (req, res) => {
  try {
    const { city, propertyType } = req.query;

    // Filtravimo sąlygos
    const query = { active: true };

    if (city && city !== 'all') {
      query.city = city;
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Bendras objektų skaičius
    const totalListings = await Property.countDocuments(query);

    // Vidutinė kaina
    const priceStats = await Property.aggregate([
      { $match: query },
      { 
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalArea: { $sum: '$area' }
        }
      }
    ]);

    // Miestų pasiskirstymas
    const cityDistribution = await Property.aggregate([
      { $match: { ...query, city: { $exists: true } } },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // NT tipų pasiskirstymas
    const typeDistribution = await Property.aggregate([
      { $match: { ...query, propertyType: { $exists: true } } },
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Rajonų pasiskirstymas (jei pasirinktas konkretus miestas)
    let districtDistribution = [];
    if (city && city !== 'all') {
      districtDistribution = await Property.aggregate([
        { $match: { ...query, district: { $exists: true, $ne: '' } } },
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' }
          }
        },
        { $sort: { count: -1 } }
      ]);
    }

    const stats = {
      totalListings,
      avgPrice: priceStats.length > 0 ? Math.round(priceStats[0].avgPrice) : 0,
      avgPricePerSqm: priceStats.length > 0 ? Math.round(priceStats[0].avgPrice / (priceStats[0].totalArea / totalListings)) : 0,
      priceRange: priceStats.length > 0 ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice } : { min: 0, max: 0 },
      cityDistribution: cityDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      typeDistribution: typeDistribution.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      districtDistribution: districtDistribution.map(item => ({
        district: item._id,
        count: item.count,
        avgPrice: Math.round(item.avgPrice)
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Klaida gaunant NT statistiką:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant NT statistiką' });
  }
});

/**
 * GET /api/properties/stats/district-prices
 * Gauti rajonų kainas
 */
router.get('/stats/district-prices', async (req, res) => {
  try {
    const { city } = req.query;

    // Filtravimo sąlygos
    const query = { 
      active: true,
      district: { $exists: true, $ne: '' }
    };

    if (city && city !== 'all') {
      query.city = city;
    }

    // Rajonų kainos
    const districtPrices = await Property.aggregate([
      { $match: query },
      {
        $group: {
          _id: { city: '$city', district: '$district' },
          avgPrice: { $avg: '$price' },
          totalArea: { $sum: '$area' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          city: '$_id.city',
          district: '$_id.district',
          avgPrice: { $round: ['$avgPrice', 0] },
          avgPricePerSqm: { 
            $round: [{ $divide: ['$avgPrice', { $divide: ['$totalArea', '$count'] }] }, 0] 
          },
          count: 1
        }
      },
      { $sort: { city: 1, avgPrice: -1 } }
    ]);

    res.json(districtPrices);
  } catch (error) {
    console.error('Klaida gaunant rajonų kainas:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant rajonų kainas' });
  }
});

/**
 * GET /api/properties/stats/price-trends
 * Gauti kainų tendencijas
 */
router.get('/stats/price-trends', async (req, res) => {
  try {
    const { city, propertyType, period } = req.query;

    // Periodas (mėnesiais)
    const months = parseInt(period) || 12;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // Filtravimo sąlygos
    const query = { 
      active: true,
      listedDate: { $gte: startDate }
    };

    if (city && city !== 'all') {
      query.city = city;
    }

    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Gauti objektų istoriją
    const properties = await Property.find(query, 'price priceHistory listedDate area');

    // Grupuoti pagal mėnesius
    const monthlyData = {};

    // Pridėti dabartinius objektus
    properties.forEach(property => {
      const date = property.listedDate;
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[yearMonth]) {
        monthlyData[yearMonth] = {
          month: yearMonth,
          totalPrice: 0,
          totalArea: 0,
          count: 0
        };
      }
      
      monthlyData[yearMonth].totalPrice += property.price;
      monthlyData[yearMonth].totalArea += property.area;
      monthlyData[yearMonth].count += 1;
    });

    // Pridėti istorinių kainų duomenis
    properties.forEach(property => {
      if (!property.priceHistory || property.priceHistory.length === 0) return;
      
      property.priceHistory.forEach(historyItem => {
        const date = historyItem.date;
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        // Jei mėnuo yra už periodo ribų, praleisti
        if (date < startDate) return;
        
        if (!monthlyData[yearMonth]) {
          monthlyData[yearMonth] = {
            month: yearMonth,
            totalPrice: 0,
            totalArea: 0,
            count: 0
          };
        }
        
        monthlyData[yearMonth].totalPrice += historyItem.price;
        monthlyData[yearMonth].totalArea += property.area;
        monthlyData[yearMonth].count += 1;
      });
    });

    // Konvertuoti į masyvą ir apskaičiuoti vidurkius
    const trends = Object.values(monthlyData)
      .map(item => ({
        month: item.month,
        avgPrice: Math.round(item.totalPrice / item.count),
        avgPricePerSqm: Math.round(item.totalPrice / item.totalArea),
        count: item.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    res.json(trends);
  } catch (error) {
    console.error('Klaida gaunant kainų tendencijas:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant kainų tendencijas' });
  }
});

/**
 * GET /api/properties/nearby
 * Gauti netoliese esančius NT objektus
 */
router.get('/nearby/location', async (req, res) => {
  try {
    const { lat, lng, radius = 1, limit = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Būtina nurodyti koordinates (lat ir lng)' });
    }

    // Ieškoti objektų nurodytu spinduliu
    const properties = await Property.find({
      active: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // konvertuoti km į metrus
        }
      }
    }).limit(parseInt(limit));

    // Pridėti atstumo informaciją
    const propertiesWithDistance = properties.map(property => {
      const propertyObj = property.toObject();
      
      if (property.location && property.location.coordinates) {
        const distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          property.location.coordinates[1],
          property.location.coordinates[0]
        );
        
        propertyObj.distance = parseFloat(distance.toFixed(2));
      }
      
      return propertyObj;
    });

    res.json(propertiesWithDistance);
  } catch (error) {
    console.error('Klaida gaunant netoliese esančius NT objektus:', error);
    res.status(500).json({ error: 'Serverio klaida gaunant netoliese esančius NT objektus' });
  }
});

module.exports = router;