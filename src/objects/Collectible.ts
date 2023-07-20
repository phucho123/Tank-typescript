import { IImageConstructor } from '../interfaces/image.interface'

export class Collectible extends Phaser.GameObjects.Image {
    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage(): void {
        this.setOrigin(0, 0).setDepth(-1)

        this.scene.physics.world.enable(this)
    }

    public update(): void {
        ///
    }

    destroy() {
        this.setActive(false)
        this.setVisible(false)
    }

    reset() {
        this.setActive(true)
        this.setVisible(true)
    }
}
