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


// Responde con el leaderboard cuando una petición GET se hace a /highscore
app.get('/highscore', (req, res) => {
    
    getLeaderboard().then( leaderboard => {
        res.send(leaderboard);
    })
})

app.post('/highscore', (req, res) => {
    let playerInfo = req.body;
    topTenPosition(playerInfo['score']).then( position => {
        console.log("player assigned pos:")
        console.log(position);

        if (position > 0) {
            setPlayerOnLeaderboard(req.body, position);
            getPlayerName(position).then( playerSet => {
                console.log("player set:");
                console.log(playerSet);
            })
        } else {
            console.log(playerInfo['name']+ " has not set a highscore");
        }
    });
})


// Hago que el server esté en localhost:3000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


// returns the position in which the score should be placed given the current leaderboard
async function topTenPosition(score) {

    let position = -1;

    for (let i = 10; i > 0; i--) {
        
        let redisScore = await getPlayerScore(i);

        console.log(i);
        console.log(score + ">" + redisScore);
        if (score > redisScore) {
            position = i;
        } else {

            break;
        }
    }

    return position;
}

// ================================== REDIS =====================================================

async function setupRedis(){

    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    // Here we set all the positions to 0 so that we don't have problem with later code
    for (let i = 1; i < 11; i++) {
        setPlayerOnLeaderboard({'name': "", 'score': 0},i);
    }
}

async function getHighScore() {
    const value = await client.get('highscore');
    console.log(value);
    return value;
}

async function setHighScore(highscoreValue) {
    await client.set('highscore', highscoreValue);
    
}

// returns a json with all the leaderboard data from redis
async function getLeaderboard() {

    let leaderboard = {};

    for (let i = 1; i < 11; i++) {

        let currentName = await getPlayerName(i);
        let currentScore = await getPlayerScore(i);


        let player = {
            'name': currentName,
            'score': currentScore,
        }
        
        leaderboard[`player${i}`] = player;

    }

    console.log(leaderboard);

    return leaderboard;
}

// Sets the player specified in playerInfo to the position specified in the redis db
async function setPlayerOnLeaderboard(playerInfo, position) {

    await client.set(`number${position}Name`, playerInfo['name']);
    await client.set(`number${position}Score`, playerInfo['score']);
    
}

// gets the player name in the position specified from the redis db
async function getPlayerName(position) {
    const value = await client.get(`number${position}Name`);
    return value;
}

// gets the player score in the position specified from the redis db
async function getPlayerScore(position) {
    const value = await client.get(`number${position}Score`);
    return value;
}