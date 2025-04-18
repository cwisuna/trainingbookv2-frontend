import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { ipcMain, dialog, OpenDialogReturnValue } from 'electron';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../preload.js'),
      webSecurity: false,
    },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

ipcMain.handle('dialog:openFile', async () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  const filePaths = await dialog.showOpenDialog(focusedWindow!, {
    properties: ['openFile'],
  });

  if (!filePaths || filePaths.length === 0) {
    return null;
  }

  return filePaths[0];
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
