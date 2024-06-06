async function setHighscoreOnServer(score) {
    let response = await fetch("http://127.0.0.1:3000")
    let data = await response;
    console.log(data);
    return data;
}