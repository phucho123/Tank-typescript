import { IImageConstructor } from '../interfaces/image.interface'
import { Bullet } from './Bullet'

export class Enemy extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body

    // variables
    private health: number
    private lastShoot: number
    private speed: number

    // children
    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics

    // game objects
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
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = 100

        // image
        this.setDepth(-2)

        this.barrel = this.scene.add.image(0, 0, 'barrelDark')
        this.barrel.setOrigin(0.5, 0.5)
        this.barrel.setDepth(-1)

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            classType: Bullet,
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // tweens
        // this.scene.tweens.add({
        //     targets: this,
        //     props: { y: this.y - 200 },
        //     delay: 0,
        //     duration: 2000,
        //     ease: 'Linear',
        //     easeParams: null,
        //     hold: 0,
        //     repeat: -1,
        //     repeatDelay: 0,
        //     yoyo: true,
        // })

        // physics
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
            // this.destroy()
            // this.barrel.destroy()
            // this.lifeBar.destroy()
            this.destroy()
        }
    }

    public destroy() {
        this.setVisible(false)
        this.barrel.setVisible(false)
        this.lifeBar.setVisible(false)
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
                // console.log('Create Bullet enemy')
                this.bullets.add(
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletRed',
                    })
                )

                // const bullet = this.bullets.get() as Bullet

                // if(bullet) bullet.setParams(this.barrel.x, this.barrel.y, this.barrel.rotation, 'bulletRed')

                this.lastShoot = this.scene.time.now + 400
            }
            // const bullet = this.bullets.get() as Bullet

            // if (bullet)
            //     bullet.setParams(this.barrel.x, this.barrel.y, this.barrel.rotation, 'bulletRed')

            // this.lastShoot = this.scene.time.now + 400
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
