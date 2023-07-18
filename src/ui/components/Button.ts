import { IImageConstructor } from '../../interfaces/image.interface'

export class Button extends Phaser.GameObjects.Image {
    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)
        this.init()
    }

    private init() {
        this.setScrollFactor(0)
        this.setScale(2)
        this.setInteractive()
        this.on('pointerover', () => {
            this.setAlpha(0.8)
            this.setScale(1.8)
        })

        this.on('pointerout', () => {
            this.setAlpha(1)
            this.setScale(2)
        })
    }

    public addFunc(func: () => void) {
        this.on('pointerdown', () => {
            this.setScale(1.5)
            func()
        })
        this.on('pointerup', () => {
            this.setScale(2)
        })
    }
}
