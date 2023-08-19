const express = require("express");
var mysql = require("mysql");
const cors = require("cors");
const app = express();

const port = 4000;

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
});

connection.connect();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/personalInfo", async (req, res) => {
  const q = " SELECT * FROM personal_info";
  await connection.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

//get all projects



app.get("/projects", async (req, res) => {
  const q = " SELECT * FROM projects";
  await connection.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/projects/:id", async (req, res) => {
  const id = req.params.id ; 
  const q = ` SELECT * FROM projects WHERE id = ${id}`;
  await connection.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
});

//delete projects



app.delete('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const q = 'DELETE FROM projects WHERE id = ?';

  console.log('Delete hit for ID:', id);

  await connection.query(q, [id], (err, data) => {
    if (err) {
      console.error('Error deleting project:', err);
      return res.status(500).json({ error: 'An error occurred while deleting the project.' });
    }
    return res.json(data);
  });
});

//update projects

app.put("/projects/:id", async (req, res) => {
  const id = req.params.id;
  const q = "UPDATE projects SET `projectName` = ? , `category` = ?, `projectsType` = ? , `features` = ? , `live_link` = ? , `github_link` = ? , `technology` = ? , `projectsImage` = ? WHERE id = ? ";

  const values = [
    req.body.projectName,
    req.body.category,
    req.body.projectsType,
    req.body.features, 
    req.body.live_link, 
    req.body.github_link, 
    req.body.technology, 
    req.body.projectsImage, 
    id,
  ];

  await connection.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.send("Projects Updated Successfuly");
  });
});


//post Projects

app.post("/addProjects", async (req, res) => {
  const q =
    "INSERT INTO projects (`projectName`,`category`,`projectsType`, `features`, `live_link` , `github_link`, `technology`,`projectsImage`) VALUES (?)";

  const values = [
    
    req.body.projectName,
    req.body.category,
    req.body.projectsType,
    req.body.features,
    req.body.live_link,
    req.body.github_link,
    req.body.technology,
    req.body.projectsImage,
  ];

  await connection.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Book has been created Successfuly");
  });
});

//update the personal info

app.put("/personalInfo/:id", async (req, res) => {
  const q =
    "UPDATE personal_info SET `developerName` = ? , `title` = ?, `aboutMe` = ? , `image` = ? WHERE id = ? ";
  const id = 1;
  const values = [
    req.body.developerName,
    req.body.title,
    req.body.aboutMe,
    req.body.image,
    id,
  ];

  await connection.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.send("Personal Info Updated Successfuly");
  });
});

//update the Socail info

app.put("/contactInfo/:id", async (req, res) => {
  const q =
    "UPDATE personal_info SET `facebook` = ? , `github` = ?, `linkdin` = ? , `youtube` = ? , `mobile` = ? , `location` = ? , `email` =? , `resume_link` = ?  WHERE id = ? ";
  const id = 1;
  const values = [
    req.body.facebook,
    req.body.github,
    req.body.linkdin,
    req.body.youtube,
    req.body.mobile,
    req.body.location,
    req.body.email,
    req.body.resume_link,
    id,
  ];

  await connection.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.send("Social Info Updated Successfuly");
  });
});

//delete api

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  const q = `DELETE FROM books WHERE id=${id}`;

  await connection.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(`ID ${id} is Deleted`);
  });
});
//update api

app.put("/books/:id", async (req, res) => {
  const id = req.params.id;
  const q =
    "UPDATE books SET `title` = ? , `desc` = ?, `cover` = ? WHERE id = ? ";
  const values = [req.body.title, req.body.desc, req.body.cover, id];

  await connection.query(q, [...values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Data is updated");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
