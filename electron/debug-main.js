const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Simple debug version of the main process
class PoultryAppDebug {
    constructor() {
        this.mainWindow = null;
    }

    async initialize() {
        console.log('DEBUG: Initializing Poultry App...');
        
        app.whenReady().then(() => {
            console.log('DEBUG: Electron app ready, creating main window...');
            this.createMainWindow();
        }).catch(error => {
            console.error('DEBUG: Error in app.whenReady:', error);
        });
        
        app.on('window-all-closed', () => {
            console.log('DEBUG: All windows closed');
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });
        
        app.on('activate', () => {
            console.log('DEBUG: App activated');
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createMainWindow();
            }
        });
    }

    createMainWindow() {
        console.log('DEBUG: Creating main window...');
        
        // Create the browser window with more debugging
        this.mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: false,
                webSecurity: false // Disable for debugging
            },
            show: true // Show immediately for debugging
        });

        // Load the HTML file directly
        const htmlPath = path.join(__dirname, '..', 'index.html');
        console.log('DEBUG: HTML path:', htmlPath);
        console.log('DEBUG: File exists:', fs.existsSync(htmlPath));
        
        // Load file with better error handling
        this.mainWindow.loadFile(htmlPath).then(() => {
            console.log('DEBUG: File loaded successfully');
        }).catch(error => {
            console.error('DEBUG: Failed to load file:', error);
        });

        // Open DevTools for debugging
        this.mainWindow.webContents.openDevTools();

        // Add more debugging events
        this.mainWindow.webContents.on('did-finish-load', () => {
            console.log('DEBUG: Page finished loading');
        });

        this.mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            console.error('DEBUG: Page failed to load:', errorCode, errorDescription);
        });

        this.mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
            console.log('DEBUG: Console message:', message);
        });

        this.mainWindow.on('closed', () => {
            console.log('DEBUG: Window closed');
            this.mainWindow = null;
        });
    }
}

// Error handling
process.on('uncaughtException', (error) => {
    console.error('DEBUG: Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('DEBUG: Unhandled Rejection:', reason);
});

console.log('DEBUG: Starting debug version...');
const app_instance = new PoultryAppDebug();
app_instance.initialize().catch(error => {
    console.error('DEBUG: Failed to initialize:', error);
});