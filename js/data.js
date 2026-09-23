/* EcoWealth demo data — packages, shop catalogue, appliances.
   Prices are illustrative USD demo figures, to be replaced with EcoWealth's price list. */
window.EW = window.EW || {};

EW.company = {
  name: 'EcoWealth',
  tagline: 'Solar energy projects for all',
  country: 'Zimbabwe',
  city: 'Harare',
  // PLACEHOLDERS — confirm with EcoWealth before going live
  phone: '+263 77 000 0000',
  whatsapp: '263770000000',
  email: 'hello@ecowealth.co.zw',
  address: 'Harare, Zimbabwe',
};

EW.img = (n, sm) => `assets/img/${n}${sm ? '-sm' : ''}.jpg`;

/* Solar constants (Zimbabwe) */
EW.K = {
  PSH: 5.5,              // peak sun hours
  PV_DERATE: 0.77,       // temperature, dust, wiring, inverter losses
  PANEL_W: 550,
  BATT_DOD: 0.9,         // LiFePO4 usable depth of discharge
  ROUNDTRIP: 0.92,
  GRID_TARIFF: 0.14,     // USD/kWh blended ZESA tariff (demo figure)
  GEN_COST: 0.55,        // USD/kWh petrol/diesel generator (fuel + upkeep)
  CO2_PER_KWH: 0.92,
  DEGRADATION: 0.005,
  INFLATION: 0.08,
};

/* ---------------- Solar packages ---------------- */
EW.packages = [
  {
    slug: 'seed-1kva', name: 'Seed', full: 'Seed 1kVA Essentials', segment: 'home', tier: 'Starter',
    kva: 1, invW: 800, batteryKWh: 1.92, battery: '12V 150Ah LiFePO4', panels: 2, panelW: 450, phase: '1P',
    price: 1150, was: 1290, img: 'roof-tiles', gallery: ['roof-tiles', 'battery-panel', 'drill-mount'],
    blurb: 'Lights, TV, Wi-Fi and phone charging through every power cut. A good first step into solar.',
    powers: ['LED lights', 'TV & decoder', 'Wi-Fi router', 'Phone & laptop charging', 'Small fans'],
    cant: ['Fridge', 'Kettle', 'Iron', 'Microwave', 'Geyser', 'Borehole pump'],
    features: ['Silent, fumeless backup', 'Plug-and-play wall unit', 'Expandable to 2kVA', 'App monitoring ready'],
  },
  {
    slug: 'sprout-3kva', name: 'Sprout', full: 'Sprout 3kVA Home', segment: 'home', tier: 'Popular', popular: true,
    kva: 3, invW: 3000, batteryKWh: 2.56, battery: '24V 100Ah LiFePO4', panels: 4, panelW: 550, phase: '1P',
    price: 2450, img: 'house-solar', gallery: ['house-solar', 'inverter-wall', 'roof-install-metal'],
    blurb: 'Keeps a family home running. Fridge, freezer, TV and lights all day and into the night.',
    powers: ['Fridge & freezer', 'LED lights', 'TVs & decoder', 'Laptops & Wi-Fi', 'Microwave (short use)', 'Gate motor'],
    cant: ['Geyser', 'Electric stove', 'Oven', 'Air conditioning'],
    features: ['24V hybrid inverter with MPPT', 'Grid + solar blending', 'Wi-Fi monitoring dongle', '10-year battery warranty'],
  },
  {
    slug: 'grove-5kva', name: 'Grove', full: 'Grove 5kVA Hybrid', segment: 'home', tier: 'Best value', popular: true,
    kva: 5, invW: 5000, batteryKWh: 5.12, battery: '48V 100Ah LiFePO4', panels: 8, panelW: 550, phase: '1P',
    price: 3450, was: 3790, img: 'roof-house-sunset', gallery: ['roof-house-sunset', 'battery-wall', 'installer-sunset', 'inverter-wall'],
    blurb: 'Whole-home backup for most households. Handles the borehole pump, washing machine and kitchen appliances.',
    powers: ['Borehole pump (≤1hp)', 'Washing machine', 'Fridges & freezers', 'Microwave & kettle', 'Iron (short use)', 'Whole-home lighting'],
    cant: ['Electric geyser (use solar geyser)', 'Multiple ACs at once'],
    features: ['48V Deye / Sunsynk hybrid inverter', 'Parallel-ready, grows to 30kW', 'Load-shedding auto switchover < 10ms', '24h remote monitoring'],
  },
  {
    slug: 'canopy-5kva-plus', name: 'Canopy', full: 'Canopy 5kVA Plus', segment: 'home', tier: 'Premium',
    kva: 5, invW: 5000, batteryKWh: 10.24, battery: '2 × 48V 100Ah LiFePO4', panels: 10, panelW: 550, phase: '1P',
    price: 4950, img: 'panels-trees', gallery: ['panels-trees', 'battery-cabinet', 'house-solar'],
    blurb: 'Twice the battery for long load-shedding nights. Use very little from ZESA, or none at all.',
    powers: ['Everything in Grove', 'All-night backup (10kWh)', '1 × AC 12000BTU', 'Home office & CCTV', 'Pool pump (daytime)'],
    cant: ['Electric geyser (use solar geyser)'],
    features: ['10.24kWh stacked lithium storage', '5.5kWp high-efficiency array', 'Off-grid capable', 'Priority after-sales support'],
  },
  {
    slug: 'forest-8kva', name: 'Forest', full: 'Forest 8kVA Power', segment: 'home', tier: 'Large home',
    kva: 8, invW: 8000, batteryKWh: 15.36, battery: '3 × 48V 100Ah LiFePO4', panels: 16, panelW: 550, phase: '1P',
    price: 7900, img: 'panels-sky', gallery: ['panels-sky', 'battery-racks', 'engineer'],
    blurb: 'For large homes and home businesses. Runs heavy appliances at the same time, day and night.',
    powers: ['2–3 ACs', 'Electric stove (1–2 plates)', 'Borehole + pool pumps', 'Workshop tools', 'Multiple fridges'],
    cant: ['Welding equipment'],
    features: ['8kW Sunsynk hybrid', '8.8kWp PV array', '15kWh lithium bank', 'Net-metering ready'],
  },
  {
    slug: 'evergreen-10kva', name: 'Evergreen', full: 'Evergreen 10kVA Premium', segment: 'business', tier: 'Business',
    kva: 10, invW: 10000, batteryKWh: 20.48, battery: '4 × 48V 100Ah LiFePO4', panels: 20, panelW: 550, phase: '1P / 3P',
    price: 11800, img: 'roof-commercial', gallery: ['roof-commercial', 'inverter-room', 'battery-cabinet'],
    blurb: 'Runs offices, clinics, schools and service stations without stopping. Includes 3 years of guided maintenance.',
    powers: ['Office floors & servers', 'Cold rooms', 'Clinic equipment', 'Fuel pumps', 'Security & CCTV'],
    cant: [],
    features: ['Commercial hybrid inverter', '11kWp array', '20kWh storage', '3-yr maintenance plan'],
  },
  {
    slug: 'summit-16kva', name: 'Summit', full: 'Summit 16kVA Business', segment: 'business', tier: 'Commercial',
    kva: 16, invW: 16000, batteryKWh: 30.72, battery: 'HV 30kWh rack', panels: 30, panelW: 550, phase: '3P',
    price: 19500, img: 'string-inverters', gallery: ['string-inverters', 'battery-racks', 'field-inverters'],
    blurb: 'Three-phase power for factories, farms and retail. Cuts diesel spend from the first month.',
    powers: ['3-phase motors', 'Irrigation', 'Cold chain', 'Retail floors', 'Workshops'],
    cant: [],
    features: ['3-phase hybrid', '16.5kWp array', 'HV battery rack', 'Energy audit included'],
  },
  {
    slug: 'horizon-30kw', name: 'Horizon', full: 'Horizon 30kW Commercial', segment: 'business', tier: 'Industrial',
    kva: 30, invW: 30000, batteryKWh: 61.44, battery: 'HV 60kWh BESS', panels: 56, panelW: 550, phase: '3P',
    price: 32000, img: 'bess-yard', gallery: ['field-sunset', 'bess-yard', 'field-inverters'],
    blurb: 'Solar and battery power for industrial sites and institutions, with project financing available.',
    powers: ['Industrial loads', 'Mines & processing', 'Hospitals', 'Campuses'],
    cant: [],
    features: ['Engineered site design', '30.8kWp array', '60kWh BESS', 'EPC + O&M contract'],
  },
];
EW.packages.forEach(p => {
  p.pvKW = +(p.panels * p.panelW / 1000).toFixed(2);
  p.includes = [
    { ic: 'panel', name: 'Solar panels', desc: `${p.panels} × ${p.panelW}W tier-1 mono PERC panels (${p.pvKW}kWp).`, w: '25-year performance warranty' },
    { ic: 'bolt', name: 'Hybrid inverter', desc: `${p.kva}kVA ${p.phase} hybrid inverter with built-in MPPT.`, w: '5-year warranty' },
    { ic: 'battery', name: 'Battery storage', desc: `${p.battery} — ${p.batteryKWh}kWh, 6000+ cycles.`, w: '10-year warranty' },
    { ic: 'tool', name: 'Installation', desc: 'Mounting, DC/AC protection, cabling, earthing and commissioning.', w: '12-month workmanship' },
    { ic: 'wifi', name: 'Monitoring', desc: 'Wi-Fi dongle and app setup. We watch your system with you.', w: 'Included' },
  ];
});

EW.addons = [
  { id: 'batt-ext', name: 'Extra 5.12kWh battery', note: '≈ +4 hours of evening backup', price: 1290 },
  { id: 'panels-2', name: '+2 panels (1.1kWp)', note: 'Faster recharge in winter', price: 360 },
  { id: 'surge', name: 'Lightning & surge protection', note: 'Type 2 DC + AC SPD kit', price: 145 },
  { id: 'service', name: '3-year care plan', note: '2 cleanings/yr + health check', price: 240 },
];

EW.financing = [
  { id: 'f6', months: 6, rate: 0, label: '6 months', badge: 'Interest-free' },
  { id: 'f12', months: 12, rate: 0.05, label: '12 months', badge: 'Most popular' },
  { id: 'f24', months: 24, rate: 0.1, label: '24 months', badge: 'Lowest monthly' },
];

/* Delivery zones (distance-based: $5 + $0.65/km from Harare) */
EW.zones = [
  { id: 'pickup', name: 'Collect from EcoWealth (Harare)', km: 0 },
  { id: 'hre-n', name: 'Harare North (Borrowdale, Mt Pleasant)', km: 10 },
  { id: 'hre-s', name: 'Harare South & CBD', km: 8 },
  { id: 'chitungwiza', name: 'Chitungwiza', km: 28 },
  { id: 'ruwa', name: 'Ruwa / Epworth', km: 24 },
  { id: 'norton', name: 'Norton', km: 42 },
  { id: 'marondera', name: 'Marondera', km: 74 },
  { id: 'kadoma', name: 'Kadoma', km: 141 },
  { id: 'gweru', name: 'Gweru', km: 275 },
  { id: 'mutare', name: 'Mutare', km: 263 },
  { id: 'masvingo', name: 'Masvingo', km: 292 },
  { id: 'bulawayo', name: 'Bulawayo', km: 439 },
  { id: 'vicfalls', name: 'Victoria Falls', km: 877 },
];
EW.deliveryFee = km => km === 0 ? 0 : Math.round(5 + 0.65 * km);
EW.FREE_DELIVERY = 1500;

EW.coupons = { SUNNY10: { pct: 10, label: '10% off' }, ECOWEALTH: { pct: 5, label: '5% off' } };

/* ---------------- Shop catalogue ---------------- */
EW.categories = [
  { id: 'panels', name: 'Solar Panels' },
  { id: 'inverters', name: 'Inverters' },
  { id: 'batteries', name: 'Batteries' },
  { id: 'kits', name: 'DIY Kits' },
  { id: 'geysers', name: 'Solar Geysers' },
  { id: 'mounting', name: 'Mounting' },
  { id: 'protection', name: 'Cables & Protection' },
  { id: 'portable', name: 'Portable & Lighting' },
];

EW.products = [
  // panels
  { id: 'ja-550', cat: 'panels', brand: 'JA Solar', name: 'JA Solar 550W Mono PERC Panel', price: 118, was: 132, rating: 4.8, reviews: 126, stock: 240, imgs: ['panel-closeup', 'panels-sky', 'roof-commercial'],
    specs: { 'Max power': '550 W', 'Cell type': 'Mono PERC half-cut', Efficiency: '21.3%', 'Voc / Isc': '49.9 V / 14.0 A', Dimensions: '2279 × 1134 × 35 mm', Weight: '28.6 kg', Warranty: '12 yr product / 25 yr output' },
    desc: 'A dependable tier-1 panel and the one we fit most. Half-cut cells keep output up in partial shade.' },
  { id: 'jinko-580', cat: 'panels', brand: 'Jinko', name: 'Jinko Tiger Neo 580W N-Type Bifacial', price: 139, rating: 4.9, reviews: 64, stock: 90, badge: 'New', imgs: ['panels-trees', 'panel-closeup', 'field-green'],
    specs: { 'Max power': '580 W', 'Cell type': 'N-type TOPCon bifacial', Efficiency: '22.4%', 'Voc / Isc': '51.2 V / 14.3 A', Dimensions: '2278 × 1134 × 30 mm', Weight: '32 kg', Warranty: '15 yr product / 30 yr output' },
    desc: 'N-type bifacial panel that also collects light from the back. Up to 8% more energy on ground mounts and bright roofs.' },
  { id: 'longi-455', cat: 'panels', brand: 'LONGi', name: 'LONGi Hi-MO 455W Mono Panel', price: 96, rating: 4.7, reviews: 88, stock: 12, imgs: ['roof-tiles', 'panel-closeup'],
    specs: { 'Max power': '455 W', 'Cell type': 'Mono PERC half-cut', Efficiency: '20.9%', 'Voc / Isc': '49.5 V / 11.6 A', Dimensions: '2094 × 1038 × 35 mm', Weight: '23.5 kg', Warranty: '12 yr product / 25 yr output' },
    desc: 'A smaller format that suits tight roofs and 24V systems.' },
  { id: 'cs-400', cat: 'panels', brand: 'Canadian Solar', name: 'Canadian Solar 400W Panel', price: 84, was: 92, rating: 4.6, reviews: 51, stock: 0, imgs: ['roof-install-metal', 'panel-closeup'],
    specs: { 'Max power': '400 W', 'Cell type': 'Mono PERC', Efficiency: '20.5%', Dimensions: '1722 × 1134 × 30 mm', Weight: '21 kg', Warranty: '12 yr / 25 yr' },
    desc: 'Budget-friendly mono panel for small systems and cabins.' },
  // inverters
  { id: 'deye-5', cat: 'inverters', brand: 'Deye', name: 'Deye 5kW 48V Hybrid Inverter', price: 1090, was: 1190, rating: 4.9, reviews: 203, stock: 34, badge: 'Best seller', imgs: ['inverter-wall', 'battery-panel', 'home-battery-ext'],
    specs: { 'Rated power': '5 kW', 'Battery voltage': '48 V', 'Max PV input': '6.5 kW / 2 MPPT', 'Switchover': '< 4 ms (UPS)', Parallel: 'Up to 16 units', Monitoring: 'Wi-Fi app', Warranty: '5 years' },
    desc: 'The standard hybrid inverter in most Harare homes. Switches to solar faster than a PC notices, and can run in parallel as you grow.' },
  { id: 'sunsynk-8', cat: 'inverters', brand: 'Sunsynk', name: 'Sunsynk 8kW Hybrid Inverter', price: 1890, rating: 4.9, reviews: 97, stock: 8, imgs: ['battery-panel', 'inverter-wall'],
    specs: { 'Rated power': '8 kW', 'Battery voltage': '48 V', 'Max PV input': '10.4 kW / 2 MPPT', Surge: '16 kW / 10 s', Parallel: 'Up to 16 units', Monitoring: 'Sunsynk Connect', Warranty: '10 years' },
    desc: 'High-surge inverter for pumps, ACs and heavy kitchens. Ten-year warranty.' },
  { id: 'growatt-3', cat: 'inverters', brand: 'Growatt', name: 'Growatt SPF 3000TL 24V Off-grid', price: 465, rating: 4.5, reviews: 142, stock: 51, imgs: ['inverter-room', 'inverter-wall'],
    specs: { 'Rated power': '3 kW', 'Battery voltage': '24 V', 'Max PV input': '4 kW / 1 MPPT', Surge: '6 kVA', Monitoring: 'Optional Wi-Fi', Warranty: '2 years' },
    desc: 'A proven off-grid inverter for small homes and shops.' },
  { id: 'victron-3', cat: 'inverters', brand: 'Victron', name: 'Victron MultiPlus-II 3kVA 24V', price: 1240, rating: 5.0, reviews: 38, stock: 6, imgs: ['string-inverters', 'inverter-room'],
    specs: { 'Rated power': '3 kVA / 2.4 kW', 'Battery voltage': '24 V', Charger: '70 A', Switchover: '< 20 ms', Monitoring: 'VRM portal', Warranty: '5 years' },
    desc: 'Built for sites that cannot go down: clinics, server rooms and lodges.' },
  { id: 'must-1', cat: 'inverters', brand: 'Must', name: 'Must 1kVA 12V Pure Sine Inverter', price: 165, was: 189, rating: 4.3, reviews: 77, stock: 60, imgs: ['home-battery-ext'],
    specs: { 'Rated power': '1 kVA / 800 W', 'Battery voltage': '12 V', Charger: '30 A PWM', Warranty: '1 year' },
    desc: 'Backup for lights, TV and Wi-Fi.' },
  // batteries
  { id: 'pylon-us5000', cat: 'batteries', brand: 'Pylontech', name: 'Pylontech US5000 4.8kWh LiFePO4', price: 1320, rating: 4.9, reviews: 156, stock: 22, badge: 'Top rated', imgs: ['battery-wall', 'battery-cabinet'],
    specs: { Capacity: '4.8 kWh (100 Ah)', Voltage: '48 V', Chemistry: 'LiFePO4', 'Cycle life': '6000+ @ 90% DoD', Stackable: 'Up to 16', Warranty: '10 years' },
    desc: 'The most widely supported lithium battery. Works with Deye, Sunsynk, Victron and Growatt.' },
  { id: 'dyness-5', cat: 'batteries', brand: 'Dyness', name: 'Dyness B4850 5.12kWh Rack Battery', price: 1150, was: 1260, rating: 4.7, reviews: 71, stock: 18, imgs: ['battery-racks', 'battery-cabinet'],
    specs: { Capacity: '5.12 kWh', Voltage: '51.2 V', Chemistry: 'LiFePO4', 'Cycle life': '6000+', Format: '19" rack', Warranty: '10 years' },
    desc: 'Rack-mount lithium that fits neatly into a cabinet.' },
  { id: 'felicity-10', cat: 'batteries', brand: 'Felicity', name: 'Felicity 10kWh Wall-mount Lithium', price: 2190, rating: 4.6, reviews: 29, stock: 4, imgs: ['home-battery-ext', 'battery-wall'],
    specs: { Capacity: '10.24 kWh', Voltage: '51.2 V', Chemistry: 'LiFePO4', 'Cycle life': '6000+', Display: 'LCD SoC', Warranty: '5 years' },
    desc: 'All the storage a home needs in one wall-mounted unit.' },
  { id: 'gel-200', cat: 'batteries', brand: 'Ritar', name: 'Ritar 12V 200Ah Deep-cycle Gel', price: 245, rating: 4.2, reviews: 112, stock: 70, imgs: ['battery-cabinet'],
    specs: { Capacity: '2.4 kWh', Voltage: '12 V', Chemistry: 'Gel VRLA', 'Cycle life': '1200 @ 50% DoD', Warranty: '1 year' },
    desc: 'Low upfront cost for small 12V and 24V backup systems.' },
  // kits
  { id: 'kit-3', cat: 'kits', brand: 'EcoWealth', name: 'EcoWealth 3kVA Plug & Save Kit', price: 2090, was: 2290, rating: 4.8, reviews: 44, stock: 15, badge: 'Kit', imgs: ['battery-panel', 'panels-sky'],
    specs: { Inverter: '3kW 24V hybrid', Battery: '2.56kWh LiFePO4', Panels: '4 × 550W', Cabling: 'Pre-crimped MC4 set', Install: 'Self or add-on' },
    desc: 'All the parts for a 3kVA system, boxed together. Install it yourself, or add our installation service at checkout.' },
  { id: 'kit-5', cat: 'kits', brand: 'EcoWealth', name: 'EcoWealth 5kVA Hybrid Kit', price: 3050, rating: 4.9, reviews: 37, stock: 9, badge: 'Kit', imgs: ['inverter-wall', 'panels-trees'],
    specs: { Inverter: 'Deye 5kW 48V', Battery: '5.12kWh LiFePO4', Panels: '8 × 550W', Protection: 'DC/AC breaker box', Install: 'Self or add-on' },
    desc: 'The same parts as our Grove package, supplied without installation.' },
  // geysers
  { id: 'geyser-150', cat: 'geysers', brand: 'Ecosolar', name: '150L Low-pressure Solar Geyser', price: 420, rating: 4.6, reviews: 58, stock: 25, imgs: ['roof-house-sunset', 'sun-sky'],
    specs: { Capacity: '150 L', Type: 'Gravity / non-pressure', Tubes: '15 evacuated tubes', 'Suits': '3–4 people', Warranty: '5 years' },
    desc: 'Takes the geyser off your inverter. That is usually the biggest saving on your electricity bill.' },
  { id: 'geyser-200p', cat: 'geysers', brand: 'Suntask', name: '200L High-pressure Smart Solar Geyser', price: 1180, was: 1290, rating: 4.8, reviews: 21, stock: 7, badge: 'Smart', imgs: ['roof-tiles', 'sun-sky'],
    specs: { Capacity: '200 L', Type: 'Pressurised (flat plate)', Controller: 'Smart timer, 5 schedules', 'Suits': '4–6 people', Warranty: '10 years tank' },
    desc: 'Mains-pressure hot water, with a smart timer so the element only switches on when you need it.' },
  // mounting
  { id: 'mount-ibr', cat: 'mounting', brand: 'K2', name: 'IBR / Corrugated Roof Mount Kit (4 panels)', price: 95, rating: 4.7, reviews: 40, stock: 80, imgs: ['drill-mount', 'roof-install-metal'],
    specs: { Fits: 'IBR & corrugated sheeting', Panels: '4 portrait', Material: 'Anodised aluminium', Wind: '150 km/h' },
    desc: 'Rails, clamps and fixings for metal roofs.' },
  { id: 'mount-tile', cat: 'mounting', brand: 'K2', name: 'Tile Roof Hook Mount Kit (4 panels)', price: 118, rating: 4.6, reviews: 22, stock: 45, imgs: ['roof-tiles', 'drill-mount'],
    specs: { Fits: 'Concrete & clay tile', Panels: '4 portrait', Material: 'Stainless hooks + aluminium rail' },
    desc: 'Adjustable stainless hooks. No tile cutting needed on most profiles.' },
  // protection
  { id: 'pv-cable', cat: 'protection', brand: 'Eland', name: '6mm² PV Solar Cable — 100m (Red/Black)', price: 128, rating: 4.8, reviews: 66, stock: 55, imgs: ['engineer'],
    specs: { Size: '6 mm²', Length: '2 × 50 m', Rating: '1500 V DC, UV-resistant', Standard: 'EN 50618' },
    desc: 'Tinned copper PV cable. UV-rated for 25 years outdoors.' },
  { id: 'combiner', cat: 'protection', brand: 'Schneider', name: 'DC Combiner & Surge Protection Box', price: 185, rating: 4.7, reviews: 19, stock: 3, imgs: ['string-inverters', 'inverter-room'],
    specs: { Strings: '2 in / 1 out', Fuses: '15 A gPV', SPD: 'Type 2, 1000 V DC', Isolator: '32 A DC', Enclosure: 'IP65' },
    desc: 'Protects your inverter from lightning surges, which are common during the Zimbabwe rainy season.' },
  // portable
  { id: 'station-1k', cat: 'portable', brand: 'EcoFlow', name: 'EcoFlow River 2 Pro Power Station', price: 499, was: 579, rating: 4.8, reviews: 84, stock: 30, imgs: ['home-battery-ext', 'sun-sky'],
    specs: { Capacity: '768 Wh LiFePO4', Output: '800 W (X-Boost 1600 W)', 'Solar input': '220 W', Charge: '0–100% in 70 min (AC)' },
    desc: 'Portable power for the office, the farm or a weekend away. Recharges from a solar panel.' },
  { id: 'flood-200', cat: 'portable', brand: 'EcoWealth', name: '200W Solar Flood Light with Remote', price: 58, rating: 4.4, reviews: 131, stock: 150, imgs: ['sun-sky'],
    specs: { Output: '200 W equiv.', Battery: 'LiFePO4, 12 h runtime', Sensor: 'Dusk-to-dawn', Rating: 'IP66' },
    desc: 'Security lighting that needs no wiring and costs nothing to run.' },
];
EW.products.forEach(p => { p.img = p.imgs[0]; });

/* ---------------- Appliances for the Solar Sizer ----------------
   w: running watts · h: default hours/day · surge: start-up multiplier
   c: likelihood it runs during the household peak · win: when it's used
   (all | day | morning | evening | night) · heavy: high-draw load worth
   rethinking · alt: cheaper way to run it */
EW.rooms = [
  { id: 'kitchen', name: 'Kitchen', ic: 'fridge' },
  { id: 'lounge', name: 'Lounge', ic: 'tv' },
  { id: 'bedroom', name: 'Bedrooms', ic: 'bed' },
  { id: 'bathroom', name: 'Bathroom & Laundry', ic: 'drop' },
  { id: 'office', name: 'Office', ic: 'laptop' },
  { id: 'outdoor', name: 'Outdoor & Utility', ic: 'sun' },
];
EW.appliances = [
  { id: 'fridge', room: 'kitchen', name: 'Fridge / freezer combo', w: 150, h: 10, surge: 3, c: .6, win: 'all', ic: 'fridge' },
  { id: 'chest', room: 'kitchen', name: 'Chest freezer', w: 120, h: 9, surge: 3, c: .5, win: 'all', ic: 'fridge' },
  { id: 'kettle', room: 'kitchen', name: 'Kettle', w: 2000, h: .3, surge: 1, c: .25, win: 'morning', ic: 'cup', heavy: true, alt: 'Boil on gas or use a flask. Saves ~2kW of inverter capacity.' },
  { id: 'micro', room: 'kitchen', name: 'Microwave', w: 1200, h: .3, surge: 1.3, c: .25, win: 'evening', ic: 'box' },
  { id: 'toaster', room: 'kitchen', name: 'Toaster', w: 800, h: .15, surge: 1, c: .15, win: 'morning', ic: 'box' },
  { id: 'stove', room: 'kitchen', name: 'Electric stove plate', w: 2000, h: 1, surge: 1, c: .5, win: 'evening', ic: 'flame', heavy: true, alt: 'A 2-plate gas stove costs about $40 and takes 2kW+ off your system.' },
  { id: 'oven', room: 'kitchen', name: 'Electric oven', w: 3000, h: .7, surge: 1, c: .4, win: 'evening', ic: 'flame', heavy: true, alt: 'Bake during the day on solar, or switch to a gas oven.' },
  { id: 'airfryer', room: 'kitchen', name: 'Air fryer', w: 1500, h: .4, surge: 1, c: .3, win: 'evening', ic: 'flame' },
  { id: 'dishwasher', room: 'kitchen', name: 'Dishwasher', w: 1800, h: 1, surge: 1.2, c: .2, win: 'day', ic: 'drop' },
  { id: 'lights-lounge', room: 'lounge', name: 'LED lights (per bulb)', w: 9, h: 6, surge: 1, c: 1, win: 'evening', ic: 'bulb', qty: 6 },
  { id: 'tv', room: 'lounge', name: 'LED TV 55"', w: 110, h: 6, surge: 1, c: .9, win: 'evening', ic: 'tv' },
  { id: 'decoder', room: 'lounge', name: 'DStv decoder', w: 25, h: 6, surge: 1, c: .9, win: 'evening', ic: 'tv' },
  { id: 'sound', room: 'lounge', name: 'Sound bar / home theatre', w: 120, h: 3, surge: 1, c: .5, win: 'evening', ic: 'speaker' },
  { id: 'console', room: 'lounge', name: 'Gaming console', w: 180, h: 3, surge: 1, c: .4, win: 'evening', ic: 'game' },
  { id: 'ac', room: 'lounge', name: 'Air conditioner 12000BTU', w: 1200, h: 5, surge: 2.5, c: .7, win: 'day', ic: 'wind', heavy: true, alt: 'Choose an inverter AC: it uses about 40% less energy and starts gently.' },
  { id: 'heater', room: 'lounge', name: 'Electric heater', w: 2000, h: 3, surge: 1, c: .6, win: 'evening', ic: 'flame', heavy: true, alt: 'An oil heater on a low setting, or a gas heater in winter, draws far less.' },
  { id: 'fan', room: 'lounge', name: 'Ceiling / pedestal fan', w: 60, h: 8, surge: 1.5, c: .7, win: 'day', ic: 'wind' },
  { id: 'lights-bed', room: 'bedroom', name: 'LED lights (per bulb)', w: 9, h: 4, surge: 1, c: .8, win: 'evening', ic: 'bulb', qty: 6 },
  { id: 'tv-bed', room: 'bedroom', name: 'Bedroom TV 32"', w: 60, h: 3, surge: 1, c: .5, win: 'evening', ic: 'tv' },
  { id: 'blanket', room: 'bedroom', name: 'Electric blanket', w: 120, h: 2, surge: 1, c: .4, win: 'night', ic: 'bed' },
  { id: 'chargers', room: 'bedroom', name: 'Phone chargers', w: 15, h: 3, surge: 1, c: .5, win: 'night', ic: 'phone', qty: 4 },
  { id: 'hairdryer', room: 'bedroom', name: 'Hair dryer', w: 1800, h: .2, surge: 1, c: .1, win: 'morning', ic: 'wind', heavy: true, alt: 'Fine to use for short spells. Just not together with the kettle.' },
  { id: 'geyser', room: 'bathroom', name: 'Electric geyser 150L', w: 3000, h: 3, surge: 1, c: .5, win: 'morning', ic: 'drop', heavy: true, alt: 'Switch to a solar geyser. This usually takes out 40–60% of a home\'s energy use.' },
  { id: 'washer', room: 'bathroom', name: 'Washing machine', w: 500, h: 1, surge: 2, c: .3, win: 'day', ic: 'wash' },
  { id: 'dryer', room: 'bathroom', name: 'Tumble dryer', w: 2500, h: 1, surge: 1.2, c: .2, win: 'day', ic: 'wash', heavy: true, alt: 'Line-dry in Zimbabwe\'s sun, or only run the dryer at midday.' },
  { id: 'iron', room: 'bathroom', name: 'Iron', w: 1200, h: .5, surge: 1, c: .2, win: 'day', ic: 'iron' },
  { id: 'laptop', room: 'office', name: 'Laptop', w: 65, h: 8, surge: 1, c: .9, win: 'day', ic: 'laptop', qty: 2 },
  { id: 'desktop', room: 'office', name: 'Desktop PC + monitor', w: 250, h: 8, surge: 1, c: .9, win: 'day', ic: 'monitor' },
  { id: 'router', room: 'office', name: 'Wi-Fi router', w: 12, h: 24, surge: 1, c: 1, win: 'all', ic: 'wifi' },
  { id: 'printer', room: 'office', name: 'Laser printer', w: 500, h: .3, surge: 2, c: .1, win: 'day', ic: 'box' },
  { id: 'pump', room: 'outdoor', name: 'Borehole pump 0.75kW', w: 750, h: 2, surge: 3, c: .5, win: 'day', ic: 'drop' },
  { id: 'pool', room: 'outdoor', name: 'Pool pump', w: 750, h: 6, surge: 2.5, c: .6, win: 'day', ic: 'drop' },
  { id: 'gate', room: 'outdoor', name: 'Gate motor', w: 300, h: .3, surge: 2, c: .2, win: 'all', ic: 'gate' },
  { id: 'cctv', room: 'outdoor', name: 'CCTV (4 cam) + alarm', w: 60, h: 24, surge: 1, c: 1, win: 'all', ic: 'cam' },
  { id: 'security-lights', room: 'outdoor', name: 'Security lights', w: 20, h: 11, surge: 1, c: 1, win: 'night', ic: 'bulb', qty: 4 },
  { id: 'fence', room: 'outdoor', name: 'Electric fence energiser', w: 10, h: 24, surge: 1, c: 1, win: 'all', ic: 'bolt' },
  { id: 'tools', room: 'outdoor', name: 'Workshop tools (grinder, drill)', w: 1500, h: .5, surge: 2, c: .2, win: 'day', ic: 'tool', heavy: true, alt: 'Use heavy tools at midday, when the panels can cover most of the load.' },
];

EW.presets = {
  starter: { label: 'Starter home', items: { 'lights-lounge': 6, tv: 1, decoder: 1, router: 1, chargers: 3, 'lights-bed': 4 } },
  family: { label: 'Family home', items: { fridge: 1, 'lights-lounge': 8, 'lights-bed': 8, tv: 1, decoder: 1, router: 1, chargers: 4, micro: 1, washer: 1, pump: 1, gate: 1, laptop: 2, cctv: 1, iron: 1 } },
  executive: { label: 'Executive home', items: { fridge: 2, chest: 1, 'lights-lounge': 12, 'lights-bed': 12, tv: 2, decoder: 1, sound: 1, router: 1, chargers: 6, micro: 1, washer: 1, pump: 1, pool: 1, gate: 1, laptop: 2, cctv: 1, ac: 1, iron: 1, 'security-lights': 6, kettle: 1 } },
  office: { label: 'Small office', items: { desktop: 4, laptop: 4, router: 1, printer: 1, 'lights-lounge': 12, fridge: 1, kettle: 1, cctv: 1, ac: 1, fan: 2 } },
};

EW.testimonials = [
  { title: 'Load-shedding is a thing of the past', text: 'We told EcoWealth what we run at home and they came back with a system that fitted our budget. Eight months on, we haven\'t noticed a single power cut.', who: 'Tendai M., Borrowdale — Grove 5kVA' },
  { title: 'Our clinic never goes dark', text: 'Vaccines have to stay cold, whatever ZESA is doing. The Evergreen system paid for itself in diesel savings in under three years.', who: 'Dr. R. Moyo, Chitungwiza Family Clinic' },
  { title: 'Clear pricing and good follow-up', text: 'The quote matched the final invoice exactly. The team explained the app to us and they still check in every few months.', who: 'Chipo & Farai N., Ruwa — Sprout 3kVA' },
];

EW.projects = [ // sample showcase — replace with EcoWealth's real installations
  { img: 'roof-commercial', t: 'Commercial rooftop', s: '10kVA hybrid · sample', seg: 'business' },
  { img: 'roof-house-sunset', t: 'Suburban family home', s: '5kVA Grove · sample', seg: 'home' },
  { img: 'field-inverters', t: 'Irrigation farm', s: '30kW ground mount · sample', seg: 'farm' },
  { img: 'roof-tiles', t: 'Tiled-roof residence', s: '10kVA with 20kWh · sample', seg: 'home' },
  { img: 'string-inverters', t: 'Office backup plant', s: '12kVA backup · sample', seg: 'business' },
  { img: 'house-solar', t: 'Country home', s: '16kVA Summit · sample', seg: 'home' },
  { img: 'field-sunset', t: 'Agro-processing site', s: '24kVA commercial · sample', seg: 'farm' },
  { img: 'roof-install-metal', t: 'Warehouse, IBR roof', s: '16kVA three-phase · sample', seg: 'business' },
  { img: 'installer-sunset', t: 'Off-grid lodge', s: '8kVA off-grid · sample', seg: 'home' },
];
