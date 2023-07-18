import { Player } from '../objects/Player'
import { Enemy } from '../objects/Enemy'
import { Obstacle } from '../objects/obstacles/Obstacle'
import { Bullet } from '../objects/Bullet'
import { PausePopup } from '../popup/PausePopup'
import { GameOverPopup } from '../popup/GameOverPopup'
import { Observable } from '../Observable'
import { ScoreUI } from '../ui/ScoreUI'

export class GameScene extends Phaser.Scene {
    private map: Phaser.Tilemaps.Tilemap
    private tileset: Phaser.Tilemaps.Tileset
    // private tileset2: Phaser.Tilemaps.Tileset
    private layer: Phaser.Tilemaps.TilemapLayer
    // private layer2: Phaser.Tilemaps.TilemapLayer
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    private player: Player
    private enemies: Phaser.GameObjects.Group
    private obstacles: Phaser.GameObjects.Group
    private explosionSprite: Phaser.GameObjects.Sprite

    private target: Phaser.Math.Vector2

    private pausePopup: PausePopup
    private gameOverPopup: GameOverPopup
    private observable: Observable
    private updateState: boolean
    private scoreUI: ScoreUI

    constructor() {
        super({
            key: 'GameScene',
        })
    }

    init(): void {
        ///
        // this.pausePopup = PausePopup.getInstance(this)
        // this.cameras.main.fadeIn(100)
        // const fxCamera = this.cameras.main.postFX.addPixelate(40)
        // this.add.tween({
        //     targets: fxCamera,
        //     duration: 1000,
        //     amount: -1,
        // })
    }

    create(): void {
        this.updateState = true
        this.observable = Observable.getInstance()
        this.scoreUI = new ScoreUI(this)
        this.observable.subscribe(this)
        console.log('Create game Scene')
        // this.input.on('pointerdown', () => {
        //     const fx = this.cameras.main.postFX.addWipe()
        //     this.scene.transition({
        //         target: 'MenuScene',
        //         duration: 2000,
        //         moveBelow: true,
        //         onUpdate: (progress: number) => {
        //             fx.progress = progress
        //         },
        //     })
        //     // const pixelated = this.cameras.main.postFX.addPixelate(-1)
        //     // this.add.tween({
        //     //     targets: pixelated,
        //     //     duration: 1000,
        //     //     amount: 40,
        //     //     onComplete: () => {
        //     //         this.cameras.main.fadeOut(100)
        //     //         if (this.scene.isSleeping('MenuScene')) {
        //     //             this.scene.wake('MenuScene')
        //     //             this.scene.sleep('GameScene')
        //     //         } else {
        //     //             this.scene.switch('MenuScene')
        //     //         }
        //     //     },
        //     // })
        // })
        this.pausePopup = new PausePopup(this)
        this.gameOverPopup = new GameOverPopup(this)
        // create tilemap from tiled JSON
        this.map = this.make.tilemap({ key: 'levelMap' })

        this.tileset = this.map.addTilesetImage('tiles') as Phaser.Tilemaps.Tileset
        // this.tileset2 = this.map.addTilesetImage('wall') as Phaser.Tilemaps.Tileset
        this.layer = this.map.createLayer(
            'tileLayer',
            this.tileset,
            0,
            0
        ) as Phaser.Tilemaps.TilemapLayer

        // this.layer2 = this.map.createLayer(
        //     // 'tileLayer',
        //     'foregroundLayer',
        //     this.tileset2,
        //     0,
        //     0
        // ) as Phaser.Tilemaps.TilemapLayer
        this.layer.setCollisionByProperty({ collide: true }).setDepth(-10)

        this.obstacles = this.add.group({
            /*classType: Obstacle,*/
            runChildUpdate: true,
        })

        this.enemies = this.add.group({
            /*classType: Enemy*/
        })

        this.convertObjects()

        // collider layer and obstacles
        this.physics.add.collider(this.player, this.layer)
        this.physics.add.collider(this.player, this.obstacles)

        // collider for bullets
        this.physics.add.collider(
            this.player.getBullets(),
            this.layer,
            this.bulletHitLayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        this.physics.add.collider(
            this.player.getBullets(),
            this.obstacles,
            this.bulletHitObstacles as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
        )

        for (const enemy of this.enemies.getChildren()) {
            const enemy2 = enemy as Enemy
            this.physics.add.overlap(
                this.player.getBullets(),
                enemy,
                this.playerBulletHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            )
            this.physics.add.overlap(
                enemy2.getBullets(),
                this.player,
                this.enemyBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            )

            this.physics.add.collider(
                enemy2.getBullets(),
                this.obstacles,
                this.bulletHitObstacles as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            )
            this.physics.add.collider(
                enemy2.getBullets(),
                this.layer,
                this.bulletHitLayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
                undefined,
                this
            )
        }

        // this.enemies.children.each((enemy: Enemy) => {
        //     this.physics.add.overlap(
        //         this.player.getBullets(),
        //         enemy,
        //         this.playerBulletHitEnemy as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        //         undefined,
        //         this
        //     )
        //     this.physics.add.overlap(
        //         enemy.getBullets(),
        //         this.player,
        //         this.enemyBulletHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        //         undefined
        //     )

        //     this.physics.add.collider(
        //         enemy.getBullets(),
        //         this.obstacles,
        //         this.bulletHitObstacles as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        //         undefined
        //     )
        //     this.physics.add.collider(
        //         enemy.getBullets(),
        //         this.layer,
        //         this.bulletHitLayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
        //         undefined
        //     )
        // }, this)

        this.cameras.main.startFollow(this.player)
        // this.pausePopup = PausePopup.getInstance(this)
        // this.gameOverPopup = GameOverPopup.getInstance(this)
        this.add
            .bitmapText(0, 0, 'font', 'II', 100)
            .setInteractive()
            .on('pointerdown', () => {
                // this.stopUpdate()
                if (this.updateState) this.pausePopup.open()
            })
            .setScrollFactor(0)
            .setDepth(-10)

        this.explosionSprite = this.add.sprite(0, 0, '').setVisible(false).setScale(2)
    }

    update(): void {
        if (!this.updateState) return
        this.player.update()
        for (const enemy of this.enemies.getChildren()) {
            const enemy2 = enemy as Enemy
            enemy2.update()
            if (this.player.active && enemy.active) {
                const angle = Phaser.Math.Angle.Between(
                    enemy2.body.x,
                    enemy2.body.y,
                    this.player.body.x,
                    this.player.body.y
                )

                enemy2.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
            }
        }
        // this.enemies.children.each((enemy: Enemy) => {
        //     enemy.update()
        //     if (this.player.active && enemy.active) {
        //         const angle = Phaser.Math.Angle.Between(
        //             enemy.body.x,
        //             enemy.body.y,
        //             this.player.body.x,
        //             this.player.body.y
        //         )

        //         enemy.getBarrel().angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
        //     }
        // }, this)
    }

    private convertObjects(): void {
        // find the object layer in the tilemap named 'objects'
        const tmp = this.map.getObjectLayer('objects')
        if (!tmp) return
        const objects = tmp.objects as any[]

        objects.forEach((object) => {
            if (object.type === 'player') {
                this.player = new Player({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    // texture: 'tankBlue',
                    texture: 'tankRed',
                })
            } else if (object.type === 'enemy') {
                const enemy = new Enemy({
                    scene: this,
                    x: object.x,
                    y: object.y,
                    texture: 'tankDark',
                })

                this.enemies.add(enemy)
            } else {
                const obstacle = new Obstacle({
                    scene: this,
                    x: object.x,
                    y: object.y - 40,
                    texture: object.type,
                })

                this.obstacles.add(obstacle)
            }
        })
    }

    private bulletHitLayer(bullet: Bullet, _layer: Phaser.Tilemaps.TilemapLayer): void {
        bullet.destroy()
        // console.log(bullet)
    }

    private bulletHitObstacles(bullet: Bullet, _obstacle: Obstacle): void {
        bullet.destroy()
    }

    private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
        player.updateHealth()
        if (!player.active && player.visible) {
            bullet.destroy()
            this.playExplosionEffect(player.x, player.y)
            this.gameOverPopup.open(this.scoreUI.getScore(), this.scoreUI.getHighScore())
        }
    }

    private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
        enemy.updateHealth()
        if (!enemy.active && enemy.visible) {
            bullet.destroy()
            this.playExplosionEffect(enemy.x, enemy.y)
            this.scoreUI.addScore(100)
            const enemyRemain = this.enemies.getChildren().filter((enemy) => enemy.active)
            if (enemyRemain.length <= 0) {
                this.gameOverPopup.open(this.scoreUI.getScore(), this.scoreUI.getHighScore())
            }
        }
    }

    playExplosionEffect(x: number, y: number) {
        if (!this.explosionSprite.visible) this.explosionSprite.setVisible(true)
        this.explosionSprite.setPosition(x, y).play('explosion', true)
    }

    pauseScene() {
        this.updateState = false
        this.tweens.pauseAll()
    }

    resumeScene() {
        this.updateState = true
        this.tweens.resumeAll()
    }

    restart() {
        this.scoreUI.setScore(0)
        this.player.reset()
        for (const enemy of this.enemies.getChildren()) {
            (<Enemy>enemy).reset()
        }
    }

    observerMessage(message: string) {
        console.log('GameScene got Message: ' + message)
        switch (message) {
            case 'PausePopup replay was press':
                this.restart()
                break
            case 'Opened Pause Popup':
                this.pauseScene()
                break
            case 'Closed Pause Popup':
                this.resumeScene()
                break
            case 'Closed GameOver Popup':
                this.restart()
                break
            case 'Quit Button was press':
                // console.log(this.scene)
                this.restart()
                this.scene.switch('MenuScene')
                break
            default:
                break
        }
    }
}
