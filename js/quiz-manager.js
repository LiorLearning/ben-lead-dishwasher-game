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
            button.addEventListener('click', () => this.handleAnswer(button));
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
        const operations = ['+', '-', '×'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * 20) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 20) + 1;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                break;
            case '×':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                break;
        }
        
        // Generate wrong answers
        const answers = [answer];
        while (answers.length < 4) {
            const wrongAnswer = answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
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
        
        
        // Update score and show feedback
        if (selectedAnswer === question.correctAnswer) {
            this.correctAnswers++;
            this.quizFeedback.textContent = 'Correct!';
            this.quizFeedback.style.color = '#32CD32';
            // Play answer sound
            if (window.game && window.game.audioManager) {
                window.game.audioManager.playSound('collect');
            }
        } else {
            this.quizFeedback.textContent = 'Wrong!';
            this.quizFeedback.style.color = '#FF0000';
        }
        
        // Move to next question after a delay
        setTimeout(() => {
            this.currentQuestion++;
            this.showQuestion();
        }, 600);
    }
    
    showQuiz() {
        // Release pointer lock before showing quiz
        document.exitPointerLock();
        
        this.generateQuestions();
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.quizPanel.style.display = 'flex';
        this.showQuestion();
    }
    
    hideQuiz() {
        this.quizPanel.style.display = 'none';
    }
    
    completeQuiz() {
        // Calculate earned fireballs (2 per correct answer)
        this.earnedFireballs = this.correctAnswers * 2;
        
        // Show completion message
        this.quizFeedback.textContent = `You earned ${this.earnedFireballs} fireballs!`;
        this.quizFeedback.style.color = '#FFD700';
        
        // Hide quiz panel after delay
        setTimeout(() => {
            this.hideQuiz();
            
            // Add earned fireballs to ammo
            if (window.game && window.game.uiManager) {
                const currentAmmo = window.game.uiManager.fireballAmmo;
                window.game.uiManager.updateFireballAmmo(currentAmmo + this.earnedFireballs);
            }
            
            // Resume game and request pointer lock
            if (window.game) {
                window.game.unfreezeGameLoop();
                // Request pointer lock after a short delay to ensure the quiz panel is fully hidden
                setTimeout(() => {
                    document.body.requestPointerLock();
                }, 100);
            }
        }, 2000);
    }
} 