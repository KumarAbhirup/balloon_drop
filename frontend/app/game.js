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

  // Balloon
  balloon.show()
  shootingBalloon.show()

  // Runner
  runner.show()

  // If key pressed
  if (keyIsPressed) {
    // move by keys on desktop
    if (keyCode === LEFT_ARROW) {
      balloon.body.position.x -= Smooth(0, 10, 2)
      shootingBalloon.body.position.x -= Smooth(0, 10, 2)

      runner.body.position.x -= Smooth(0, 10, 2)
      runner.isMoving = 'left'

      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = width
        shootingBalloon.body.position.x = width
      }
    }

    if (keyCode === RIGHT_ARROW) {
      balloon.body.position.x += Smooth(0, 10, 2)
      shootingBalloon.body.position.x += Smooth(0, 10, 2)

      runner.body.position.x += Smooth(0, 10, 2)
      runner.isMoving = 'right'

      if (balloon.wentOutOfFrame()) {
        balloon.body.position.x = 0
        shootingBalloon.body.position.x = 0
      }
    }
  } else {
    runner.isMoving = false
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
