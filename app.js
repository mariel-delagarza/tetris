document.addEventListener('DOMContentLoaded', () => {

  // Use query selector to look through HTML and find
  // className of grid, and assign it to our constant
  const grid = document.querySelector('.grid')

  // Turn all 200 divs into an array we can work with
  // and give them a specific index number
  let squares = Array.from(document.querySelectorAll('.grid div'))

  // A hash indicates we are looking for an id
  const ScoreDisplay = document.querySelector('#score')
  const StartBtn = document.querySelector('#start-button')

  const width = 10;


})