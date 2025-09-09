"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

class RunnerScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys | null;
  ground!: Phaser.GameObjects.TileSprite;
  trees!: Phaser.Physics.Arcade.Group;
  birds!: Phaser.Physics.Arcade.Group;
  coins!: Phaser.Physics.Arcade.Group;
  platforms!: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  speed = 280;
  level = 1;
  gameOver = false;

  // double jump
  jumps = 0;
  maxJumps = 2;

  constructor() {
    super({ key: "RunnerScene" });
  }

  preload() {
    this.load.image("sky", "https://labs.phaser.io/assets/skies/sky4.png");
    this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
    this.load.image("tree", "https://labs.phaser.io/assets/sprites/tree.png");
    this.load.image("bird", "https://labs.phaser.io/assets/sprites/ufo.png");
    this.load.image("coin", "https://labs.phaser.io/assets/sprites/coin.png"); // round gold coin
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/platform.png");

    this.load.spritesheet("dude", "https://labs.phaser.io/assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // background
    this.add.image(this.scale.width / 2, this.scale.height / 2, "sky").setDisplaySize(this.scale.width, this.scale.height);

    // scrolling ground
    this.ground = this.add.tileSprite(0, this.scale.height - 48, this.scale.width * 2, 96, "ground");
    this.ground.setOrigin(0, 0);

    // invisible static ground
    const staticGround = this.physics.add.staticGroup();
    staticGround.create(this.scale.width / 2, this.scale.height - 32, "ground").setScale(this.scale.width / 200, 1).refreshBody();

    // player
    this.player = this.physics.add.sprite(120, this.scale.height - 100, "dude") as typeof this.player;
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(1200);
    this.player.setSize(20, 40).setOffset(6, 8);

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 10,
    });
    this.player.anims.play("run");

    this.physics.add.collider(this.player, staticGround, () => {
      this.jumps = 0; // reset jumps on ground
    });

    // groups
    this.trees = this.physics.add.group();
    this.birds = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.platforms = this.physics.add.group({ allowGravity: false, immovable: true });

    this.physics.add.collider(this.player, this.platforms, () => {
      if (this.player.body.blocked.down) this.jumps = 0;
    });

    // score text
    this.scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "28px", color: "#fff" });
    this.scoreText.setScrollFactor(0).setDepth(10);

    // collisions
    this.physics.add.overlap(this.player, this.trees, this.hitObstacle, undefined, this);
    this.physics.add.overlap(this.player, this.birds, this.hitObstacle, undefined, this);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, undefined, this);

    // controls
    this.cursors = this.input.keyboard?.createCursorKeys() ?? null;
    this.input.on("pointerdown", () => this.jumpIfPossible());

    // spawn events
    this.time.addEvent({ delay: 2500, loop: true, callback: () => this.spawnTree() });
    this.time.addEvent({ delay: 4000, loop: true, callback: () => this.spawnBird() });
    this.time.addEvent({ delay: 3500, loop: true, callback: () => this.spawnCoin() });

    // score increment
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (!this.gameOver) {
          this.score += 1;
          this.scoreText.setText(`Score: ${this.score} | Level ${this.level}`);
        }
      },
    });

    // difficulty scaling
    this.time.addEvent({
      delay: 120000,
      loop: true,
      callback: () => {
        if (!this.gameOver) {
          this.speed += 60;
          this.level += 1;
        }
      },
    });
  }

  spawnTree() {
    if (this.gameOver) return;
    const tree = this.trees.create(this.scale.width + 64, this.scale.height - 100, "tree") as Phaser.Physics.Arcade.Sprite;
    tree.setVelocityX(-this.speed);
    tree.setImmovable(true);
    tree.body.allowGravity = false;

    // hitbox only trunk
    tree.setSize(30, 60).setOffset(35, 40);

    // sometimes add platform above
    if (Phaser.Math.Between(0, 100) < 40) this.spawnPlatform();
  }

  spawnBird() {
    if (this.gameOver) return;
    const yPos = Phaser.Math.Between(this.scale.height - 220, this.scale.height - 160);
    const bird = this.birds.create(this.scale.width + 64, yPos, "bird") as Phaser.Physics.Arcade.Sprite;
    bird.setVelocityX(-this.speed - 50);
    bird.body.allowGravity = false;

    // tight hitbox
    bird.setSize(28, 20).setOffset(6, 10);
  }

  spawnPlatform() {
    if (this.gameOver) return;
    const yPos = this.scale.height - 220;
    const platform = this.platforms.create(this.scale.width + 100, yPos, "platform") as Phaser.Physics.Arcade.Sprite;
    platform.setVelocityX(-this.speed);
    platform.setSize(100, 20).setOffset(0, 0);
  }

  spawnCoin() {
    if (this.gameOver) return;

    if (Phaser.Math.Between(0, 100) < 50) {
      // ground coin
      const coin = this.coins.create(this.scale.width + 64, this.scale.height - 100, "coin") as Phaser.Physics.Arcade.Sprite;
      coin.setVelocityX(-this.speed);
      coin.body.allowGravity = false;
      coin.setCircle(12).setOffset(0, 0);
    } else {
      // airborne coin arc
      const startY = Phaser.Math.Between(this.scale.height - 250, this.scale.height - 200);
      for (let i = 0; i < 5; i++) {
        const coin = this.coins.create(this.scale.width + 64 + i * 32, startY - i * 20, "coin") as Phaser.Physics.Arcade.Sprite;
        coin.setVelocityX(-this.speed);
        coin.body.allowGravity = false;
        coin.setCircle(12).setOffset(0, 0);
      }
    }
  }

  collectCoin = (_player: Phaser.GameObjects.GameObject, coinObj: Phaser.GameObjects.GameObject) => {
    const coin = coinObj as Phaser.Physics.Arcade.Sprite;
    coin.disableBody(true, true);
    this.score += 50;
    this.scoreText.setText(`Score: ${this.score} | Level ${this.level}`);
  };

  hitObstacle = (playerObj: Phaser.GameObjects.GameObject, _obs: Phaser.GameObjects.GameObject) => {
    const player = playerObj as Phaser.Physics.Arcade.Sprite;
    if (this.gameOver) return;
    this.gameOver = true;
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.stop();
    this.scoreText.setText(`Game Over! Final Score: ${this.score}`);
  };

  jumpIfPossible() {
    if (this.gameOver) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (body.blocked.down) {
      this.player.setVelocityY(-520);
      this.jumps = 1;
    } else if (this.jumps < this.maxJumps) {
      this.player.setVelocityY(-480);
      this.jumps++;
    }
  }

  update(time: number, delta: number) {
    if (this.gameOver) return;

    if ((this.cursors?.up?.isDown || this.cursors?.space?.isDown) && Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.jumpIfPossible();
    }

    // scroll ground
    this.ground.tilePositionX += (this.speed * delta) / 1000;

    // cleanup
    this.trees.getChildren().forEach((c) => { if ((c as Phaser.Physics.Arcade.Sprite).x < -100) c.destroy(); });
    this.birds.getChildren().forEach((c) => { if ((c as Phaser.Physics.Arcade.Sprite).x < -100) c.destroy(); });
    this.coins.getChildren().forEach((c) => { if ((c as Phaser.Physics.Arcade.Sprite).x < -100) c.destroy(); });
    this.platforms.getChildren().forEach((c) => { if ((c as Phaser.Physics.Arcade.Sprite).x < -150) c.destroy(); });
  }
}

const Platformer: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: "runner-container",
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
      },
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 1000 }, debug: false },
      },
      scene: RunnerScene,
      backgroundColor: "#87CEEB",
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="runner-container" className="w-full h-screen touch-none" />;
};

export default Platformer;
