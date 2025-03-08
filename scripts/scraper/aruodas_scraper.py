#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Aruodas.lt duomenų scraper

Šis skriptas renka NT skelbimų duomenis iš Aruodas.lt puslapio.
Surinkti duomenys išsaugomi JSON formatu.

Naudojimas:
    python aruodas_scraper.py --output rezultatai.json --city Vilnius,Kaunas --property-type flat,house

Parametrai:
    --output - Rezultatų failo pavadinimas (privalomas)
    --city - Miestų sąrašas, atskirtas kableliais (jei nenurodytas, renkami visi miestai)
    --property-type - NT tipų sąrašas (flat,house,land,commercial)
    --pages - Puslapių skaičius kiekvienam miestui (numatytasis: 3)
    --delay - Užlaikymas sekundėmis tarp užklausų (numatytasis: 1)
"""

import argparse
import json
import os
import random
import re
import sys
import time
from datetime import datetime
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup

# Numatytieji parametrai
DEFAULT_CITIES = ['Vilnius', 'Kaunas', 'Klaipėda', 'Šiauliai', 'Panevėžys']
DEFAULT_PROPERTY_TYPES = ['flat', 'house', 'land', 'commercial']
DEFAULT_PAGES_PER_CITY = 3
DEFAULT_DELAY = 1
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
]

# NT tipų URL pavadinimai
PROPERTY_TYPE_URLS = {
    'flat': 'butai',
    'house': 'namai',
    'land': 'sklypai',
    'commercial': 'komercines-patalpos',
    'cottage': 'sodyba'
}

def get_arguments():
    """Gauti komandinės eilutės argumentus"""
    parser = argparse.ArgumentParser(description='Aruodas.lt duomenų scraper')
    parser.add_argument('--output', required=True, help='Rezultatų failo pavadinimas')
    parser.add_argument('--city', help='Miestų sąrašas, atskirtas kableliais')
    parser.add_argument('--property-type', help='NT tipų sąrašas, atskirtas kableliais')
    parser.add_argument('--pages', type=int, default=DEFAULT_PAGES_PER_CITY, help=f'Puslapių skaičius kiekvienam miestui (numatytasis: {DEFAULT_PAGES_PER_CITY})')
    parser.add_argument('--delay', type=float, default=DEFAULT_DELAY, help=f'Užlaikymas sekundėmis tarp užklausų (numatytasis: {DEFAULT_DELAY})')
    
    args = parser.parse_args()
    
    # Apdoroti miestų sąrašą
    if args.city:
        args.cities = [city.strip() for city in args.city.split(',')]
    else:
        args.cities = DEFAULT_CITIES
    
    # Apdoroti NT tipų sąrašą
    if args.property_type:
        args.property_types = [prop_type.strip() for prop_type in args.property_type.split(',')]
        # Patikrinti, ar visi NT tipai yra palaikomi
        for prop_type in args.property_types:
            if prop_type not in PROPERTY_TYPE_URLS:
                print(f"Klaida: Nepalaikomas NT tipas '{prop_type}'. Palaikomi tipai: {', '.join(PROPERTY_TYPE_URLS.keys())}")
                sys.exit(1)
    else:
        args.property_types = DEFAULT_PROPERTY_TYPES
    
    return args

def scrape_aruodas_page(url):
    """Scrape'inti vieną Aruodas.lt puslapį ir gauti NT skelbimus"""
    # Atsitiktinis User-Agent, kad išvengtume blokavimo
    headers = {
        'User-Agent': random.choice(USER_AGENTS),
        'Accept-Language': 'lt,en-US;q=0.9,en;q=0.8',
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Patikrinti, ar gauti duomenys yra HTML
        content_type = response.headers.get('Content-Type', '')
        if 'text/html' not in content_type:
            print(f"Klaida: Gautas ne HTML turinys ({content_type})")
            return []
        
        # Apdoroti HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        listings = soup.select('.list-row')
        
        properties = []
        for listing in listings:
            try:
                # Surinkti pagrindinius duomenis
                title_element = listing.select_one('.list-line-1')
                title = title_element.text.strip() if title_element else 'Nenurodyta'
                
                price_element = listing.select_one('.list-price-main')
                price_text = price_element.text.strip() if price_element else '0'
                # Išvalyti kainą ir konvertuoti į skaičių
                price = int(''.join(filter(str.isdigit, price_text)) or 0)
                
                details_element = listing.select_one('.list-line-2')
                details_text = details_element.text.strip() if details_element else ''
                
                # Ištraukti plotą
                area = 0
                area_match = re.search(r'(\d+(?:[.,]\d+)?)\s*m²', details_text)
                if area_match:
                    # Konvertuoti kablelius į taškus ir paversti į float
                    area = float(area_match.group(1).replace(',', '.'))
                
                # Ištraukti kambarių skaičių (jei tai butas arba namas)
                rooms = None
                rooms_match = re.search(r'(\d+)\s*kamb', details_text)
                if rooms_match:
                    rooms = int(rooms_match.group(1))
                
                # Gauti nuorodą į skelbimą
                url_element = listing.select_one('a.item-url')
                url = url_element['href'] if url_element and 'href' in url_element.attrs else ''
                
                # Gauti paveikslėlio URL
                img_element = listing.select_one('img')
                img_url = img_element['src'] if img_element and 'src' in img_element.attrs else ''
                
                # Gauti adresą
                address_element = listing.select_one('.list-address')
                address = address_element.text.strip() if address_element else ''
                
                # Apdoroti adresą
                district = ''
                street = ''
                if address:
                    address_parts = [part.strip() for part in address.split(',')]
                    if len(address_parts) > 0:
                        district = address_parts[0]
                    if len(address_parts) > 1:
                        street = address_parts[1]
                
                # Sukurti NT objekto duomenis
                property_data = {
                    'title': title,
                    'price': price,
                    'area': area,
                    'url': url,
                    'district': district,
                    'street': street,
                    'listedDate': datetime.now().strftime('%Y-%m-%d'),
                }
                
                # Pridėti kambarių skaičių, jei yra
                if rooms is not None:
                    property_data['rooms'] = rooms
                
                # Pridėti paveikslėlį, jei yra
                if img_url:
                    property_data['images'] = [img_url]
                
                properties.append(property_data)
                
            except Exception as e:
                print(f"Klaida apdorojant skelbimą: {e}")
                continue
        
        return properties
    
    except requests.exceptions.RequestException as e:
        print(f"Klaida gaunant puslapį {url}: {e}")
        return []

def scrape_aruodas(args):
    """Pagrindinis scraping funkcija"""
    all_properties = []
    
    for city in args.cities:
        print(f"\nScrape'inamas miestas: {city}")
        
        for prop_type in args.property_types:
            prop_type_name = PROPERTY_TYPE_URLS.get(prop_type)
            print(f"  NT tipas: {prop_type} ({prop_type_name})")
            
            # Formuojame URL
            city_encoded = quote(city.lower())
            base_url = f"https://www.aruodas.lt/{prop_type_name}/{city_encoded}/"
            
            # Scrape'iname nurodytą puslapių skaičių
            for page in range(1, args.pages + 1):
                # Formuojame puslapio URL
                if page == 1:
                    page_url = base_url
                else:
                    page_url = f"{base_url}puslapis/{page}/"
                
                print(f"    Puslapis {page}: {page_url}")
                
                # Scrape'iname puslapį
                properties = scrape_aruodas_page(page_url)
                
                # Pridedame miestą ir NT tipą
                for prop in properties:
                    prop['city'] = city
                    prop['propertyType'] = prop_type
                
                all_properties.extend(properties)
                print(f"    Surinkta skelbimų: {len(properties)}")
                
                # Užlaikymas tarp užklausų
                time.sleep(args.delay + random.uniform(0, 1))
    
    # Išsaugome rezultatus į JSON failą
    output_dir = os.path.dirname(args.output)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(all_properties, f, ensure_ascii=False, indent=2)
    
    print(f"\nScrapinimas baigtas. Iš viso surinkta {len(all_properties)} skelbimų.")
    print(f"Rezultatai išsaugoti: {args.output}")
    
    return all_properties

def main():
    args = get_arguments()
    scrape_aruodas(args)

if __name__ == "__main__":
    main()