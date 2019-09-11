/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// This function runs when the Game Screen is ON
function gamePlay() {
  if (gameStart) {
    for (let i = 0; i < floatingTexts.length; i += 1) {
      floatingTexts[i].update()
      floatingTexts[i].render()
    }
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

  balloon.body.position.x += Smooth(0, 10, 2) * balloon.moveDir
  shootingBalloon.body.position.x += Smooth(0, 10, 2) * balloon.moveDir

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
        sizing: { radius: house.sizing.radius },
        body: house.body,
      },
      'circle'
    )
  ) {
    sndRunnerHit = loadSound(Koji.config.sounds.enemyHit, () =>
      playMusic(sndRunnerHit, 10, false)
    )

    floatingTexts.push(
      new FloatingText(
        runner.body.position.x,
        runner.body.position.y,
        random(comboTexts),
        Koji.config.colors.floatingTextColor,
        objSize * 1.4,
        1.5
      )
    )

    addScore(
      1,
      imgMoverStill,
      {
        x: runner.body.position.x,
        y: runner.body.position.y,
      },
      isMobile ? 15 : 30,
      { floatingText: false }
    )

    particlesEffect(
      imgShootingBalloon,
      {
        x: shootingBalloon.body.position.x,
        y: shootingBalloon.body.position.y,
      },
      5
    )

    shootingBalloons.pop()
    runner.reload()
    balloon.reload()
  }

  // If ShootingBalloon collides House
  if (
    shootingBalloon.didTouch(
      {
        sizing: { radius: house.sizing.radius },
        body: house.body,
      },
      'circle'
    )
  ) {
    sndHouseHit = loadSound(Koji.config.sounds.explosion, () =>
      playMusic(sndHouseHit, 10, false)
    )

    // floatingTexts.push(
    //   new OldFloatingText(
    //     width / 2,
    //     height / 2 + height * 0.08,
    //     Koji.config.strings.balloonCollidedHouse,
    //     Koji.config.colors.floatingTextColor,
    //     objSize * 1.2,
    //     2
    //   )
    // )

    addScore(
      -2,
      imgLife,
      {
        x: shootingBalloon.body.position.x,
        y: shootingBalloon.body.position.y,
      },
      15,
      { floatingText: true }
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
      // eslint-disable-next-line no-loop-func
      sndLife = loadSound(Koji.config.sounds.life, () =>
        playMusic(sndLife, 10, false)
      )

      loseLife()

      shootingBalloons.splice(i, 1)
      balloon.reload()
    }
  }

  // move by keys on desktop
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) {
      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = width
        shootingBalloon.body.position.x = width
      }
    }

    if (keyCode === RIGHT_ARROW) {
      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = 0
        shootingBalloon.body.position.x = 0
      }
    }
  }

  if (
    collidePointRect(
      // Check if user is touching balloon to drag
      mouseX,
      mouseY,
      balloon.body.position.x - balloon.sizing.width / 2, // because the rectangle is assumed as rectMode(CORNER)
      balloon.body.position.y - balloon.sizing.height / 2,
      balloon.sizing.width + balloon.sizing.width,
      balloon.sizing.height
    )
  ) {
    isBalloonDraggable = true
  } else {
    isBalloonDraggable = false
  }

  if (touching) {
    if (isMobile && isBalloonDraggable) {
      balloon.body.position.x = mouseX
      shootingBalloon.body.position.x = mouseX
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
