/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// This function runs when the Game Screen is ON
function gamePlay() {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < floatingTexts.length; i++) {
    floatingTexts[i].update()
    floatingTexts[i].render()
  }

  // InGame UI
  if (!runner.isMoving) runner.settings.image = imgMoverStill
  if (runner.isMoving === 'left') runner.settings.image = imgMoverLeft
  if (runner.isMoving === 'right') runner.settings.image = imgMoverRight

  // Draw Timer!
  if (gameTimerEnabled) {
    gameTimer -= 1 / frameRate()
    drawTimer()
  }

  // Particle effects
  for (let i = 0; i < particles.length; i += 1) {
    if (particles[i]) {
      particles[i].render()
      particles[i].update()
    }
  }

  // Balloon
  balloon.show()
  shootingBalloon.show()

  // Runner
  runner.show()
  runner.moveRandomly()

  // House
  house.show()

  // Reload Runner
  if (runner.wentOutOfFrame()) {
    runner.body.position.x = width / 2
  }

  // If ShootingBalloon collides Runner if it is out of house
  if (
    shootingBalloon.didTouch(
      {
        sizing: { width: runner.sizing.width, height: runner.sizing.height },
        body: runner.body,
      },
      'rectangle'
    ) &&
    !runner.didTouch(
      {
        sizing: { width: house.sizing.width, height: house.sizing.height },
        body: house.body,
      },
      'rectangle'
    )
  ) {
    addScore(
      1,
      imgMoverStill,
      {
        x: runner.body.position.x,
        y: runner.body.position.y,
      },
      30
    )
    shootingBalloons.pop()
    runner.reload()
    balloon.reload()
  }

  // If ShootingBalloon collides House
  if (
    shootingBalloon.didTouch(
      {
        sizing: { width: house.sizing.width, height: house.sizing.height },
        body: house.body,
      },
      'rectangle'
    )
  ) {
    addScore(
      -2,
      imgHouse,
      {
        x: house.body.position.x,
        y: house.body.position.y,
      },
      30
    )
    loseLife()

    shootingBalloons.pop()
    balloon.reload()
  }

  // Fire the balloon
  for (let i = 0; i < shootingBalloons.length; i += 1) {
    const thisShootingBalloon = shootingBalloons[i]

    if (thisShootingBalloon.shooting) thisShootingBalloon.fire()

    if (thisShootingBalloon.wentOutOfFrame()) {
      loseLife()
      shootingBalloons.splice(i, 1)
      balloon.reload()
    }
  }

  // move by keys on desktop
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      balloon.body.position.x -= Smooth(0, 10, 2)
      shootingBalloon.body.position.x -= Smooth(0, 10, 2)

      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = width
        shootingBalloon.body.position.x = width
      }
    }

    if (keyCode === RIGHT_ARROW) {
      balloon.body.position.x += Smooth(0, 10, 2)
      shootingBalloon.body.position.x += Smooth(0, 10, 2)

      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = 0
        shootingBalloon.body.position.x = 0
      }
    }
  }

  // Score draw
  const scoreX = width - objSize / 2
  const scoreY = objSize / 3
  textSize(objSize * 2)
  fill(Koji.config.colors.scoreColor)
  textAlign(RIGHT, TOP)
  text(score, scoreX, scoreY)

  // Lives draw
  const lifeSize = objSize

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < lives; i++) {
    image(
      imgLife,
      lifeSize / 2 + lifeSize * i,
      lifeSize / 2,
      lifeSize,
      lifeSize
    )
  }

  cleanup()
}
