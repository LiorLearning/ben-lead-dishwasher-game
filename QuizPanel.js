function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';
var QuizPanel = /*#__PURE__*/ function() {
    "use strict";
    function QuizPanel(game) {
        _class_call_check(this, QuizPanel);
        this.game = game;
        this.visible = false;
        this.width = 400;
        this.height = 300;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2;
        // Quiz content
        this.currentQuiz = null;
        this.selectedAnswer = null;
        this.feedbackMessage = '';
        this.feedbackColor = 'white';
        this.showingFeedback = false;
        this.feedbackTimer = 0;
        // Quiz question bank - educational questions on various topic
        this.quizQuestions = [
            {
                question: "What is 9 × 7?",
                answers: [
                    "56",
                    "63",
                    "72",
                    "81"
                ],
                correctAnswer: 1,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 8 × 7?",
                answers: [
                    "56",
                    "63",
                    "72",
                    "81"
                ],
                correctAnswer: 0,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 56 ÷ 8?",
                answers: [
                    "6",
                    "7",
                    "8",
                    "9"
                ],
                correctAnswer: 1,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 81 ÷ 9?",
                answers: [
                    "7",
                    "8",
                    "9",
                    "10"
                ],
                correctAnswer: 2,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 6 × 8?",
                answers: [
                    "42",
                    "46",
                    "48",
                    "54"
                ],
                correctAnswer: 2,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 72 ÷ 8?",
                answers: [
                    "9",
                    "8",
                    "7",
                    "6"
                ],
                correctAnswer: 0,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 7 × 6?",
                answers: [
                    "42",
                    "49",
                    "36",
                    "48"
                ],
                correctAnswer: 0,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 63 ÷ 7?",
                answers: [
                    "7",
                    "8",
                    "9",
                    "10"
                ],
                correctAnswer: 2,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 9 × 6?",
                answers: [
                    "54",
                    "56",
                    "63",
                    "64"
                ],
                correctAnswer: 0,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            },
            {
                question: "What is 48 ÷ 6?",
                answers: [
                    "6",
                    "7",
                    "8",
                    "9"
                ],
                correctAnswer: 2,
                reward: {
                    type: "goldNuggets",
                    amount: 2
                }
            }
        ];
        this.setupListeners();
    }
    _create_class(QuizPanel, [
        {
            key: "setupListeners",
            value: function setupListeners() {
                // Mouse click handler for answering questions
                this.clickHandler = this.handleClick.bind(this);
                this.game.canvas.addEventListener('click', this.clickHandler);
                // Touch handler for mobile
                this.touchHandler = this.handleTouch.bind(this);
                this.game.canvas.addEventListener('touchstart', this.touchHandler);
            }
        },
        {
            key: "removeListeners",
            value: function removeListeners() {
                this.game.canvas.removeEventListener('click', this.clickHandler);
                this.game.canvas.removeEventListener('touchstart', this.touchHandler);
            }
        },
        {
            key: "handleClick",
            value: function handleClick(event) {
                if (!this.visible) return;
                var rect = this.game.canvas.getBoundingClientRect();
                var mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
                var mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
                // Check if an answer was clicked
                if (this.currentQuiz) {
                    var answers = this.currentQuiz.answers;
                    var buttonHeight = 40;
                    var buttonSpacing = 15;
                    var startY = this.y + 120;
                    for(var i = 0; i < answers.length; i++){
                        var buttonY = startY + i * (buttonHeight + buttonSpacing);
                        if (mouseX >= this.x + 50 && mouseX <= this.x + this.width - 50 && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
                            this.selectedAnswer = i;
                            this.checkAnswer();
                            break;
                        }
                    }
                }
            }
        },
        {
            key: "handleTouch",
            value: function handleTouch(event) {
                if (!this.visible) return;
                event.preventDefault();
                var rect = this.game.canvas.getBoundingClientRect();
                var touch = event.touches[0];
                var touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
                var touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
                // Use the same logic as click handler
                if (this.currentQuiz) {
                    var answers = this.currentQuiz.answers;
                    var buttonHeight = 40;
                    var buttonSpacing = 15;
                    var startY = this.y + 120;
                    for(var i = 0; i < answers.length; i++){
                        var buttonY = startY + i * (buttonHeight + buttonSpacing);
                        if (touchX >= this.x + 50 && touchX <= this.x + this.width - 50 && touchY >= buttonY && touchY <= buttonY + buttonHeight) {
                            this.selectedAnswer = i;
                            this.checkAnswer();
                            break;
                        }
                    }
                }
            }
        },
        {
            key: "show",
            value: function show(miningSpot) {
                this.visible = true;
                this.selectRandomQuiz();
                this.selectedAnswer = null;
                this.showingFeedback = false;
                this.currentMiningSpot = miningSpot; // Store reference to the mining spot
            }
        },
        {
            key: "hide",
            value: function hide() {
                this.visible = false;
                this.currentQuiz = null;
                this.selectedAnswer = null;
            }
        },
        {
            key: "selectRandomQuiz",
            value: function selectRandomQuiz() {
                // Select questions based on mining spot type if available
                if (this.currentMiningSpot) {
                    // Filter questions related to the mining spot resource type
                    var resourceType = this.currentMiningSpot.type;
                    var typeQuestions = this.quizQuestions.filter(function(q) {
                        return q.reward.type === resourceType;
                    });
                    if (typeQuestions.length > 0) {
                        // Choose from resource-specific questions
                        var randomIndex = Math.floor(Math.random() * typeQuestions.length);
                        this.currentQuiz = typeQuestions[randomIndex];
                        return;
                    }
                }
                // Fallback to random question if no matching questions or no mining spot
                var randomIndex1 = Math.floor(Math.random() * this.quizQuestions.length);
                this.currentQuiz = this.quizQuestions[randomIndex1];
            }
        },
        {
            key: "checkAnswer",
            value: function checkAnswer() {
                var _this = this;
                if (this.selectedAnswer === this.currentQuiz.correctAnswer) {
                    // Correct answer
                    this.feedbackMessage = 'Correct! Gold nuggets will appear.';
                    this.feedbackColor = '#4CAF50'; // Green
                    // If this quiz is from a mining spot, spawn the resource there
                    if (this.currentMiningSpot) {
                        this.spawnResourceAtMiningSpot();
                    } else {
                        // Fallback for quizzes not triggered by mining
                        this.game.resources[this.currentQuiz.reward.type] += this.currentQuiz.reward.amount;
                        this.game.craftingPanel.updateResources(this.game.resources);
                        // Add floating text for direct rewards
                        var playerX = this.game.player.x;
                        var playerY = this.game.player.y;
                        this.game.floatingTexts.push(new this.game.floatingTextClass("+".concat(this.currentQuiz.reward.amount, " ").concat(this.currentQuiz.reward.type), playerX, playerY - 20));
                    }
                } else {
                    // Wrong answer
                    this.feedbackMessage = 'Incorrect! Try again.';
                    this.feedbackColor = '#F44336'; // Red
                }
                // Show feedback
                this.showingFeedback = true;
                this.feedbackTimer = 2000; // 2 seconds
                // After feedback, close quiz and return to game
                setTimeout(function() {
                    _this.hide();
                    _this.game.gameState = GAME_STATE.PLAYING;
                }, this.feedbackTimer);
            }
        },
        {
            key: "spawnResourceAtMiningSpot",
            value: function spawnResourceAtMiningSpot() {
                if (!this.currentMiningSpot) return;
                // Create a new collectable item at the mining spot location
                var item = {
                    type: this.currentMiningSpot.type,
                    x: this.currentMiningSpot.x,
                    y: this.currentMiningSpot.y - 30,
                    width: 30,
                    height: 30,
                    id: "".concat(this.currentMiningSpot.type, "-").concat(Date.now())
                };
                // Add the item to the world
                this.game.world.items.push(item);
                // Mark mining spot as having spawned a resource
                this.currentMiningSpot.resourceSpawned = true;
                // Add floating text indicating resource spawned
                this.game.floatingTexts.push(new this.game.floatingTextClass("Gold nuggets appeared!", this.currentMiningSpot.x, this.currentMiningSpot.y - 50));
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                if (this.showingFeedback) {
                    this.feedbackTimer -= deltaTime;
                    if (this.feedbackTimer <= 0) {
                        this.showingFeedback = false;
                    }
                }
            }
        },
        {
            key: "render",
            value: function render(ctx) {
                if (!this.visible) return;
                // Semi-transparent overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                // Quiz panel background
                ctx.fillStyle = '#34495e'; // Dark blue
                ctx.fillRect(this.x, this.y, this.width, this.height);
                // Panel border (Minecraft style)
                var borderWidth = 4;
                ctx.fillStyle = '#8B4513'; // Wood color
                ctx.fillRect(this.x - borderWidth, this.y - borderWidth, this.width + borderWidth * 2, borderWidth); // Top
                ctx.fillRect(this.x - borderWidth, this.y + this.height, this.width + borderWidth * 2, borderWidth); // Bottom
                ctx.fillRect(this.x - borderWidth, this.y, borderWidth, this.height); // Left
                ctx.fillRect(this.x + this.width, this.y, borderWidth, this.height); // Right
                // Pixelated corners (Minecraft style)
                ctx.fillRect(this.x - borderWidth * 2, this.y - borderWidth * 2, borderWidth, borderWidth); // Top-left
                ctx.fillRect(this.x + this.width + borderWidth, this.y - borderWidth * 2, borderWidth, borderWidth); // Top-right
                ctx.fillRect(this.x - borderWidth * 2, this.y + this.height + borderWidth, borderWidth, borderWidth); // Bottom-left
                ctx.fillRect(this.x + this.width + borderWidth, this.y + this.height + borderWidth, borderWidth, borderWidth); // Bottom-right
                if (this.currentQuiz) {
                    // Quiz title
                    ctx.fillStyle = 'white';
                    ctx.font = '24px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('Question', this.x + this.width / 2, this.y + 30);
                    // Question text
                    ctx.fillStyle = 'white';
                    ctx.font = '18px Arial';
                    // Handle long questions with wrapping
                    this.wrapText(ctx, this.currentQuiz.question, this.x + this.width / 2, this.y + 70, this.width - 40, 25);
                    // Answer options
                    var answers = this.currentQuiz.answers;
                    var buttonHeight = 40;
                    var buttonSpacing = 15;
                    var startY = this.y + 120;
                    for(var i = 0; i < answers.length; i++){
                        var buttonY = startY + i * (buttonHeight + buttonSpacing);
                        // Button background
                        ctx.fillStyle = this.selectedAnswer === i ? '#3498db' : '#2980b9';
                        ctx.fillRect(this.x + 50, buttonY, this.width - 100, buttonHeight);
                        // Button border
                        ctx.strokeStyle = '#1f618d';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(this.x + 50, buttonY, this.width - 100, buttonHeight);
                        // Answer text
                        ctx.fillStyle = 'white';
                        ctx.font = '16px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillText("".concat(i + 1, ". ").concat(answers[i]), this.x + 70, buttonY + buttonHeight / 2 + 5);
                    }
                    // Feedback message
                    if (this.showingFeedback) {
                        ctx.fillStyle = this.feedbackColor;
                        ctx.font = '20px Arial';
                        ctx.textAlign = 'center';
                        ctx.fillText(this.feedbackMessage, this.x + this.width / 2, startY + answers.length * (buttonHeight + buttonSpacing) + 20);
                    }
                }
            }
        },
        {
            // Helper function to wrap text
            key: "wrapText",
            value: function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
                var words = text.split(' ');
                var line = '';
                ctx.textAlign = 'center';
                for(var n = 0; n < words.length; n++){
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
            }
        }
    ]);
    return QuizPanel;
}();
export { QuizPanel as default };
