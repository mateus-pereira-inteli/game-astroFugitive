class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        //Carregar componentes
        this.load.image("plataform", "../assets/plataforma2.png")
        this.load.spritesheet('astronauta', '../assets/astronauta-spritesheet.png', { frameWidth: 55, frameHeight: 81 });
        this.load.spritesheet('alien', '../assets/alien-spritesheet.png', { frameWidth: 55, frameHeight: 81 });
        this.load.html('gameOver', '../components/gameOver.html');
        this.load.html('gameEnd', '../components/gameEnd.html');
        this.load.image("star", "../assets/star.png")
    }

    create() {

        //Definição dos atributos do game
        this.gameStatus = true; //variavel inicial do status do game
        this.score = 0; //varivel inicial score
        this.dificulty = 0; //variavel inicial dificuldade

        //Adição do background
        this.add.image(innerWidth, innerHeight, 'bg');

        //Definição do grupo das plataformas
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(innerWidth / 2, innerHeight - 32, 'plataform').setScale(5, 2).refreshBody();
        this.platforms.create(innerWidth / 2, (innerHeight / 2), 'plataform');

        //Adição do Player
        this.player = this.physics.add.sprite(innerWidth / 2, (innerHeight / 2) - 100, 'astronauta').setBounce(0.2).setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platforms);

        //Adição do Alien
        this.enemy = this.physics.add.sprite(0, innerHeight - 120, 'alien').setBounce(0.2).setCollideWorldBounds(true);
        this.physics.add.collider(this.enemy, this.platforms);

        this.scoreText = this.add.text((innerWidth / 2) - 125, 16, 'Estrelas: 0', { fontSize: '40px', fill: '#FFF', fontStyle: 'bold' });

        //Animações do Player e do Alien
        this.anims.create({
            key: 'leftAstro',
            frames: this.anims.generateFrameNumbers('astronauta', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turnAstro',
            frames: [{ key: 'astronauta', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'rightAstro',
            frames: this.anims.generateFrameNumbers('astronauta', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'leftAlien',
            frames: this.anims.generateFrameNumbers('alien', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turnAlien',
            frames: [{ key: 'alien', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'rightAlien',
            frames: this.anims.generateFrameNumbers('alien', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //Controle do game
        this.cursors = this.input.keyboard.createCursorKeys();

        //Sobreposição do player no alien
        this.physics.add.overlap(this.player, this.enemy, this.gameOver, null, this);

        //Stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 9, //Adiciona as estrelas
            setXY: { x: (innerWidth / 2) - 400, y: innerHeight - 100, stepX: 80 } //posicionamento w,y e espaçamento dos elementos
        });

        this.stars.children.iterate(function(child) { //interação com os elementos filhos da variavel stars
            //  definir a elasticidade do componente no eixo Y
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.stars, this.platforms); //Colisão das estrelas no grupo estático das plataformas
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this); //Sobreposição do player na estrela
    }
    update() {
        if (this.gameStatus) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);

                this.player.anims.play('leftAstro', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);

                this.player.anims.play('rightAstro', true);
            } else {
                this.player.setVelocityX(0);

                this.player.anims.play('turnAstro');
            }

            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }


            //selecionar velocidade do alien com base na dificuldade
            switch (this.dificulty) {
                case 0:
                    this.alienVelo = 60;
                    break;
                case 1:
                    this.alienVelo = 80;
                    break;
                case 2:
                    this.alienVelo = 100;
                    break;
            }

            //movimentação alien
            if (this.enemy.x + (this.enemy.width / 2) < this.player.x) {
                // faz ele ir para direita
                this.enemy.setVelocityX(this.alienVelo);
                this.enemy.anims.play('rightAlien');

            } else if (this.enemy.x - (this.enemy.width / 2) > this.player.x) {
                // Senão, faz ele ir para esquerda
                this.enemy.setVelocityX(-this.alienVelo);
                this.enemy.anims.play('leftAlien');

            } else {
                this.enemy.setVelocityX(0);
                this.enemy.anims.play('turnAlien');
            }
        }
    }

    gameOver() {
        this.gameStatus = false;
        this.player.destroy()

        this.enemy.setVelocityX(0);
        this.enemy.anims.play('turnAlien');

        this.add.dom(innerWidth / 2, innerHeight / 2).createFromCache('gameOver');
        document.getElementById("countStars").innerHTML = this.score; //atualiza o placar da tela de game over

        var replayGame = document.getElementById("replayGame");
        replayGame.addEventListener("click", (event) => {
            this.replayGame();
        });

        var returnMenu = document.getElementById("returnMenu");
        returnMenu.addEventListener("click", (event) => {
            this.returnMenu();
        });
    }

    replayGame() {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
            this.scene.restart();
            this.cameras.main.fadeIn(1000, 0, 0, 0);
        }, this);
    }

    returnMenu() {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
            this.scene.start('Welcome');
            this.cameras.main.fadeIn(1000, 0, 0, 0);
        }, this);
    }

    collectStar(player, star) {
        star.destroy();

        //  Atualização do score
        this.score += 1;
        this.scoreText.setText('Estrelas: ' + this.score); // atualiza o placar do game


        //verifica se a condição de vitória foi atingida
        if (this.score == 10) {
            this.gameEnd();
        }

        //A cada moeda coletada a dificuldade ira mudar de forma aleatória
        this.setRandomDificulty();
    }
    setRandomDificulty() {
        this.dificulties = [0, 1, 2]; //Definição das três dificuldades do game em um array/lista
        for (var i = 0; i < this.dificulties.length; i++) { //Looping for para pegar uma dificuldade aleatória
            this.dificulty = this.dificulties[Math.floor(Math.random() * this.dificulties.length)]; //Defini a dificuldade
        }
    }

    gameEnd() {
        this.gameStatus = false;
        this.enemy.destroy()

        this.player.setVelocityX(0);
        this.player.anims.play('turnAstro');

        this.add.dom(innerWidth / 2, innerHeight / 2).createFromCache('gameEnd');

        var replayGame = document.getElementById("replayGame");
        replayGame.addEventListener("click", (event) => {
            this.replayGame();
        });

        var returnMenu = document.getElementById("returnMenu");
        returnMenu.addEventListener("click", (event) => {
            this.returnMenu();
        });
    }




}