import { Bullet } from './Bullet'
import { IImageConstructor } from '../interfaces/image.interface'
import { Observable } from '../Observable'

export class Player extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body


    private health: number
    private lastShoot: number
    private speed: number


    private barrel: Phaser.GameObjects.Image
    private lifeBar: Phaser.GameObjects.Graphics

 
    private bullets: Phaser.GameObjects.Group

    
    private rotateKeyLeft: Phaser.Input.Keyboard.Key
    private rotateKeyRight: Phaser.Input.Keyboard.Key
    private MoveUpKey: Phaser.Input.Keyboard.Key
    private MoveDownKey: Phaser.Input.Keyboard.Key
    private damage: number
    private shield: number
    private observable: Observable
 

    public getBullets(): Phaser.GameObjects.Group {
        return this.bullets
    }

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

        this.initImage()
        this.scene.add.existing(this)
    }

    private initImage() {
        this.observable = Observable.getInstance()
        this.observable.subscribe(this)
        
        this.health = 1
        this.shield = 0
        this.lastShoot = 0
        this.speed = 300 
      
        this.setOrigin(0.5, 0.5)
        this.setDepth(-2)
        this.angle = 180


        this.barrel = this.scene.add.image(this.x, this.y, 'barrelRed')
        this.damage = 0.4

        this.barrel.setOrigin(0.5, 0.5)
        this.barrel.setDepth(-1)
        this.barrel.angle = 180

        this.lifeBar = this.scene.add.graphics()
        this.redrawLifebar()

        this.bullets = this.scene.add.group({
            active: true,
            maxSize: 10,
            runChildUpdate: true,
        })

        if (this.scene.input.keyboard) {
            this.rotateKeyLeft = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
            this.rotateKeyRight = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
            this.MoveUpKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
            this.MoveDownKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        }

       
        this.scene.physics.world.enable(this)
        this.scene.input.on('pointerdown', () => {
            if (this.active) this.handleShooting()
        })
       
    }

    public update(): void {
        let angle = Math.atan2(
            this.scene.input.mousePointer.y - this.scene.cameras.main.height / 2,
            this.scene.input.mousePointer.x - this.scene.cameras.main.width / 2
        )
        angle = angle + Math.PI / 2
        this.barrel.setRotation(angle)

        if (this.active) {
            this.barrel.x = this.x
            this.barrel.y = this.y
            this.lifeBar.x = this.x
            this.lifeBar.y = this.y
            this.handleInput()
           
        } else {
            this.destroy()
            
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

        
        if (this.rotateKeyLeft.isDown) {
            this.rotation -= 0.05
        } else if (this.rotateKeyRight.isDown) {
            this.rotation += 0.05
        }
    }

    private handleShooting(): void {
       
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
                
                this.bullets.addMultiple([
                    
                    new Bullet({
                        scene: this.scene,
                        rotation: this.barrel.rotation,
                        x: this.barrel.x,
                        y: this.barrel.y,
                        texture: 'bulletBlue',
                    }),
                   
                ])
                
                this.lastShoot = this.scene.time.now + 10
                this.observable.notify('Player shooting')
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

    public updateHealth(): void {
        if (this.shield > 0) {
            this.shield -= 0.05
            return
        } else if (this.shield < 0) {
            this.removeShield()
        }

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
        this.setBarrel(1)
        this.removeShield()
    }

    public fullHealth() {
        this.health = 1
        this.redrawLifebar()
    }

    public setBarrel(barrelNumber: number) {
        switch (barrelNumber) {
            case 1:
                this.barrel.setTexture('barrelRed')
                this.damage = 0.4
                break
            case 2:
                this.barrel.setTexture('barrel2Red')
                this.damage = 0.6
                break
            case 3:
                this.barrel.setTexture('barrel3Red')
                this.damage = 1
                break
            default:
                break
        }
    }

    public getDamage() {
        return this.damage
    }

    public addShield() {
        this.shield = 1
        this.postFX.addGradient(0x0000ff, 0x00ff00, 0.5)
        this.barrel.postFX.addGradient(0x0000ff, 0x00ff00, 0.5)
    }

    public removeShield() {
        this.shield = 0
        this.postFX.clear()
        this.barrel.postFX.clear()
    }

    public observerMessage(_message: string) {
        ///
    }
}
