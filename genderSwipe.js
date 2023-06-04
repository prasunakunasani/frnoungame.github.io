// Load the nouns data from a JSON file
fetch("frenchGender.json")
    .then((response) => response.json())
    .then((data) => {
        const nouns = data.nouns; // Get the array of nouns from the JSON data
        let currentNounIndex = 0; // Keep track of the current noun index
        let score = 0; // Keep track of the player's score
        const questionElement = document.getElementById("question"); // Get the question element
        const messageElement = document.getElementById("message"); // Get the message element
        const scoreElement = document.getElementById("score"); // Get the score element
        const cardBody = document.querySelector(".card-body"); // Get the card body element
        const masculineButton = document.getElementById("masculine"); // Get the masculine button element
        const feminineButton = document.getElementById("feminine"); // Get the feminine button element
        const wordElement = document.getElementById("word"); // Get the word element
        const imageElement = document.getElementById("image"); // Get the image element
        const hintButton = document.getElementById("hint"); // Get the hint button element
        const resultsTable = document.getElementById("scoreboard-body"); // Get the results table element
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
            hintButton.classList.add("hidden")
            // Show a hint for the current noun
            if (currentNounIndex < 0) {
                currentNounIndex = nouns.length - 1;
            }
            imageElement.classList.remove("hidden");
            imageElement.src = nouns[currentNounIndex].imageLink;
            wordElement.textContent = nouns[currentNounIndex].the_word;
        });

        // Function to display a new question
        function displayQuestion() {
            imageElement.classList.add("hidden");
            hintButton.classList.remove("hidden")
            let unansweredNouns = nouns.filter(noun => !noun.answered && !noun.answeredCorrectly); // Filter out nouns that have been answered or answered correctly
            let totalAnswered = nouns.filter(noun => noun.answered).length; // Count the total number of answered nouns

            if (totalAnswered === nouns.length) {
                gameEnded = true; // All nouns have been answered, end the game
            } else if (unansweredNouns.length === 0) {
                resetNounsAnsweredStatus(); // Reset the answered status of nouns and get all nouns again
            } else {
                const randomIndex = Math.floor(Math.random() * unansweredNouns.length);
                const noun = unansweredNouns[randomIndex];
                currentNounIndex = nouns.indexOf(noun); // Update the current noun index
                noun.answered = true; // Mark the noun as answered
                questionElement.textContent = " " + noun.word + "?"; // Display the question
                wordElement.textContent = ""; // Clear the word element
                imageElement.src = ""; // Clear the image element
                messageElement.textContent = ""; // Clear the message element

                if (totalAnswered === nouns.length - 1 && unansweredNouns.length === 1) {
                    messageElement.textContent = "All nouns have been answered!";
                    gameEnded = true; // All nouns have been answered, end the game
                }
            }
        }

        // Function to reset the answered status of nouns
        function resetNounsAnsweredStatus() {
            nouns.forEach(noun => {
                noun.answered = false;
                noun.answeredCorrectly = false;
            });
        }

        // Function to check the user's answer
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
                //todo - fix the -1 garbage
                scoreElement.textContent = `Score: ${score}/${(nouns.length)-1}`;
                noun.answeredCorrectly = true; // Mark the noun as answered correctly
            } else {
                messageElement.textContent = `Wrong! The correct answer is "${correctAnswer}".`;
                noun.answeredCorrectly = false; // Mark the noun as answered incorrectly
            }

            // Add the question and user's answer to the results table
            const row = resultsTable.insertRow(-1);
            const numberCell = row.insertCell(0);
            const wordCell = row.insertCell(1);
            const userAnswerCell = row.insertCell(2);
            const correctAnswerCell = row.insertCell(3);
            const resultCell = row.insertCell(4);
            numberCell.textContent = resultsTable.rows.length ;
            wordCell.textContent = noun.word;
            userAnswerCell.textContent = userAnswer;
            correctAnswerCell.textContent = correctAnswer;
            resultCell.textContent = noun.answeredCorrectly ? "✔" : "❌";
            resultCell.style.color = noun.answeredCorrectly ? "green" : "red";

            // Check if all nouns have been answered
            const totalAnswered = nouns.filter(noun => noun.answered).length;
            if (totalAnswered === nouns.length) {
                console.log("All nouns have been answered!");
                return;
            }

            // Display the next question after a brief delay
            setTimeout(() => {
                displayQuestion();
            }, 150);
        }

        // Function to restart the game
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


            // Add the hint button back to the card body
            cardBody.appendChild(hintButton);

            // Reset the score to 0
            //todo - fix the -1 garbage
            scoreElement.textContent = `Score: ${score}/${(nouns.length)-1}`;

            // Display the first question
            displayQuestion();
        }

        // Add event listener to the "Restart" button
        const restartButton = document.getElementById("restart-button");
        restartButton.addEventListener("click", restartGame);
    });
