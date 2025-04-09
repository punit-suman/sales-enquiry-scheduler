const { Pool } = require('pg');

const pool = new Pool({
    user: 'default',
    password: 'JeKRzgk1V2yv',
    host: 'ep-late-meadow-18207352-pooler.us-east-1.postgres.vercel-storage.com',
    port: 5432,
    database: 'verceldb',
    ssl: true
});

module.exports = pool;