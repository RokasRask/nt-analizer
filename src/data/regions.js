/**
 * Lietuvos regionų ir rajonų duomenys
 * Naudojami žemėlapiui ir geo informacijai
 */

const regions = {
    // Vilnius
    'Vilnius': {
      center: [54.687157, 25.279652],
      districts: {
        'Senamiestis': [54.6800, 25.2882],
        'Naujamiestis': [54.6750, 25.2691],
        'Antakalnis': [54.7005, 25.3095],
        'Žirmūnai': [54.7213, 25.2987],
        'Šnipiškės': [54.6986, 25.2776],
        'Žvėrynas': [54.6932, 25.2446],
        'Karoliniškės': [54.6971, 25.2331],
        'Lazdynai': [54.6785, 25.2018],
        'Pilaitė': [54.7078, 25.1871],
        'Justiniškės': [54.7166, 25.2210],
        'Viršuliškės': [54.7092, 25.2319],
        'Šeškinė': [54.7224, 25.2511],
        'Baltupiai': [54.7313, 25.2825],
        'Fabijoniškės': [54.7286, 25.2461],
        'Pašilaičiai': [54.7342, 25.2187],
        'Verkiai': [54.7500, 25.2950],
        'Jeruzalė': [54.7419, 25.2693],
        'Santariškės': [54.7568, 25.2687],
        'Naujoji Vilnia': [54.6950, 25.4153],
        'Rasos': [54.6700, 25.3255],
        'Vilkpėdė': [54.6609, 25.2533],
        'Naujamiestis': [54.6691, 25.2569],
        'Paneriai': [54.6304, 25.2233],
        'Naujininkai': [54.6550, 25.2890],
        'Kirtimai': [54.6340, 25.2921],
        'Grigiškės': [54.6677, 25.0923],
        'Bajorai': [54.7477, 25.2359],
        'Valakupiai': [54.7209, 25.3375]
      }
    },
    
    // Kaunas
    'Kaunas': {
      center: [54.8985, 23.9036],
      districts: {
        'Centras': [54.8964, 23.9182],
        'Senamiestis': [54.8992, 23.8917],
        'Žaliakalnis': [54.9037, 23.9297],
        'Aleksotas': [54.8787, 23.9087],
        'Šančiai': [54.8889, 23.9603],
        'Petrašiūnai': [54.8764, 23.9926],
        'Dainava': [54.9109, 23.9550],
        'Eiguliai': [54.9197, 23.9567],
        'Šilainiai': [54.9297, 23.8606],
        'Vilijampolė': [54.9125, 23.8739],
        'Panemunė': [54.8772, 23.9755],
        'Rokai': [54.8467, 23.9692],
        'Vaišvydava': [54.8653, 24.0172],
        'Freda': [54.8693, 23.9306],
        'Kazliškiai': [54.9375, 23.8514],
        'Kleboniškis': [54.9342, 23.9361]
      }
    },
    
    // Klaipėda
    'Klaipėda': {
      center: [55.7068, 21.1345],
      districts: {
        'Senamiestis': [55.7095, 21.1371],
        'Naujamiestis': [55.7135, 21.1499],
        'Centras': [55.7124, 21.1342],
        'Mažasis kaimelis': [55.7264, 21.1465],
        'Didysis kaimelis': [55.7195, 21.1607],
        'Smeltė': [55.6825, 21.1683],
        'Melnragė': [55.7368, 21.0880],
        'Giruliai': [55.7564, 21.0687],
        'Tauralaukis': [55.7547, 21.1304],
        'Miško': [55.7166, 21.1558],
        'Baltijos': [55.6930, 21.1681],
        'Debrecenas': [55.7220, 21.1718],
        'Labrenciškės': [55.7003, 21.1537],
        'Lypkiai': [55.6810, 21.1963],
        'Rimkai': [55.6974, 21.2122]
      }
    },
    
    // Šiauliai
    'Šiauliai': {
      center: [55.9349, 23.3137],
      districts: {
        'Centras': [55.9293, 23.3188],
        'Gubernija': [55.9419, 23.2888],
        'Lieporiai': [55.9145, 23.3289],
        'Dainiai': [55.9187, 23.3221],
        'Medelynas': [55.9253, 23.3377],
        'Rėkyva': [55.8822, 23.3356],
        'Zokniai': [55.9537, 23.3571],
        'Kalniukas': [55.9277, 23.3086],
        'Šimšė': [55.9372, 23.3328]
      }
    },
    
    // Panevėžys
    'Panevėžys': {
      center: [55.7335, 24.3579],
      districts: {
        'Centras': [55.7342, 24.3588],
        'Kniaudiškiai': [55.7303, 24.3407],
        'Pilėnai': [55.7229, 24.3655],
        'Tulpės': [55.7450, 24.3688],
        'Klaipėdos': [55.7229, 24.3366],
        'Šilaičiai': [55.7410, 24.3240],
        'Žemaičių': [55.7303, 24.3750],
        'Rožynas': [55.7487, 24.3553],
        'Marijonai': [55.7220, 24.3898]
      }
    }
  };
  
  export default regions;