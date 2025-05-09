const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");
const mongoose = require("mongoose");
const Supplier = require("../models/suppliers");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log("Couldn't connect to database"));

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    icon: path.join(__dirname, "../assets/logo_favicon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("../renderer/pages/incoming/index.html");
};

app.whenReady().then(() => {
  createWindow();
});

// Adding an event for macOs as even if all windows are closed it doesn't close the process so we are telling it if its not windows OS and all windows have been closed kill the process
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Channels Communications
const models = {
  Supplier,
  // Add more models as needed
};

ipcMain.handle("get:all", async (event, modelName) => {
  const Model = models[modelName];
  try {
    const data = await Model.find();
    return data;
  } catch (err) {
    console.error(`DB error on ${modelName}:`, err);
  }
});

ipcMain.handle("get:byId", async (event, { modelName, id }) => {
  try {
    const Model = models[modelName];
    const doc = await Model.findById(id);
    return { success: true, data: doc };
  } catch (error) {
    console.error(error);
  }
});

ipcMain.handle("create:doc", async (event, { modelName, data }) => {
  const Model = models[modelName];
  console.log(data);
  try {
    await Model.create(data);
    return { success: true };
  } catch (err) {
    console.error(`DB error creating ${modelName}:`, err);
  }
});
