const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const auth = require("./middleware/auth");
//  Routes
const UserRoutes = require("./routes/user.routes");


const app = express();
dotenv.config();

//  content-type - application/json
app.use(express.json());

//  content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
console.log("see db.model " + db);
//  console.log("Conn string " + db.url);   //  <- for debug

//  third party middlewares installed via npm
app.use(morgan("common"));  //  logging to terminal
app.use(helmet());  //  security focused

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// root project endpoint 
app.get("/", auth, (request, response) => {
  response.status(200).send("Welcome 🙌 ");
});

//  endpoints
app.use("/api", UserRoutes);



// set port and listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});