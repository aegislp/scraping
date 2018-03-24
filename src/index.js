const electron = require("electron")

const fs = require("fs")
 
const worker = require('./modules/worker')

const { app, BrowserWindow, ipcMain, Menu, dialog } =  electron

const Json2csvParser = require('json2csv').Parser;

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

global.EM  = new MyEmitter();

var fullData = [] 

let mainWindow;

app.on('ready',()=>{

	mainWindow = new BrowserWindow({ frame: false})
	mainWindow.loadURL(`file://${__dirname}/index.html`)
 
	//Menu.setApplicationMenu(null)
	 
})

process.on('uncaughtException', function (error) {
    mainWindow.webContents.send('error:msg', error);

   
    console.log(error)
}) 


/*  Comunicacion intener y externa  */
ipcMain.on('info:fetch',()=>{
	
	worker.fetchData()
	 
})

ipcMain.on('app:close',()=>{
	app.quit()
})
 
ipcMain.on('app:save',()=>{
 dialog.showSaveDialog({ filters: [

	     { name: 'data', extensions: ['csv'] }

	    ]}, function (fileName) {

	    if (fileName === undefined) return;


	    var fields = ['titulo', 'lugar', 'horario','idioma','formato','duracion','clasificacion','origen','genero','distribuidora'];
		const opts = { fields };
		 
 		var parser = new Json2csvParser(opts);
	  	var csv = parser.parse(fullData);
		 
	    fs.writeFile(fileName, csv, 'utf8', function (err) {
			
			if (err) { return console.log(err);}
			
		    mainWindow.webContents.send('save:done',fileName);
		    	 
		}); 
	    

	  });  
})

 
EM.on('log:msg', (msg) => {
    mainWindow.webContents.send('log:msg', msg);

});

EM.on('finish:cinemalp', () => {
    mainWindow.webContents.send('finish:cinemalp');
    console.log("TERMINO CINEMALAPLATA")	
});

EM.on('finish:village', () => {
    mainWindow.webContents.send('finish:village');

});

EM.on('finish:all', (data) => {
    mainWindow.webContents.send('finish:all',data);
    fullData = data;

});

 
