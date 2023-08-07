if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const Doctor = require("./models/doctors");
const methodOverride = require("method-override");

mongoose.connect("mongodb://0.0.0.0:27017/hospi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/logout", async (req, res) => {
  res.render("users/login");
});

app.get("/doctors", async (req, res) => {
  const doctors = await Doctor.find({});
  res.render("doctors/index", { doctors });
});

app.get("/login", (req, res) => {
  res.render("users/login");
});

app.get("/doctors/new", (req, res) => {
  res.render("doctors/new");
});

app.get("/doctors/:id", async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  res.render("doctors/show", { doctor });
});

app.post("/doctors", async (req, res) => {
  const doctor = new Doctor(req.body.doctor);
  await doctor.save();
  res.redirect(`/doctors/${doctor._id}`);
});

app.get("/doctors/:id/edit", async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findById(id);
  res.render("doctors/edit", { doctor });
});

app.put("/doctors/:id", async (req, res) => {
  const { id } = req.params;
  const doctor = await Doctor.findByIdAndUpdate(id, { ...req.body.doctor });
  await doctor.save();
  res.redirect(`/doctors/${doctor._id}`);
});

app.delete("/doctors/:id", async (req, res) => {
  const { id } = req.params;
  await Doctor.findByIdAndDelete(id);
  res.redirect("/doctors");
});

app.listen(3000, () => {
  console.log("Serving on port 3000.");
});
