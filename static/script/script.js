class QuizGame {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.playerName = '';
        this.timer = null;
        this.timeLeft = 30;
        this.questions = [
            {
                question: "A printer is currently being used by one process, and another process also requests the printer. Since the printer cannot be shared, the second process must wait. What deadlock condition does this scenario represent?",
                options: ["Hold and Wait", "Circular Wait", "Mutual Exclusion", "No Preemption"],
                answer: 2
            },
            {
                question: "A process is holding a memory block while simultaneously requesting access to a CPU cycle. Another process is holding the CPU cycle and waiting for the memory block. Which deadlock condition is demonstrated?",
                options: ["Hold and Wait", "Circular Wait", "No Preemption", "Resource Allocation Denial"],
                answer: 0
            },
            {
                question: "A process is holding a disk resource. The operating system tries to reassign the disk to another process, but it cannot because resources cannot be forcibly taken. What condition prevents the OS from reallocating the disk?",
                options: ["Hold and Wait", "Circular Wait", "No Preemption", "Deadlock Avoidance"],
                answer: 2
            },
            {
                question: "Process A is holding a printer and waiting for a scanner. Process B is holding the scanner and waiting for a keyboard. Process C is holding the keyboard and waiting for the printer. What type of situation is this?",
                options: ["Deadlock Avoidance", "Circular Wait", "Indirect Prevention", "Resource Allocation Denial"],
                answer: 1
            },
            {
                question: "The system requires all processes to request their resources at the beginning of execution. If resources aren’t available, the process must wait until all requested resources can be allocated simultaneously. What condition is being prevented here?",
                options: ["Hold and Wait", "Cirular Wait", "No Preemption", "Deadlock Detection"],
                answer: 0
            },
            {
                question: "A banking system checks every resource request with the Banker’s Algorithm. It only grants the request if the system will remain in a safe state. Which strategy is being used?",
                options: ["Deadlock Prevention", "Deadlock Detection", "Deadlock Avoidance", "Circular Wait"],
                answer: 2
            },
            {
                question: "A system identifies that five processes are deadlocked. The operating system aborts all five processes and restarts them from the beginning. What recovery method is used here?",
                options: ["Rollback to checkpoint", "Abort all deadlocked process", "Preempt resources", "Abort Process one by one"],
                answer: 1
            },
            {
                question: "The OS checks a resource request against the Banker’s Algorithm and denies it if granting it would lead to an unsafe state. Which strategy is used?",
                options: ["Deadlock Prevention", "Deadlock Avoidance", "Deadlock Detection", "Circular Wait"],
                answer: 1
            },
            {
                question: "A new process requests more resources than what is available. The system refuses to start it. What avoidance method is applied?",
                options: ["Resource Allocation Denial", "Deadlock Detection", "Process Initiation Denial", "Circular Wait"],
                answer: 2
            },
            {
                question: "A process holding a scanner requests a printer. The OS denies the request because granting it might lead to deadlock. Which method is used?",
                options: ["Process Initiation Denial", "Resource Allocation Denial", "Deadlock Detection", "Circular Wait"],
                answer: 1
            },
            {
                question: "The OS detects a deadlock among 3 processes and terminates all of them immediately. Which recovery method is applied?",
                options: ["Abort all process", "Abort process at a time", "Resource Preemption", "Rollback"],
                answer: 0
            },
            {
                question: "The system detects deadlock and kills one process at a time until no cycle exists. Which recovery method is this?",
                options: ["Abort all process", "Resource Preemption", "Abort processes one by one", "Process Initiation Denial"],
                answer: 2
            },
            {
                question: "The OS rolls back a process to its last safe checkpoint and restarts it to resolve deadlock. Which recovery method is applied?",
                options: ["Resource Preemption", "Abort all processes", "Rollback", "Circular Wait Prevention"],
                answer: 2
            },
            {
                question: "A system detects a deadlock and temporarily takes memory away from one process to give it to another. Which recovery method is this?",
                options: ["Rollback", "Resource Preemption", "Abort processes one by one", "Deadlock Avoidance"],
                answer: 1
            },
            {
                question: "The OS must terminate one of the deadlocked processes. It chooses the process with the lowest priority to kill. Which Criterion is being used?",
                options: ["Least resources allocated", "Most remaining time", "lowest priority", "Least CPU time consumed"],
                answer: 2
            }
        ];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('userForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.startGame();
        });

        document.getElementById('nextButton').addEventListener('click', () => {
            this.nextQuestion();
        });
    }

    async startGame() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        
        if (!firstName || !lastName) {
            alert('Please enter both first and last name');
            return;
        }
        
        this.playerName = `${firstName} ${lastName}`;
        
        // Test backend connection first
        try {
            const response = await fetch('/health');
            if (!response.ok) {
                throw new Error('Backend not responding');
            }
            const health = await response.json();
            console.log('Server health:', health);
        } catch (error) {
            alert('Server connection failed. Please make sure the backend is running.');
            console.error('Server connection error:', error);
            return;
        }
        
        // Hide login, show quiz
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
        
        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion];
        document.getElementById('question').textContent = `Question ${this.currentQuestion + 1}/15: ${question.question}`;
        
        const optionsContainer = document.getElementById('options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'option-button';
            button.onclick = () => this.selectOption(index);
            optionsContainer.appendChild(button);
        });
        
        document.getElementById('score').textContent = this.score;
        document.getElementById('nextButton').disabled = true;
        
        // Reset timer
        this.timeLeft = 30;
        document.getElementById('timer').textContent = this.timeLeft;
    }

    startTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timer').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.autoNextQuestion();
            }
        }, 1000);
    }

    autoNextQuestion() {
        // Highlight correct answer if time runs out
        const correctIndex = this.questions[this.currentQuestion].answer;
        const options = document.querySelectorAll('.option-button');
        
        options.forEach((button, index) => {
            if (index === correctIndex) {
                button.classList.add('correct');
            }
            button.disabled = true;
        });
        
        document.getElementById('nextButton').disabled = false;
    }

    selectOption(selectedIndex) {
        // Stop the timer
        clearInterval(this.timer);
        
        const correctIndex = this.questions[this.currentQuestion].answer;
        const options = document.querySelectorAll('.option-button');
        
        options.forEach((button, index) => {
            if (index === correctIndex) {
                button.classList.add('correct');
            }
            if (index === selectedIndex && index !== correctIndex) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });
        
        if (selectedIndex === correctIndex) {
            this.score++;
            document.getElementById('score').textContent = this.score;
        }
        
        document.getElementById('nextButton').disabled = false;
    }

    nextQuestion() {
        this.currentQuestion++;
        this.displayQuestion();
        this.startTimer();
    }

    async endGame() {
        // Clear any remaining timer
        clearInterval(this.timer);
        
        // Send score to backend
        try {
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            
            const response = await fetch('/submit_score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    score: this.score
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                console.log('Score submitted successfully:', result);
                this.showResults();
            } else {
                console.error('Failed to submit score:', result);
                alert('Failed to submit score. Please try again.');
                this.showResults(); // Still show results
            }
        } catch (error) {
            console.error('Error submitting score:', error);
            alert('Network error. Your score may not have been saved.');
            this.showResults(); // Still show results
        }
    }

    async showResults() {
        // Hide quiz, show results
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // Display final score
        document.getElementById('finalScore').textContent = this.score;
        
        // Get and display leaderboard
        await this.updateLeaderboard();
        
        // Set up real-time leaderboard updates
        setInterval(() => {
            this.updateLeaderboard();
        }, 5000); // Update every 5 seconds
    }

    async updateLeaderboard() {
        try {
            const response = await fetch('/get_leaderboard');
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            
            const leaderboardData = await response.json();
            
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = '';
            
            if (leaderboardData.length === 0) {
                leaderboard.innerHTML = '<div class="no-scores">No scores yet. Be the first!</div>';
                return;
            }
            
            leaderboardData.forEach((player, index) => {
                const ranks = ['1st', '2nd', '3rd'];
                const item = document.createElement('div');
                item.className = 'leaderboard-item';
                
                // Highlight current player
                if (player.name === this.playerName) {
                    item.classList.add('current-player');
                }
                
                item.innerHTML = `
                    <span class="rank">${ranks[index]}</span>
                    <span class="name">${player.name}</span>
                    <span class="score">${player.score}/15</span>
                `;
                leaderboard.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = '<div class="error">Error loading leaderboard</div>';
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizGame();
});