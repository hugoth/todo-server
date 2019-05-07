const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/todo-server", { useNewUrlParser: true });

const Spot = mongoose.model("Spots", {
  title: {
    type: String
  },
  isDone: {
    type: Boolean
  }
});

// **Create**
app.post("/create", async (req, res) => {
  try {
    const newSpot = new Spot({
      title: req.body.title,
      isDone: req.body.isDone
    });
    await newSpot.save();
    res.json({ message: "Spot sucessfully created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Read**
app.get("/", async (req, res) => {
  try {
    const spot = await Spot.find();
    res.json(spot);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// **Update**
app.post("/update", async (req, res) => {
  try {
    if (req.body.id) {
      const spot = await Spot.findOne({ _id: req.body.id });
      if (spot.isDone === true) {
        spot.isDone = false;
      } else {
        spot.isDone = true;
      }

      await spot.save();
      res.json({ message: "Updated" });
    } else {
      res.status(400).json({ message: "Missing parameter" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// // **Delete**
app.post("/delete", async (req, res) => {
  try {
    if (req.body.id) {
      const spot = await Spot.findOne({ _id: req.body.id });
      // Autre manière de trouver un document à partir d'un `id` :
      // const student = await Student.findById(req.body.id);
      await spot.remove();
      res.json({ message: "The spot is Removed" });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
