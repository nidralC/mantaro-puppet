const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain;

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 460,
    maxWidth: 400,
    maxHeight: 460,
    minWidth: 400,
    minHeight: 460,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.removeMenu()
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})