async function setHighscoreOnServer() {
    const score = document.getElementById('score').value;

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
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
