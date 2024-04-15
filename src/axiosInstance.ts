import axios from "axios"

const instance = axios.create({
  baseURL: "https://tttapi.vercel.app",
  headers: {
    "Content-Type": "application/json"
  }
})

export default instance

// https://tttapi.vercel.app
// http://localhost:8000
