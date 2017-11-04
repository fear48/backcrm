import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";
import cors from "cors";
import fileUpload from "express-fileupload";
import oauth2 from 'simple-oauth2';
import google from 'googleapis';

import config from "./config/config";
import passportConfig from "./config/passport";
import usersRouter from "./routers/users";
import historyRouter from "./routers/history";
import roomsRouter from "./routers/rooms";
import eventsRouter from "./routers/events";
import passportRouter from "./routers/passport";
import logsRouter from "./routers/logs";
import transactionRouter from "./routers/transactions";
import tasksRouter from "./routers/tasks";
import salesRouter from "./routers/sales";
import configRouter from "./routers/config";
import clientRouter from "./routers/clients";
import categoryRouter from "./routers/category";
import errorHandler from "./middlewares/errorHandler";
import agenda from "./additions/schedule";

// INITIALIZE APP //
const app = express();

// CONNECTING TO DB //
mongoose.Promise = global.Promise;
mongoose
  .connect(config.database, { useMongoClient: true })
  .then(() => {
    console.log("Connected successfully");
  })
  .catch(err => {
    throw new Error(err);
  });

// AGENDA INITIALIZE ??
agenda.on("ready", () => {
  console.log("Agenda connected to database");
  agenda.every("1 minute", "delete old events");
  agenda.start();
});

// MIDDLEWARES //
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  })
);

// TOKEN //

const OAuth2 = google.auth.OAuth2;
const scope = 'https://www.googleapis.com/auth/calendar';

var oauth2Client = new OAuth2(
  "148190024026-d3de7ud10fmjlan504l4qu3r1tl5bv1a.apps.googleusercontent.com",
  "IR7C89RgT101GjMy7ulWItq_",
  "http:/localhost:3001/api/google"
);

oauth2Client.setCredentials({
  access_token: 'ya29.Glv5BNkHWcWNZi3TawGteUcdUWDqpbBgk16f3kcHXfg1EtFRPZOtO2vCFXXk6yliBWjJE5Ue2kQvyEMY6UpF2clc20bGSQVln4Io-Uajyi8KcsLmVyYHGWyJjn1W',
  refresh_token: '1/waG7X40pksGCLPE4Pc04_pEApD_gs1CHdkeuvc9XMRw'
  // Optional, provide an expiry_date (milliseconds since the Unix Epoch)
  // expiry_date: (new Date()).getTime() + (1000 * 60 * 60 * 24 * 7)
});

oauth2Client.refreshAccessToken(function (err, tokens) {
  console.log(tokens, err)
});

app.get("/api/google", (req, res, next) => {
  console.log(req.body)
})

// PASSPORT //
app.use(passport.initialize({}))
passportConfig(passport);

// LOGGING//
// app.use(savingLogs);  may 

// ROUTES //
app.use("/api", passportRouter);
app.use("/api/clients", clientRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/history", historyRouter);
app.use("/api/config", configRouter);
app.use("/api/sales", salesRouter);
app.use(passport.authenticate("jwt", { session: false })); // cheak if unauthorized
app.use("/api/categories", categoryRouter);
app.use("/api/users", usersRouter);
app.use("/api/logs", logsRouter);
app.use("/api/tasks", tasksRouter);

// ERRORS
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}); // Error 404
app.use(errorHandler); // Always last (error handler)

// STARTING SERVER //
const port = process.env.port || 3001;
app.listen(port, err => {
  if (err) throw err;
  console.log(`Server started on port ${port}`);
});
