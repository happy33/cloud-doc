const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
let mainwindow;

app.on("ready", () => {
  mainwindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const urlLocation = isDev ? "http://localhost:3000" : "dummyURL";
  mainwindow.loadURL(urlLocation);

  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainwindow.webContents);
});
