import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import db from "./model/model.js"

const app = express()

app.use(cors())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  res.sendFile(import.meta.dirname + "/views/index.html")
})

app
  .route("/api/users")
  .post((req, res) => {
    const username = req.body.username

    db()
      .then(({ addNewUser }) => addNewUser(username))
      .then((user) => res.json(user))
      .catch((err) => res.json(err))
  })
  .get((req, res) => {
    db()
      .then(({ getAllUsers }) => getAllUsers())
      .then((users) => res.json(users))
      .catch((err) => res.json(err))
  })

app.post("/api/users/:_id/exercises", (req, res) => {
  db()
    .then(({ addExercise }) => addExercise(req.params._id, req.body))
    .then((data) => res.json(data))
    .catch((err) => res.json(err))
})

app.get("/api/users/:_id/logs", (req, res) => {
  db()
    .then(({ getUser }) => getUser(req.params._id, req.query))
    .then((userLog) => res.json(userLog))
    .catch((err) => res.json(err))
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port)
})
