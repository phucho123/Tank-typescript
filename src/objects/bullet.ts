import { IBulletConstructor } from '../interfaces/bullet.interface'

export class Bullet extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    private bulletSpeed: number
    private damage: number

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.rotation = aParams.rotation
        this.initImage()
        this.scene.add.existing(this)
    }

    public initImage(): void {
        this.setScale(0.5)

        this.bulletSpeed = 1000

        this.setOrigin(0.5, 0.5)
        this.setDepth(-1.5)

        this.scene.physics.world.enable(this)
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        )

        this.damage = 0.05
    }

    public update(): void {
        ///
    }

    public setDamage(damage: number) {
        this.damage = damage
    }

    public getDamage() {
        return this.damage
    }
}
