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
                
                // Semi-transparent overlay with more opacity for better focus
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                
                // Quiz panel background with gradient for depth
                const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
                gradient.addColorStop(0, '#2c3e50');  // Darker top
                gradient.addColorStop(1, '#34495e');  // Lighter bottom
                ctx.fillStyle = gradient;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                
                // Panel border with better texture appearance
                const borderWidth = 6;  // Slightly thicker border
                ctx.fillStyle = '#8B4513'; // Wood color
                
                // Draw border with slight texture variation
                // Top border
                for (let x = this.x - borderWidth; x < this.x + this.width + borderWidth; x += 8) {
                    const variation = Math.random() * 3 - 1;
                    ctx.fillRect(x, this.y - borderWidth, 8, borderWidth + variation);
                }
                
                // Bottom border
                for (let x = this.x - borderWidth; x < this.x + this.width + borderWidth; x += 8) {
                    const variation = Math.random() * 3 - 1;
                    ctx.fillRect(x, this.y + this.height, 8, borderWidth + variation);
                }
                
                // Left border
                for (let y = this.y; y < this.y + this.height; y += 8) {
                    const variation = Math.random() * 3 - 1;
                    ctx.fillRect(this.x - borderWidth, y, borderWidth + variation, 8);
                }
                
                // Right border
                for (let y = this.y; y < this.y + this.height; y += 8) {
                    const variation = Math.random() * 3 - 1;
                    ctx.fillRect(this.x + this.width, y, borderWidth + variation, 8);
                }
                
                // Enhanced pixelated corners (Minecraft style)
                ctx.fillRect(this.x - borderWidth * 2, this.y - borderWidth * 2, borderWidth, borderWidth); // Top-left
                ctx.fillRect(this.x + this.width + borderWidth, this.y - borderWidth * 2, borderWidth, borderWidth); // Top-right
                ctx.fillRect(this.x - borderWidth * 2, this.y + this.height + borderWidth, borderWidth, borderWidth); // Bottom-left
                ctx.fillRect(this.x + this.width + borderWidth, this.y + this.height + borderWidth, borderWidth, borderWidth); // Bottom-right
                
                if (this.currentQuiz) {
                    // Quiz title with text shadow for better visibility
                    ctx.fillStyle = '#F8F8F8';
                    ctx.font = 'bold 28px Arial';
                    ctx.textAlign = 'center';
                    
                    // Add text shadow
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                    ctx.shadowBlur = 5;
                    ctx.shadowOffsetX = 2;
                    ctx.shadowOffsetY = 2;
                    ctx.fillText('Question', this.x + this.width / 2, this.y + 35);
                    
                    // Reset shadow
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    
                    // Question text with better contrast
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 20px Arial';
                    
                    // Add subtle highlight to question area
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    const questionAreaHeight = 60;
                    ctx.fillRect(this.x + 20, this.y + 45, this.width - 40, questionAreaHeight);
                    
                    // Question text
                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = 'bold 20px Arial';
                    // Handle long questions with wrapping
                    this.wrapText(ctx, this.currentQuiz.question, this.x + this.width / 2, this.y + 70, this.width - 40, 25);
                    
                    // Answer options with improved buttons and hover effect
                    const answers = this.currentQuiz.answers;
                    const buttonHeight = 45; // Taller buttons
                    const buttonSpacing = 12;
                    const startY = this.y + 120;
                    
                    for (let i = 0; i < answers.length; i++) {
                        const buttonY = startY + i * (buttonHeight + buttonSpacing);
                        
                        // Button background with gradient
                        const buttonGradient = ctx.createLinearGradient(
                            this.x + 50, buttonY, 
                            this.x + 50, buttonY + buttonHeight
                        );
                        
                        if (this.selectedAnswer === i) {
                            // Selected button
                            buttonGradient.addColorStop(0, '#3498db');
                            buttonGradient.addColorStop(1, '#2980b9');
                        } else {
                            // Normal button
                            buttonGradient.addColorStop(0, '#2980b9');
                            buttonGradient.addColorStop(1, '#1f618d');
                        }
                        
                        ctx.fillStyle = buttonGradient;
                        
                        // Button with rounded corners
                        const cornerRadius = 5;
                        ctx.beginPath();
                        ctx.moveTo(this.x + 50 + cornerRadius, buttonY);
                        ctx.lineTo(this.x + this.width - 50 - cornerRadius, buttonY);
                        ctx.quadraticCurveTo(this.x + this.width - 50, buttonY, this.x + this.width - 50, buttonY + cornerRadius);
                        ctx.lineTo(this.x + this.width - 50, buttonY + buttonHeight - cornerRadius);
                        ctx.quadraticCurveTo(this.x + this.width - 50, buttonY + buttonHeight, this.x + this.width - 50 - cornerRadius, buttonY + buttonHeight);
                        ctx.lineTo(this.x + 50 + cornerRadius, buttonY + buttonHeight);
                        ctx.quadraticCurveTo(this.x + 50, buttonY + buttonHeight, this.x + 50, buttonY + buttonHeight - cornerRadius);
                        ctx.lineTo(this.x + 50, buttonY + cornerRadius);
                        ctx.quadraticCurveTo(this.x + 50, buttonY, this.x + 50 + cornerRadius, buttonY);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Button glow effect when selected
                        if (this.selectedAnswer === i) {
                            ctx.shadowColor = 'rgba(52, 152, 219, 0.7)';
                            ctx.shadowBlur = 10;
                            ctx.strokeStyle = '#5DADE2';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            ctx.shadowColor = 'transparent';
                            ctx.shadowBlur = 0;
                        } else {
                            // Button border
                            ctx.strokeStyle = '#1f618d';
                            ctx.lineWidth = 2;
                            ctx.stroke();
                        }
                        
                        // Answer text
                        ctx.fillStyle = '#FFFFFF';
                        ctx.font = '18px Arial';
                        ctx.textAlign = 'left';
                        ctx.fillText(`${i + 1}. ${answers[i]}`, this.x + 70, buttonY + buttonHeight / 2 + 6);
                    }
                    
                    // Feedback message with animation
                    if (this.showingFeedback) {
                        // Calculate animation progress (0 to 1)
                        const maxFeedbackTime = 2000;
                        const animationProgress = 1 - (this.feedbackTimer / maxFeedbackTime);
                        
                        // Apply scale and opacity based on animation
                        const scale = 0.8 + (0.2 * animationProgress);
                        const opacity = Math.min(1, animationProgress * 3);
                        
                        ctx.save();
                        ctx.globalAlpha = opacity;
                        
                        // Center position
                        const centerX = this.x + this.width / 2;
                        const centerY = startY + answers.length * (buttonHeight + buttonSpacing) + 25;
                        
                        // Create feedback message background
                        ctx.fillStyle = this.feedbackColor === '#4CAF50' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)';
                        const msgWidth = 300;
                        const msgHeight = 40;
                        
                        // Draw rounded rectangle for feedback message
                        ctx.beginPath();
                        ctx.moveTo(centerX - msgWidth/2 + 10, centerY - msgHeight/2);
                        ctx.lineTo(centerX + msgWidth/2 - 10, centerY - msgHeight/2);
                        ctx.quadraticCurveTo(centerX + msgWidth/2, centerY - msgHeight/2, centerX + msgWidth/2, centerY - msgHeight/2 + 10);
                        ctx.lineTo(centerX + msgWidth/2, centerY + msgHeight/2 - 10);
                        ctx.quadraticCurveTo(centerX + msgWidth/2, centerY + msgHeight/2, centerX + msgWidth/2 - 10, centerY + msgHeight/2);
                        ctx.lineTo(centerX - msgWidth/2 + 10, centerY + msgHeight/2);
                        ctx.quadraticCurveTo(centerX - msgWidth/2, centerY + msgHeight/2, centerX - msgWidth/2, centerY + msgHeight/2 - 10);
                        ctx.lineTo(centerX - msgWidth/2, centerY - msgHeight/2 + 10);
                        ctx.quadraticCurveTo(centerX - msgWidth/2, centerY - msgHeight/2, centerX - msgWidth/2 + 10, centerY - msgHeight/2);
                        ctx.closePath();
                        ctx.fill();
                        
                        // Feedback message text with scaling
                        ctx.translate(centerX, centerY);
                        ctx.scale(scale, scale);
                        
                        // Draw the message text
                        ctx.fillStyle = this.feedbackColor;
                        ctx.font = 'bold 22px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(this.feedbackMessage, 0, 0);
                        
                        ctx.restore();
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
