document.addEventListener('DOMContentLoaded', (event) => {
    getHighscoreFromServer();
});

async function getHighscoreFromServer() {
    try {
        let response = await fetch("/highscore");
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        document.getElementById('current-highscore').textContent = `Current Highscore: ${data.highscore}`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('current-highscore').textContent = 'Failed to load highscore';
    }
}

async function setHighscoreOnServer() {
    const score = document.getElementById('score').value;

    let response = await fetch("/highscore");
    let data = await response.json();

    if (score > data.highscore){
        try {
            let response = await fetch("/highscore", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ highscore: score })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            let data = await response.json();
            console.log(data);
            document.getElementById('current-highscore').textContent = `Current Highscore: ${data.highscore}`;
            return data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

}
