// Importo redis y express y cors
const express = require('express');
const path = require('path');
const redis = require('redis');


const client = redis.createClient();

const app = express()
const port = 3000


// hago setup de redis
setupRedis();
setHighScore(3);

// Servir archivos estáticos (frontend) desde el directorio "client"
app.use(express.static(path.join(__dirname, '../client')));
// Esto permite recibir jsons
app.use(express.json())


// Responde con "Hello World" cuando una petición GET se hace al homepage
app.get('/highscore', (req, res) => {

    getHighScore().then(highscore => { // Esto utiliza un then porque sino el Highscore como es una promesa no se muestra
        let text = "The Highscore is: " + highscore.toString();
        res.send(text);
    })
    //let highscore = await getHighScore();
    
})

app.post('/highscore', (req, res) => {
    console.log(req.body)
})


// Hago que el server esté en localhost:3000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


async function setupRedis(){

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();
}

async function getHighScore() {
    const value = await client.get('highscore');
    console.log(value);
    return value;
}

async function setHighScore(highscoreValue) {
    await client.set('highscore', highscoreValue);
    
}