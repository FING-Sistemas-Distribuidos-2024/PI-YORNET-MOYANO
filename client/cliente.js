// This loads the leaderboard from the server
getLeaderboardFromServer().then( leaderboard => {
    updateLeaderboard(leaderboard);
});

async function setLeaderBoardOnClient(){
    getHighscoreFromServer();
}

// returns the leaderboard from the server
async function getLeaderboardFromServer() {
    let response = await fetch("http://localhost:3000/highscore")
    let data = await response.json();
    return data;
}

// puts the currentLeaderBoard data into the html list
function updateLeaderboard(currentLeaderboard) {

    for (let i = 1; i < 11; i++) {
        document.getElementById(`number${i}`).innerText = currentLeaderboard[`player${i}`]['name'] + " " + currentLeaderboard[`player${i}`]['score'];
    }

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
    
    console.log("xd")
    // This loads the leaderboard from the server
    getLeaderboardFromServer().then( leaderboard => {
        updateLeaderboard(leaderboard);
    });
}