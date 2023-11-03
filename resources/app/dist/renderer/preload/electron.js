const { ipcRenderer } = require('electron')

function sendSync(channel, ...args) {
    return ipcRenderer.sendSync(channel, ...args);
}
  
window.electronMTop = {sendSync}