const app = require("express");
// const bodyParser = require("body-parser");
const server = require("http").createServer(app);
const MongoClient = require("mongodb").MongoClient;
const io = require("socket.io")(server);

// const app = express();

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   next();
// });

const URL = "mongodb://localhost:27017";
const dbName = "chatapp_db";
const client = new MongoClient(URL, { useUnifiedTopology: true });

client.connect();
console.log("Connected on mongodb");

const db = client.db(dbName);

// io.on("connection", (socket) => {
//   socket.on("message", (text) => {
//     console.log(text);
//     io.emit("message", { text: "my message" });
//   });
// });

// const server = app.listen(9000, () => {
//   console.log("listening on port 9000");
// });
// sk = io(server);

db.on("error", console.error.bind(console, "Connection Error:"));
io.listen(9000, () => {
  console.log("Listening on port 9000");
});

io.on("connection", (socket) => {
  socket.on("message", ({ text }) => {
    // console.log(text);
    // const inbox = "inbox";
    console.log(text);
    if (text.isLogin === true) {
      io.emit("message", text);
    } else if (text.status === "request") {
      console.log(text);
      io.emit("message", text);
    }

    const coll = db.collection(`messages.${text.conver_id}.inbox`);
    // const id_col = coll[text.user_id];
    // const inbox_col = id_col.inbox;
    const changeStreams = coll.watch();

    changeStreams.on("change", (change) => {
      console.log(change.fullDocument);

      io.emit("message", change.fullDocument);
    });
  });
});

// db.once("open", () => {
//   io.listen(9000, () => {
//     console.log("Listening on port 9000");
//   });
//   const coll = db.collection("messages");

//   const changeStreams = coll.watch();

//   changeStreams.on("change", (change) => {
//     console.log(change.fullDocument);

//     io.emit("message", change.fullDocument);
//   });
// });

// db.on("error", console.error.bind(console, "Connection Error:"));

// db.once("open", () => {});

// db.once("open", () => {
//   app.listen(9000, () => {
//     console.log("Node server running on port 9000");
//   });

//   const taskCollection = db.collection("tasks");
//   const changeStream = taskCollection.watch();

//   //   changeStream.on("change", (change) => {});
//   changeStream.on("change", (change) => {
//     console.log(change);

//     if (change.operationType === "insert") {
//       const task = change.fullDocument;
//       pusher.trigger(channel, "inserted", {
//         id: task._id,
//         task: task.task,
//       });
//     } else if (change.operationType === "delete") {
//       pusher.trigger(channel, "deleted", change.documentKey._id);
//     }
//   });
// });
