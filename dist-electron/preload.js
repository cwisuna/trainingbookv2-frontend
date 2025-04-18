"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => electron_1.ipcRenderer.invoke('dialog:openFile'),
    openFile: (filePath) => electron_1.shell.openPath(filePath),
});
