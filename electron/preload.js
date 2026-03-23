const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // File operations
    importCSVFile: () => ipcRenderer.invoke('import-csv-file'),
    exportDataFile: (data, fileName) => ipcRenderer.invoke('export-data-file', data, fileName),
    createBackup: (data) => ipcRenderer.invoke('create-backup', data),
    
    // Notifications
    showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
    
    // Menu actions
    onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
    removeMenuActionListener: () => ipcRenderer.removeAllListeners('menu-action'),
    
    // Platform info
    platform: process.platform
});

// Desktop-specific enhancements
window.addEventListener('DOMContentLoaded', () => {
    // Add desktop class to body for desktop-specific styling
    document.body.classList.add('electron-app');
    
    // Enhance existing functionality with desktop features
    enhanceWithDesktopFeatures();
});

function enhanceWithDesktopFeatures() {
    // Wait for app to be fully loaded before setting up menu listeners
    const setupMenuListeners = () => {
        if (window.electronAPI) {
            window.electronAPI.onMenuAction((event, action) => {
                console.log('Desktop menu action triggered:', action);
                switch (action) {
                    case 'import-csv':
                        handleDesktopImport();
                        break;
                    case 'export-data':
                        handleDesktopExport();
                        break;
                    case 'create-backup':
                        handleDesktopBackup();
                        break;
                    case 'export-charts':
                        handleDesktopChartExport();
                        break;
                    default:
                        console.log('Unknown menu action:', action);
                }
            });
            console.log('Desktop menu listeners set up successfully');
        }
    };

    // Set up listeners immediately and also when app is ready
    setupMenuListeners();
    
    // Also try after a delay to ensure all components are loaded
    setTimeout(setupMenuListeners, 2000);
    
    // Add visual indicator that desktop features are available
    setTimeout(() => {
        if (document.body) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
                position: fixed; 
                bottom: 10px; 
                right: 10px; 
                background: #28a745; 
                color: white; 
                padding: 5px 10px; 
                border-radius: 5px; 
                font-size: 12px; 
                z-index: 1000;
                opacity: 0.8;
            `;
            indicator.textContent = '🖥️ Desktop Mode';
            document.body.appendChild(indicator);
            
            // Remove after 3 seconds
            setTimeout(() => indicator.remove(), 3000);
        }
    }, 1000);
}

async function handleDesktopImport() {
    try {
        const result = await window.electronAPI.importCSVFile();
        if (result.success) {
            // Create a file input event simulation
            const fileName = result.fileName;
            const content = result.content;
            
            // Check if we have the dataManager available
            if (window.dataManager && window.dataManager.csvHandler) {
                // Create a file-like object
                const file = new File([content], fileName, { type: 'text/csv' });
                const event = { target: { files: [file] } };
                
                // Trigger the existing import functionality
                await window.dataManager.csvHandler.handleFileImport(event);
                
                window.electronAPI.showNotification(
                    'Import Successful', 
                    `Successfully imported ${fileName}`
                );
            } else {
                // Fallback - navigate to data manager if not available
                if (window.router) {
                    window.router.navigate('data-manager');
                    setTimeout(() => {
                        alert(`Please use the Import section to process the file: ${fileName}\n\nFile content has been prepared for import.`);
                    }, 500);
                }
            }
        }
    } catch (error) {
        console.error('Desktop import failed:', error);
        alert('Import failed: ' + error.message);
    }
}

async function handleDesktopExport() {
    try {
        // Check if dataManager is available with export functionality
        if (window.dataManager && window.dataManager.exportAllData) {
            // Use the existing export functionality
            await window.dataManager.exportAllData();
            
            window.electronAPI.showNotification(
                'Export Initiated', 
                'Export process started - files will be downloaded automatically'
            );
        } else if (window.db) {
            // Fallback - manual export
            const cycles = await window.db.getAll('cycles');
            const cages = await window.db.getAll('cages');
            const productionLogs = await window.db.getAll('productionLogs');
            const feedLogs = await window.db.getAll('feedLogs');
            const sales = await window.db.getAll('sales') || [];
            const expenses = await window.db.getAll('expenses') || [];
            const vaccinations = await window.db.getAll('vaccinations') || [];

            const exportData = {
                cycles,
                cages,
                productionLogs,
                feedLogs,
                sales,
                expenses,
                vaccinations,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const data = JSON.stringify(exportData, null, 2);
            const fileName = `poultry-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
            
            const result = await window.electronAPI.exportDataFile(data, fileName);
            if (result.success) {
                window.electronAPI.showNotification(
                    'Export Successful', 
                    `Complete data backup saved to ${result.filePath}`
                );
            }
        } else {
            // Navigate to data manager page
            if (window.router) {
                window.router.navigate('data-manager');
                window.electronAPI.showNotification(
                    'Export Data', 
                    'Navigate to the Data Manager page to export your data'
                );
            }
        }
    } catch (error) {
        console.error('Desktop export failed:', error);
        alert('Export failed: ' + error.message);
    }
}

async function handleDesktopBackup() {
    try {
        if (window.db) {
            const cycles = await window.db.getAll('cycles');
            const cages = await window.db.getAll('cages');
            const productionLogs = await window.db.getAll('productionLogs');
            const feedLogs = await window.db.getAll('feedLogs');
            const sales = await window.db.getAll('sales') || [];
            const expenses = await window.db.getAll('expenses') || [];
            const vaccinations = await window.db.getAll('vaccinations') || [];

            const backupData = {
                cycles,
                cages,
                productionLogs,
                feedLogs,
                sales,
                expenses,
                vaccinations,
                backupDate: new Date().toISOString(),
                version: '1.0',
                type: 'desktop_backup',
                totalRecords: {
                    cycles: cycles.length,
                    cages: cages.length,
                    productionLogs: productionLogs.length,
                    feedLogs: feedLogs.length,
                    sales: sales.length,
                    expenses: expenses.length,
                    vaccinations: vaccinations.length
                }
            };

            const data = JSON.stringify(backupData, null, 2);
            
            const result = await window.electronAPI.createBackup(data);
            if (result.success) {
                const totalRecords = Object.values(backupData.totalRecords).reduce((a, b) => a + b, 0);
                window.electronAPI.showNotification(
                    'Backup Created Successfully', 
                    `${totalRecords} records backed up to ${result.filePath.split('\\').pop()}`
                );
            }
        } else {
            alert('Database not available. Please wait for the app to fully load and try again.');
        }
    } catch (error) {
        console.error('Desktop backup failed:', error);
        alert('Backup failed: ' + error.message);
    }
}

async function handleDesktopChartExport() {
    // This would capture charts and export as PDF
    console.log('Chart export requested - this could be enhanced to generate PDF reports');
}