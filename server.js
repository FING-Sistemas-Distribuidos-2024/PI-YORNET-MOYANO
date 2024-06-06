const express = require('express');
const redis = require('redis');
const path = require('path');

const client = redis.createClient();
const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

setupRedis();
setHighScore(3);

// Obtiene la puntuación más alta
app.get('/highscore', async (req, res) => {
    try {
        const highscore = await getHighScore();
        res.json({ highscore: highscore });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Establece una nueva puntuación más alta
app.post('/highscore', (req, res) => {
    const highscore = req.body.highscore;
    setHighScore(highscore).then(() => {
        res.json({ status: 'success', highscore: highscore });
    }).catch(err => {
        res.status(500).json({ status: 'error', message: err.message });
    });
});

// Inicia el servidor y escucha en el puerto especificado
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Configura el cliente de Redis
async function setupRedis() {
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect();
}

// Obtiene la puntuación más alta desde Redis
async function getHighScore() {
    const value = await client.get('highscore');
    console.log(value);
    return value;
}

// Establece una nueva puntuación más alta en Redis
async function setHighScore(highscoreValue) {
    await client.set('highscore', highscoreValue);
}
