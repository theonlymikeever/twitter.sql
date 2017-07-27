const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect(function(err){
  if (err){
    console.log(err.message);
  }
  // console.log('connected');
});




//exports
module.exports = client;
