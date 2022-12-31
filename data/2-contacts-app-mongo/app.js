// express connection
const express = require("express");
// ejs-layouts connection
const expressLayouts = require("express-ejs-layouts");

require("./utils/db");
const contactSchema = require("./model/schema");

const app = express();
const port = 3000;

// flash connections
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// == ejs ==
app.set("view engine", "ejs");

// == middlewere ==
app.use(expressLayouts);
app.use(express.static("public")); // built-in middlewere
app.use(express.urlencoded({ extended: true })); // built-in middlewere

// configuration flash
app.use(cookieParser("secret"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 6000 },
  })
);

app.use(flash());

// halaman home
app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Ketsar Ali",
      prodi: "Teknik Informatika",
    },
    {
      nama: "Nur Asyiyah",
      prodi: "Teknik Telekomunikasi ",
    },
    {
      nama: "Irwan Aidy",
      prodi: "Akuntansi",
    },
  ];

  res.render("home", {
    title: "Home Page",
    layout: "layouts/main-component",
    mahasiswa,
  });
});

// halaman about'
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    layout: "layouts/main-component",
  });
});

// display data contacts
app.get("/contacts", async (req, res) => {
  // contactSchema.find().then((result) => {
  //   res.send(result);
  // });
  const contacts = await contactSchema.find();
  res.render("contacts", {
    title: "Contacts Page",
    layout: "layouts/main-component",
    contacts,
    msg: req.flash("msg"),
  });
});

// halaman detail contact
app.get("/contacts/:nama", async (req, res) => {
  const contact = await contactSchema.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Detail Contact Page",
    layout: "layouts/main-component",
    contact,
  });
});

// note : relative url './' selain url yang sudah diatur maka arahkan ke  blank page dan tampilkan pesan
app.use((req, res) => {
  const inputData = app.set("error", "Alamat URL Tidak Di Ketahui");
  const getData = app.get("error");
  res.send(`<h1>Error : ${getData}</h1>`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}... | Klik For Visit : http://localhost:${port}`);
});
