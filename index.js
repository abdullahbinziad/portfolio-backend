const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv"); // Import dotenv package

const port = 4000;

app.use(express.json());
app.use(cors());
dotenv.config();

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kxnyyz3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("portfolio");
    const personalInfoCollection = database.collection("personalInfo");
    const projectsCollection = database.collection("projects");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.get("/personalInfo", async (req, res) => {
      let query = {};
      const result = await personalInfoCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/projects", async (req, res) => {
      const result = await projectsCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new Object(id) };

      const result = await projectsCollection.find(query).toArray();
      res.send(result);
    });

    //delete projects

    app.delete("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new Object(id) };
      const result = await projectsCollection.deleteOne(query);
      res.send(result);
    });

    // update single projects

    app.put("/projects/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectID(id) };
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

      const result = await projectsCollection.updateOne(filter, update);
      res.send(result);
    });

    // post projects

    app.post("/addProjects", async (req, res) => {
      const data = req.body;
      const result = await projectsCollection.insertOne(data);
      res.send(result);
    });

    //update personal info

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

      // Add the 'upsert' option here

      const result = await personalInfoCollection.updateOne(filter, update);
      res.send(result);
    });

    //update social links info

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

      const result = await personalInfoCollection.updateOne(filter, update);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
