require("dotenv").config();
require("./utils/db-connection.util");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const logger = require("./utils/winston.util");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const { exceptionHandler } = require("./exceptionHandling");
const fileUpload = require("express-fileupload");
const {
  UPLOAD_FILE_MAX_SIZE,
  TEMP_FILE_UPLOAD_DIRECTORY,
} = require("./config/fileUpload.config");
const { sendResponse } = require("./helpers/requestHandler.helper");

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(morgan("combined", { stream: logger.stream }));
app.use(
  fileUpload({
    debug: false,
    useTempFiles: true,
    preserveExtension: true,
    abortOnLimit: true,
    tempFileDir: TEMP_FILE_UPLOAD_DIRECTORY,
    limits: { fileSize: UPLOAD_FILE_MAX_SIZE },
    limitHandler: (_req, res, _next) => {
      return sendResponse(
        res,
        false,
        413,
        `Uploaded file is too large. Max allowed size is ${UPLOAD_FILE_MAX_SIZE} bytes.`
      );
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
require("./routes/index.route")(app);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(YAML.load("./documentation/swagger.yaml"))
);

// error handler
app.use((err, req, res, _next) => {
  return exceptionHandler(err, req, res);
});

module.exports = app;
