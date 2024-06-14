
async function setLeaderBoardOnClient(){
    getHighscoreFromServer();
}

async function getHighscoreFromServer() {
    let response = await fetch("http://localhost:3000/highscore")
    let data = await response.text();
    console.log(data);
    return data;
}

async function setHighscoreOnServer(score) {
    let response = await fetch("http://localhost:3000/highscore")
    let data = await response.text();
    console.log(data);
    return data;
}

async function sendScoreToServer(name, score) {
    let jsonToBeSent = {
        "name": name,
        "score": score
    }
    
    let request = await fetch("http://localhost:3000/highscore", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonToBeSent)
    })

}