const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
var udpServ = require('./js/server.js');

//Initialize server
udpServ.init(2222);

//Create window
let win

//Create the browser window
function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  })
}

ipcMain.on('msg', function(event,arg){
    console.log(arg);
    udpServ.broadcast(arg);
});

//When everything's loaded
app.on('ready', createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//When there's no window but the app is in the menu
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
