const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

const port = process.env.PORT || 4000; // Use process.env.PORT if available, otherwise use 4000

app.use(express.json());
app.use(cors());
dotenv.config();

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxnyyz3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    return client.db("portfolio");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Define route handlers

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/personalInfo", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const personalInfoCollection = db.collection("personalInfo");
    const result = await personalInfoCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/projects", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/projects/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };

  try {
    const db = await connectToDatabase();
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/projects/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };

  try {
    const db = await connectToDatabase();
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/projects/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: {
      projectName: req.body.projectName,
      category: req.body.category,
      projectsType: req.body.projectsType,
      features: req.body.features,
      live_link: req.body.live_link,
      github_link: req.body.github_link,
      technology: req.body.technology,
      projectsImage: req.body.projectsImage,
    },
  };

  try {
    const db = await connectToDatabase();
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection.updateOne(filter, update);
    res.send(result);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/addProjects", async (req, res) => {
  const data = req.body;
  data.createdAt = new Date();

  try {
    const db = await connectToDatabase();
    const projectsCollection = db.collection("projects");
    const result = await projectsCollection.insertOne(data);
    res.send(result);
  } catch (error) {
    console.error("Error adding project:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/personalInfo/:id", async (req, res) => {
  const filter = { _id: "1" };
  const update = {
    $set: {
      developerName: req.body.developerName,
      title: req.body.title,
      aboutMe: req.body.aboutMe,
      image: req.body.image,
    },
  };

  try {
    const db = await connectToDatabase();
    const personalInfoCollection = db.collection("personalInfo");
    const result = await personalInfoCollection.updateOne(filter, update);
    res.send(result);
  } catch (error) {
    console.error("Error updating personal info:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/contactInfo/:id", async (req, res) => {
  const filter = { _id: "1" };
  const update = {
    $set: {
      facebook: req.body.facebook,
      github: req.body.github,
      linkdin: req.body.linkdin,
      youtube: req.body.youtube,
      mobile: req.body.mobile,
      location: req.body.location,
      email: req.body.email,
      resume_link: req.body.resume_link,
    },
  };

  try {
    const db = await connectToDatabase();
    const personalInfoCollection = db.collection("personalInfo");
    const result = await personalInfoCollection.updateOne(filter, update);
    res.send(result);
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
