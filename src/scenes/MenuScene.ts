export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
    // private gameOverPopup: GameOverPopup

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    init(): void {
        if (this.input.keyboard)
            this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
        // this.gameOverPopup = GameOverPopup.getInstance(this)
        // this.gameOverPopup.open()

        // this.cameras.main.fadeIn(100)
        // const fxCamera = this.cameras.main.postFX.addPixelate(40)
        // this.add.tween({
        //     targets: fxCamera,
        //     duration: 1000,
        //     amount: -1,
        // })
    }

    create(): void {
        const background = this.add.image(0, 0, 'backgroundMenu', 0)
        background
            .setScale(
                this.sys.canvas.width / background.displayWidth,
                this.sys.canvas.height / background.displayHeight
            )
            .setScrollFactor(0)
            .setOrigin(0, 0)

        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 120,
                this.sys.canvas.height / 2,
                'font',
                'PRESS TO PLAY',
                30
            )
        )
        this.bitmapTexts.push(
            this.add.bitmapText(
                this.sys.canvas.width / 2 - 120,
                this.sys.canvas.height / 2 - 100,
                'font',
                'TANK',
                100
            )
        )

        this.input.on('pointerdown', () => {
            const fx = this.cameras.main.postFX.addWipe()
            this.scene.transition({
                target: 'GameScene',
                duration: 2000,
                moveBelow: true,
                onUpdate: (progress: number) => {
                    fx.progress = progress
                },
            })

            // const pixelated = this.cameras.main.postFX.addPixelate(-1)
            // this.add.tween({
            //     targets: pixelated,
            //     duration: 1000,
            //     amount: 40,
            //     onComplete: () => {
            //         this.cameras.main.fadeOut(100)
            //         if (this.scene.isSleeping('GameScene')) {
            //             this.scene.wake('GameScene')
            //             this.scene.sleep('MenuScene')
            //         } else {
            //             this.scene.switch('GameScene')
            //         }
            //     },
            // })
        })
    }

    update(): void {
        // if (this.startKey.isDown) {
        //     // this.scene.start('GameScene')
        //     const fx = this.cameras.main.postFX.addWipe()
        //     this.scene.transition({
        //         target: 'GameScene',
        //         duration: 2000,
        //         moveBelow: true,
        //         onUpdate: (progress: number) => {
        //             fx.progress = progress
        //         },
        //     })
        // }
    }
}
