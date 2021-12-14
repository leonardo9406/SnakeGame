class SnakeGame {
    constructor() {
        this.initialize();
    }

    initialize() {
        this.game = {
            size: 20,
            points: 1,
            score: 0,
            audios: {
                lose: new Audio()
            },
            lockKey: false
        };

        this.snake = {
            position: null,
            body: [
                {
                    x: 280,
                    y: 180,
                }
            ]
        };

        this.food = {
            x: 120,
            y: 140,
            ico: new Image(),
            audio: new Audio()
        };

        this.position = {
            up: 0,
            right: 1,
            down: 2,
            left: 3
        };

        this.gameover = false;

        // canvas
        this.canvas = document.getElementById('game');
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.focus();

        // contexto
        this.context = this.canvas.getContext('2d');

        // puntuación
        this.score = document.getElementById('score');

        // imagenes
        this.food.ico.src = 'img/food.png';

        // audios
        this.food.audio.src = 'img/bite.mp3';
        this.game.audios.lose.src = 'img/lose.mp3';
    }

    start() {
        let self = this;

        // habilitar controles
        controls();
        // juego
        let interval = setInterval(draw, 100);
        function draw() {
            // tecla de desbloqueo
            setTimeout(() => {
                self.game.lockKey = false;
            }, 100);

            // limpiar
            self.context.clearRect(0, 0, self.canvas.width, self.canvas.height);

            if (self.snake.body.length > 1) {
                self.snake.body.pop();
                self.snake.body.unshift({
                    x: self.snake.body[0].x,
                    y: self.snake.body[0].y
                });
            }

            // comer
            if (self.food.x === self.snake.body[0].x && self.food.y === self.snake.body[0].y) {
                self.food.x = Math.floor(Math.random() * (self.canvas.width / self.game.size)) * self.game.size;
                self.food.y = Math.floor(Math.random() * (self.canvas.height / self.game.size)) * self.game.size;

                self.snake.body.push({
                    x: self.snake.body[self.snake.body.length - 1].x,
                    y: self.snake.body[self.snake.body.length - 1].y
                });

                self.game.score++;
                self.score.innerText = (self.game.score * self.game.points).toLocaleString('es-pe');
                self.food.audio.play();
            }

            // pinta la comida en la posición
            self.context.drawImage(self.food.ico, self.food.x, self.food.y, self.game.size, self.game.size);

            // posición de la serpiente
            if (self.snake.position === self.position.up) {
                self.snake.body[0].y += -self.game.size;
            }

            if (self.snake.position === self.position.down) {
                self.snake.body[0].y += self.game.size;
            }

            if (self.snake.position === self.position.right) {
                self.snake.body[0].x += self.game.size;
            }

            if (self.snake.position === self.position.left) {
                self.snake.body[0].x += -self.game.size;
            }

            //pinta la sepiente en la posición
            self.snake.body.forEach((pos, index) => {
                // cabeza
                if (index === 0) {
                    self.context.fillStyle = "green";
                } else {
                    self.context.fillStyle = "black";
                }

                self.context.fillRect(pos.x, pos.y, self.game.size, self.game.size);
            });

            // choque
            colissions();
        }

        function controls() {
            document.addEventListener('keyup', (e) => {
                if (self.game.lockKey) {
                    return;
                }

                if (e.keyCode === 38 && self.snake.position !== self.position.down) {
                    self.snake.position = self.position.up;
                    self.game.lockKey = true;
                }

                if (e.keyCode === 40 && self.snake.position !== self.position.up) {
                    self.snake.position = self.position.down;
                    self.game.lockKey = true;
                }

                if (e.keyCode === 39 && self.snake.position !== self.position.left) {
                    self.snake.position = self.position.right;
                    self.game.lockKey = true;
                }

                if (e.keyCode === 37 && self.snake.position !== self.position.right) {
                    self.snake.position = self.position.left;
                    self.game.lockKey = true;
                }
            });
        }

        function colissions() {
            let snakeHead = self.snake.body[0];

            // bordes
            self.gameover = (
                (snakeHead.y < 0 || snakeHead.y >= self.canvas.height)
                || (snakeHead.x < 0 || snakeHead.x >= self.canvas.width)
            )
            
            if (self.snake.body.length > 1) {
                self.snake.body.forEach((body, index) => {
                    if (index > 0 && (body.y === snakeHead.y && body.x === snakeHead.x)) {
                        self.gameover = true;
                    }
                });
            }
            if (self.gameover) {
                clearInterval(interval);

                self.context.font = "30px Arial";
                self.context.fillStyle = "black";
                self.context.fillText("Game Over", self.canvas.height / 2 + self.game.size, self.canvas.height / 2);
                self.game.audios.lose.play();
            }
        }
    }
}

function Update(){
    location.reload(true);
}