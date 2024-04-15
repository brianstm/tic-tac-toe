import axiosInstance from "../axiosInstance"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

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
function Home() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get("code") || ""

  const [size, setSize] = useState(3)
  const [disappearing, setDisappearing] = useState(false)
  const [disappearing_rounds, setDisappearingRounds] = useState("")
  const [player_0, setPlayer0] = useState("")
  const [player_1, setPlayer1] = useState("")
  const [gameCode, setGameCode] = useState(code || "")
  const [createOrJoin, setCreateOrJoin] = useState<
    "create" | "join" | "lobby" | ""
  >("")
  const [player0Name, setPlayer0Name] = useState("")
  const [player1Name, setPlayer1Name] = useState("")
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

  useEffect(() => {
    if (code !== "") {
      setGameCode(code)
      axiosInstance.get(`/game/${gameCode}`).then((response) => {
        setGame(response.data)
        setPlayer0Name(response.data.player_0_name || "")
        setPlayer1Name(response.data.player_1_name || "")
        setCreateOrJoin("lobby")
      })
      setCreateOrJoin("lobby")
    }
  }, [code])

  function createGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    axiosInstance
      .post("/new-game", {
        size: String(size),
        disappearing: disappearing,
        disappearing_rounds: Number(disappearing_rounds) || 0,
        player_0: player_0,
        player_1: player_1
      })
      .then((response) => {
        setGame(response.data)
        setGameCode(response.data.gameCode)
        setPlayer0Name(response.data.player_0_name || "")
        setPlayer1Name(response.data.player_1_name || "")
        setCreateOrJoin("lobby")
      })
  }

  function findGame(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    axiosInstance.get(`/game/${gameCode}`).then((response) => {
      setGame(response.data)
      setGameCode(response.data.gameCode)
      setPlayer0Name(response.data.player_0_name || "")
      setPlayer1Name(response.data.player_1_name || "")
      setCreateOrJoin("lobby")
    })
  }

  function setName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    axiosInstance
      .post("/join-game", {
        gameCode: gameCode,
        player0: player0Name || "",
        player1: player1Name || ""
      })
      .then((response) => {
        let multiplayer = false
        if (player1Name !== "" && player0Name !== "") {
          multiplayer = false
        } else {
          multiplayer = true
        }
        setGame(response.data.editedGame)
        setGameCode(response.data.editedGame.gameCode)
        setPlayer0Name(response.data.editedGame.player_0_name || "")
        setPlayer1Name(response.data.editedGame.player_1_name || "")

        if (
          response.data.editedGame.player_0 !== "" &&
          response.data.editedGame.player_1 !== ""
        ) {
          window.location.href = `/game/${gameCode}?player=${
            player1Name !== "" ? "1" : "0"
          }&multi=${multiplayer}`
        }
      })
  }

  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-300 min-h-screen flex justify-center">
      <div className="flex flex-col gap-3 text-black font-sans">
        <div className="flex flex-col justify-center pt-4">
          <div className="flex justify-center pt-4 flex-col items-center">
            <h1 className="text-4xl font-bold pb-3">Tic Tac Toe</h1>
            <h3 className="text-2xl font-bold pb-3">{game.gameCode}</h3>
          </div>
          {createOrJoin === "create" ? (
            <div>
              <h1 className="font-3xl text-lg font-bold ">Create Game</h1>

              <form
                className="font-sans flex flex-col gap-2 w-44"
                onSubmit={createGame}
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="size"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Size
                  </label>
                  <input
                    type="number"
                    id="size"
                    name="size"
                    value={size}
                    className="w-44 py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                    onChange={(e) => {
                      const newSize = parseInt(e.target.value)
                      if (!isNaN(newSize) && newSize >= 3) {
                        setSize(newSize)
                      } else {
                        setSize(3)
                      }
                    }}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col h-full w-full">
                    <label
                      htmlFor="disappearing"
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                    >
                      Disapear
                    </label>
                    <input
                      type="checkbox"
                      id="disappearing"
                      name="disappearing"
                      checked={disappearing}
                      onChange={(e) => setDisappearing(e.target.checked)}
                      className="rounded-md px-2.5 py-2.5 checked:bg-secondary focus:ring-2 focus:ring-secondary-dark"
                    />
                  </div>
                  {disappearing ? (
                    <div className="flex flex-col">
                      <input
                        type="number"
                        id="disappearing_rounds"
                        name="disappearing_rounds"
                        value={disappearing_rounds}
                        placeholder="6"
                        required={disappearing}
                        className="w-full py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                        onChange={(e) => setDisappearingRounds(e.target.value)}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor="player_0"
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                    >
                      Player 0
                    </label>
                    <input
                      type="text"
                      id="player_0"
                      name="player_0"
                      placeholder="X"
                      value={player_0}
                      className="w-full py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                      onChange={(e) => setPlayer0(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="player_1"
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                    >
                      Player 1
                    </label>
                    <input
                      type="text"
                      id="player_1"
                      name="player_1"
                      placeholder="O"
                      value={player_1}
                      className="w-full py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                      onChange={(e) => setPlayer1(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                  >
                    Create Game
                  </button>
                </div>
              </form>
            </div>
          ) : createOrJoin === "join" ? (
            <div>
              <h1 className="font-3xl text-lg font-bold ">Join Game</h1>
              <form
                className="font-sans flex flex-col gap-2 w-44"
                onSubmit={findGame}
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="size"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Game Code
                  </label>
                  <input
                    type="text"
                    id="gamecode"
                    name="gamecode"
                    placeholder="XXXXXXXXXX"
                    value={gameCode}
                    className="w-44 py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                    onChange={(e) => setGameCode(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                >
                  Find Game
                </button>
              </form>
            </div>
          ) : createOrJoin === "lobby" ? (
            <div>
              <h1 className="font-3xl text-lg font-bold ">Lobby</h1>
              <form
                className="font-sans flex flex-col gap-2 w-44"
                onSubmit={setName}
              >
                <div className="flex flex-col pt-2">
                  <label
                    htmlFor="size"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Player 1
                  </label>
                  <input
                    type="text"
                    id="player_1"
                    name="player_1"
                    placeholder="Johnny"
                    value={player0Name}
                    className="w-44 py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                    onChange={(e) => setPlayer0Name(e.target.value)}
                  />
                  <label
                    htmlFor="size"
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold pt-2"
                  >
                    Player 2
                  </label>
                  <input
                    type="text"
                    id="player_2"
                    name="player_2"
                    placeholder="Jane"
                    value={player1Name}
                    className="w-44 py-2 px-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition duration-500 ease-in-out"
                    onChange={(e) => setPlayer1Name(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-b from-blue-500 to-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                >
                  Enter Game
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="font-3xl text-lg font-bold ">Create or Join</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setCreateOrJoin("create")}
                  className="bg-gradient-to-b from-cyan-500 to-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-sm"
                >
                  Create Game
                </button>
                <button
                  onClick={() => setCreateOrJoin("join")}
                  className="bg-gradient-to-b from-cyan-500 to-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full text-sm"
                >
                  Join Game
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
