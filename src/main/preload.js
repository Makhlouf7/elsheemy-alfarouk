const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dbAPI", {
  getAllData: (modelName) => ipcRenderer.invoke("get:all", modelName),
  createDoc: ({ modelName, data }) =>
    ipcRenderer.invoke("create:doc", { modelName, data }),
  updateDoc: ({ modelName, id, data }) =>
    ipcRenderer.invoke("update:doc", { modelName, id, data }),
  getDocById: ({ modelName, id }) =>
    ipcRenderer.invoke("get:byId", { modelName, id }),
  deleteDocById: ({ modelName, id }) =>
    ipcRenderer.invoke("delete:byId", { modelName, id }),
  getDocBySearch: ({ modelName, filterOptions }) =>
    ipcRenderer.invoke("get:byFilter", { modelName, filterOptions }),
  upsertAttendance: (data) => ipcRenderer.invoke("upsert:attendance", data),
  // Statistics Functions
  generalStatistics: (options = {}) =>
    ipcRenderer.invoke("stats:all", { date: options.date }),
});
