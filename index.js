import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html")
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
