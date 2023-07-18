import { Bullet } from './Bullet'
import { IImageConstructor } from '../interfaces/image.interface'

export class Player extends Phaser.GameObjects.Image {
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

    // input
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private rotateKeyLeft: Phaser.Input.Keyboard.Key
    private rotateKeyRight: Phaser.Input.Keyboard.Key
    private MoveUpKey: Phaser.Input.Keyboard.Key
    private MoveDownKey: Phaser.Input.Keyboard.Key
    private shootingKey: Phaser.Input.Keyboard.Key

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage() {
        // variables
        this.health = 1
        this.lastShoot = 0
        this.speed = 300 //100

        // image
        this.setOrigin(0.5, 0.5)
        this.setDepth(-2)
        this.angle = 180

        // this.barrel = this.scene.add.image(this.x, this.y, 'barrelBlue')
        this.barrel = this.scene.add.image(this.x, this.y, 'barrel3Red')

        this.barrel.setOrigin(0.5, 0.5)
        this.barrel.setDepth(-1)
        this.barrel.angle = 180

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        // game objects
        this.bullets = this.scene.add.group({
            /*classType: Bullet,*/
            // classType: Bullet,
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        // input
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys()
            this.rotateKeyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            this.rotateKeyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
            this.MoveUpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
            this.MoveDownKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            this.shootingKey = this.scene.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            )
        }

        // physics
        this.scene.physics.world.enable(this)
        this.scene.input.on('pointerdown', () => {
            this.handleShooting()
        })
    }

    public update(): void {
        // console.log(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
        // console.log(this.scene.input.mousePointer.x, this.scene.input.mousePointer.y)
        let angle = Math.atan2(
            this.scene.input.mousePointer.y - this.scene.cameras.main.height / 2,
            this.scene.input.mousePointer.x - this.scene.cameras.main.width / 2
        )
        angle = angle + Math.PI / 2
        console.log(angle)
        this.barrel.setRotation(angle)

        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
            // this.handleShooting()
        } else {
            this.destroy()
            // this.barrel.destroy()
            // this.lifeBar.destroy()
        }
    }

    public destroy() {
        this.body.setVelocity(0, 0)
        this.setVisible(false)
        this.barrel.setVisible(false)
        this.lifeBar.setVisible(false)
    }

    private reborn() {
        this.active = true
        this.setVisible(true)
        this.barrel.setVisible(true)
        this.lifeBar.setVisible(true)
    }

    private handleInput() {
        // move tank forward
        // small corrections with (- MATH.PI / 2) to align tank correctly
        // if (this.cursors.up.isDown) {
        //     this.scene.physics.velocityFromRotation(
        //         this.rotation - Math.PI / 2,
        //         this.speed,
        //         this.body.velocity
        //     )
        // } else if (this.cursors.down.isDown) {
        //     this.scene.physics.velocityFromRotation(
        //         this.rotation - Math.PI / 2,
        //         -this.speed,
        //         this.body.velocity
        //     )
        // } else {
        //     this.body.setVelocity(0, 0)
        // }

        if (this.MoveUpKey.isDown) {
            this.scene.physics.velocityFromRotation(
                this.rotation - Math.PI / 2,
                this.speed,
                this.body.velocity
            )
        } else if (this.MoveDownKey.isDown) {
            this.scene.physics.velocityFromRotation(
                this.rotation - Math.PI / 2,
                -this.speed,
                this.body.velocity
            )
        } else {
            this.body.setVelocity(0, 0)
        }

        // rotate tank
        // if (this.cursors.left.isDown) {
        //     this.rotation -= 0.02
        // } else if (this.cursors.right.isDown) {
        //     this.rotation += 0.02
        // }

        // rotate barrel
        // if (this.rotateKeyLeft.isDown) {
        //     this.barrel.rotation -= 0.05
        // } else if (this.rotateKeyRight.isDown) {
        //     this.barrel.rotation += 0.05
        // }
        if (this.rotateKeyLeft.isDown) {
            this.rotation -= 0.05
        } else if (this.rotateKeyRight.isDown) {
            this.rotation += 0.05
        }
    }

    private handleShooting(): void {
        // if (this.shootingKey.isDown && this.scene.time.now > this.lastShoot)
        if (this.scene.time.now > this.lastShoot) {
            this.scene.cameras.main.shake(20, 0.005)
            this.scene.tweens.add({
                targets: this,
                props: { alpha: 0.8 },
                delay: 0,
                duration: 5,
                ease: 'Power1',
                easeParams: null,
                hold: 0,
                repeat: 0,
                repeatDelay: 0,
                yoyo: true,
                paused: false,
            })

            if (this.bullets.getLength() < 10) {
                // console.log('Create bullet')
                this.bullets.addMultiple([
                    // new Bullet({
                    //     scene: this.scene,
                    //     rotation: this.barrel.rotation,
                    //     x: this.barrel.x - 10 * Math.cos(this.barrel.rotation),
                    //     y: this.barrel.y - 10 * Math.sin(this.barrel.rotation),
                    //     texture: 'bulletBlue',
                    // }),
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletBlue',
                    }),
                    // new Bullet({
                    //     scene: this.scene,
                    //     rotation: this.barrel.rotation,
                    //     x: this.barrel.x + 10 * Math.cos(this.barrel.rotation),
                    //     y: this.barrel.y + 10 * Math.sin(this.barrel.rotation),
                    //     texture: 'bulletBlue',
                    // }),
                ])
                // this.bullets.add(
                //     new Bullet({
                //         scene: this.scene,
                //         rotation: this.barrel.rotation,
                //         x: this.barrel.x + 10 * Math.cos(this.barrel.rotation),
                //         y: this.barrel.y + 10 * Math.sin(this.barrel.rotation),
                //         texture: 'bulletBlue',
                //     })
                // )

                // const bullet = this.bullets.get() as Bullet
                // bullet.setParams(this.barrel.x, this.barrel.y, this.barrel.rotation, 'bulletBlue')
                this.lastShoot = this.scene.time.now + 100
            }
            // const bullet = this.bullets.get() as Bullet
            // if (bullet)
            //     bullet.setParams(this.barrel.x, this.barrel.y, this.barrel.rotation, 'bulletBlue')

            // this.lastShoot = this.scene.time.now + 80
            // console.log(this.bullets.getLength())
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

    public updateHealth(): void {
        if (this.health > 0) {
            this.health -= 0.05
            this.redrawLifebar()
        }
        if (this.health <= 0) {
            this.health = 0
            this.active = false
        }
    }

    public reset() {
        this.reborn()
        this.health = 1
        this.redrawLifebar()
        this.setPosition(320, 240)
        this.barrel.setRotation(Math.PI)
        this.setRotation(Math.PI)
    }
}
