async function setHighscoreOnServer(score) {
    let response = await fetch("http://localhost:3000/highscore")
    let data = await response;
    console.log(data);
    return data;
}