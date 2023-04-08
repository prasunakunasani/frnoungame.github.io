// Load the nouns data from a JSON file
fetch("frenchGender.json")
    .then((response) => response.json())
    .then((data) => {
        const nouns = data.nouns;
        let currentNounIndex = 0;
        let previousNounIndex = 0;
        let score = 0;
        const questionElement = document.getElementById("question");
        const messageElement = document.getElementById("message");
        const scoreElement = document.getElementById("score");
        const cardBody = document.querySelector(".card-body");
        const masculineButton = document.getElementById("masculine");
        const feminineButton = document.getElementById("feminine");
        const wordElement = document.getElementById("word");
        const imageElement = document.getElementById("image");
        const hintButton = document.getElementById("hint");
        const resultsTable = document.getElementById("scoreboard-body");
        let gameEnded = false; // Flag variable to keep track of game ending

        // Append the word, image, and hint button elements to the card body
        cardBody.appendChild(wordElement);
        cardBody.appendChild(imageElement);
        cardBody.appendChild(hintButton);

        // Display the first question
        displayQuestion();

        // Add event listeners to buttons
        masculineButton.addEventListener("click", () => {
            checkAnswer("m");
        });

        feminineButton.addEventListener("click", () => {
            checkAnswer("f");
        });

        hintButton.addEventListener("click", () => {
            // currentNounIndex--;
            if (currentNounIndex < 0) {
                currentNounIndex = nouns.length - 1;
            }
            imageElement.src = nouns[currentNounIndex].imageLink;
            wordElement.textContent = nouns[currentNounIndex].theword;
        });


        // function displayQuestion() {
        //     // Choose a random noun that has not been answered yet
        //     let unansweredNouns = nouns.filter(noun => !noun.answered && !noun.answeredCorrectly);
        //     let totalAnswered = nouns.filter(noun => noun.answered).length;
        //
        //     if (totalAnswered === nouns.length) {
        //         // Display a message or end the game
        //         // messageElement.textContent = "All nouns have been answered!";
        //         gameEnded = true; // set the flag to end the game
        //         return;
        //     } else if (unansweredNouns.length === 0) {
        //         // Reset the answered property of each noun to false
        //         nouns.forEach(noun => {
        //             noun.answered = false;
        //             noun.answeredCorrectly = false;
        //         });
        //         unansweredNouns = nouns;
        //     }
        //
        //     const randomIndex = Math.floor(Math.random() * unansweredNouns.length);
        //     const noun = unansweredNouns[randomIndex];
        //     currentNounIndex = nouns.indexOf(noun);
        //     noun.answered = true;
        //     // Display the question, word, and image
        //     questionElement.textContent = " " + noun.word + "?";
        //     wordElement.textContent = "";
        //     imageElement.src = "";
        //     // Clear the message element
        //     messageElement.textContent = "";
        //
        //     if (totalAnswered === nouns.length - 1 && unansweredNouns.length === 1) {
        //         // Display a message or end the game
        //         messageElement.textContent = "All nouns have been answered!";
        //         gameEnded = true; // set the flag to end the game
        //         return;
        //     }
        //
        // }

        function displayQuestion() {
            let unansweredNouns = nouns.filter(noun => !noun.answered && !noun.answeredCorrectly);
            let totalAnswered = nouns.filter(noun => noun.answered).length;

            if (totalAnswered === nouns.length) {
                gameEnded = true;
            } else if (unansweredNouns.length === 0) {
                resetNounsAnsweredStatus();
                unansweredNouns = nouns;
            } else {
                const randomIndex = Math.floor(Math.random() * unansweredNouns.length);
                const noun = unansweredNouns[randomIndex];
                currentNounIndex = nouns.indexOf(noun);
                noun.answered = true;
                questionElement.textContent = " " + noun.word + "?";
                wordElement.textContent = "";
                imageElement.src = "";
                messageElement.textContent = "";
                if (totalAnswered === nouns.length - 1 && unansweredNouns.length === 1) {
                    messageElement.textContent = "All nouns have been answered!";
                    gameEnded = true;
                }
            }
        }

        function resetNounsAnsweredStatus() {
            nouns.forEach(noun => {
                noun.answered = false;
                noun.answeredCorrectly = false;
            });
        }

        function checkAnswer(answer) {

            if (gameEnded) {
                messageElement.textContent = "The game has ended!";
                return;
            }

            const noun = nouns[currentNounIndex];
            const correctAnswer = noun.gender;
            const userAnswer = answer;
            if (userAnswer === correctAnswer) {
                messageElement.textContent = "Correct!";
                score++;
                scoreElement.textContent = `Score: ${score}`;
                noun.answeredCorrectly = true;
            } else {
                messageElement.textContent = `Wrong! The correct answer is "${correctAnswer}".`;
                noun.answeredCorrectly = false;
            }
            // Add the question and user's answer to the results table
            const row = resultsTable.insertRow(-1);
            const numberCell = row.insertCell(0);
            const wordCell = row.insertCell(1);
            const userAnswerCell = row.insertCell(2);
            const correctAnswerCell = row.insertCell(3);
            const resultCell = row.insertCell(4);
            numberCell.textContent = resultsTable.rows.length - 1;
            wordCell.textContent = noun.word;
            userAnswerCell.textContent = userAnswer;
            correctAnswerCell.textContent = correctAnswer;
            resultCell.textContent = noun.answeredCorrectly ? "✔" : "❌";
            resultCell.style.color = noun.answeredCorrectly ? "green" : "red";

            // Check if all nouns have been answered
            const totalAnswered = nouns.filter(noun => noun.answered).length;
            if (totalAnswered === nouns.length) {
                // Display a message or end the game
                console.log("All nouns have been answered!");
                return;
            }

            // Display the next question after a brief delay
            setTimeout(() => {
                displayQuestion();
            }, 150);
        }


        // Display the user's score
        function restartGame() {
            // Reset the "answered" and "answeredCorrectly" properties of each noun to false
            nouns.forEach(noun => {
                noun.answered = false;
                noun.answeredCorrectly = false;
            });

            // Clear the results table
            while (resultsTable.firstChild) {
                resultsTable.removeChild(resultsTable.firstChild);
            }

            // Reset variables
            currentNounIndex = 0;
            score = 0;

            // Remove the score table and display the game elements
            cardBody.removeChild(cardBody.lastChild);
            messageElement.classList.remove("hidden");
            masculineButton.classList.remove("hidden");
            feminineButton.classList.remove("hidden");
            // hintButton.classList.remove("hidden");

            // Display the first question
            displayQuestion();
        }

        // Add event listener to the "Restart" button
        const restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click", restartGame);
    });