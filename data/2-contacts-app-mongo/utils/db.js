// Using Node.js `require()`
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/univ", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// // menambah satu data

// const contact1 = new Contact({
//   nama: "indra kusuma",
//   email: "indrakusuma@gmail.com",
//   telp: "089633556677",
// });

// //  simpan ke collections
// contact1.save().then((res) => console.log(res));
