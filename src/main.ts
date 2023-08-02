import { app, BrowserWindow, Tray, Menu, ipcMain } from "electron";
import * as path from "path";
// const electronReload = require('electron-reload');

// try {
//   require('electron-reloader')(module)
// } catch (_) {}

// // Config hot reload
// electronReload(__dirname);

let tray: Tray = null;
let trayWindow: BrowserWindow = null;
let trayBounds: Electron.Rectangle = null;

function createWindow() {
  tray = new Tray(path.join(__dirname, "../assets/icon-small.png"));
  trayBounds = tray.getBounds();

  tray.setToolTip("Let's stretch a bit");

  trayWindow = new BrowserWindow({
    width: 128,
    height: 120,
    frame: false,
    resizable: false,
    transparent: true,
    show: false,
    movable: false,
    minimizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    maximizable: false,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  trayWindow.loadFile(path.join(__dirname, "../index.html"));

  tray.on("click", () => {
    trayWindow.setPosition(trayBounds.x - 62, trayBounds.y - 60);
    toggleWindow();
  });

  trayWindow.on("closed", function () {
    trayWindow = null;
  });

  trayWindow.on("blur", () => {
    trayWindow.hide();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

function toggleWindow() {
  trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (trayWindow === null) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.once("quit", (event, args) => {
  app.quit();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
