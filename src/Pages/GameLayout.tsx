import { useParams, useSearchParams } from "react-router-dom"
import axiosInstance from "../axiosInstance"
import { useEffect, useState } from "react"
import { IoPersonCircle } from "react-icons/io5"
import { CiShare2 } from "react-icons/ci"

interface Game {
  gameCode: string
  size: string
  board: string[][]
  currentPlayer: string
  winner: string | null
  winningLine: winningLine[]
  player_0: string
  player_0_name: string
  player_1: string
  player_1_name: string
  disappearing: boolean
  disappearing_rounds: number
  rounds: Round[]
}

interface Round {
  player: string
  row: number
  col: number
}

interface winningLine {
  row: number
  col: number
}

function GameLayout() {
  const { gameCode } = useParams()

  const [searchParams] = useSearchParams()
  const player = searchParams.get("player")
  const multi = searchParams.get("multi")

  const [game, setGame] = useState<Game>({
    gameCode: "",
    size: "",
    board: [],
    currentPlayer: "",
    winner: null,
    winningLine: [],
    player_0: "",
    player_0_name: "",
    player_1: "",
    player_1_name: "",
    disappearing: false,
    disappearing_rounds: 0,
    rounds: []
  })
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setReload(reload + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [reload])

  useEffect(() => {
    axiosInstance.get(`/game/${gameCode}`).then((response) => {
      setGame(response.data)
      console.log(response.data)
    })
  }, [gameCode, reload])

  const handleClick = (row: number, col: number) => {
    axiosInstance
      .post(`/play`, {
        gameCode: game.gameCode,
        row,
        col
      })
      .then((response) => {
        setGame(response.data)
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  function shareLink() {
    navigator.clipboard.writeText(
      "https://tttapp.vercel.app?code=" + game.gameCode
    )
  }

  const renderGrid = () => {
    return (
      <div>
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center">
            {row.map((cell, colIndex) => {
              const isTopLeft = rowIndex === 0 && colIndex === 0
              const isTopRight = rowIndex === 0 && colIndex === row.length - 1
              const isBottomLeft =
                rowIndex === game.board.length - 1 && colIndex === 0
              const isBottomRight =
                rowIndex === game.board.length - 1 &&
                colIndex === row.length - 1

              const isWinningCell =
                game.winner !== null &&
                game.winningLine.some(
                  (line) => line.row === rowIndex && line.col === colIndex
                )

              console.log(game.winningLine)

              const cellClassName = `${
                cell === "1" ? "bg-blue-500" : cell === "0" ? "bg-cyan-500" : ""
              } 
                 font-sans border border-white w-20 h-20 flex items-center justify-center cursor-pointer 
                 text-4xl text-white font-bold 
                 ${isTopLeft ? "rounded-tl-xl" : ""}
                 ${isTopRight ? "rounded-tr-xl" : ""}
                 ${isBottomLeft ? "rounded-bl-xl" : ""}
                 ${isBottomRight ? "rounded-br-xl" : ""} 
                 ${
                   game.winner !== null
                     ? "pointer-events-none"
                     : game.currentPlayer === "1" &&
                       player === "1" &&
                       multi === "false"
                     ? "pointer-events-none"
                     : game.currentPlayer === "0" &&
                       player === "0" &&
                       multi === "false"
                     ? "pointer-events-none"
                     : ""
                 }
                 ${isWinningCell ? "bg-slate-500" : ""}`

              return (
                <div
                  key={colIndex}
                  className={cellClassName}
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {cell === "1"
                    ? game.player_1
                    : cell === "0"
                    ? game.player_0
                    : " "}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  function getOrdinal(number: number) {
    const suffixes = ["th", "st", "nd", "rd"]
    const v = number % 100
    return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen flex justify-center">
      <div className="flex flex-col gap-3 text-black font-sans">
        <div className="flex justify-center pt-4">
          <h1 className="font-3xl text-lg font-bold ">
            Game - #{game.gameCode}
          </h1>
        </div>
        <div className="flex gap-5 items-center">
          <div
            className={`${
              game.winner === "0"
                ? "bg-gradient-to-b from-yellow-300 to-yellow-400"
                : ""
            } ${
              player === "1" ? "bg-slate-200" : "bg-white"
            } shadow-lg w-fit flex flex-col gap-1 rounded-xl items-center justify-center px-5 py-2 place-items-center`}
          >
            <IoPersonCircle size={50} />
            <p className="font-semibold text-sm">{game.player_0_name}</p>
            <div className="bg-gradient-to-b from-cyan-400 to-cyan-500 py-2 px-5 font-bold text-white rounded-lg">
              {game.player_0}
            </div>
          </div>

          <div className="flex flex-col h-16 w-16 rounded-full items-center justify-center place-items-center bg-gradient-to-b from-yellow-400 to-yellow-500">
            <h2 className="font-bold">{getOrdinal(game.rounds.length)}</h2>
            <p className="text-xs font-medium">Round</p>
          </div>

          <div
            className={`${
              game.winner === "1"
                ? "bg-gradient-to-b from-yellow-300 to-yellow-400"
                : ""
            } ${
              player === "0" ? "bg-slate-100" : "bg-white"
            } shadow-lg w-fit flex flex-col gap-1 rounded-xl items-center justify-center px-5 py-2 place-items-center`}
          >
            <IoPersonCircle size={50} />
            <p className="font-semibold text-sm">{game.player_1_name}</p>
            <div className="bg-gradient-to-b from-cyan-400 to-cyan-500 py-2 px-5 font-bold text-white rounded-lg">
              {game.player_1}
            </div>
          </div>
        </div>
        {renderGrid()}
        <div className="flex justify-center items-center">
          <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 w-fit py-2 px-4 rounded-lg font-bold">
            {multi === "false"
              ? player === "0" && game.currentPlayer === "1"
                ? "Your Turn"
                : player === "1" && game.currentPlayer === "0"
                ? " Your Turn"
                : "Waiting for Opponent"
              : multi === "true"
              ? game.currentPlayer === "1"
                ? `${game.player_1_name}'s Turn`
                : game.currentPlayer === "0"
                ? `${game.player_0_name}'s Turn`
                : ""
              : ""}
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-5 bg-white p-4 rounded-full">
        <CiShare2 size={30} onClick={shareLink} />
      </div>
    </div>
  )
}

export default GameLayout
