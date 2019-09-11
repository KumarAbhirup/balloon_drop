/* eslint-disable no-global-assign */
/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  mouseX
  frameRate
  createVector
  random
  Smooth
  runner
  height
  width
  objSize
  imgMoverStill
*/

class Runner extends GameObject {
  isMoving = null

  goalVelocity = createVector(0, 0)

  velocity = createVector(0, 0)

  moveSpeed = 5

  moveTimer = 0.1

  moveRandomly() {
    this.isMoving = true

    this.moveTimer -= 1 / frameRate()

    if (this.moveTimer <= 0) {
      this.goalVelocity.x = random(-this.moveSpeed, this.moveSpeed)
      this.goalVelocity.y = random(-this.moveSpeed, this.moveSpeed)

      this.moveTimer = 1.5
    }

    this.velocity.x = Smooth(this.velocity.x, this.goalVelocity.x, 1)

    if (this.velocity.x < -2) {
      this.isMoving = 'left'
    } else if (this.velocity.x > 2) {
      this.isMoving = 'right'
    } else {
      this.isMoving = null
    }

    this.body.position = createVector(
      this.body.position.x,
      this.body.position.y
    )

    this.body.position.add(this.velocity)
  }

  reload = () => {
    runner = null
    runner = new Runner(
      { x: width / 2, y: height - objSize * 2 },
      { width: 3 * objSize, height: 4 * objSize },
      {
        shape: 'rectangle',
        image: imgMoverStill,
      }
    )
  }
}
