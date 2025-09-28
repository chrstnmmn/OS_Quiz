class QuizGame {
	constructor() {
		this.currentQuestion = 0;
		this.score = 0;
		this.playerName = "";
		this.timer = null;
		this.timeLeft = 45;
		// The original questions array stores the correct option index (0, 1, 2, or 3)
		this.originalQuestions = [
			{
				situation:
					"A printer is currently being used by one process, and another process also requests the printer. Since the printer cannot be shared, the second process must wait.",
				question:
					"What deadlock condition does this scenario represent?",
				options: [
					"Hold and Wait",
					"Circular Wait",
					"Mutual Exclusion",
					"No Preemption",
				],
				correctAnswerIndex: 2, // 'Mutual Exclusion'
			},
			{
				situation:
					"A process is holding a memory block while simultaneously requesting access to a CPU cycle. Another process is holding the CPU cycle and waiting for the memory block.",
				question: "Which deadlock condition is demonstrated?",
				options: [
					"Hold and Wait",
					"Circular Wait",
					"No Preemption",
					"Resource Allocation Denial",
				],
				correctAnswerIndex: 0, // 'Hold and Wait'
			},
			{
				situation:
					"A process is holding a disk resource. The operating system tries to reassign the disk to another process, but it cannot because resources cannot be forcibly taken.",
				question:
					"What condition prevents the OS from reallocating the disk?",
				options: [
					"Hold and Wait",
					"Circular Wait",
					"No Preemption",
					"Deadlock Avoidance",
				],
				correctAnswerIndex: 2, // 'No Preemption'
			},
			{
				situation:
					"Process A is holding a printer and waiting for a scanner. Process B is holding the scanner and waiting for a keyboard. Process C is holding the keyboard and waiting for the printer.",
				question: "What type of situation is this?",
				options: [
					"Deadlock Avoidance",
					"Circular Wait",
					"Indirect Prevention",
					"Resource Allocation Denial",
				],
				correctAnswerIndex: 1, // 'Circular Wait'
			},
			{
				situation:
					"The system requires all processes to request their resources at the beginning of execution. If resources aren't available, the process must wait until all requested resources can be allocated simultaneously.",
				question: "What condition is being prevented here?",
				options: [
					"Hold and Wait",
					"Circular Wait",
					"No Preemption",
					"Deadlock Detection",
				],
				correctAnswerIndex: 0, // 'Hold and Wait'
			},
			{
				situation:
					"A banking system checks every resource request with the Banker's Algorithm. It only grants the request if the system will remain in a safe state.",
				question: "Which strategy is being used?",
				options: [
					"Deadlock Prevention",
					"Deadlock Detection",
					"Deadlock Avoidance",
					"Circular Wait",
				],
				correctAnswerIndex: 2, // 'Deadlock Avoidance'
			},
			{
				situation:
					"A system identifies that five processes are deadlocked. The operating system aborts all five processes and restarts them from the beginning.",
				question: "What recovery method is used here?",
				options: [
					"Rollback to checkpoint",
					"Abort all deadlocked process",
					"Preempt resources",
					"Abort Process one by one",
				],
				correctAnswerIndex: 1, // 'Abort all deadlocked process'
			},
			{
				situation:
					"The OS checks a resource request against the Banker's Algorithm and denies it if granting it would lead to an unsafe state.",
				question: "Which strategy is used?",
				options: [
					"Deadlock Prevention",
					"Deadlock Avoidance",
					"Deadlock Detection",
					"Circular Wait",
				],
				correctAnswerIndex: 1, // 'Deadlock Avoidance'
			},
			{
				situation:
					"A new process requests more resources than what is available. The system refuses to start it.",
				question: "What avoidance method is applied?",
				options: [
					"Resource Allocation Denial",
					"Deadlock Detection",
					"Process Initiation Denial",
					"Circular Wait",
				],
				correctAnswerIndex: 2, // 'Process Initiation Denial'
			},
			{
				situation:
					"A process holding a scanner requests a printer. The OS denies the request because granting it might lead to deadlock.",
				question: "Which method is used?",
				options: [
					"Process Initiation Denial",
					"Resource Allocation Denial",
					"Deadlock Detection",
					"Circular Wait",
				],
				correctAnswerIndex: 1, // 'Resource Allocation Denial'
			},
			{
				situation:
					"The OS detects a deadlock among 3 processes and terminates all of them immediately.",
				question: "Which recovery method is applied?",
				options: [
					"Abort all process",
					"Abort process at a time",
					"Resource Preemption",
					"Rollback",
				],
				correctAnswerIndex: 0, // 'Abort all process'
			},
			{
				situation:
					"The system detects deadlock and kills one process at a time until no cycle exists.",
				question: "Which recovery method is this?",
				options: [
					"Abort all process",
					"Resource Preemption",
					"Abort processes one by one",
					"Process Initiation Denial",
				],
				correctAnswerIndex: 2, // 'Abort processes one by one'
			},
			{
				situation:
					"The OS rolls back a process to its last safe checkpoint and restarts it to resolve deadlock.",
				question: "Which recovery method is applied?",
				options: [
					"Resource Preemption",
					"Abort all processes",
					"Rollback",
					"Circular Wait Prevention",
				],
				correctAnswerIndex: 2, // 'Rollback'
			},
			{
				situation:
					"A system detects a deadlock and temporarily takes memory away from one process to give it to another.",
				question: "Which recovery method is this?",
				options: [
					"Rollback",
					"Resource Preemption",
					"Abort processes one by one",
					"Deadlock Avoidance",
				],
				correctAnswerIndex: 1, // 'Resource Preemption'
			},
			{
				situation:
					"The OS must terminate one of the deadlocked processes. It chooses the process with the lowest priority to kill.",
				question: "Which Criterion is being used?",
				options: [
					"Least resources allocated",
					"Most remaining time",
					"lowest priority",
					"Least CPU time consumed",
				],
				correctAnswerIndex: 2, // 'lowest priority'
			},
		];

		// This array will hold the randomized question sequence for the current game
		this.questions = [];
		this.initializeEventListeners();
	}

	/**
	 * Fisher-Yates shuffle algorithm.
	 * @param {Array} array The array to shuffle.
	 */
	static shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	initializeEventListeners() {
		// NOTE: Assuming your HTML uses 'userForm' for the start screen form.
		const userForm = document.getElementById("userForm");
		if (userForm) {
			userForm.addEventListener("submit", (e) => {
				e.preventDefault();
				this.startGame();
			});
		}
	}

	async startGame() {
		const firstName = document.getElementById("firstName").value.trim();
		const lastName = document.getElementById("lastName").value.trim();

		if (!firstName || !lastName) {
			console.error("Please enter both first and last name");
			// NOTE: Using a simple console error instead of alert()
			return;
		}

		this.playerName = `${firstName} ${lastName}`;
		this.score = 0; // Reset score for new game
		this.currentQuestion = 0; // Reset question index

		// **1. Randomize the Question Order**
		this.questions = QuizGame.shuffleArray([...this.originalQuestions]);

		// Hide login, show quiz
		document.getElementById("loginSection").style.display = "none";
		document.getElementById("quizSection").style.display = "block";

		// Hide results section in case this is a restart
		const resultsSection = document.getElementById("resultsSection");
		if (resultsSection) {
			resultsSection.style.display = "none";
		}

		this.displayQuestion();
		this.startTimer();
	}

	displayQuestion() {
		if (this.currentQuestion >= this.questions.length) {
			this.endGame();
			return;
		}

		const question = this.questions[this.currentQuestion];

		// **2. Prepare Options for Shuffling**
		const optionsData = question.options.map((text, index) => ({
			text,
			isCorrect: index === question.correctAnswerIndex,
		}));

		// **3. Randomize the Option Order**
		const randomizedOptions = QuizGame.shuffleArray(optionsData);

		// Store the correct answer's new index (0-3) in the randomized array
		const newCorrectIndex = randomizedOptions.findIndex(
			(opt) => opt.isCorrect
		);

		// Save the currently displayed, randomized options structure and the new correct index
		// on the question object so selectOption can access the current mapping.
		question.randomizedOptions = randomizedOptions;
		question.newCorrectIndex = newCorrectIndex;

		// Update question header with numbering
		document.querySelector(".question-header").textContent = `Question ${
			this.currentQuestion + 1
		}:`;

		// Update situation text
		document.getElementById("situationText").textContent =
			question.situation;

		// Update question text
		document.getElementById("questionText").textContent = question.question;

		// Update options - create fresh buttons with proper structure
		const optionsContainer = document.querySelector(".optionsContainer");
		optionsContainer.innerHTML = "";

		randomizedOptions.forEach((optionData, index) => {
			const button = document.createElement("button");
			button.className = "option-button";

			// The value attribute now holds the *current* index (0, 1, 2, or 3) of the button
			button.setAttribute("value", index);

			// Create SVG container (initially hidden)
			const svgContainer = document.createElement("span");
			svgContainer.className = "option-svg";
			svgContainer.style.display = "none";

			// Add option text
			const optionText = document.createElement("span");
			optionText.className = "option-text";
			optionText.textContent = optionData.text;

			button.appendChild(svgContainer);
			button.appendChild(optionText);

			// Pass the current index in the randomized array
			button.onclick = () => this.selectOption(index, button);

			optionsContainer.appendChild(button);
		});

		// Reset timer
		this.timeLeft = 45;
		document.getElementById("timer").textContent = this.timeLeft;
	}

	startTimer() {
		if (this.timer) {
			clearInterval(this.timer);
		}

		this.timer = setInterval(() => {
			this.timeLeft--;
			document.getElementById("timer").textContent = this.timeLeft;

			if (this.timeLeft <= 0) {
				clearInterval(this.timer);
				this.autoNextQuestion();
			}
		}, 1000);
	}

	autoNextQuestion() {
		// Automatically select an invalid index (-1) to trigger feedback but no score change
		this.selectOption(-1);
	}

	selectOption(selectedIndex, selectedButton = null) {
		// Prevent re-selection
		if (selectedButton && selectedButton.disabled) return;

		// Stop the timer
		clearInterval(this.timer);

		const currentQuestionData = this.questions[this.currentQuestion];
		// Retrieve the correct index from the currently displayed, randomized options
		const correctIndex = currentQuestionData.newCorrectIndex;

		const options = document.querySelectorAll(".option-button");

		// The comparison is now based on the index in the *shuffled* array
		const isCorrect = selectedIndex === correctIndex;

		// Disable all options
		options.forEach((button) => {
			button.disabled = true;
		});

		if (isCorrect) {
			this.score++;
		}

		// ⭐ NEW: Log the current score to the console
		console.log(`✅ Current Score for ${this.playerName}: ${this.score}`);

		// Process all options to display feedback
		options.forEach((button, index) => {
			const svgContainer = button.querySelector(".option-svg");
			svgContainer.style.display = "inline-block";

			if (index === correctIndex) {
				// Correct Answer Styling
				this.createCheckMark(svgContainer, true);
				button.style.backgroundColor = "#ff05b0";
				button.style.color = "#ffffff";
			} else if (index === selectedIndex && selectedIndex !== -1) {
				// Incorrect Selected Answer Styling
				this.createXMark(svgContainer, true);
				button.style.backgroundColor = "rgba(255, 5, 176, 0.50)";
				button.style.color = "#ffffff";
			} else {
				// Default styling for other unselected, incorrect options
				button.style.backgroundColor = "";
				button.style.color = "";
				svgContainer.style.display = "none";
			}
		});

		// Automatic transition to the next question after a brief delay
		setTimeout(() => {
			this.currentQuestion++;
			this.displayQuestion();
			this.startTimer();
		}, 1500); // Wait 1.5 seconds before moving on
	}

	createCheckMark(svgContainer, isSolidColor = false) {
		const fill = isSolidColor ? "#ffffff" : "#000000";

		svgContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                    <path d="M10.6851 0.286987C5.30896 0.286987 0.935059 4.66089 0.935059 10.037C0.935059 15.4131 5.30896 19.787 10.6851 19.787C16.0612 19.787 20.4351 15.4131 20.4351 10.037C20.4351 4.66089 16.0612 0.286987 10.6851 0.286987ZM15.7593 6.76933L9.45928 14.2693C9.39017 14.3516 9.30418 14.4181 9.20713 14.4643C9.11008 14.5105 9.00424 14.5353 8.89678 14.537H8.88412C8.779 14.5369 8.67506 14.5148 8.57904 14.472C8.48303 14.4292 8.39708 14.3667 8.32678 14.2886L5.62678 11.2886C5.55821 11.2158 5.50487 11.1301 5.46989 11.0365C5.43491 10.9428 5.41901 10.8432 5.42311 10.7433C5.42721 10.6434 5.45123 10.5454 5.49376 10.4549C5.53629 10.3645 5.59648 10.2834 5.67078 10.2166C5.74508 10.1497 5.832 10.0984 5.92642 10.0656C6.02084 10.0328 6.12087 10.0192 6.22062 10.0256C6.32037 10.032 6.41783 10.0583 6.50728 10.1029C6.59672 10.1475 6.67634 10.2096 6.74146 10.2854L8.86443 12.6442L14.6108 5.80464C14.7397 5.65562 14.9221 5.5633 15.1185 5.54765C15.3149 5.532 15.5096 5.59427 15.6605 5.721C15.8114 5.84773 15.9063 6.02875 15.9248 6.22492C15.9433 6.42108 15.8838 6.61664 15.7593 6.76933Z" fill="${fill}"/>
                </svg>
            `;
	}

	createXMark(svgContainer, isSolidColor = false) {
		// Fill color for X mark is now white if isSolidColor is true
		const fill = isSolidColor ? "#ffffff" : "#FF05B0";
		svgContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M10.6851 0.741699C5.30896 0.741699 0.935059 5.11561 0.935059 10.4917C0.935059 15.8678 5.30896 20.2417 10.6851 20.2417C16.0612 20.2417 20.4351 15.8678 20.4351 10.4917C20.4351 5.11561 16.0612 0.741699 10.6851 0.741699ZM14.2152 12.9615C14.2878 13.0305 14.3458 13.1133 14.3859 13.205C14.426 13.2967 14.4473 13.3956 14.4486 13.4957C14.4499 13.5958 14.4311 13.6951 14.3934 13.7878C14.3557 13.8806 14.2998 13.9648 14.229 14.0356C14.1582 14.1064 14.0739 14.1623 13.9812 14.2C13.8885 14.2377 13.7891 14.2565 13.689 14.2552C13.5889 14.2539 13.4901 14.2326 13.3984 14.1925C13.3066 14.1525 13.2239 14.0944 13.1549 14.0219L10.6851 11.5525L8.21521 14.0219C8.07342 14.1566 7.88461 14.2306 7.68903 14.2281C7.49346 14.2256 7.30661 14.1468 7.16831 14.0085C7.03001 13.8702 6.9512 13.6833 6.9487 13.4877C6.94619 13.2922 7.02019 13.1033 7.1549 12.9615L9.62428 10.4917L7.1549 8.02186C7.02019 7.88006 6.94619 7.69125 6.9487 7.49568C6.9512 7.3001 7.03001 7.11325 7.16831 6.97495C7.30661 6.83665 7.49346 6.75784 7.68903 6.75534C7.88461 6.75283 8.07342 6.82683 8.21521 6.96154L10.6851 9.43092L13.1549 6.96154C13.2967 6.82683 13.4855 6.75283 13.6811 6.75534C13.8767 6.75784 14.0635 6.83665 14.2018 6.97495C14.3401 7.11325 14.4189 7.3001 14.4214 7.49568C14.4239 7.69125 14.3499 7.88006 14.2152 8.02186L11.7458 10.4917L14.2152 12.9615Z" fill="${fill}"/>
                </svg>
            `;
	}

	// --- NEW METHOD: Toggles visibility from score summary to leaderboard ---
	toggleLeaderboardView() {
		// Hide the score summary container
		const summary = document.getElementById("score-summary-display");
		// Show the full leaderboard container
		const leaderboardDisplay = document.getElementById(
			"leaderboard-display"
		);

		if (summary && leaderboardDisplay) {
			summary.style.display = "none";
			leaderboardDisplay.style.display = "block";

			// Fetch and display the leaderboard data
			this.updateLeaderboard();
		}
	}
	// -----------------------------------------------------------------------

	async endGame() {
		// Clear any remaining timer
		clearInterval(this.timer);

		// Send score to backend (keeping the original user logic, but note these endpoints are simulated)
		try {
			const firstName = document.getElementById("firstName").value.trim();
			const lastName = document.getElementById("lastName").value.trim();

			const response = await fetch("/submit_score", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstName: firstName,
					lastName: lastName,
					score: this.score,
				}),
			});

			const result = await response.json();

			if (response.ok) {
				console.log("Score submitted successfully:", result);
			} else {
				console.error("Failed to submit score:", result);
			}
		} catch (error) {
			console.error(
				"Error submitting score (Simulated endpoint):",
				error
			);
		}

		// Always show results screen whether submission succeeded or failed
		this.showResults();
	}

	// --- REWRITTEN METHOD: Sets up the score summary and hidden leaderboard views ---
	async showResults() {
		const resultsSection = document.getElementById("resultsSection");
		if (!resultsSection) {
			console.error("Results section not found.");
			return;
		}

		// Hide quiz, show results
		document.getElementById("quizSection").style.display = "none";
		resultsSection.style.display = "block";

		// A. Score Summary HTML (The player's score view - initially visible)
		// Tailwind classes added for better styling and responsive layout
		const scoreSummaryHtml = `
            <div id="score-summary-display" class="results-container">
                <div class="title-header text-center text-white mb-6">
                    <h3 class="sub-title-score text-xl font-medium">You got</h3>
                    <h2 class="title-score text-3xl font-black uppercase">A score of</h2>
                </div>

                <div class="final-score text-center text-white p-6 bg-[#2a2a2a] rounded-xl shadow-lg shadow-[rgba(255,5,176,0.3)] my-6">
                    <!-- Dynamically insert the player's actual score -->
                    <h1 class="main-score text-[var(--pink-accent)] font-black text-6xl">${this.score}</h1>
                    <h2 class="over-total-score text-xl font-medium">Out of ${this.questions.length}</h2>
                </div>

                <!-- Leaderboard Button -->
                <button class="leaderboard-button w-full py-3 rounded-lg text-lg font-bold uppercase bg-[var(--pink-accent)] text-white hover:opacity-90 transition duration-150 flex items-center justify-center space-x-2">
                    <h1 class="button-label">Leaderboard</h1>
                    <!-- SVG icon remains the same -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="18" viewBox="0 0 26 18" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.29126 2.45849C0.29126 1.58233 1.00152 0.87207 1.87768 0.87207H24.0875C24.9637 0.87207 25.674 1.58233 25.674 2.45849C25.674 3.33464 24.9637 4.04491 24.0875 4.04491H1.87768C1.00152 4.04491 0.29126 3.33464 0.29126 2.45849Z" fill="white"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.29126 9.33288C0.29126 8.45672 1.00152 7.74646 1.87768 7.74646H24.0875C24.9637 7.74646 25.674 8.45672 25.674 9.33288C25.674 10.209 24.9637 10.9193 24.0875 10.9193H1.87768C1.00152 10.9193 0.29126 10.209 0.29126 9.33288Z" fill="white"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.29126 16.2074C0.29126 15.3312 1.00152 14.621 1.87768 14.621H24.0875C24.9637 14.621 25.674 15.3312 25.674 16.2074C25.674 17.0835 24.9637 17.7938 24.0875 17.7938H1.87768C1.00152 17.7938 0.29126 17.0835 0.29126 16.2074Z" fill="white"/>
                    </svg>
                </button>
            </div>
        `;

		// B. Leaderboard Display HTML (Initially hidden)
		const leaderboardDisplayHtml = `
            <div id="leaderboard-display" style="display: none;"> 
                <div class="leaderboard-section">
                    <div class="leaderboard-container">
                        <h1 class="leaderboard-title">Leaderboard</h1>
                        <h3 class="top-players-title">Top Players:</h3>
                        <div id="leaderboard" class="leaderboard">
                            <!-- Placeholder while loading or no scores -->
                            <div class="no-scores text-center text-white p-4">Loading leaderboard...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

		// Combine and inject both views into the main results section
		resultsSection.innerHTML = scoreSummaryHtml + leaderboardDisplayHtml;

		// --- 2. Attach Event Listener to the newly created button ---
		// Select the button within the new score summary container
		const leaderboardButton = document.querySelector(
			"#score-summary-display .leaderboard-button"
		);
		if (leaderboardButton) {
			leaderboardButton.addEventListener("click", () => {
				this.toggleLeaderboardView();
			});
		}
	}
	// --------------------------------------------------------------------------

	async updateLeaderboard(forceUpdate = false) {
		// Use the ID of the container that holds the list of leaderboard items
		const leaderboard = document.getElementById("leaderboard");
		if (!leaderboard) {
			console.error(
				"Leaderboard container element with ID 'leaderboard' not found."
			);
			return;
		}

		try {
			// NOTE: This endpoint is simulated and will likely fail in this environment.
			const response = await fetch("/get_leaderboard");
			if (!response.ok) {
				throw new Error(
					"Failed to fetch leaderboard (Simulated Endpoint)"
				);
			}

			const leaderboardData = await response.json();

			// Clear existing content
			leaderboard.innerHTML = "";

			if (leaderboardData.length === 0) {
				leaderboard.innerHTML =
					'<div class="no-scores text-center text-white p-4">No scores yet. Be the first!</div>';
				return;
			}

			leaderboardData.forEach((player, index) => {
				const rank = index + 1; // Rank starts at 1

				// --- Name Parsing Logic: Extracts First and Last name to display as 'Lastname, Firstname' ---
				let firstName = "";
				let lastName = "";

				const nameParts = player.name
					? player.name.split(" ")
					: ["Unknown", "Player"];

				if (nameParts.length > 1) {
					// The last name is the final word in the string.
					lastName = nameParts[nameParts.length - 1];
					// The first name(s) are all preceding words.
					firstName = nameParts
						.slice(0, nameParts.length - 1)
						.join(" ");
				} else {
					// If only one word, treat it as the last name.
					lastName = nameParts[0] || "Unknown";
					firstName = "";
				}

				// --- 1. Construct Name HTML ---
				const nameHtml = `
                        <h1 class="name">
                            <span class="lastname">${lastName}</span>, 
                            <span class="firstname">${firstName}</span>
                        </h1>
                    `;

				// --- 2. Construct Score HTML ---
				const scoreHtml = `
                        <h1 class="score">
                            <span class="player-score">${player.score}</span> /${this.questions.length}
                        </h1>
                    `;

				// --- 3. Create and Assemble the Item ---
				const item = document.createElement("div");
				item.className = "leaderboard-item";
				item.setAttribute("rank", rank); // Sets rank="1", rank="2", etc.

				// Highlight current player
				if (player.name === this.playerName) {
					item.classList.add("current-player");
				}

				// Inject the name and score structure
				item.innerHTML = nameHtml + scoreHtml;

				// Add the complete item to the leaderboard container
				leaderboard.appendChild(item);
			});
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			leaderboard.innerHTML =
				'<div class="error text-center text-red-400 p-4">Error loading leaderboard. Check console for details.</div>';
		}
	}
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
	new QuizGame();
});
