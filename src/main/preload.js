const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dbAPI", {
  getAllData: (modelName) => ipcRenderer.invoke("get:all", modelName),
  createDoc: ({ modelName, data }) =>
    ipcRenderer.invoke("create:doc", { modelName, data }),
  getDocById: (modelName, id) =>
    ipcRenderer.invoke("get:byId", { modelName, id }),
  getDocBySearch: (modelName, filterOptions) =>
    ipcRenderer.invoke("get:byFilter", { modelName, filterOptions }),
});
