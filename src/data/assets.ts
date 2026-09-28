import type { Asset } from '../types';

// SYNTHETIC DEMO DATA — NOT LIVE RAILWAY DATA
export const assets: Asset[] = [
  {
    id: 'PM-1042', name: 'Point Machine PM-1042', type: 'Point Machine',
    division: 'Jaipur Division', section: 'JP-KOTA Down Line', chainage: '214.300 km',
    station: 'Phulera Jn', routeClass: 'A (High Density)', installDate: '2016-03-12',
    ownerDept: 'S&T', criticality: 'High', status: 'In Service',
    lat: 26.8700, lng: 75.2400, nearJunction: true, expectedServiceLifeYears: 15,
  },
  {
    id: 'TRK-0871', name: 'Track Panel — Rail Section 0871', type: 'Track Section',
    division: 'Jaipur Division', section: 'JP-AII Up Line', chainage: '187.100 km',
    station: 'Kishangarh', routeClass: 'A (High Density)', installDate: '2011-07-01',
    ownerDept: 'Engineering', criticality: 'Medium', status: 'In Service',
    lat: 26.5900, lng: 74.8600, nearJunction: false, expectedServiceLifeYears: 25,
  },
  {
    id: 'OHE-3320', name: 'OHE Mast OHE-3320', type: 'OHE Mast',
    division: 'Jaipur Division', section: 'JP-REWARI Up Line', chainage: '96.700 km',
    station: 'Alwar', routeClass: 'A (High Density)', installDate: '2014-11-20',
    ownerDept: 'Electrical', criticality: 'Medium', status: 'In Service',
    lat: 27.5600, lng: 76.6100, nearJunction: false, expectedServiceLifeYears: 30,
  },
  {
    id: 'BRG-0512', name: 'Bridge BRG-0512 (Bandi River)', type: 'Bridge',
    division: 'Jaipur Division', section: 'JP-KOTA Down Line', chainage: '241.900 km',
    station: 'Sawai Madhopur', routeClass: 'A (High Density)', installDate: '1998-02-15',
    ownerDept: 'Engineering', criticality: 'High', status: 'In Service',
    lat: 26.0200, lng: 76.3500, nearJunction: false, expectedServiceLifeYears: 60,
  },
  {
    id: 'AXC-2207', name: 'Axle Counter AXC-2207', type: 'Axle Counter',
    division: 'Jaipur Division', section: 'JP-KOTA Down Line', chainage: '214.900 km',
    station: 'Phulera Jn', routeClass: 'A (High Density)', installDate: '2018-05-09',
    ownerDept: 'S&T', criticality: 'High', status: 'In Service',
    lat: 26.8720, lng: 75.2430, nearJunction: true, expectedServiceLifeYears: 15,
  },
  {
    id: 'TRN-1180', name: 'Turnout TRN-1180', type: 'Turnout',
    division: 'Jaipur Division', section: 'Phulera Yard', chainage: '215.100 km',
    station: 'Phulera Jn', routeClass: 'A (High Density)', installDate: '2013-09-30',
    ownerDept: 'Engineering', criticality: 'Medium', status: 'In Service',
    lat: 26.8710, lng: 75.2410, nearJunction: true, expectedServiceLifeYears: 20,
  },
  {
    id: 'LC-0044', name: 'Level Crossing LC-0044', type: 'Level Crossing',
    division: 'Jaipur Division', section: 'JP-AII Up Line', chainage: '175.400 km',
    station: 'Naraina', routeClass: 'B', installDate: '2005-01-10',
    ownerDept: 'Engineering', criticality: 'High', status: 'In Service',
    lat: 26.7500, lng: 75.4300, nearJunction: false, expectedServiceLifeYears: 25,
  },
  {
    id: 'SIG-3391', name: 'Signal SIG-3391', type: 'Signal',
    division: 'Jaipur Division', section: 'JP-KOTA Down Line', chainage: '213.800 km',
    station: 'Phulera Jn', routeClass: 'A (High Density)', installDate: '2019-06-18',
    ownerDept: 'S&T', criticality: 'High', status: 'In Service',
    lat: 26.8690, lng: 75.2380, nearJunction: true, expectedServiceLifeYears: 15,
  },
  {
    id: 'TRK-0455', name: 'Track Panel — Rail Section 0455', type: 'Track Section',
    division: 'Jaipur Division', section: 'JP-REWARI Up Line', chainage: '88.200 km',
    station: 'Alwar', routeClass: 'A (High Density)', installDate: '2009-04-22',
    ownerDept: 'Engineering', criticality: 'Low', status: 'In Service',
    lat: 27.5500, lng: 76.6300, nearJunction: false, expectedServiceLifeYears: 25,
  },
  {
    id: 'OHE-4410', name: 'OHE Mast OHE-4410', type: 'OHE Mast',
    division: 'Jaipur Division', section: 'JP-KOTA Down Line', chainage: '230.500 km',
    station: 'Sawai Madhopur', routeClass: 'A (High Density)', installDate: '2020-01-05',
    ownerDept: 'Electrical', criticality: 'Low', status: 'In Service',
    lat: 26.1000, lng: 76.2000, nearJunction: false, expectedServiceLifeYears: 30,
  },
  {
    id: 'PM-1120', name: 'Point Machine PM-1120', type: 'Point Machine',
    division: 'Jaipur Division', section: 'JP-AII Up Line', chainage: '190.600 km',
    station: 'Kishangarh', routeClass: 'A (High Density)', installDate: '2017-08-14',
    ownerDept: 'S&T', criticality: 'Medium', status: 'In Service',
    lat: 26.5950, lng: 74.8550, nearJunction: false, expectedServiceLifeYears: 15,
  },
  {
    id: 'BRG-0733', name: 'Bridge BRG-0733 (Banas River)', type: 'Bridge',
    division: 'Jaipur Division', section: 'JP-AII Up Line', chainage: '201.200 km',
    station: 'Kishangarh', routeClass: 'A (High Density)', installDate: '2002-10-01',
    ownerDept: 'Engineering', criticality: 'Medium', status: 'In Service',
    lat: 26.6100, lng: 74.9200, nearJunction: false, expectedServiceLifeYears: 60,
  },
];

export const findAsset = (id: string) => assets.find(a => a.id === id);
