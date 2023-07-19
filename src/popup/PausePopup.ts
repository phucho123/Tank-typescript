import { Observable } from '../Observable'
import { Button } from '../ui/components/Button'

export class PausePopup extends Phaser.GameObjects.Container {
    static instance: PausePopup | null = null
    private overlay: Phaser.GameObjects.Graphics
    private observable: Observable
    private speaker: Button

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene.add.existing(this)
        this.init()
    }

    static getInstance(scene: Phaser.Scene) {
        if (!PausePopup.instance) PausePopup.instance = new PausePopup(scene)
        return PausePopup.instance
    }

    private init() {
        this.observable = Observable.getInstance()
        this.observable.subscribe(this)
        this.overlay = this.scene.add
            .graphics()
            .fillStyle(0x000000, 0.7)
            .fillRect(0, 0, this.scene.sys.canvas.width, this.scene.sys.canvas.height)
            .setDepth(-0.5)
            .setVisible(false)
            .setScrollFactor(0)
        // this.scene.add.container(0, 0, this)
        this.setSize(1000, 1000)
        this.setPosition(this.scene.cameras.main.width / 2, this.scene.cameras.main.height / 2)

        const text = this.scene.add
            .bitmapText(0, -250, 'font', 'Pause', 64)
            .setOrigin(0.5)
            .setDepth(2)
            .setTint(0x8c5308)
            .setInteractive()

        const img = this.scene.add.image(0, 0, 'popupWindow')
        img.setScale(800 / img.width, 900 / img.height)

        const resumeButton = new Button({
            scene: this.scene,
            x: 0,
            y: -150,
            texture: 'resumeButton',
            frame: 0,
        })
        resumeButton.addFunc(() => this.close())

        const replayButton = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            texture: 'replayButton',
            frame: 0,
        })
        replayButton.addFunc(() => {
            this.observable.notify('PausePopup replay was press')
            this.close()
        })

        this.speaker = new Button({
            scene: this.scene,
            x: 0,
            y: 150,
            texture: 'unmuteButton',
            frame: 0,
        })
        this.speaker.addFunc(() => {
            if (this.speaker.texture.key == 'unmuteButton') {
                this.speaker.setTexture('muteButton')
                this.observable.notify('Speaker was mute')
            } else {
                this.speaker.setTexture('unmuteButton')
                this.observable.notify('Speaker was unmute')
            }
        })

        this.add([img, text, resumeButton, replayButton, this.speaker])
        this.setScrollFactor(0)
        this.setScale(0)
    }

    public open() {
        this.overlay.setVisible(true)
        this.scene.add.tween({
            targets: this,
            scale: 1,
            duration: 500,
            ease: 'bounce',
            onComplete: () => {
                this.observable.notify('Opened Pause Popup')
            },
        })
    }

    public close() {
        this.observable.notify('Closed Pause Popup')
        this.overlay.setVisible(false)
        this.scene.add.tween({
            targets: this,
            scale: 0,
            duration: 200,
            ease: 'Quintic.easeInOut',
        })
    }

    public observerMessage(message: string) {
        if (message == 'Speaker was mute') {
            this.speaker.setTexture('muteButton')
        } else if (message == 'Speaker was unmute') {
            this.speaker.setTexture('unmuteButton')
        }
    }
}
