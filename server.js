require("dotenv").config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;
const helmet = require('helmet')
const cors = require('cors');
const InitializeAdmin = require("./src/server/services/InitializeAdmin");
const connectDB = require("./src/server/database/connection");



// Middlewares
app.use(express.json());
app.use(helmet());


// Connect Database
connectDB()


// // Initialize Super Admin
 InitializeAdmin()

const allowedOrigins = [

   "https://www.deesandbeesglobal.com",
   "https://deesandbeesglobal.com",
   "http://deesandbeesglobal.com",
    process.env.FRONTEND_BASE_URL
  ];
  
  app.use(
    cors({
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
      credentials: true,
    })
  );
  

app.get("/", (req, res) => {
    res.send("Dees And Bees Server Running now")
})


app.use("/api/v1/user", require("./src/server/routes/userRoute"))
app.use("/api/v1/secure", require("./src/server/routes/authRoute"))
app.use("/api/v1/testimonial", require("./src/server/routes/testimonialRoute"))
app.use("/api/v1/contact", require("./src/server/routes/contactRoute"))


app.listen(port, ()=> console.log(`Server running on: http://localhost:${port}`))