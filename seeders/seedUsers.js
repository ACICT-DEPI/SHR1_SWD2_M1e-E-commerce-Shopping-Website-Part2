const mongoose = require("mongoose");
const { generateFakeUser } = require("./fakeData");
const User = require("../models/userModel");

const URL =
  "mongodb://ESW_Team:ESW12344321Team@eswcluster-shard-00-00.klvma.mongodb.net:27017,eswcluster-shard-00-01.klvma.mongodb.net:27017,eswcluster-shard-00-02.klvma.mongodb.net:27017/eswDB?ssl=true&replicaSet=atlas-mx1d2x-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ESWCluster";

mongoose
  .connect(URL)
  .then(async () => {
    const users = [];

    // Generate 50 users
    for (let i = 0; i < 50; i++) {
      const fakeUser = await generateFakeUser();
      users.push(fakeUser);
    }

    // Optionally, insert them into the database
    await User.insertMany(users);
    console.log("50 users have been generated and inserted into the database!");

    mongoose.disconnect();
  })
  .catch((err) => console.error(err));
