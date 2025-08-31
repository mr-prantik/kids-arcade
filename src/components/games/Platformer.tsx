// "use client";

// import React, { useEffect, useRef } from "react";
// import Phaser from "phaser";

// class PlatformerScene extends Phaser.Scene {
//   player!: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };
//   cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
//   platforms!: Phaser.Physics.Arcade.StaticGroup;

//   constructor() {
//     super("PlatformerScene");
//   }

//   preload() {
//     this.load.image("sky", "https://labs.phaser.io/assets/skies/sky4.png");
//     this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
//     this.load.spritesheet("dude", "https://labs.phaser.io/assets/sprites/dude.png", {
//       frameWidth: 32,
//       frameHeight: 48,
//     });
//   }

//   create() {
//     this.add.image(400, 300, "sky");

//     // Platforms
//     this.platforms = this.physics.add.staticGroup();
//     this.platforms.create(400, 568, "ground").setScale(2).refreshBody();
//     this.platforms.create(600, 400, "ground");
//     this.platforms.create(50, 250, "ground");
//     this.platforms.create(750, 220, "ground");

//     // Player
//     this.player = this.physics.add.sprite(100, 450, "dude") as typeof this.player;
//     this.player.setBounce(0.2);
//     this.player.setCollideWorldBounds(true);

//     // Animations
//     this.anims.create({
//       key: "left",
//       frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
//       frameRate: 10,
//       repeat: -1,
//     });

//     this.anims.create({
//       key: "turn",
//       frames: [{ key: "dude", frame: 4 }],
//       frameRate: 20,
//     });

//     this.anims.create({
//       key: "right",
//       frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
//       frameRate: 10,
//       repeat: -1,
//     });

//     // Physics collisions
//     this.physics.add.collider(this.player, this.platforms);

//     // Controls (safe fallback if keyboard is null)
//     this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
//   }

//   update() {
//     if (!this.cursors) return;

//     if (this.cursors.left?.isDown) {
//       this.player.setVelocityX(-160);
//       this.player.anims.play("left", true);
//     } else if (this.cursors.right?.isDown) {
//       this.player.setVelocityX(160);
//       this.player.anims.play("right", true);
//     } else {
//       this.player.setVelocityX(0);
//       this.player.anims.play("turn");
//     }

//     // Jump only when touching ground
//     const body = this.player.body as Phaser.Physics.Arcade.Body;
//     if (this.cursors.up?.isDown && body.touching.down) {
//       this.player.setVelocityY(-330);
//     }
//   }
// }

// const Platformer: React.FC = () => {
//   const gameRef = useRef<Phaser.Game | null>(null);

//   useEffect(() => {
//     if (gameRef.current) return;

//     gameRef.current = new Phaser.Game({
//         type: Phaser.AUTO,
//         width: 800,
//         height: 600,
//         physics: {
//             default: "arcade",
//             arcade: { gravity: { x: 0, y: 300 }, debug: false }, // ✅ fixed
//         },
//         scene: PlatformerScene,
//         parent: "platformer-container",
//     });

//     return () => {
//       gameRef.current?.destroy(true);
//       gameRef.current = null;
//     };
//   }, []);

//   return <div id="platformer-container" className="w-full h-full" />;
// };

// export default Platformer;


//--------------------------------------------------------------------------------------------------------------------

"use client";

import React, { useEffect, useRef } from "react";
import Phaser from "phaser";

class PlatformerScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite & { body: Phaser.Physics.Arcade.Body };
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  platforms!: Phaser.Physics.Arcade.StaticGroup;
  coins!: Phaser.Physics.Arcade.Group;
  enemies!: Phaser.Physics.Arcade.Group;
  score: number = 0;
  scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super("PlatformerScene");
  }

  preload() {
    this.load.image("sky", "https://labs.phaser.io/assets/skies/sky4.png");
    this.load.image("ground", "https://labs.phaser.io/assets/sprites/platform.png");
    this.load.image("coin", "https://labs.phaser.io/assets/sprites/gold_1.png");
    this.load.image("enemy", "https://labs.phaser.io/assets/sprites/baddie.png");

    this.load.spritesheet("dude", "https://labs.phaser.io/assets/sprites/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // Background
    this.add.image(this.scale.width / 2, this.scale.height / 2, "sky").setDisplaySize(this.scale.width, this.scale.height);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(this.scale.width / 2, this.scale.height - 32, "ground").setScale(2).refreshBody();
    this.platforms.create(600, 400, "ground");
    this.platforms.create(50, 250, "ground");
    this.platforms.create(750, 220, "ground");

    // Player
    this.player = this.physics.add.sprite(100, this.scale.height - 150, "dude") as typeof this.player;
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Coins
    this.coins = this.physics.add.group({
      key: "coin",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.coins.children.iterate((child) => {
      const coin = child as Phaser.Physics.Arcade.Sprite;
      coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      return null;
    });

    // Enemies
    this.enemies = this.physics.add.group();

    // Score text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#fff",
    }).setScrollFactor(0);

    // Physics
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(
      this.player,
      this.coins,
      (playerObj, coinObj) => this.collectCoin(playerObj as Phaser.Physics.Arcade.Sprite, coinObj as Phaser.Physics.Arcade.Sprite),
      undefined,
      this
    );

    this.physics.add.collider(
      this.player,
      this.enemies,
      (playerObj, enemyObj) => this.hitEnemy(playerObj as Phaser.Physics.Arcade.Sprite, enemyObj as Phaser.Physics.Arcade.Sprite),
      undefined,
      this
    );

    // Controls
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;

    // Spawn enemies
    this.time.addEvent({
      delay: 3000,
      loop: true,
      callback: this.spawnEnemy,
      callbackScope: this,
    });
  }

  collectCoin(_player: Phaser.Physics.Arcade.Sprite, coin: Phaser.Physics.Arcade.Sprite) {
    coin.disableBody(true, true);
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);
  }

  spawnEnemy() {
    const x = Phaser.Math.Between(100, this.scale.width - 100);
    const enemy = this.enemies.create(x, 16, "enemy") as Phaser.Physics.Arcade.Sprite;
    enemy.setBounce(1);
    enemy.setCollideWorldBounds(true);
    enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }

  hitEnemy(player: Phaser.Physics.Arcade.Sprite, _enemy: Phaser.Physics.Arcade.Sprite) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    this.scoreText.setText("Game Over! Final Score: " + this.score);
  }

  update() {
    if (!this.cursors) return;

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.cursors.up?.isDown && body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}

const Platformer: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameRef.current) return;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,          // ✅ responsive scaling
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1024,                      // base width
        height: 768,                      // base height
      },
      physics: {
        default: "arcade",
        arcade: { gravity: { x: 0, y: 300 }, debug: false },
      },
      scene: PlatformerScene,
      parent: "platformer-container",
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="platformer-container" className="w-full h-screen" />;
};

export default Platformer;



