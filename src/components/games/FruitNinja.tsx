"use client";

import React, { useEffect, useRef, useState } from "react";
import type Phaser from "phaser";
import dynamic from "next/dynamic";

const GameOverScreen = dynamic(() => import("@/components/GameOverScreen"), { ssr: false });

const FruitNinja: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    let PhaserModule: typeof Phaser;

    (async () => {
      const phaserModule = await import("phaser");
      PhaserModule = phaserModule;

      if (gameRef.current) return;

      const parentRef = "fruit-ninja-container";
      const reactGameOver = (score: number) => {
        setFinalScore(score);
        setIsGameOver(true);
      };

      class FruitScene extends PhaserModule.Scene {
        fruits!: Phaser.Physics.Arcade.Group;
        score = 0;
        scoreText!: Phaser.GameObjects.Text;
        lives = 3;
        heartIcons: Phaser.GameObjects.Image[] = [];

        // Difficulty
        spawnDelay = 1800;
        fruitSpeed = 140;
        fruitsAtOnce = 1;

        constructor() {
          super({ key: "FruitScene" });
        }

        preload() {
          this.load.image("apple", "https://labs.phaser.io/assets/sprites/apple.png");
          this.load.image("banana", "https://labs.phaser.io/assets/sprites/banana.png");
          this.load.image("melon", "https://labs.phaser.io/assets/sprites/melon.png");
          this.load.image("heart", "https://labs.phaser.io/assets/ui/heart.png");
        }

        create() {
          this.fruits = this.physics.add.group();

          this.scoreText = this.add.text(16, 16, "Score: 0", {
            fontSize: "28px",
            color: "#fff",
          });

          for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(this.scale.width - 40 - i * 40, 30, "heart");
            heart.setScale(1.2);
            this.heartIcons.push(heart);
          }

          this.time.addEvent({
            delay: this.spawnDelay,
            loop: true,
            callback: () => this.spawnFruit(),
          });

          this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            const sliced = this.physics.overlapRect(pointer.x, pointer.y, 50, 50);

            sliced.forEach((body) => {
              const fruit = body.gameObject as Phaser.Physics.Arcade.Sprite;
              if (fruit && fruit.active) {
                fruit.disableBody(true, true);

                this.add.tween({
                  targets: fruit,
                  alpha: 0,
                  duration: 200,
                  onComplete: () => fruit.destroy(),
                });

                this.score += 10;
                this.scoreText.setText(`Score: ${this.score}`);

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
          this.fruitSpeed += 20;
          if (this.fruitsAtOnce < 3) this.fruitsAtOnce++;
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

              this.lives--;
              const heart = this.heartIcons[this.lives];
              if (heart) heart.setVisible(false);

              if (this.lives <= 0) {
                this.physics.pause();
                reactGameOver(this.score);
              }
            }
          });
        }
      }

      gameRef.current = new PhaserModule.Game({
        type: PhaserModule.AUTO,
        parent: parentRef,
        scale: {
          mode: PhaserModule.Scale.FIT,
          autoCenter: PhaserModule.Scale.CENTER_BOTH,
          width: 480,
          height: 800,
        },
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 120 }, debug: false },
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

  const restartGame = () => {
    setIsGameOver(false);
    setFinalScore(0);
    window.location.reload(); // Quick reset (can improve later with scene restart)
  };

  return (
    <div className="relative w-full h-screen touch-none">
      <div id="fruit-ninja-container" className="w-full h-full" />
      {isGameOver && <GameOverScreen score={finalScore} onRestart={restartGame} />}
    </div>
  );
};

export default FruitNinja;
