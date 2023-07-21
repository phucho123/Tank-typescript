export class MenuScene extends Phaser.Scene {
    private startKey: Phaser.Input.Keyboard.Key
    private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

    constructor() {
        super({
            key: 'MenuScene',
        })
    }

    public init(): void {
        if (this.input.keyboard)
            this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.startKey.isDown = false
    }

    public create(): void {
        const background = this.add.image(0, 0, 'backgroundMenu', 0)
        background
            .setScale(
                this.sys.canvas.width / background.displayWidth,
                this.sys.canvas.height / background.displayHeight
            )
            .setScrollFactor(0)
            .setOrigin(0, 0)

        this.bitmapTexts.push(
            this.add
                .bitmapText(
                    this.sys.canvas.width / 2,
                    this.sys.canvas.height / 2,
                    'font',
                    'PRESS TO PLAY',
                    30
                )
                .setOrigin(0.5, 0)
        )
        this.bitmapTexts.push(
            this.add
                .bitmapText(
                    this.sys.canvas.width / 2,
                    this.sys.canvas.height / 2 - 100,
                    'font',
                    'TANK',
                    100
                )
                .setOrigin(0.5, 0)
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
        })
    }

    public update(): void {
        ///
    }
}
