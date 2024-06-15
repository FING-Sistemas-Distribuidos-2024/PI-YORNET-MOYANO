setLeaderBoardOnClient();

// This loads the leaderboard from the server and shows it in the html
async function setLeaderBoardOnClient(){
    getLeaderboardFromServer().then( leaderboard => {
        updateLeaderboard(leaderboard);
    });
}

// Returns the leaderboard from the server in json format
async function getLeaderboardFromServer() {
    let response = await fetch("http://localhost:3000/highscore")
    let data = await response.json();
    return data;
}

// Puts the currentLeaderBoard data into the html list
function updateLeaderboard(currentLeaderboard) {

    for (let i = 1; i < 11; i++) {
        document.getElementById(`number${i}`).innerText = currentLeaderboard[`player${i}`]['name'] + " " + currentLeaderboard[`player${i}`]['score'];
    }

}

// Sends the score made to the server in json format
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
    

    setLeaderBoardOnClient();
}