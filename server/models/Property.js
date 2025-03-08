const mongoose = require('mongoose');

// Schema NT objektams
const propertySchema = new mongoose.Schema({
  // Identifikatorius iš šaltinio
  sourceId: {
    type: String,
    required: false,
    index: true,
  },
  
  // Pagrindinis objekto pavadinimas
  title: {
    type: String,
    required: true,
  },
  
  // Kaina eurais
  price: {
    type: Number,
    required: true,
  },
  
  // Kvadratinis plotas
  area: {
    type: Number,
    required: true,
  },
  
  // Kambarių skaičius
  rooms: {
    type: Number,
    required: false,
  },
  
  // Aukštas
  floor: {
    type: Number,
    required: false,
  },
  
  // Visas aukštų skaičius
  totalFloors: {
    type: Number,
    required: false,
  },
  
  // Statybos metai
  buildYear: {
    type: Number,
    required: false,
  },
  
  // Šildymo tipas
  heatingType: {
    type: String,
    required: false,
  },
  
  // Energetinė klasė
  energyClass: {
    type: String,
    required: false,
  },
  
  // Miestas
  city: {
    type: String,
    required: true,
    index: true,
  },
  
  // Miesto rajonas
  district: {
    type: String,
    required: false,
    index: true,
  },
  
  // Gatvė
  street: {
    type: String,
    required: false,
  },
  
  // NT tipas (butas, namas, sklypas, komercinės patalpos, etc.)
  propertyType: {
    type: String,
    required: true,
    enum: ['flat', 'house', 'land', 'commercial', 'cottage', 'other'],
    index: true,
  },
  
  // Geografinė padėtis
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
  
  // Datos
  listedDate: {
    type: Date,
    default: Date.now,
  },
  
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  
  // Nuoroda į skelbimą
  url: {
    type: String,
    required: false,
  },
  
  // Nuotraukos URL
  images: {
    type: [String],
    required: false,
  },
  
  // Papildomos savybės kaip objektas
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
  
  // Istorija (kainų pokyčiai)
  priceHistory: [
    {
      price: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  // Aktyvus/neaktyvus skelbimas
  active: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Indeksas geografinei paieškai
propertySchema.index({ location: '2dsphere' });

// Virtuali savybė kainai už kvadratinį metrą
propertySchema.virtual('pricePerSqm').get(function() {
  if (this.area > 0) {
    return Math.round(this.price / this.area);
  }
  return 0;
});

// Kai konvertuojama į JSON, įtraukti virtualias savybes
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

// Metodas kainų istorijos pridėjimui
propertySchema.methods.addPriceToHistory = function(price) {
  // Tikriname, ar kaina pasikeitė
  const currentPrice = this.price;
  if (currentPrice !== price) {
    // Pridedame esamą kainą į istoriją
    this.priceHistory.push({
      price: currentPrice,
      date: new Date()
    });
    // Atnaujiname esamą kainą
    this.price = price;
    this.updatedDate = new Date();
    return true;
  }
  return false;
};

// Sukuriamas modelis
const Property = mongoose.model('Property', propertySchema);

module.exports = Property;