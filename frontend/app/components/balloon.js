/* eslint-disable no-global-assign */
/* eslint-disable no-unused-vars */
/*
  global
  GameObject
  mouseX
  shootingBalloons
  shootingBalloon
  imgShootingBalloon
  width
  objSize
  balloon
  Smooth
*/

class Balloon extends GameObject {
  shooting = false

  dir = 0

  update = () => {
    if (balloon.dir === -1) {
      balloon.body.position.x -= Smooth(0, 10, 2)
      shootingBalloon.body.position.x -= Smooth(0, 10, 2)
    }

    if (balloon.dir === 1) {
      balloon.body.position.x += Smooth(0, 10, 2)
      shootingBalloon.body.position.x += Smooth(0, 10, 2)
    }
  }

  shoot = () => {
    shootingBalloon.shooting = true
    shootingBalloons.push(shootingBalloon)
  }

  reload = () => {
    shootingBalloon = null
    shootingBalloon = new Balloon(
      { x: balloon.body.position.x, y: balloon.sizing.height + objSize },
      { width: objSize, height: 2 * objSize },
      {
        shape: 'rectangle',
        image: imgShootingBalloon,
        color: { r: 255, g: 255, b: 255 },
        rotate: true,
      }
    )
  }

  // Don't use the below function for moving balloon, only use it for shooting balloon!
  fire = () => {
    let velocity = 0
    velocity += Smooth(0, 30, 1)
    this.body.position.y += velocity
  }
}
