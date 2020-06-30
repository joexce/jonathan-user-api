const redis = require('redis')
const cache = redis.createClient({ 
    port: 6379,
    host: '127.0.0.1'
});
cache.on('error', (err) => {
    console.log("Error " + err)
});

module.exports = cache;