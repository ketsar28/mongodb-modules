// express connection
const express = require("express");
// ejs-layouts connection
const expressLayouts = require("express-ejs-layouts");
// method-override
const methodOverride = require("method-override");

require("./utils/db");
const contactSchema = require("./model/schema");

const app = express();
const port = 3000;

// flash connections
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// ...rest of the initial code omitted for simplicity.
const { body, validationResult, check } = require("express-validator");

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

app.use(methodOverride("_method"));

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

app.use("/about", (req, res, next) => {
  console.log("Ini Halaman About");
  next();
});
// halaman about'
app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    layout: "layouts/main-component",
  });
});

app.use("/contacts", (req, res, next) => {
  console.log("Ini Halaman Contacts");
  next();
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

app.use("/add", (req, res, next) => {
  console.log("Ini Halaman Add");
  next();
});

// tambahkan data contacts
app.get("/add", (req, res) => {
  res.render("add", {
    title: "Add Contact Page",
    layout: "layouts/main-component",
  });
});

// proses tambah data contacts
app.post(
  "/contacts",
  [
    check("nama", "Username Tersebut Telah Digunakan").custom(async (value) => {
      const duplikat = await contactSchema.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Username Tersebut Telah Digunakan");
      }
      return true;
    }),
    check("email", "Email Yang Anda Masukan Tidak Valid").isEmail(),
    check("telp", "Nomor Yang Anda Masukan Tidak Valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add", {
        title: "Add Contact Page",
        layout: "layouts/main-component",
        errors: errors.array(),
      });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      contactSchema.insertMany(req.body, (error, result) => {
        // kirimkan flash message
        req.flash("msg", "Data Contact Berhasil Di Tambahkan");
        res.redirect("/contacts");
      });
    }
  }
);

// router handler -- hapus data contacts -- versi method override & mongoose
app.delete("/contacts", (req, res) => {
  contactSchema.deleteOne({ nama: req.body.nama }).then((result) => {
    // kirimkan flash message
    req.flash("msg", "Data Contact Berhasil Di Hapus");
    res.redirect("/contacts");
  });
});

// router handler -- ubah data contacts -- versi method override & mongoose
app.get("/contacts/edit/:nama", async (req, res) => {
  const contact = await contactSchema.findOne({ nama: req.params.nama });
  res.render("edit", {
    title: "Edit Contact Page",
    layout: "layouts/main-component",
    contact,
  });
});

// proses ubah data
app.put(
  "/contacts",
  [
    check("nama", "Username Tersebut Telah Digunakan").custom(async (value, { req }) => {
      const duplikat = await contactSchema.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Username Tersebut Telah Digunakan");
      }
      return true;
    }),
    check("email", "Email Yang Anda Masukan Tidak Valid").isEmail(),
    check("telp", "Nomor Yang Anda Masukan Tidak Valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit", {
        title: "Edit Contact Page",
        layout: "layouts/main-component",
        errors: errors.array(),
        contact: req.body,
      });
      // return res.status(400).json({ errors: errors.array() });
    } else {
      //  res.send(req.body)
      contactSchema
        .updateOne(
          { _id: req.body._id },
          {
            $set: {
              nama: req.body.nama,
              email: req.body.email,
              telp: req.body.telp,
            },
          }
        )
        .then((result) => {
          // kirimkan flash message
          req.flash("msg", "Data Contact Berhasil Di Perbaharui");
          res.redirect("/contacts");
        });
    }
  }
);

// halaman detail contact
app.get("/contacts/:nama", async (req, res) => {
  const contact = await contactSchema.findOne({ nama: req.params.nama });
  res.render("detail", {
    title: "Detail Contact Page",
    layout: "layouts/main-component",
    contact,
  });
});

// // hapus data contacts -- versi mongoose saja
// app.get("/contacts/delete/:nama", async (req, res) => {
//   const contact = await contactSchema.findOne({ nama: req.params.nama });

//   if (!contact) {
//     res.status(404);
//     res.send("Data Tidak Di Ketahui!");
//   } else {
//     contactSchema.deleteOne({ nama: req.params.nama }).then((result) => {
//       // kirimkan flash message
//       req.flash("msg", "Data Contact Berhasil Di Hapus");
//       res.redirect("/contacts");
//     });
//   }
// });

//  selain url yang sudah diatur maka arahkan ke  blank page dan tampilkan pesan
app.use((req, res) => {
  const inputData = app.set("error", "Alamat URL Tidak Di Ketahui");
  const getData = app.get("error");
  res.send(`<h1>Error : ${getData}</h1>`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}... | Klik For Visit : http://localhost:${port}`);
});
