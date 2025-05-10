const dBase = (function () {
  const xAxis = [1, 2, 3]
  const yAxis = [1, 2, 3]
  const tableView = {}
  let winnerFound = false
  let winner = ""
  let turn = "X"

  xAxis.forEach(function (x) {
    yAxis.forEach(function (y) {
      const key = `x${x}y${y}`
      tableView[key] = null
    })
  })

  function setValue(x, y, newValue) {
    const key = `x${x}y${y}`

    if (!winnerFound) {
      if (tableView[key] === null) {
        const played = newValue.toUpperCase() //variable to log X or O in the right time
        tableView[key] = newValue.toUpperCase()
        console.log(`✅ Value saved at ${key}: ${newValue}`)
        checkWinner()
        whosTurn() // put whosTurn here to make log chain
        return played
      } else {
        console.log(
          `⚠️ That slot ${key} is already taken with value: ${tableView[key]}`
        )
      }
    } else {
      console.log(
        `⚠️ Game is over. The winner is ${winner}. \n\nClick 🔁 to play again )`
      )
    }
  }

  function whosTurn() {
    turn = turn === "X" ? "O" : "X"
    updateTurnUI()
  }

  function updateTurnUI() {
    const whosTurnContainer = document.querySelector(".whosTurn")
    whosTurnContainer.textContent = turn === "X" ? "❌ Turn" : "⭕ Turn"
  }

  function logAll() {
    for (let key in tableView) {
      console.table(`${key}: ${tableView[key]}`)
    }
  }

  //
  let winCases = [
    ["x1y1", "x2y1", "x3y1"],
    ["x1y2", "x2y2", "x3y2"],
    ["x1y3", "x2y3", "x3y3"],
    ["x1y1", "x1y2", "x1y3"],
    ["x2y1", "x2y2", "x2y3"],
    ["x3y1", "x3y2", "x3y3"],
    ["x1y1", "x2y2", "x3y3"],
    ["x3y1", "x2y2", "x1y3"],
  ]

  function checkWinner() {
    winCases.forEach(function (winCase) {
      const [a, b, c] = winCase

      if (
        tableView[a] === "X" &&
        tableView[a] === tableView[b] &&
        tableView[a] === tableView[c]
      ) {
        winner = "Player 1"
        winnerFound = true
      } else if (
        tableView[a] === "O" &&
        tableView[a] === tableView[b] &&
        tableView[a] === tableView[c]
      ) {
        winner = "Player 2"
        winnerFound = true
      }
    })

    if (winnerFound) {
      console.log(
        `🎉 Congrats, ${winner}! You win! 🏆\n\nClick 🔁 to play again.`
      )
    } else {
      const allFilled = Object.values(tableView).every((val) => val !== null)
      if (allFilled) {
        console.log("🤝 It's a draw!\n\nClick 🔁 to play again.")
      } else {
        console.log("➕ Add more values")
      }
    }
  }

  function repeatGame() {
    xAxis.forEach(function (x) {
      yAxis.forEach(function (y) {
        const key = `x${x}y${y}`
        tableView[key] = null
      })
    })

    winnerFound = false
    winner = ""
    turn = "O"
    updateTurnUI()

    const allBoxes = document.querySelectorAll("#turnBox")
    allBoxes.forEach(function (box) {
      box.textContent = ""
    })

    whosTurn()

    console.clear()
  }

  return {
    setValue,
    logAll,
    repeatGame,
    whosTurn,
    getTurn: () => turn,
    getWinner: () => winnerFound,
    updateTurnUI
  }
})()

dBase.updateTurnUI();

//DOM
const container = document.querySelector(".tableViewContainer")

const coordinates = [
  [1, 3],
  [2, 3],
  [3, 3],
  [1, 2],
  [2, 2],
  [3, 2],
  [1, 1],
  [2, 1],
  [3, 1],
]

for (let i = 0; i < 9; i++) {
  const newBox = document.createElement("div")
  container.appendChild(newBox)

  newBox.style.outline = "1px solid black"
  newBox.classList.add(`${i + 1}`)
  newBox.id = "turnBox"

  newBox.addEventListener("click", function () {
    if (newBox.textContent !== "" || dBase.getWinner()) return

    const [x, y] = coordinates[i]
    const symbol = dBase.getTurn() === "X" ? "x" : "o"
    const played = dBase.setValue(x, y, symbol)

    if (played) {
      newBox.textContent = played === "X" ? "❌" : "⭕"
    }
  })
}

//Replay button logic implementation
const replayContainer = document.querySelector(".replay")

replayContainer.addEventListener("click", function () {
  dBase.repeatGame()
})
