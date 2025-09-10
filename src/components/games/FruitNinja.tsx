// "use client";

// import React, { useEffect, useRef } from "react";

// const FruitNinja: React.FC = () => {
//   const gameRef = useRef<any>(null);

//   useEffect(() => {
//     let Phaser: any;
//     (async () => {
//       const phaserModule = await import("phaser");
//       Phaser = phaserModule;

//       if (gameRef.current) return;

//       class FruitScene extends Phaser.Scene {
//         fruits!: Phaser.Physics.Arcade.Group;
//         score = 0;
//         scoreText!: Phaser.GameObjects.Text;
//         lives = 3;
//         heartIcons: Phaser.GameObjects.Image[] = [];

//         // difficulty control
//         spawnDelay = 1800;
//         fruitSpeed = 140;
//         fruitsAtOnce = 1;

//         constructor() {
//           super({ key: "FruitScene" });
//         }

//         preload() {
//           // fruits
//           this.load.image("apple", "https://labs.phaser.io/assets/sprites/apple.png");
//           this.load.image("banana", "https://labs.phaser.io/assets/sprites/banana.png");
//           this.load.image("melon", "https://labs.phaser.io/assets/sprites/melon.png");

//           // heart for lives
//           this.load.image("heart", "https://labs.phaser.io/assets/ui/heart.png");
//         }

//         create() {
//           this.fruits = this.physics.add.group();

//           // Score text
//           this.scoreText = this.add.text(16, 16, "Score: 0", {
//             fontSize: "28px",
//             color: "#fff",
//           });

//           // Lives (hearts)
//           for (let i = 0; i < this.lives; i++) {
//             const heart = this.add.image(this.scale.width - 40 - i * 40, 30, "heart");
//             heart.setScale(1.2);
//             this.heartIcons.push(heart);
//           }

//           // Fruit spawner
//           this.time.addEvent({
//             delay: this.spawnDelay,
//             loop: true,
//             callback: () => this.spawnFruit(),
//           });

//           // Swipe detection
//           this.input.on("pointermove", (pointer: any) => {
//             const sliced = this.physics.overlapRect(pointer.x, pointer.y, 50, 50);
//             sliced.forEach((obj: any) => {
//               const fruit = obj.gameObject as Phaser.Physics.Arcade.Sprite;
//               if (fruit.active) {
//                 fruit.disableBody(true, true);

//                 // slice animation
//                 this.add.tween({
//                   targets: fruit,
//                   alpha: 0,
//                   duration: 200,
//                   onComplete: () => fruit.destroy(),
//                 });

//                 this.score += 10;
//                 this.scoreText.setText(`Score: ${this.score}`);

//                 // difficulty scaling
//                 if (this.score % 100 === 0) {
//                   this.increaseDifficulty();
//                 }
//               }
//             });
//           });
//         }

//         spawnFruit() {
//           const fruitTypes = ["apple", "banana", "melon"];

//           for (let i = 0; i < this.fruitsAtOnce; i++) {
//             const choice = Phaser.Math.RND.pick(fruitTypes);

//             const x = Phaser.Math.Between(50, this.scale.width - 50);
//             const fruit = this.fruits.create(x, -50, choice) as Phaser.Physics.Arcade.Sprite;

//             fruit.setVelocityY(this.fruitSpeed);
//             fruit.setCollideWorldBounds(false);
//             fruit.setScale(1.1);
//           }
//         }

//         increaseDifficulty() {
//           // faster falling fruits
//           this.fruitSpeed += 20;

//           // more fruits
//           if (this.fruitsAtOnce < 3) {
//             this.fruitsAtOnce++;
//           }

//           // spawn more frequently
//           if (this.spawnDelay > 800) {
//             this.spawnDelay -= 200;
//             // update timer
//             this.time.addEvent({
//               delay: this.spawnDelay,
//               loop: true,
//               callback: () => this.spawnFruit(),
//             });
//           }
//         }

//         update() {
//           this.fruits.getChildren().forEach((fruitObj) => {
//             const fruit = fruitObj as Phaser.Physics.Arcade.Sprite;
//             if (fruit.y > this.scale.height && fruit.active) {
//               fruit.disableBody(true, true);

//               // lose a life
//               this.lives--;
//               const heart = this.heartIcons[this.lives];
//               if (heart) heart.setVisible(false);

//               if (this.lives <= 0) {
//                 this.physics.pause();
//                 this.scoreText.setText(`Game Over! Final Score: ${this.score}`);
//               }
//             }
//           });
//         }
//       }

//       gameRef.current = new Phaser.Game({
//         type: Phaser.AUTO,
//         parent: "fruit-ninja-container",
//         scale: {
//           mode: Phaser.Scale.FIT,
//           autoCenter: Phaser.Scale.CENTER_BOTH,
//           width: 480,
//           height: 800,
//         },
//         physics: {
//           default: "arcade",
//           arcade: { gravity: { y: 120 }, debug: false },
//         },
//         scene: FruitScene,
//         backgroundColor: "#111",
//       });
//     })();

//     return () => {
//       gameRef.current?.destroy(true);
//       gameRef.current = null;
//     };
//   }, []);

//   return <div id="fruit-ninja-container" className="w-full h-screen touch-none" />;
// };

// export default FruitNinja;






"use client";

import React, { useEffect, useRef } from "react";
import type Phaser from "phaser";

const FruitNinja: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    let PhaserModule: typeof Phaser;

    (async () => {
      const phaserModule = await import("phaser");
      PhaserModule = phaserModule;

      if (gameRef.current) return;

      class FruitScene extends PhaserModule.Scene {
        fruits!: Phaser.Physics.Arcade.Group;
        score = 0;
        scoreText!: Phaser.GameObjects.Text;
        lives = 3;
        heartIcons: Phaser.GameObjects.Image[] = [];

        // Difficulty control
        spawnDelay = 1800;
        fruitSpeed = 140;
        fruitsAtOnce = 1;

        constructor() {
          super({ key: "FruitScene" });
        }

        preload() {
          // Fruits
          this.load.image("apple", "https://labs.phaser.io/assets/sprites/apple.png");
          this.load.image("banana", "https://labs.phaser.io/assets/sprites/banana.png");
          this.load.image("melon", "https://labs.phaser.io/assets/sprites/melon.png");

          // Heart for lives
          this.load.image("heart", "https://labs.phaser.io/assets/ui/heart.png");
        }

        create() {
          this.fruits = this.physics.add.group();

          // Score text
          this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "28px",
            color: "#fff",
          });

          // Lives (hearts)
          for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(this.scale.width - 40 - i * 40, 30, "heart");
            heart.setScale(1.2);
            this.heartIcons.push(heart);
          }

          // Fruit spawner
          this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: () => this.spawnFruit(),
          });

          // Swipe detection
          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            const sliced = this.physics.overlapRect(pointer.x, pointer.y, 50, 50);

            sliced.forEach((body) => {
              const fruit = body.gameObject as Phaser.Physics.Arcade.Sprite;
              if (fruit && fruit.active) {
                fruit.disableBody(true, true);

                // Slice animation
                this.add.tween({
                  targets: fruit,
                  alpha: 0,
                  duration: 200,
                  onComplete: () => fruit.destroy(),
                });

                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);

                // Difficulty scaling
                if (this.score % 100 === 0) {
                  this.increaseDifficulty();
                }
              }
            });
          });
        }

        spawnFruit() {
          const fruitTypes = ["apple", "banana", "melon"];

          for (let i = 0; i < this.fruitsAtOnce; i++) {
            const choice = PhaserModule.Math.RND.pick(fruitTypes);

            const x = PhaserModule.Math.Between(50, this.scale.width - 50);
            const fruit = this.fruits.create(x, -50, choice) as Phaser.Physics.Arcade.Sprite;

            fruit.setVelocityY(this.fruitSpeed);
            fruit.setCollideWorldBounds(false);
            fruit.setScale(1.1);
          }
        }

        increaseDifficulty() {
          // Faster falling fruits
          this.fruitSpeed += 20;

          // More fruits
          if (this.fruitsAtOnce < 3) {
            this.fruitsAtOnce++;
          }

          // Spawn more frequently
          if (this.spawnDelay > 800) {
            this.spawnDelay -= 200;
            this.time.addEvent({
              delay: this.spawnDelay,
              loop: true,
              callback: () => this.spawnFruit(),
            });
          }
        }

        update() {
          this.fruits.getChildren().forEach((fruitObj) => {
            const fruit = fruitObj as Phaser.Physics.Arcade.Sprite;
            if (fruit.y > this.scale.height && fruit.active) {
              fruit.disableBody(true, true);

              // Lose a life
              this.lives--;
              const heart = this.heartIcons[this.lives];
              if (heart) heart.setVisible(false);

              if (this.lives <= 0) {
                this.physics.pause();
                this.scoreText.setText(`Game Over! Final Score: ${this.score}`);
              }
            }
          });
        }
      }

      // Create Phaser game instance
      gameRef.current = new PhaserModule.Game({
        type: PhaserModule.AUTO,
        parent: "fruit-ninja-container",
        scale: {
          mode: PhaserModule.Scale.FIT,
          autoCenter: PhaserModule.Scale.CENTER_BOTH,
          width: 480,
          height: 800,
        },
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 120 }, // FIXED: Added x to satisfy Vector2Like
            debug: false,
          },
        },
        scene: FruitScene,
        backgroundColor: "#111",
      });
    })();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div id="fruit-ninja-container" className="w-full h-screen touch-none" />;
};

export default FruitNinja;

