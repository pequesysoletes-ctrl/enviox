CREATE TABLE IF NOT EXISTS Session (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  state TEXT NOT NULL,
  isOnline INTEGER DEFAULT 0,
  scope TEXT,
  expires TEXT,
  accessToken TEXT NOT NULL,
  userId INTEGER,
  firstName TEXT,
  lastName TEXT,
  email TEXT,
  accountOwner INTEGER DEFAULT 0,
  locale TEXT,
  collaborator INTEGER DEFAULT 0,
  emailVerified INTEGER DEFAULT 0,
  refreshToken TEXT,
  refreshTokenExpires TEXT
);

CREATE TABLE IF NOT EXISTS MrwCredentials (
  id TEXT PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  codigoFranquicia TEXT NOT NULL,
  codigoAbonado TEXT NOT NULL,
  codigoDepartamento TEXT DEFAULT '',
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  verified INTEGER DEFAULT 0,
  verifiedAt TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ShippingConfig (
  id TEXT PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  defaultService TEXT DEFAULT '0800',
  defaultWeight INTEGER DEFAULT 2,
  defaultLength INTEGER DEFAULT 30,
  defaultWidth INTEGER DEFAULT 20,
  defaultHeight INTEGER DEFAULT 15,
  autoCreateShipment INTEGER DEFAULT 1,
  sendTrackingEmail INTEGER DEFAULT 1,
  sendTrackingSms INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Shipment (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  shopifyOrderId TEXT NOT NULL,
  shopifyOrderName TEXT NOT NULL,
  customerName TEXT NOT NULL,
  customerPhone TEXT DEFAULT '',
  destinationAddress TEXT NOT NULL,
  destinationCity TEXT NOT NULL,
  destinationZip TEXT NOT NULL,
  destinationProvince TEXT DEFAULT '',
  mrwTrackingNumber TEXT,
  mrwServiceCode TEXT DEFAULT '0800',
  weight INTEGER DEFAULT 1,
  packages INTEGER DEFAULT 1,
  status TEXT DEFAULT 'PENDING',
  labelPdf TEXT,
  reference TEXT,
  observations TEXT DEFAULT '',
  error TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ShipmentEvent (
  id TEXT PRIMARY KEY,
  shipmentId TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT DEFAULT '',
  eventDate TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipmentId) REFERENCES Shipment(id)
);

CREATE TABLE IF NOT EXISTS Pickup (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  date TEXT NOT NULL,
  timeSlot TEXT NOT NULL,
  packages INTEGER DEFAULT 1,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'PENDING',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ReturnShipment (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  originalShipmentId TEXT,
  shopifyOrderId TEXT DEFAULT '',
  shopifyOrderName TEXT DEFAULT '',
  customerName TEXT NOT NULL,
  customerPhone TEXT DEFAULT '',
  pickupAddress TEXT NOT NULL,
  pickupCity TEXT NOT NULL,
  pickupZip TEXT NOT NULL,
  pickupProvince TEXT DEFAULT '',
  mrwTrackingNumber TEXT,
  mrwServiceCode TEXT DEFAULT '0800',
  reason TEXT DEFAULT '',
  status TEXT DEFAULT 'PENDING',
  error TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ShippingRule (
  id TEXT PRIMARY KEY,
  shop TEXT NOT NULL,
  name TEXT NOT NULL,
  conditionField TEXT NOT NULL,
  conditionOperator TEXT NOT NULL,
  conditionValue TEXT NOT NULL,
  actionService TEXT NOT NULL,
  actionInsurance INTEGER DEFAULT 0,
  enabled INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS TrackingConfig (
  id TEXT PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  logoUrl TEXT,
  primaryColor TEXT DEFAULT '#E30613',
  secondaryColor TEXT DEFAULT '#1A1A2E',
  accentColor TEXT DEFAULT '#10B981',
  showStoreName INTEGER DEFAULT 1,
  storeName TEXT,
  customCss TEXT,
  footerText TEXT,
  showPoweredBy INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS NotificationConfig (
  id TEXT PRIMARY KEY,
  shop TEXT UNIQUE NOT NULL,
  smsEnabled INTEGER DEFAULT 0,
  whatsappEnabled INTEGER DEFAULT 0,
  twilioSid TEXT DEFAULT '',
  twilioToken TEXT DEFAULT '',
  twilioFromNumber TEXT DEFAULT '',
  wahaUrl TEXT DEFAULT '',
  wahaApiKey TEXT DEFAULT '',
  wahaSession TEXT DEFAULT 'default',
  notifyOnCreated INTEGER DEFAULT 1,
  notifyOnPickedUp INTEGER DEFAULT 0,
  notifyOnInTransit INTEGER DEFAULT 1,
  notifyOnOutForDelivery INTEGER DEFAULT 1,
  notifyOnDelivered INTEGER DEFAULT 1,
  notifyOnIncident INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
