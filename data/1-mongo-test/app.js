const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const uri = "mongodb://127.0.0.1:27017";
const dbName = "univ";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((error, result) => {
  if (error) {
    return console.log("koneksi gagal");
  }

  // pilih database
  const db = client.db(dbName);

  // == menambahkan 1 data ==
  //   db.collection("mhs")
  //     .insertOne({
  //       nama: "agung",
  //       jurusan: "teknik mesin",
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  // == mengupdate satu data ==
  db.collection("mhs")
    .updateMany(
      {
        nama: "ketsar ali",
      },

      {
        $set: {
          nama: "muhammad ketsar ali",
          jurusan: "teknik informtika",
        },
      }
    )
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  // == menampilkan semua data ==
  //   console.log(
  //     db
  //       .collection("mhs")
  //       .find({ nama: "ketsar" })
  //       .toArray()
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => console.log(err))
  //   );

  // == menghapus 1 data ==
  //   db.collection("mhs")
  //     .deleteOne({
  //       _id: ObjectId("6373462ee3d20c08145162a9"),
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  // });
});
