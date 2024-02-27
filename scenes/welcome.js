class Welcome extends Phaser.Scene {

    constructor() {
        super({
            key: 'Welcome'
        });
    }

    preload() {
        //Carregar componentes
        this.load.image("bg", "assets/space_bg.jpg");
        this.load.html("title", "components/title.html");
        this.load.html("buttons", "components/initial_buttons.html");
        this.load.html("guia", "components/guia.html");
    }

    create() {
        this.add.dom((this.game.config.width - 400) / 2, (this.game.config.height - 350) / 2).createFromCache('title').setOrigin(0, 0);
        this.add.image(innerWidth, innerHeight, 'bg');
        //Disposição dos componentes na tela
        this.buttons = this.add.dom((this.game.config.width - 290) / 2, (this.game.config.height - 80) / 2).createFromCache('buttons').setOrigin(0, 0);
        this.guia = this.add.dom((this.game.config.width - ((this.game.config.width * 0.4 + 40))) / 2, (this.game.config.height - ((this.game.config.height * 0.8 + 40))) / 2).createFromCache('guia');

        //Abir e fechar popup do guia do jogo
        var showScore = document.getElementById("showGuia");
        showScore.addEventListener("click", (event) => {
            document.getElementById("guia").classList.remove("d-none");
        });
        var closeScore = document.getElementById("closeGuia");
        closeScore.addEventListener("click", (event) => {
            document.getElementById("guia").classList.add("d-none");
        });



        //Iniciar jogo
        var play = document.getElementById("playBtn");
        play.addEventListener("click", (event) => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
                this.scene.start('Game');
                this.cameras.main.fadeIn(1000, 0, 0, 0);
            }, this);
        });
    }




    //
}