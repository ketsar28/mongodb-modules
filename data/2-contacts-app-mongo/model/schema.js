const mongoose = require("mongoose");
// membuat schema / create structure dbs
const Contact = mongoose.model("Contact", {
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  telp: {
    type: String,
    required: true,
  },
});

module.exports = Contact;
