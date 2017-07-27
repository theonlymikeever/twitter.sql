const pg = require('pg');
const fs = require('fs');

// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client('postgres://localhost/twitterdb');

client.connect(function(err){
  if (err){
    console.log(err.message);
  }
  // console.log('connected');
});

function syncAndSeed(cb){
  var sql = fs.readFileSync('./seed.sql').toString();
  query(sql, null, function(err){
    if(err){
      return cb(err);
    }
    cb(null);
  });
}

function query(sql, params, cb){
  client.query(sql, params, cb);
}

//exports
module.exports = {
  client: client,
  syncAndSeed: syncAndSeed
};
