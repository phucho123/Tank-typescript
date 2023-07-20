(()=>{"use strict";var e,t={330:(e,t,s)=>{s(260);class i extends Phaser.Scene{constructor(){super({key:"BootScene"})}preload(){console.log(this.cameras.main.width,this.cameras.main.height),this.cameras.main.setBackgroundColor(0),this.createLoadingGraphics(),this.load.on("progress",(e=>{this.progressBar.clear(),this.progressBar.fillStyle(8971347,1),this.progressBar.fillRect(this.cameras.main.width/4,this.cameras.main.height/2-16,this.cameras.main.width/2*e,16)}),this),this.load.on("complete",(()=>{this.progressBar.destroy(),this.loadingBar.destroy(),this.anims.create({key:"explosion",frames:this.anims.generateFrameNumbers("explosion",{frames:[0,1,2,3,4,5,6,7,8]}),frameRate:16,repeat:0})}),this),this.load.pack("preload","./assets/pack.json","preload")}update(){this.scene.start("MenuScene")}createLoadingGraphics(){this.loadingBar=this.add.graphics(),this.loadingBar.fillStyle(16777215,1),this.loadingBar.fillRect(this.cameras.main.width/4-2,this.cameras.main.height/2-18,this.cameras.main.width/2+4,20),this.progressBar=this.add.graphics()}}class a extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.rotation=e.rotation,this.initImage(),this.scene.add.existing(this)}initImage(){this.setScale(.5),this.bulletSpeed=1e3,this.setOrigin(.5,.5),this.setDepth(-1.5),this.scene.physics.world.enable(this),this.scene.physics.velocityFromRotation(this.rotation-Math.PI/2,this.bulletSpeed,this.body.velocity)}update(){}}class h{constructor(){this.observers=[]}static getInstance(){return h.instance||(h.instance=new h),h.instance}subscribe(e){this.observers.push(e)}unsubscribe(e){this.observers=this.observers.filter((t=>t!==e))}notify(e){this.observers.forEach((t=>t.observerMessage(e)))}}h.instance=null;class r extends Phaser.GameObjects.Image{getBullets(){return this.bullets}constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.initImage(),this.scene.add.existing(this)}initImage(){this.observable=h.getInstance(),this.observable.subscribe(this),this.health=1,this.shield=0,this.lastShoot=0,this.speed=300,this.setOrigin(.5,.5),this.setDepth(-2),this.angle=180,this.barrel=this.scene.add.image(this.x,this.y,"barrelRed"),this.damage=.4,this.barrel.setOrigin(.5,.5),this.barrel.setDepth(-1),this.barrel.angle=180,this.lifeBar=this.scene.add.graphics(),this.redrawLifebar(),this.bullets=this.scene.add.group({active:!0,maxSize:10,runChildUpdate:!0}),this.scene.input.keyboard&&(this.rotateKeyLeft=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),this.rotateKeyRight=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),this.MoveUpKey=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),this.MoveDownKey=this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)),this.scene.physics.world.enable(this),this.scene.input.on("pointerdown",(()=>{this.active&&this.handleShooting()}))}update(){let e=Math.atan2(this.scene.input.mousePointer.y-this.scene.cameras.main.height/2,this.scene.input.mousePointer.x-this.scene.cameras.main.width/2);e+=Math.PI/2,this.barrel.setRotation(e),this.active?(this.barrel.x=this.x,this.barrel.y=this.y,this.lifeBar.x=this.x,this.lifeBar.y=this.y,this.handleInput()):this.destroy()}destroy(){this.body.setVelocity(0,0),this.setVisible(!1),this.barrel.setVisible(!1),this.lifeBar.setVisible(!1)}reborn(){this.active=!0,this.setVisible(!0),this.barrel.setVisible(!0),this.lifeBar.setVisible(!0)}handleInput(){this.MoveUpKey.isDown?this.scene.physics.velocityFromRotation(this.rotation-Math.PI/2,this.speed,this.body.velocity):this.MoveDownKey.isDown?this.scene.physics.velocityFromRotation(this.rotation-Math.PI/2,-this.speed,this.body.velocity):this.body.setVelocity(0,0),this.rotateKeyLeft.isDown?this.rotation-=.05:this.rotateKeyRight.isDown&&(this.rotation+=.05)}handleShooting(){this.scene.time.now>this.lastShoot&&(this.scene.cameras.main.shake(20,.005),this.scene.tweens.add({targets:this,props:{alpha:.8},delay:0,duration:5,ease:"Power1",easeParams:null,hold:0,repeat:0,repeatDelay:0,yoyo:!0,paused:!1}),this.bullets.getLength()<10&&(this.bullets.addMultiple([new a({scene:this.scene,rotation:this.barrel.rotation,x:this.barrel.x,y:this.barrel.y,texture:"bulletBlue"})]),this.lastShoot=this.scene.time.now+10,this.observable.notify("Player shooting")))}redrawLifebar(){this.lifeBar.clear(),this.lifeBar.fillStyle(15100456,1),this.lifeBar.fillRect(-this.width/2,this.height/2,this.width*this.health,15),this.lifeBar.lineStyle(2,16777215),this.lifeBar.strokeRect(-this.width/2,this.height/2,this.width,15),this.lifeBar.setDepth(-1)}updateHealth(){this.shield>0?this.shield-=.05:(this.shield<0&&this.removeShield(),this.health>0&&(this.health-=0,this.redrawLifebar()),this.health<=0&&(this.health=0,this.active=!1))}reset(){this.reborn(),this.health=1,this.redrawLifebar(),this.setPosition(320,240),this.barrel.setRotation(Math.PI),this.setRotation(Math.PI),this.setBarrel(1),this.removeShield()}fullHealth(){this.health=1,this.redrawLifebar()}setBarrel(e){switch(e){case 1:this.barrel.setTexture("barrelRed"),this.damage=.4;break;case 2:this.barrel.setTexture("barrel2Red"),this.damage=.6;break;case 3:this.barrel.setTexture("barrel3Red"),this.damage=1}}getDamage(){return this.damage}addShield(){this.shield=1,this.postFX.addGradient(255,65280,.5),this.barrel.postFX.addGradient(255,65280,.5)}removeShield(){this.shield=0,this.postFX.clear(),this.barrel.postFX.clear()}observerMessage(e){}}class n extends Phaser.GameObjects.Image{getBarrel(){return this.barrel}getBullets(){return this.bullets}constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.initContainer(),this.originPosition={x:e.x,y:e.y},this.scene.add.existing(this)}initContainer(){this.health=1,this.lastShoot=0,this.speed=100,this.setDepth(-2),this.barrel=this.scene.add.image(0,0,"barrelDark"),this.barrel.setOrigin(.5,.5),this.barrel.setDepth(-1),this.lifeBar=this.scene.add.graphics(),this.redrawLifebar(),this.bullets=this.scene.add.group({classType:a,active:!0,maxSize:10,runChildUpdate:!0}),this.scene.physics.world.enable(this)}update(){this.active?(this.barrel.x=this.x,this.barrel.y=this.y,this.lifeBar.x=this.x,this.lifeBar.y=this.y,this.scene.physics.velocityFromRotation(this.rotation-Math.PI/2,this.speed,this.body.velocity),this.handleShooting()):this.destroy()}destroy(){this.setVisible(!1),this.barrel.setVisible(!1),this.lifeBar.setVisible(!1)}reborn(){this.active=!0,this.setVisible(!0),this.barrel.setVisible(!0),this.lifeBar.setVisible(!0),this.setPosition(this.originPosition.x,this.originPosition.y)}handleShooting(){this.scene.time.now>this.lastShoot&&this.bullets.getLength()<10&&(this.bullets.add(new a({scene:this.scene,rotation:this.barrel.rotation,x:this.barrel.x,y:this.barrel.y,texture:"bulletRed"})),this.lastShoot=this.scene.time.now+400)}redrawLifebar(){this.lifeBar.clear(),this.lifeBar.fillStyle(15100456,1),this.lifeBar.fillRect(-this.width/2,this.height/2,this.width*this.health,15),this.lifeBar.lineStyle(2,16777215),this.lifeBar.strokeRect(-this.width/2,this.height/2,this.width,15),this.lifeBar.setDepth(-1)}updateHealth(e){this.health>0&&(this.health-=e,this.redrawLifebar()),this.health<=0&&(this.health=0,this.active=!1)}reset(){console.log("reborn enemy"),this.reborn(),this.health=1,this.redrawLifebar()}stopMoving(){this.body.setVelocity(0,0)}}class o extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture),this.initImage(),this.scene.add.existing(this)}initImage(){this.setOrigin(0,0).setDepth(-2),this.scene.physics.world.enable(this),this.body.setImmovable(!0)}update(){}}class l extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture,e.frame),this.init()}init(){this.setScrollFactor(0),this.setScale(2),this.setInteractive(),this.on("pointerover",(()=>{this.setAlpha(.8),this.setScale(1.8)})),this.on("pointerout",(()=>{this.setAlpha(1),this.setScale(2)}))}addFunc(e){this.on("pointerdown",(()=>{this.setScale(1.5),e()})),this.on("pointerup",(()=>{this.setScale(2)}))}}class c extends Phaser.GameObjects.Container{constructor(e){super(e),this.scene.add.existing(this),this.init()}static getInstance(e){return c.instance||(c.instance=new c(e)),c.instance}init(){this.observable=h.getInstance(),this.observable.subscribe(this),this.overlay=this.scene.add.graphics().fillStyle(0,.7).fillRect(0,0,this.scene.sys.canvas.width,this.scene.sys.canvas.height).setDepth(-.5).setVisible(!1).setScrollFactor(0),this.setSize(1e3,1e3),this.setPosition(this.scene.cameras.main.width/2,this.scene.cameras.main.height/2);const e=this.scene.add.bitmapText(0,-250,"font","Pause",64).setOrigin(.5).setDepth(2).setTint(9196296).setInteractive(),t=this.scene.add.image(0,0,"popupWindow");t.setScale(800/t.width,900/t.height);const s=new l({scene:this.scene,x:0,y:-150,texture:"resumeButton",frame:0});s.addFunc((()=>this.close()));const i=new l({scene:this.scene,x:0,y:0,texture:"replayButton",frame:0});i.addFunc((()=>{this.observable.notify("PausePopup replay was press"),this.close()})),this.speaker=new l({scene:this.scene,x:0,y:150,texture:"unmuteButton",frame:0}),this.speaker.addFunc((()=>{"unmuteButton"==this.speaker.texture.key?(this.speaker.setTexture("muteButton"),this.observable.notify("Speaker was mute")):(this.speaker.setTexture("unmuteButton"),this.observable.notify("Speaker was unmute"))})),this.add([t,e,s,i,this.speaker]),this.setScrollFactor(0),this.setScale(0)}open(){this.overlay.setVisible(!0),this.scene.add.tween({targets:this,scale:1,duration:500,ease:"bounce",onComplete:()=>{this.observable.notify("Opened Pause Popup")}})}close(){this.observable.notify("Closed Pause Popup"),this.overlay.setVisible(!1),this.scene.add.tween({targets:this,scale:0,duration:200,ease:"Quintic.easeInOut"})}observerMessage(e){"Speaker was mute"==e?this.speaker.setTexture("muteButton"):"Speaker was unmute"==e&&this.speaker.setTexture("unmuteButton")}}c.instance=null;class d extends Phaser.GameObjects.Container{constructor(e){super(e),this.scene.add.existing(this),this.init()}static getInstance(e){return d.instance||(d.instance=new d(e)),d.instance}init(){this.observable=h.getInstance(),this.observable.subscribe(this),this.overlay=this.scene.add.graphics().fillStyle(0,.7).fillRect(0,0,this.scene.cameras.main.width,this.scene.cameras.main.height).setDepth(-.5).setVisible(!1).setScrollFactor(0),this.scene.add.container(0,0,this),this.setSize(1e3,1e3),this.setPosition(this.scene.cameras.main.width/2,this.scene.cameras.main.height/2).setScrollFactor(0);const e=this.scene.add.image(0,0,"popupWindow");e.setScale(800/e.width,900/e.height);const t=this.scene.add.bitmapText(0,-200,"font","High Score",48).setOrigin(.5).setDepth(2).setTint(9196296);this.highScoreDisplay=this.scene.add.bitmapText(0,-150,"font2","0",48).setOrigin(.5).setDepth(2).setTint(7830138);const s=this.scene.add.bitmapText(0,-50,"font","Score",48).setOrigin(.5).setDepth(2).setTint(9196296);this.scoreDisplay=this.scene.add.bitmapText(0,0,"font2","0",48).setOrigin(.5).setDepth(2).setTint(7830138);const i=new l({scene:this.scene,x:0,y:200,texture:"replayButton",frame:0});i.addFunc((()=>{this.close()})),this.speaker=new l({scene:this.scene,x:-150,y:200,texture:"unmuteButton",frame:0}),this.speaker.addFunc((()=>{"unmuteButton"==this.speaker.texture.key?(this.speaker.setTexture("muteButton"),this.observable.notify("Speaker was mute")):(this.speaker.setTexture("unmuteButton"),this.observable.notify("Speaker was unmute"))}));const a=new l({scene:this.scene,x:150,y:200,texture:"quitButton",frame:0});a.addFunc((()=>{this.observable.notify("Quit Button was press"),this.close()})),this.add([e,t,s,this.highScoreDisplay,this.scoreDisplay,i,this.speaker,a]),this.setInteractive(),this.setVisible(!1)}open(e,t){this.scoreDisplay.setText(`${e}`),this.highScoreDisplay.setText(`${t}`),this.setScale(0),this.setVisible(!0),this.scene.add.tween({delay:500,targets:this,scale:1,duration:500,ease:"bounce",onStart:()=>{this.overlay.setVisible(!0)}})}close(){this.observable.notify("Closed GameOver Popup"),this.overlay.setVisible(!1),this.scene.add.tween({targets:this,scale:0,duration:200,ease:"Quintic.easeInOut"})}observerMessage(e){"Speaker was mute"==e?this.speaker.setTexture("muteButton"):"Speaker was unmute"==e&&this.speaker.setTexture("unmuteButton")}}d.instance=null;class p extends Phaser.GameObjects.Container{constructor(e){super(e),this.scene.add.existing(this),this.init()}static getInstance(e){return p.instance||(p.instance=new p(e)),p.instance}init(){this.score=0,this.highScore=0,this.scoreDisplay=this.scene.add.bitmapText(200,0,"font2",`Score: ${this.score}`,32).setOrigin(0).setDepth(-.5).setTint(16777215).setInteractive().setScrollFactor(0),this.highScoreDisplay=this.scene.add.bitmapText(200,50,"font2",`High Score: ${this.highScore}`,32).setOrigin(0).setDepth(-.5).setTint(16777215).setInteractive().setScrollFactor(0)}setScore(e){this.score=e,this.scoreDisplay.setText(`Score: ${this.score}`),this.score>this.highScore&&(this.highScore=this.score,this.highScoreDisplay.setText(`High Score: ${this.highScore}`))}addScore(e){this.score+=e,this.scoreDisplay.setText(`Score: ${this.score}`),this.score>this.highScore&&(this.highScore=this.score,this.highScoreDisplay.setText(`High Score: ${this.highScore}`))}getScore(){return this.score}getHighScore(){return this.highScore}}p.instance=null;class u extends Phaser.GameObjects.Image{constructor(e){super(e.scene,e.x,e.y,e.texture),this.initImage(),this.scene.add.existing(this)}initImage(){this.setOrigin(0,0).setDepth(-1),this.scene.physics.world.enable(this)}update(){}destroy(){this.setActive(!1),this.setVisible(!1)}reset(){this.setActive(!0),this.setVisible(!0)}}class y{constructor(e){this.scene=e,this.init()}static getInstance(e){return y.instance||(y.instance=new y(e)),y.instance}init(){this.hitButtonSound=this.scene.sound.add("hitButton").setRate(1.5),this.explosionSound=this.scene.sound.add("explosion"),this.hitSound=this.scene.sound.add("hit").setRate(2)}playHitButton(){this.hitButtonSound.play()}playExplosion(){this.explosionSound.play()}playHit(){this.hitSound.play()}mute(){this.hitButtonSound.setMute(!0),this.explosionSound.setMute(!0),this.hitSound.setMute(!0)}unMute(){this.hitButtonSound.setMute(!1),this.explosionSound.setMute(!1),this.hitSound.setMute(!1)}}y.instance=null;class b extends Phaser.Scene{constructor(){super({key:"GameScene"})}init(){}create(){console.log("Create game Scene"),this.audioManager=y.getInstance(this),this.updateState=!0,this.observable=h.getInstance(),this.scoreUI=p.getInstance(this),this.observable.subscribe(this),this.map=this.make.tilemap({key:"levelMap"}),this.tileset=this.map.addTilesetImage("tiles"),this.layer=this.map.createLayer("tileLayer",this.tileset,0,0),this.layer.setCollisionByProperty({collide:!0}).setDepth(-10),this.obstacles=this.add.group({runChildUpdate:!0}),this.enemies=this.add.group({}),this.collectibles=this.add.group({}),this.convertObjects(),this.physics.add.collider(this.player,this.layer),this.physics.add.collider(this.player,this.obstacles),this.physics.add.collider(this.enemies,this.obstacles),this.physics.add.collider(this.enemies,this.layer),this.physics.add.collider(this.enemies,this.player),this.physics.add.collider(this.enemies,this.enemies),this.physics.add.collider(this.player.getBullets(),this.layer,this.bulletHitLayer,void 0,this),this.physics.add.collider(this.player.getBullets(),this.obstacles,this.bulletHitObstacles,void 0,this),this.physics.add.overlap(this.player,this.collectibles,this.playerOverlapCollectible,void 0,this);for(const e of this.enemies.getChildren()){const t=e;this.physics.add.overlap(this.player.getBullets(),e,this.playerBulletHitEnemy,void 0,this),this.physics.add.overlap(t.getBullets(),this.player,this.enemyBulletHitPlayer,void 0,this),this.physics.add.collider(t.getBullets(),this.obstacles,this.bulletHitObstacles,void 0,this),this.physics.add.collider(t.getBullets(),this.layer,this.bulletHitLayer,void 0,this)}this.cameras.main.startFollow(this.player),this.pausePopup=c.getInstance(this),this.gameOverPopup=d.getInstance(this),this.add.bitmapText(0,0,"font","II",100).setInteractive().on("pointerdown",(()=>{this.updateState&&this.pausePopup.open()})).setScrollFactor(0).setDepth(-1),this.explosionSprite=this.add.sprite(0,0,"").setVisible(!1).setScale(2)}update(){if(this.updateState){this.player.update();for(const e of this.enemies.getChildren()){const t=e;if(t.update(),this.player.active&&e.active){const e=Phaser.Math.Angle.Between(t.body.x,t.body.y,this.player.body.x,this.player.body.y);t.getBarrel().angle=(e+Math.PI/2)*Phaser.Math.RAD_TO_DEG,t.angle=(e+Math.PI/2)*Phaser.Math.RAD_TO_DEG}}}}convertObjects(){const e=this.map.getObjectLayer("objects");e&&e.objects.forEach((e=>{if("player"===e.type)this.player=new r({scene:this,x:e.x,y:e.y,texture:"tankRed"});else if("enemy"===e.type){const t=new n({scene:this,x:e.x,y:e.y,texture:"tankDark"});this.enemies.add(t)}else if("collectible"==e.type){const t=new u({scene:this,x:e.x,y:e.y,texture:e.name});this.collectibles.add(t)}else{const t=new o({scene:this,x:e.x,y:e.y-40,texture:e.type});this.obstacles.add(t)}}))}bulletHitLayer(e,t){e.destroy()}bulletHitObstacles(e,t){e.destroy()}enemyBulletHitPlayer(e,t){e.destroy(),t.updateHealth(),!t.active&&t.visible&&(this.playExplosionEffect(t.x,t.y),this.audioManager.playExplosion(),this.gameOverPopup.open(this.scoreUI.getScore(),this.scoreUI.getHighScore()),this.player.setActive(!1))}playerBulletHitEnemy(e,t){if(e.destroy(),t.updateHealth(this.player.getDamage()),this.audioManager.playHit(),!t.active&&t.visible){this.playExplosionEffect(t.x,t.y),this.audioManager.playExplosion(),this.scoreUI.addScore(100);const e=this.enemies.getChildren().filter((e=>e.active));e.length<=0&&(this.gameOverPopup.open(this.scoreUI.getScore(),this.scoreUI.getHighScore()),this.player.setActive(!1))}}playerOverlapCollectible(e,t){if(t.active)switch(t.texture.key){case"health":this.player.fullHealth(),t.destroy();break;case"barrelRed":this.player.setBarrel(1),t.destroy();break;case"barrel2Red":this.player.setBarrel(2),t.destroy();break;case"barrel3Red":this.player.setBarrel(3),t.destroy();break;case"shield":this.player.addShield(),t.destroy()}}playExplosionEffect(e,t){this.explosionSprite.visible||this.explosionSprite.setVisible(!0),this.explosionSprite.setPosition(e,t).play("explosion",!0)}pauseScene(){this.updateState=!1,this.tweens.pauseAll()}resumeScene(){this.updateState=!0,this.tweens.resumeAll()}restart(){this.scoreUI.setScore(0),this.player.reset();for(const e of this.enemies.getChildren())e.reset();for(const e of this.collectibles.getChildren())e.reset()}observerMessage(e){switch(console.log("GameScene got Message: "+e),e){case"PausePopup replay was press":case"Closed GameOver Popup":this.restart(),this.audioManager.playHitButton();break;case"Opened Pause Popup":this.pauseScene(),this.audioManager.playHitButton(),this.player.active=!1;for(const e of this.enemies.getChildren())e.stopMoving();break;case"Closed Pause Popup":this.resumeScene(),this.audioManager.playHitButton(),this.player.active=!0;break;case"Quit Button was press":this.restart(),this.audioManager.playHitButton(),this.scene.switch("MenuScene");break;case"Speaker was mute":this.audioManager.mute();break;case"Speaker was unmute":this.audioManager.unMute(),this.audioManager.playHitButton()}}}class g extends Phaser.Scene{constructor(){super({key:"MenuScene"}),this.bitmapTexts=[]}init(){this.input.keyboard&&(this.startKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)),this.startKey.isDown=!1}create(){const e=this.add.image(0,0,"backgroundMenu",0);e.setScale(this.sys.canvas.width/e.displayWidth,this.sys.canvas.height/e.displayHeight).setScrollFactor(0).setOrigin(0,0),this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width/2-120,this.sys.canvas.height/2,"font","PRESS TO PLAY",30)),this.bitmapTexts.push(this.add.bitmapText(this.sys.canvas.width/2-120,this.sys.canvas.height/2-100,"font","TANK",100)),this.input.on("pointerdown",(()=>{const e=this.cameras.main.postFX.addWipe();this.scene.transition({target:"GameScene",duration:2e3,moveBelow:!0,onUpdate:t=>{e.progress=t}})}))}update(){}}const m={title:"Tank",url:"https://github.com/digitsensitive/phaser3-typescript",version:"2.0",width:window.innerWidth,height:window.innerHeight,zoom:1,type:Phaser.AUTO,parent:"game",scene:[i,g,b],input:{keyboard:!0},physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},render:{pixelArt:!1,antialias:!0}};class x extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{new x(m)}))}},s={};function i(e){var a=s[e];if(void 0!==a)return a.exports;var h=s[e]={exports:{}};return t[e].call(h.exports,h,h.exports,i),h.exports}i.m=t,e=[],i.O=(t,s,a,h)=>{if(!s){var r=1/0;for(c=0;c<e.length;c++){for(var[s,a,h]=e[c],n=!0,o=0;o<s.length;o++)(!1&h||r>=h)&&Object.keys(i.O).every((e=>i.O[e](s[o])))?s.splice(o--,1):(n=!1,h<r&&(r=h));if(n){e.splice(c--,1);var l=a();void 0!==l&&(t=l)}}return t}h=h||0;for(var c=e.length;c>0&&e[c-1][2]>h;c--)e[c]=e[c-1];e[c]=[s,a,h]},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={179:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var a,h,[r,n,o]=s,l=0;if(r.some((t=>0!==e[t]))){for(a in n)i.o(n,a)&&(i.m[a]=n[a]);if(o)var c=o(i)}for(t&&t(s);l<r.length;l++)h=r[l],i.o(e,h)&&e[h]&&e[h][0](),e[h]=0;return i.O(c)},s=self.webpackChunktype_project_template=self.webpackChunktype_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var a=i.O(void 0,[216],(()=>i(330)));a=i.O(a)})();