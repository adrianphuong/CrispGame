title = "Target Shooter";
description = "Hit the target!";
characters = [];
options = {
  viewSize: { x: 200, y: 100 },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
};

let player, target, isShooting, angle, playerCollision, boundaryTouched, decreaseBar;
let grassOffset = 0;
let power = 1;
let visualPower = 100;
let visualDecrementRate = 0.3; // Adjust the decrement rate for the visual bar

function update() {
  if (!ticks) {
    player = vec(20, 80);
    target = vec(rnd(200, 250), rnd(50, 70));
    isShooting = angle = 0;
  }

  if (isShooting) {
    target.x -= power; // Adjust based on power
    if (target.x <= 0) {
      play("explosion");
      power = 0;
      end();
    }
  }

  // Draw grass layer
  for (let i = 0; i < 11; i++) {
    color("green");
    rect(i * 20 - grassOffset, 90, 20, 10);
  }

  // Draw power indicator bar
  color("black");
  rect(10, 10, 180, 10);
  
  // Visual decrement of the power indicator bar
  color("green");

  
  // Determine the position of the visual power within the black box
  let visualPowerPosition = visualPower * 100;

  rect(10, 10, Math.min(180,visualPowerPosition), 10);
  
  // Draw arrow pointing towards the target
  color("yellow");
  line(player.x, player.y, target.x, target.y, 2);

  // Draw target
  color("red");
  box(target, 15, 15);
  color("white");
  box(target, 10, 10);
  color("red");
  box(target, 4, 4);

  // Draw player
  color("yellow");
  playerCollision = box(player, 9, 9);

  // Check game over conditions
  if (player.x < 0 || player.x > 200 || player.y > 100 || player.y < 0) {
    play("explosion");
    power = 0;
    end();
  }

  // Handle shooting logic
  if (isShooting) {
    // Move player's projectile
    player.addWithAngle(angle, 2);

    // Check collision with target
    if (playerCollision.isColliding.rect.red) {
      power = 0;
      visualPower = 0;
      score += 100;
      play("powerUp");
      // Player hit the target, reset player and set a new random target
      isShooting = angle = 0;
      particle(50, 50);
      player = vec(20, 80);
      target = vec(rnd(200, 250), rnd(50, 70));
    }
  } else {
    // Adjust angle while holding the button
    if (input.isPressed) {
      bar(player, 20, 3, (angle -= 0.05), 0);

      // Increment power more slowly
      power += 0.01;
      visualPower = power;
      if (power >= 50) {
        power -= 1;
      }
    }

    // Release to shoot
    if (input.isJustReleased) {
      play("jump");
      isShooting = 1;
    }
  }

  // Scroll the grass layer to the left
  grassOffset += 1;
  if (grassOffset >= 20) {
    grassOffset = 0;
  }
}
