const { app, BrowserWindow } = require('electron');
const path = require('path');

// Minimal test to verify Electron basics work
app.whenReady().then(() => {
    console.log('=== MINIMAL ELECTRON TEST ===');
    console.log('Current directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('App path:', app.getAppPath());
    
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        show: true
    });

    // Try to load a simple HTML page
    const htmlPath = path.join(__dirname, 'index.html');
    console.log('Trying to load:', htmlPath);
    
    const fs = require('fs');
    console.log('File exists:', fs.existsSync(htmlPath));
    
    if (fs.existsSync(htmlPath)) {
        win.loadFile(htmlPath).then(() => {
            console.log('SUCCESS: HTML file loaded');
        }).catch(err => {
            console.error('ERROR loading file:', err);
        });
    } else {
        console.log('Creating simple test page...');
        win.loadURL('data:text/html,<h1>Electron Test</h1><p>If you see this, Electron is working!</p>');
    }

    win.webContents.openDevTools();
    
    win.on('closed', () => {
        console.log('Window closed');
    });
});

app.on('window-all-closed', () => {
    app.quit();
});

console.log('Starting minimal Electron test...');