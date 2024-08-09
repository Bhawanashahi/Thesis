require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");

const adminController = require("./controllers/admin_controller");
const cloudinaryController = require("./controllers/cloudinary_controller");
const userController = require("./controllers/user_controller");
const productsController = require("./controllers/products_controller");
require("./models");
const app = express();
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log(process.env);
    console.log("Connected to Mlab..");
  })
  .catch(err => {
    console.log("Mlab connection error -- ", err);
  });
app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14
    }
  })
);

app.use(bodyParser.json());

//set timeout so that our database connects before accessing data

//admin
app.get("/api/users", adminController.getAdminUsers);

app.post("/api/products", adminController.createProduct);

app.put("/api/product/:id", adminController.updateProduct);

app.delete("/api/products/:id", adminController.deleteProduct);

//user
app.get("/auth/callback", userController.login);

app.post("/api/logout", userController.logout);

app.get("/api/user-data", userController.readUserData);

app.post("/api/user-data/cart", userController.addToCart);

app.delete("/api/user-data/cart/:id", userController.removeFromCart);

//products
app.get("/api/products", productsController.readAllProducts);

app.get("/api/products/:id", productsController.readProduct);

app.get("/api/upload", cloudinaryController.upload);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
