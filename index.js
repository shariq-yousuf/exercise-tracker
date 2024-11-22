import express from "express"
import cors from "cors"
import { nanoid } from "nanoid"
import dotenv from "dotenv"
dotenv.config()

const app = express()

app.use(cors())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html")
})

const users = []

app
  .route("/api/users")
  .post((req, res) => {
    const username = req.body.username
    const _id = nanoid()

    const user = {
      username,
      _id,
    }
    users.push(user)

    res.json(user)
  })
  .get((req, res) => {
    res.json(users)
  })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
