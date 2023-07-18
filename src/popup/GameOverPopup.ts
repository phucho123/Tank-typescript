import { Observable } from '../Observable'
import { Button } from '../ui/components/Button'

export class GameOverPopup extends Phaser.GameObjects.Container {
    static instance: GameOverPopup | null = null
    private highScoreDisplay: Phaser.GameObjects.BitmapText
    private scoreDisplay: Phaser.GameObjects.BitmapText
    private overlay: Phaser.GameObjects.Graphics
    private observable: Observable
    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene.add.existing(this)
        this.init()
    }

    static getInstance(scene: Phaser.Scene) {
        if (!GameOverPopup.instance) GameOverPopup.instance = new GameOverPopup(scene)
        return GameOverPopup.instance
    }

    init() {
        this.observable = Observable.getInstance()
        this.observable.subscribe(this)
        this.overlay = this.scene.add
            .graphics()
            .fillStyle(0x000000, 0.7)
            .fillRect(0, 0, this.scene.cameras.main.width, this.scene.cameras.main.height)
            .setDepth(-0.5)
            .setVisible(false)
            .setScrollFactor(0)
        this.scene.add.container(0, 0, this)
        this.setSize(1000, 1000)
        this.setPosition(
            this.scene.cameras.main.width / 2,
            this.scene.cameras.main.height / 2
        ).setScrollFactor(0)

        const img = this.scene.add.image(0, 0, 'popupWindow')
        img.setScale(1000 / img.width, 1000 / img.height)

        this.highScoreDisplay = this.scene.add
            .bitmapText(0, -200, 'font2', `High Score\n\n${0}`, 48)
            .setOrigin(0.5)
            .setDepth(2)
            .setTint(0x8c5308)
        this.highScoreDisplay.align = 1
        this.scoreDisplay = this.scene.add
            .bitmapText(0, 0, 'font2', `Score\n\n${0}`, 48)
            .setOrigin(0.5)
            .setDepth(2)
            .setTint(0x8c5308)
        this.scoreDisplay.align = 1

        const replayButton = new Button({
            scene: this.scene,
            x: 0,
            y: 200,
            texture: 'replayButton',
            frame: 0,
        })
        replayButton.addFunc(() => {
            this.close()
        })

        const speaker = new Button({
            scene: this.scene,
            x: -150,
            y: 200,
            texture: 'unmuteButton',
            frame: 0,
        })
        speaker.addFunc(() => {
            if (speaker.texture.key == 'unmuteButton') speaker.setTexture('muteButton')
            else speaker.setTexture('unmuteButton')
        })

        const quit = new Button({
            scene: this.scene,
            x: 150,
            y: 200,
            texture: 'quitButton',
            frame: 0,
        })
        quit.addFunc(() => {
            this.observable.notify('Quit Button was press')
            this.close()
        })

        this.add([img, this.highScoreDisplay, this.scoreDisplay, replayButton, speaker, quit])
        this.setInteractive()
        this.setVisible(false)
    }

    open(score: number, highScore: number) {
        this.scoreDisplay.setText(`Score\n\n${score}`)
        this.highScoreDisplay.setText(`High Score\n\n${highScore}`)
        this.setScale(0)
        this.setVisible(true)
        this.scene.add.tween({
            delay: 500,
            targets: this,
            scale: 1,
            duration: 500,
            ease: 'bounce',
            onStart: () => {
                this.overlay.setVisible(true)
            },
        })
    }

    close() {
        this.observable.notify('Closed GameOver Popup')
        this.overlay.setVisible(false)
        this.scene.add.tween({
            targets: this,
            scale: 0,
            duration: 200,
            ease: 'Quintic.easeInOut',
        })
    }

    observerMessage(_message: string) {
        ///
    }
}
