const express = require('express');
const redis = require('redis');
const path = require('path'); // Importa path para manejar rutas

const client = redis.createClient();
const app = express();
const port = 5000;

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Para manejar cuerpos de solicitud en formato JSON

setupRedis();
setHighScore(3);

app.get('/highscore', (req, res) => {
    getHighScore().then(highscore => {
        let text = "The Highscore is: " + highscore.toString();
        res.send(text);
    });
});

app.post('/highscore', (req, res) => {
    const highscore = req.body.highscore;
    setHighScore(highscore).then(() => {
        res.json({ status: 'success', highscore: highscore });
    }).catch(err => {
        res.status(500).json({ status: 'error', message: err.message });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function setupRedis() {
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
