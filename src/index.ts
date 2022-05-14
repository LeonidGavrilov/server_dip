import express, { Express } from "express";
import mongoose from "mongoose";
// import csurf from "csurf";
// import session from "express-session";
import cors from "cors";
// import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import movieRouter from './routes/movie';
import uploadRouter from './routes/upload';
import authRouter from './routes/auth';
import { mongoUrl } from "./secret";
// import keys from "./keys";
// import userMW from "./middleware/user";
// import sessionMW from "./middleware/variables";

const app: Express = express();
const port: number = 3001;

// const store = MongoStore.create({
//   collectionName: "sessions",
//   mongoUrl: keys.connectionDB,
// });

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.json());

app.use(cors());
app.use(cookieParser());

// app.use(
//   session({
//     secret: keys.sessionSecret || "code",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );
// app.use(csurf({ cookie: true }));
// app.use(sessionMW);
// app.use(userMW);

app.use("/api/movie", movieRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);

mongoose.connect(mongoUrl, (err) => {
  if (err) return console.log(err);
  app.listen(port, function () {
    console.log("Сервер подключён на 3001 порту...");
  });
});
