// Importo redis y express
const express = require('express');
const redis = require('redis');

const client = redis.createClient();

const app = express()
const port = 3000

// Pongo hello world en el html
app.get('/', (req, res) => {
    res.send('Hello world');
})


// hago setup de redis
setupRedis();


// Hago que el server esté en localhost:3000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

async function setupRedis(){

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
}

async function getHighScore() {
    const value = await client.get('key');
    console.log(value);
    return value;
}

async function setHighScore(highscoreValue) {
    await client.set('highscore', highscoreValue);
    
}