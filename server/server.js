// Imports redis, path and express
const express = require('express');
const path = require('path');
const redis = require('redis');


// Esto se hace para comunicar con otros containers a través de variables de entorno
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    socket: {
        host: redisHost,
        port: redisPort
    }
});

const app = express()
const port = 3000


setupRedis();

// This servers static files (frontend) from the directory '/client'
//app.use(express.static(path.join(__dirname, '../client')));
// This allows receiving jsons
app.use(express.json())


// This responds with the leaderboard when a GET request is made to /highscore
app.get('/highscore', (req, res) => {
    
    getLeaderboard().then( leaderboard => {
        res.send(leaderboard);
    })
})

/**
 * Check if the given score is a highscore, if it is it calculates its position 
 * on the leaderboard and saves it in the redis db
 */
app.post('/highscore', (req, res) => {
    let playerInfo = req.body;
    // Calculates player position by score
    topTenPosition(playerInfo['score']).then( position => {


        if (position > 0) {// This happens when the score is a new highscore

            setPlayerOnLeaderboard(req.body, position);
        }

        // Sends a response to the client, so that it doesn't leave it hanging
        res.status(200).send();
    });
})


// This makes the server be in localhost:port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})


// Returns the position in which the score should be placed given the current leaderboard
async function topTenPosition(score) {

    let position = -1;

    for (let i = 10; i > 0; i--) {
        
        let redisScore = await getPlayerScore(i);

        // Transforms numbers to intengers so that the comparison is right
        redisScore = Number(redisScore);
        score = Number(score);

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

    // Here we set all the positions to 0 if the redis db has no data
    let sampleScore = await getPlayerScore(1);
    if(sampleScore == null){
        for (let i = 1; i < 11; i++) {
            setPlayerOnPosition({'name': "", 'score': 0},i);
        }
    }
}

// Returns a json with all the leaderboard data from redis
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

    return leaderboard;
}

/**
 * Sets the player specified in playerInfo to the position specified in the redis db
 * and then pushes down the previous player that occupied that position
 */
async function setPlayerOnLeaderboard(playerInfo, position) {

    let oldPlayerName = await getPlayerName(position);
    let oldPlayerScore = await getPlayerScore(position);

    await client.set(`number${position}Name`, playerInfo['name']);
    await client.set(`number${position}Score`, playerInfo['score']);
    
    if (position + 1 < 11) { // This makes all highscore go down recursively when a new one is set
        await setPlayerOnLeaderboard({"name": oldPlayerName, "score": oldPlayerScore}, position + 1)
    }
}

/** 
 * Sets the player specified in playerInfo to the position specified in the redis db without
 * re-adjusting the leaderboard
 * */

async function setPlayerOnPosition(playerInfo, position) {
    await client.set(`number${position}Name`, playerInfo['name']);
    await client.set(`number${position}Score`, playerInfo['score']);
}


// Gets the player name in the position specified from the redis db
async function getPlayerName(position) {
    const value = await client.get(`number${position}Name`);
    return value;
}

// Gets the player score in the position specified from the redis db
async function getPlayerScore(position) {
    const value = await client.get(`number${position}Score`);
    return value;
}