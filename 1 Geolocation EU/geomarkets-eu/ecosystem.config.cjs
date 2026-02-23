module.exports = {
  apps: [{
    name: 'geomarkets-eu',
    script: 'node_modules/.bin/remix-serve',
    args: 'build/server/index.js',
    cwd: '/var/www/geomarkets-eu',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      SHOPIFY_API_KEY: '491ab980ec59ff1d3cf46c14c5329107',
      SHOPIFY_API_SECRET: 'shpss_REDACTED',
      SHOPIFY_APP_URL: 'https://geomarkets.enviox.es',
      SCOPES: 'read_markets,read_locales,read_themes,write_themes,read_content',
      DATABASE_URL: 'file:./dev.sqlite',
    }
  }]
};
