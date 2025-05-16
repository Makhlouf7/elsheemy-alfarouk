const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");
const mongoose = require("mongoose");
const Supplier = require("../models/suppliers");
const Incoming = require("../models/incoming");
const Customer = require("../models/customers");
const Safe = require("../models/safe");
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

// Channels Communications =====
const models = {
  Supplier,
  Incoming,
  Customer,
  Safe,
};

ipcMain.handle("get:all", async (event, modelName) => {
  const Model = models[modelName];
  try {
    const data = await Model.find();
    return data;
  } catch (err) {
    console.error(`DB error on ${modelName}:`, err);
    return { success: false };
  }
});

ipcMain.handle("get:byId", async (event, { modelName, id }) => {
  try {
    const Model = models[modelName];
    const doc = await Model.findById(id);
    console.log(doc);
    return { success: true, data: doc };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
});

ipcMain.handle("get:byFilter", async (event, { modelName, filterOptions }) => {
  try {
    const Model = models[modelName];
    const docs = await Model.find(filterOptions);
    return { success: true, data: docs };
  } catch (error) {
    console.error(`DB error filtering ${modelName}`, err);
    return { success: false };
  }
});

ipcMain.handle("create:doc", async (event, { modelName, data }) => {
  const Model = models[modelName];
  try {
    await Model.create(data);
    return { success: true };
  } catch (err) {
    console.error(`DB error creating ${modelName}:`, err);
    return { success: false };
  }
});

ipcMain.handle("update:doc", async (event, { modelName, id, data }) => {
  const Model = models[modelName];
  try {
    await Model.findByIdAndUpdate(id, data);
    return { success: true };
  } catch (err) {
    console.error(`DB error updating ${modelName}:`, err);
    return { success: false };
  }
});

ipcMain.handle("delete:byId", async (event, { modelName, id }) => {
  const Model = models[modelName];
  try {
    await Model.findByIdAndDelete(id);
    return { success: true };
  } catch (err) {
    console.error(`DB error delete ${modelName}:`, err);
    return { success: false };
  }
});

ipcMain.handle("stats:all", async (event, statOptions) => {
  console.log("StatOptions", statOptions);
  const safeTotalIncomes = await Safe.totalIncomes(statOptions.date);
  const safeTotalExpenses = await Safe.totalExpenses(statOptions.date);
  const safeTotalBalance = safeTotalIncomes - safeTotalExpenses;
  return {
    success: true,
    data: {
      safeTotalIncomes,
      safeTotalExpenses,
      safeTotalBalance,
    },
  };
});
