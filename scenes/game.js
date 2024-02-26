class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        //Carregar componentes
        this.load.image("bg", "assets/space_bg.jpg");
    }

    create() {
        this.add.image(innerWidth, innerHeight, 'bg');
    }
}