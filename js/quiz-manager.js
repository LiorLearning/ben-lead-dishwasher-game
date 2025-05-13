// quiz-manager.js - Handles quiz functionality for fire-orb collection

class QuizManager {
    constructor() {
        this.quizPanel = document.getElementById('quiz-panel-root');
        this.questionText = this.quizPanel.querySelector('.question-text');
        this.answerButtons = this.quizPanel.querySelectorAll('.answer-btn');
        this.quizFeedback = this.quizPanel.querySelector('.quiz-feedback');
        
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.questions = [];
        this.earnedFireballs = 0;
        
        // Add click event listeners to answer buttons
        this.answerButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Play button sound
                if (window.game && window.game.audioManager) {
                    window.game.audioManager.playButtonSound();
                }
                this.handleAnswer(button);
            });
        });
    }
    
    generateQuestions() {
        // Generate 3 grade 4 level math questions
        this.questions = [];
        for (let i = 0; i < 3; i++) {
            const question = this.generateQuestion();
            this.questions.push(question);
        }
    }
    
    generateQuestion() {
        const operations = ['×', '÷'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch (operation) {
            case '×':
                // For multiplication: 1 digit x 1 digit or 2 digit x 1 digit (under 20)
                if (Math.random() > 0.5) {
                    // 1 digit x 1 digit
                    num1 = Math.floor(Math.random() * 9) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
                } else {
                    // 2 digit x 1 digit (under 20)
                    num1 = Math.floor(Math.random() * 19) + 1;
                    num2 = Math.floor(Math.random() * 9) + 1;
                }
                answer = num1 * num2;
                break;
            case '÷':
                // For division: 2 digit by 1 digit
                num2 = Math.floor(Math.random() * 9) + 1; // 1 digit divisor
                answer = Math.floor(Math.random() * 9) + 1; // 1 digit quotient
                num1 = num2 * answer; // Calculate dividend to ensure clean division
                break;
        }
        
        // Generate wrong answers
        const answers = [answer];
        while (answers.length < 4) {
            let wrongAnswer;
            if (operation === '×') {
                // For multiplication, generate wrong answers close to the correct answer
                wrongAnswer = answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
            } else {
                // For division, generate wrong answers that are also valid quotients
                wrongAnswer = Math.floor(Math.random() * 9) + 1;
                if (wrongAnswer === answer) {
                    wrongAnswer = (wrongAnswer % 9) + 1; // Ensure different from correct answer
                }
            }
            if (!answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        return {
            text: `${num1} ${operation} ${num2} = ?`,
            answers: answers,
            correctAnswer: answer
        };
    }
    
    showQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.completeQuiz();
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        this.questionText.textContent = question.text;
        
        // Update answer buttons
        this.answerButtons.forEach((button, index) => {
            button.textContent = question.answers[index];
            button.classList.remove('correct', 'wrong');
            button.disabled = false;
        });
        
        this.quizFeedback.textContent = '';
    }
    
    handleAnswer(button) {
        const selectedAnswer = parseInt(button.textContent);
        const question = this.questions[this.currentQuestion];
        
        // Check if question exists
        if (!question) {
            console.error('No question found for current index:', this.currentQuestion);
            return;
        }
        
        // Disable all buttons
        this.answerButtons.forEach(btn => btn.disabled = true);
        
        // Mark correct and wrong answers
        this.answerButtons.forEach(btn => {
            const answer = parseInt(btn.textContent);
            if (answer === question.correctAnswer) {
                btn.classList.add('correct');
            } else if (answer === selectedAnswer && answer !== question.correctAnswer) {
                btn.classList.add('wrong');
            }
        });
        
        // Play appropriate sound
        if (window.game && window.game.audioManager) {
            if (selectedAnswer === question.correctAnswer) {
                window.game.audioManager.playAnswerSound();
            } else {
                window.game.audioManager.playWrongSound();
            }
        }
        
        // Update score and show feedback
        if (selectedAnswer === question.correctAnswer) {
            this.correctAnswers++;
            this.quizFeedback.textContent = 'Correct!';
            this.quizFeedback.style.color = '#32CD32';
        } else {
            this.quizFeedback.textContent = 'Wrong!';
            this.quizFeedback.style.color = '#FF0000';
        }
        
        // Move to next question after a shorter delay
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 800); // Reduced from 1500ms to 800ms
    }
    
    showQuiz() {
        // Release pointer lock before showing quiz
        document.exitPointerLock();
        
        this.generateQuestions();
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.quizPanel.style.display = 'flex';
        // Add trident quiz theme class
        this.quizPanel.querySelector('.quiz-container').classList.add('trident-quiz');
        this.showQuestion();
    }
    
    hideQuiz() {
        this.quizPanel.style.display = 'none';
        // Remove trident quiz theme class
        this.quizPanel.querySelector('.quiz-container').classList.remove('trident-quiz');
    }
    
    completeQuiz() {
        // Calculate earned fireballs (2 per correct answer)
        this.earnedFireballs = this.correctAnswers * 2;
        
        // Show completion message
        this.quizFeedback.textContent = `You earned ${this.earnedFireballs} tridents!`;
        this.quizFeedback.style.color = '#FF6600'; // Updated to match trident theme color
        
        // Hide quiz panel after a shorter delay
        setTimeout(() => {
            this.hideQuiz();
            
            // Add earned tridents to ammo
            if (window.game && window.game.uiManager) {
                const currentAmmo = window.game.uiManager.fireballAmmo;
                window.game.uiManager.updateFireballAmmo(currentAmmo + this.earnedFireballs);
            }
            
            // Resume game and request pointer lock immediately
            if (window.game) {
                window.game.unfreezeGameLoop();
                document.body.requestPointerLock();
            }
        }, 1000); // Reduced from 2000ms to 1000ms
    }
} 