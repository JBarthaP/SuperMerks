
export default class mainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: "mainMenuScene" });
    }

    init(data) {
        console.log(data);
    }

    create() {
        this.add.image(0, 0, "background_img").setOrigin(0).setDepth(0);
        let tableBack = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "table_back").setScale(0.75);

        this.mute_button = this.add.image(this.game.renderer.width - 150, this.game.renderer.height - 100, "mute_button").setScale(0.3).setVisible(false);
        this.sound_button = this.add.image(this.game.renderer.width - 150, this.game.renderer.height - 100, "sound_button").setScale(0.3);

        this.mute_button.setInteractive();
        this.mute_button.on("pointerup", () => {
            if (this.sound.mute == true) {
                this.sound.mute = false
                this.mute_button.setVisible(false);
                this.sound_button.setVisible(true);
            }
            else {
                this.sound.mute = true
                this.mute_button.setVisible(true);
                this.sound_button.setVisible(false);
            }

        });

        this.sound_button.setInteractive();
        this.sound_button.on("pointerup", () => {
            if (this.sound.mute == true) {
                this.sound.mute = false
                this.mute_button.setVisible(false);
                this.sound_button.setVisible(true);
            }
            else {
                this.sound.mute = true
                this.mute_button.setVisible(true);
                this.sound_button.setVisible(false);
            }

        });

        this.full_screen_button = this.add.image(150, this.game.renderer.height - 100, "full_screen").setScale(0.3);
        this.window_mode_button = this.add.image(150, this.game.renderer.height - 100, "window_mode").setScale(0.3).setVisible(false);

        this.full_screen_button.setInteractive();
        this.full_screen_button.on("pointerup", () => {
            this.game.canvas.requestFullscreen();
            this.full_screen_button.setVisible(false);
            this.window_mode_button.setVisible(true);
        });

        this.window_mode_button.setInteractive();
        this.window_mode_button.on("pointerup", () => {
            this.scale.stopFullscreen()
            this.window_mode_button.setVisible(false);
            this.full_screen_button.setVisible(true);
        });



        this.sound.add('wrong_answer_music', {
            volume: 0.3,
            loop: true
        }).play();

        const playButtonAnim = this.anims.create({
            key: 'play_button',
            frames: this.anims.generateFrameNumbers('play_button', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.play_btn = this.add.sprite((this.game.renderer.width + 10) / 2, (this.game.renderer.height + 10) / 2, "play_button").setDepth(2);
        this.play_btn.play('play_button');

        this.play_btn.setInteractive();
        this.play_btn.on("pointerup", () => {
            this.sound.stopAll();
            this.scene.start("level");
        });

    }
}