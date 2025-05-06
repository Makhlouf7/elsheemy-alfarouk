const { BrowserWindow, app } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 830,
    height: 630,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../assets/logo_favicon.ico"),
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
