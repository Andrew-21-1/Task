const pg = require('pg')
const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'CS',
  password: '12345Aa'
})

module.exports = client