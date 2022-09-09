const Player = (sign, currentPlayer, resultStatus) => {
    const getSign = () => {
        return sign
    }
    const getCurrent = () => {
        return currentPlayer
    }

    const updateCurrent = (isPlayerCurrent) => {
        return currentPlayer = isPlayerCurrent;
    }

    const currentStatus = () => {
        return resultStatus
    }

    const updateResultStatus = (status) => {
        return resultStatus = status
    }

    return {
        getSign,
        getCurrent,
        updateCurrent,
        updateResultStatus,
        currentStatus
    }
}

const gameBoard = (() => {
    const board = document.querySelector('#gametable')
    const cells = document.querySelectorAll('.cell')
    const playerX = Player('x', false, false)
    const playerO = Player('o', false, false)
    let movesPlayerX = [];
    let movesPlayerO = [];
    let moveCounter = 0;
    let xWins = 0
    let oWins = 0

    const setCurrentPlayer = () => {
        if (playerX.getCurrent() === false && playerO.getCurrent() === false) {
            playerX.updateCurrent(true);
            return playerX;
        }
        if (playerX.getCurrent() === true) {
            playerX.updateCurrent(false);
            playerO.updateCurrent(true);
            return playerO;
        }
        else if (playerO.getCurrent() === true) {
            playerO.updateCurrent(false);
            playerX.updateCurrent(true);
            return playerX;
        }
    }

    const currentPlayer = () => {
        return playerX.getCurrent() === true ? playerX : playerO;
    }

    const updateBoardClass = () => {
        if (playerX.getCurrent() === false && playerO.getCurrent() === false) {
            return board.className = 'gametable'
        }
        if (playerX.getCurrent() === true) {
            board.classList.remove(playerO.getSign())
            return board.classList.add(playerX.getSign())
        }
        else if (playerO.getCurrent() === true) {
            board.classList.remove(playerX.getSign())
            return board.classList.add(playerO.getSign())
        }
    }

    const onHover = () => {
        board.addEventListener('mouseover', updateBoardClass)
    }

    const setMark = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', playerOnClick, { once: true })
        })
    }

    const checkWin = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]];
        winningCombinations.forEach(combination => {
            const winningX = [];
            const winningO = [];
            combination.forEach(i => {
                if (movesPlayerX.includes(i)) {
                    winningX.push(i)
                    if (winningX.length === 3) {
                        cells.forEach(cell => cell.removeEventListener('click', playerOnClick))
                        playerO.updateCurrent(false)
                        playerX.updateResultStatus(true)
                        return xWins++
                    }
                }
                else if (movesPlayerO.includes(i)) {
                    winningO.push(i)
                    if (winningO.length === 3) {
                        cells.forEach(cell => cell.removeEventListener('click', playerOnClick))
                        playerX.updateCurrent(false)
                        playerO.updateResultStatus(true)
                        return oWins++
                    }
                }
            })
        })
    }

    const xWinCount = () => {
        return xWins
    }

    const oWinCount = () => {
        return oWins

    }

    const xRoundStatus = () => {
        return playerX.currentStatus()
    }

    const oRoundStatus = () => {
        return playerO.currentStatus()
    }

    const playerOnClick = (cell) => {
        const field = cell.target
        if (currentPlayer() === playerX) {
            setCurrentPlayer()
            field.classList.add(playerX.getSign())
            movesPlayerX.push(parseInt(field.dataset.num))
        }
        else if (currentPlayer() === playerO) {
            setCurrentPlayer()
            field.classList.add(playerO.getSign())
            movesPlayerO.push(parseInt(field.dataset.num))
        }
        onHover()
        checkWin(cell)
        draw()
        console.log(draw())
        return moveCounter++
    }

    const draw = () => {
        if (moveCounter === 8 && playerX.currentStatus() != true && playerO.currentStatus() != true) {
            return true
        }
    }

    const restartRound = () => {
        playerX.updateResultStatus(false)
        playerO.updateResultStatus(false)
        moveCounter = 0
        if (movesPlayerO.length > movesPlayerX.length) {
            playerX.updateCurrent(true)
        }
        else if (movesPlayerX.length > movesPlayerO.length) {
            playerO.updateCurrent(true)
        }
        cells.forEach(cell => cell.className = 'cell')
        movesPlayerX = []
        movesPlayerO = []
        setMark()
    }

    const restartGame = () => {
        // restartaj brojac pobjeda
    }

    const initialHover = (() => {
        if (playerX.getCurrent() === false && playerO.getCurrent() === false) {
            setCurrentPlayer()
            onHover()
            setMark()
        }
    })()

    return {
        setCurrentPlayer,
        currentPlayer,
        updateBoardClass,
        checkWin,
        draw,
        playerOnClick,
        xWinCount,
        oWinCount,
        restartRound,
        xRoundStatus,
        oRoundStatus
    }
})()

const displayController = (() => {
    const announceWinner = document.querySelector('#announceWinner')
    const scoreX = document.querySelector('#scorex')
    const scoreO = document.querySelector('#scoreo')
    const btnNextRound = document.querySelector('#nextRound')
    const player1 = document.querySelector('#player1')
    const player2 = document.querySelector('#player2')
    const submitPlayerNames = document.querySelector('#submitPlayers')

    const playerName = () => {
        submitPlayerNames.addEventListener('click', () => {
        if (player1.value === '' || player2.value === '') {
            announceWinner.innerText = 'Enter player names!'
        }
        else {
            scoreX.innerText = player1.value
            scoreO.innerText = player2.value
        }
    }, { once: true })
    }

    btnNextRound.addEventListener('click', () => {
        scoreX.innerText = `${gameBoard.xWinCount()}`
        scoreO.innerText = `${gameBoard.oWinCount()}`
        if (gameBoard.xRoundStatus()) {
            announceWinner.innerText = 'Player X won!'
        }
        else if (gameBoard.oRoundStatus()) {
            announceWinner.innerText = 'Player O won!'
        }
        else if (gameBoard.draw()) {
            announceWinner.innerText = 'It is draw!'
        }
        gameBoard.restartRound()
    })



})()