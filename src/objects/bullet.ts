import { IBulletConstructor } from '../interfaces/bullet.interface'

export class Bullet extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    private bulletSpeed: number

    constructor(aParams: IBulletConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.rotation = aParams.rotation
        this.initImage()
        this.scene.add.existing(this)
    }

    public initImage(): void {
        this.setScale(0.5)
        // variables
        this.bulletSpeed = 1000

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(-1.5)

        // physics
        this.scene.physics.world.enable(this)
        this.scene.physics.velocityFromRotation(
            this.rotation - Math.PI / 2,
            this.bulletSpeed,
            this.body.velocity
        )
    }

    update(): void {
        // const vx = Math.cos(this.rotation - Math.PI / 2) * this.bulletSpeed
        // const vy = Math.sin(this.rotation - Math.PI / 2) * this.bulletSpeed
        // this.body.setVelocity(vx, vy)
        ///
        // this.x += this.bulletSpeed * this.body.velocity.x * Math.cos(this.rotation - Math.PI / 2)
        // this.y += this.bulletSpeed * this.body.velocity.y * Math.sin(this.rotation - Math.PI / 2)
        // this.scene.physics.velocityFromRotation(
        //     this.rotation - Math.PI / 2,
        //     this.bulletSpeed,
        //     this.body.velocity
        // )
    }

    // destroy() {
    //     this.setActive(false)
    //     this.setVisible(false)
    // }

    // public setParams(x: number, y: number, rotation: number, texture: string) {
    //     if (this.visible) {
    //         this.setX(x)
    //         this.setY(y)
    //         this.rotation = rotation
    //         this.setTexture(texture)
    //         this.initImage()
    //         this.scene.add.existing(this)
    //     } else {
    //         this.setX(x)
    //         this.setY(y)
    //         this.body.x = x
    //         this.rotation = rotation
    //         this.setTexture(texture)
    //         this.setVisible(true)
    //         this.initImage()
    //     }
    // }
}
