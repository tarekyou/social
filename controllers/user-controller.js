const { User, Thought } = require("../models");

const userController = {
  getAllUser(req, res) {
    User.find({})
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        // console.log("heristheuser" + dbUserData.thoughts);
        // console.log(dbUserData);
        // console.log(dbUserData.thoughts[0]._id);
        for (let i = 0; i < dbUserData.thoughts.length; i++) {
          console.log(dbUserData.thoughts[i]._id);
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //   deleteUser({ params }, res) {
  //     User.findOneAndDelete({ _id: params.id })
  //       .then((dbUserData) => {
  //         if (!dbUserData) {
  //           res.status(404).json({ message: "No User with this particular ID!" });
  //           return;
  //         }
  //         res.json(dbUserData);
  //       })
  //       .catch((err) => res.status(400).json(err));
  //   },
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      })
      .then((dbThoughtdata) => {
        res.json(dbThoughtdata);
      })
      .catch((err) => res.status(400).json(err));
  },
  //   deleteUser({ params }, res) {
  //     User.findById({ _id: params.id })
  //       .then((dbUserData) => {
  //         Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
  //       })
  //       .then((dbUserData) => {
  //         User.findOneAndDelete({ _id: params.id });
  //       })
  //       .then((dbUserData) => {
  //         if (!dbUserData) {
  //           res.status(404).json({ message: "No User with this particular ID!" });
  //           return;
  //         }
  //         // Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
  //         // Thought.deleteMany({ $in: dbUserData.thoughts });
  //         res.json(dbUserData);
  //       })
  //       .catch((err) => res.status(400).json(err));
  //   },

  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No User with this particular ID!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
