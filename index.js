var express = require("express");
var app = express();
var cors = require("cors");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var PORT = 5000;
var Todo = require("./Todo");
var todoRouter = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://admin123:Sohail99@cluster0.acej1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("connected to mongodb successfully");
});

todoRouter.route("/").get(function (req, res) {
  Todo.find(function (err, todos) {
    if (err) {
      console.log("error" + err);
    } else {
      res.json(todos);
    }
  });
});

todoRouter.route("/:id").get(function (req, res) {
  Todo.findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        res.statusCode(404).send("No todo found");
      } else {
        res.json(todo);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
todoRouter.route("/add").post(function (req, res) {
  let todo = new Todo(req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo });
      //   console.log("successfully added");
    })
    .catch((err) => {
      res.status(400).send(err);
      //   console.log(err);
    });
});
todoRouter.route("/del/:id").delete((req, res) => {
  // res.status(200).send(req.params.id);
  Todo.findByIdAndRemove(req.params.id)
    .then((todo) => {
      if (!todo) {
        return res.status(401).send("something went wrong");
      } else {
        res.status(200).send("Delete success");
      }
    })
    .catch((err) => res.status(401).send(err));
});
todoRouter.route("/edit/:id").post(function (req, res) {
  var id = req.params.id;
  Todo.findById(id, (err, todo) => {
    if (!todo) res.status(404).send("object with givcen id not found");
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;

      todo
        .save()
        .then((todo) => {
          res.status(200).send("update success");
        })
        .catch((err) => {
          res.status(400).send("something went wrong please try again");
        });
    }
  });
});

app.use("/todo", todoRouter);
app.get("/beacon", (req, res) => {
  res.type("application/json");
  res.json({ price: 6.0,id:2});
});
app.get("/", (req, res) => {
  res.status(200).send("HELLO WELCOME TO SERVER");
});

app.listen(process.env.PORT || 6000, function () {
  console.log("listening to port " + PORT);
});
