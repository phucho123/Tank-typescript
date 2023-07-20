import { IImageConstructor } from '../interfaces/image.interface'
import { Bullet } from './Bullet'

export class Enemy extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    private health: number
    private lastShoot: number
    private speed: number

    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics

    private bullets: Phaser.GameObjects.Group
    private originPosition: { x: number; y: number }

    public getBarrel(): Phaser.GameObjects.Image {
        return this.barrel
    }

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initContainer()
        this.originPosition = { x: aParams.x, y: aParams.y }
        this.scene.add.existing(this)
    }

    private initContainer() {
        this.health = 1
        this.lastShoot = 0
        this.speed = 100

        this.setDepth(-2)

        this.barrel = this.scene.add.image(0, 0, 'barrelDark')
        this.barrel.setOrigin(0.5, 0.5)
        this.barrel.setDepth(-1)

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        this.bullets = this.scene.add.group({
            classType: Bullet,
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        this.scene.physics.world.enable(this)
    }

    public update(): void {
        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.scene.physics.velocityFromRotation(
                this.rotation - Math.PI / 2,
                this.speed,
                this.body.velocity
            )
            this.handleShooting()
        } else {
            this.destroy()
        }
    }

    public destroy() {
        this.setVisible(false)
        this.barrel.setVisible(false)
        this.lifeBar.setVisible(false)
        this.setPosition(0, 0)
        this.barrel.setPosition(0, 0)
    }

    private reborn() {
        this.active = true
        this.setVisible(true)
        this.barrel.setVisible(true)
        this.lifeBar.setVisible(true)
        this.setPosition(this.originPosition.x, this.originPosition.y)
    }

    private handleShooting(): void {
        if (this.scene.time.now > this.lastShoot) {
            if (this.bullets.getLength() < 10) {
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletRed',
                    })
                )

                this.lastShoot = this.scene.time.now + 400
            }
        }
    }

    private redrawLifebar(): void {
        this.lifeBar.clear()
        this.lifeBar.fillStyle(0xe66a28, 1)
        this.lifeBar.fillRect(-this.width / 2, this.height / 2, this.width * this.health, 15)
        this.lifeBar.lineStyle(2, 0xffffff)
        this.lifeBar.strokeRect(-this.width / 2, this.height / 2, this.width, 15)
        this.lifeBar.setDepth(-1)
    }

    public updateHealth(damage: number): void {
        if (this.health > 0) {
            this.health -= damage
            this.redrawLifebar()
        }
        if (this.health <= 0) {
            this.health = 0
            this.active = false
        }
    }

    public reset() {
        console.log('reborn enemy')
        this.reborn()
        this.health = 1
        this.redrawLifebar()
    }

    public stopMoving() {
        this.body.setVelocity(0, 0)
    }
}
