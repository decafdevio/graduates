/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const { User } = require("../models/user");
const { Employer } = require("../models/employer");
const sendMailMethod = require("../src/emailServer");
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbName = process.env.dbName;

mongoose.connect(dbName);

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.post("/sendmail", async (req, res) => {
  try {
    const result = await sendMailMethod(req.body);

    // send the response
    res.json({
      status: true,
      payload: result,
    });
  } catch (error) {
    console.error(error.message);
    res.json({
      // status: false,
      status: error.message,
      payload: "Something went wrong in Sendmail Route.",
    });
  }
});

app.post("/register", async (req, res) => {
  // const newPassword = await bcrypt.hash(req.body.password, 10);
  const newPassword = await req.body.password;

  const emailCheck = await User.findOne({ email: req.body.email });
  if (emailCheck) {
    // console.log(`error `);
    // res.sendStatus(409);
    res.send("Email address is already registered.");
    // throw new Error("Email address is already registered.");
  } else {
    // console.log(`fname `, req.body.fname);

    if (req.body.fname != "") {
      const user = await User.create({
        email: req.body.email,
        password: newPassword,
        role: "participant",
        fname: req.body.fname,
        sname: req.body.sname,
        location: req.body.location,
      });
      await user.save();
      res.send("Great, your account has been created! Login!");
    } else {
      const employer = await Employer.create({
        email: req.body.email,
        password: newPassword,
        role: "employer",
        company: req.body.company,
        industry: req.body.industry,
        location: req.body.location,
      });
      await employer.save();
      res.send("Great, your account has been created! Login!");
    }
  }
});

app.post("/auth", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log("login details", user);
  if (!user) {
    console.log("ERROR AUTH 401");
    return res.sendStatus(401);
  }
  // const isPasswordValid = await bcrypt.compare(
  //   req.body.password,
  //   user.password
  // );
  const isPasswordValid = req.body.password === user.password;

  if (isPasswordValid) {
    user.token = uuidv4();
    await user.save();
    res.send({ token: user.token });
  } else {
    console.log("ERROR AUTH PASSWORD");
    return res.sendStatus(404);
  }
});

app.get("/user/pic/:filename", (req, res) => {
  try {
    const path = require("path");
    // console.log("Got Here", __dirname + "./uploads/" + req.params.filename);
    res.sendFile(path.resolve("./uploads/" + req.params.filename));
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/cv/:filename", (req, res) => {
  try {
    const path = require("path");
    // console.log("Got Here", __dirname + "./uploads/" + req.params.filename);
    res.sendFile(path.resolve("./uploads/" + req.params.filename));
  } catch (err) {
    console.log(err);
  }
});

app.use(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const user = await User.findOne({ token: authHeader });

  if (user) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// defining CRUD operations
app.get("/", async (req, res) => {
  res.send(await User.find());
});

app.post("/", async (req, res) => {
  const newUser = req.body;
  const User = new User(newUser);
  await User.save();
  res.send({ message: "New user inserted." });
});

app.delete("/:id", async (req, res) => {
  await User.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Profile removed." });
});

app.put("/:id", async (req, res) => {
  await User.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Profile updated." });
});

app.put("/employer/:id", async (req, res) => {
  await Employer.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Profile updated." });
});

//multer
let storage = multer.memoryStorage();
let uploadDisk = multer({ storage: storage });

app.post("/user/pic/new", uploadDisk.single("myfile"), async (req, res) => {
  let fileType = req.file.originalname.split(".");
  fs.writeFileSync(
    "./uploads/" + `${req.body.name}.${fileType[fileType.length - 1]}`,
    req.file.buffer
  );
  res.json({ message: "Upload Complete" });
});

app.post("/user/cv/new", uploadDisk.single("myfile"), async (req, res) => {
  let fileType = req.file.originalname.split(".");
  fs.writeFileSync(
    "./uploads/" + `${req.body.name}.${fileType[fileType.length - 1]}`,
    req.file.buffer
  );
  res.json({ message: "Upload Complete" });
});

// starting the server
app.listen(port, () => console.log(`Listening on port ${port}!`));

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
