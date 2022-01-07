const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//listen for app to be ready
app.on('ready', function(){
    //create new window
    mainWindow = new BrowserWindow({});
    //load main.html into mainWindow
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    //build menu from template
    //const mainMenu = Menu.buildFromTemplate([{label:''}]);
    //insert menu
    //Menu.setApplicationMenu(mainMenu);
});