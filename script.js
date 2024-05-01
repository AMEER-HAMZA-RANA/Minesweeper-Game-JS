import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from './minesweeper.js'

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 8

const boardElement = document.querySelector('.board')
const mineCount = document.querySelector('[data-mine-count]')
const messageText = document.querySelector('.subtext')

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)

board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener('click', e => {
      revealTile(board, tile)
      checkGameEnd(board)
    })
    tile.element.addEventListener('contextmenu', e => {
      e.preventDefault()
      markTile(tile)
      listMineLeft()
    })
  })
})

boardElement.style.setProperty('--size', BOARD_SIZE)
mineCount.textContent = NUMBER_OF_MINES




function listMineLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count += row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)

  mineCount.textContent = NUMBER_OF_MINES - markedTilesCount
}


function checkGameEnd(board) {
  const win = checkWin(board)
  const lose = checkLose(board)

  if(win || lose) {
    boardElement.addEventListener('click', stopProp, {capture: true})
  }

  if(win) {
    messageText.textContent = "You Win!"
  }

  if(lose) {
    messageText.textContent = "You Lose!"

    board.forEach(row => {
      row.forEach(tile => {
        if(tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if(tile.mine) revealTile(board, tile) 
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}