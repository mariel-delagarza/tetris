document.addEventListener('DOMContentLoaded', () => {

  // Use query selector to look through HTML and find
  // className of grid, and assign it to our constant
  const grid = document.querySelector('.grid')

  // Turn all 200 divs into an array we can work with
  // and give them a specific index number
  let squares = Array.from(document.querySelectorAll('.grid div'))

  // A hash indicates we are looking for an id
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')

  const width = 10;
  let nextRandom = 0;
  let timerId
  let score = 0;

  // The Tetrominoes
  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  // Randomly select a Tetromino and its first rotation
  // Random will randomly select a number (index) from the array
  // Floor will round down to the nearest integer so you actually 
  // have an index number.
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  // Draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  // Undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // Make the Tetromino move down every seoncd (1000 milliseconds)
  /*timerId = setInterval(moveDown, 1000) */

  // Assign functions to key Codes
  function control(e) {
    if(e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  // Move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  // Freeze function
  function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      // Start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // Move the tetromino left, unless it's
  // at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  // Move the tetromino right, unless it's 
  // at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }

    draw()
  }

  // Rotate the tetromino
  function rotate() {
    undraw()
    currentRotation++

    // If the rotations reach the end of
    // the options, start over at 1st rotation
    if(currentRotation === current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  // Show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  // The tetrominoes without rotations
  const upNextTetromino = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], // zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], // tTetromino
    [0, 1, displayWidth, displayWidth+1], // oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] // iTetromino
  ]

  // Display the shape in the mini-grid display
  function displayShape() {
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetromino[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  // Add functionality to the start button
  startBtn.addEventListener('click', () => {
    if(timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.drandom()*theTetrominoes.length)
    }
  })

  // Add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // Game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }






})