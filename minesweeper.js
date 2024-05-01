export const TILE_STATUSES = {
  HIDDEN: "hidden",
  NUMBER: "number",
  MINE: "mine",
  MARKED: "marked",
}

export function createBoard(boardSize, noOfMines) {
  const board = []
  const minePositions = getMinePositions(boardSize, noOfMines)

  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUSES.HIDDEN

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }

      row.push(tile)
    }
    board.push(row)
  }
  return board
}

function getMinePositions(boardSize, noOfMines) {
  let positions = []

  while (positions.length < noOfMines) {
    let minePosition = {
      x: getRandomNo(boardSize),
      y: getRandomNo(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, minePosition))) {
      positions.push(minePosition)
    }
  }

  return positions
}

export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }

  tile.status = TILE_STATUSES.NUMBER

  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter((t) => t.mine)

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length
  }
}

function nearbyTiles(board, { x, y }) {
  const tiles = []

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset]
      tile && tiles.push(tile)
    }
  }

  return tiles
}

function positionMatch(a, b) {
  return a.x === b.x && a.y == b.y
}

function getRandomNo(boardSize) {
  return Math.floor(Math.random() * boardSize)
}

export function markTile(tile) {
  if (
    tile.status === TILE_STATUSES.NUMBER ||
    tile.status === TILE_STATUSES.MINE
  ) {
    return
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every(
      (tile) =>
        tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine &&
          (tile.status === TILE_STATUSES.HIDDEN ||
            tile.status === TILE_STATUSES.MARKED))
    )
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => tile.status === TILE_STATUSES.MINE)
  })
}
