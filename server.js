// Importo redis y express y cors
const express = require('express');
const redis = require('redis');
const cors = require('cors'); // npm install cors


const client = redis.createClient();

const app = express()
const port = 3000

// Esto es para solucionar error CORS que tira
app.use(cors());
app.get('/products/:id', function(req, res,next){
    res.json({msg: 'This is CORS-enabled for all origins!'});
    res.send("xd");
}
);

// hago setup de redis
setupRedis();
setHighScore(3);

// Responde con "Hello World" cuando una petición GET se hace al homepage
app.get('/', (req, res) => {

    getHighScore().then(highscore => { // Esto utiliza un then porque sino el Highscore como es una promesa no se muestra
        let text = "The Highscore is: " + highscore.toString();
        res.send(text);
    })
    //let highscore = await getHighScore();
    
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