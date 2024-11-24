import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: String,
  log: [
    {
      _id: false,
      description: String,
      duration: Number,
      date: String,
    },
  ],
})

userSchema.virtual("count").get(function () {
  return this.log.length
})

const User = mongoose.model("User", userSchema)

async function db() {
  await mongoose.connect(process.env.DB_URI)

  return {
    async addNewUser(username) {
      try {
        const user = await new User({ username }).save()

        return { username: user.username, _id: user._id }
      } catch (error) {
        console.error("add new user error", error)
      }
    },

    async getAllUsers() {
      try {
        return await User.find({}, "username _id")
      } catch (error) {
        console.error("get all user error", error)
      }
    },

    async getUser(_id, { from, to, limit } = {}) {
      let user = await User.findById(_id)

      user.log = user.log.filter((log) => {
        const logDate = new Date(log.date)
        if (from && to) {
          from = new Date(from)
          to = new Date(to)
          return logDate >= from && logDate <= to
        } else if (from) {
          from = new Date(from)
          return logDate >= from
        } else if (to) {
          to = new Date(to)
          return logDate <= to
        } else {
          return true
        }
      })

      if (limit) user.log = user.log.slice(0, limit)

      user = { ...user.toJSON({ virtuals: true }) }
      if (from) user.from = from.toDateString()
      if (to) user.to = to.toDateString()

      return user
    },

    async addExercise(userId, exercise) {
      const user = await User.findById(userId)

      let { description, duration, date } = exercise
      duration = Number(duration)
      date ? (date = new Date(date)) : (date = new Date())
      date = date.toDateString()

      user.log.push({
        description,
        duration,
        date,
      })
      await user.save()

      return {
        username: user.username,
        description,
        duration,
        date,
        _id: user._id,
      }
    },
  }
}

export default db
