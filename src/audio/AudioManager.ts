export class AudioManager {
    static instance: AudioManager | null = null
    private scene: Phaser.Scene
    private hitButtonSound: Phaser.Sound.NoAudioSound
    private explosionSound: Phaser.Sound.NoAudioSound
    private shootingSound: Phaser.Sound.NoAudioSound
    private hitSound: Phaser.Sound.NoAudioSound
    private victorySound: Phaser.Sound.NoAudioSound
    private defeatSound: Phaser.Sound.NoAudioSound
    constructor(scene: Phaser.Scene) {
        this.scene = scene
        this.init()
    }

    static getInstance(scene: Phaser.Scene) {
        if (!AudioManager.instance) AudioManager.instance = new AudioManager(scene)
        return AudioManager.instance
    }

    private init() {
        this.hitButtonSound = this.scene.sound
            .add('hitButton')
            .setRate(1.5) as Phaser.Sound.NoAudioSound
        // this.explosionSound = this.scene.sound.add('explosion') as Phaser.Sound.NoAudioSound
        // this.shootingSound = this.scene.sound.add('shoot') as Phaser.Sound.NoAudioSound

        // this.hitSound = this.scene.sound.add('hit') as Phaser.Sound.NoAudioSound
        // this.victorySound = this.scene.sound.add('victory') as Phaser.Sound.NoAudioSound
        // this.defeatSound = this.scene.sound.add('defeat') as Phaser.Sound.NoAudioSound
    }

    public playHitButton() {
        this.hitButtonSound.play()
    }

    public playExplosion() {
        this.explosionSound.play()
    }

    public playShooting() {
        this.shootingSound.play()
    }

    public playHit() {
        this.hitSound.play()
    }

    public playVictory() {
        this.victorySound.play()
    }

    public playDefeat() {
        this.defeatSound.play()
    }

    public mute() {
        this.hitButtonSound.setMute(true)
        this.explosionSound.setMute(true)
        this.shootingSound.setMute(true)
        this.hitSound.setMute(true)
        this.victorySound.setMute(true)
        this.defeatSound.setMute(true)
    }

    public unMute() {
        this.hitButtonSound.setMute(false)
        this.explosionSound.setMute(false)
        this.shootingSound.setMute(false)
        this.hitSound.setMute(false)
        this.victorySound.setMute(false)
        this.defeatSound.setMute(false)
    }
}
