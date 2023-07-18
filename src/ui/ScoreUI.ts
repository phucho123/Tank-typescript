export class ScoreUI extends Phaser.GameObjects.Container {
    static instance: ScoreUI | null = null
    private scoreDisplay: Phaser.GameObjects.BitmapText
    private highScoreDisplay: Phaser.GameObjects.BitmapText
    private score: number
    private highScore: number

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.scene.add.existing(this)
        this.init()
    }

    static getInstance(scene: Phaser.Scene) {
        if (!ScoreUI.instance) ScoreUI.instance = new ScoreUI(scene)
        return ScoreUI.instance
    }

    init() {
        this.score = 0
        this.highScore = 0
        this.scoreDisplay = this.scene.add
            .bitmapText(200, 0, 'font2', `Score: ${this.score}`, 32)
            .setOrigin(0)
            .setDepth(-0.5)
            .setTint(0xffffff)
            .setInteractive()
            .setScrollFactor(0)
        this.highScoreDisplay = this.scene.add
            .bitmapText(200, 50, 'font2', `High Score: ${this.highScore}`, 32)
            .setOrigin(0)
            .setDepth(-0.5)
            .setTint(0xffffff)
            .setInteractive()
            .setScrollFactor(0)
    }

    setScore(score: number) {
        this.score = score
        this.scoreDisplay.setText(`Score: ${this.score}`)
        if (this.score > this.highScore) {
            this.highScore = this.score
            this.highScoreDisplay.setText(`High Score: ${this.highScore}`)
        }
    }

    addScore(score: number) {
        this.score += score
        this.scoreDisplay.setText(`Score: ${this.score}`)
        if (this.score > this.highScore) {
            this.highScore = this.score
            this.highScoreDisplay.setText(`High Score: ${this.highScore}`)
        }
    }

    getScore() {
        return this.score
    }

    getHighScore() {
        return this.highScore
    }
}
