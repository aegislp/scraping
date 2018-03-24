const request = require('request');
const fs = require('fs');
var mergeJSON = require("merge-json") ;

function removeRepited(a){
	uniqueArray = a.filter(function(item, pos) {
    	return a.indexOf(item) == pos;
	})

	return uniqueArray;
}
function cleanTag(tag){

	return getCleanedString(tag.outerHTML.toLowerCase().replace("<strong>","").replace("</strong>","").replace(" ","_").replace("<br>").
		replace('<span_class="label  label-danger" style="margin-right: 5px;">',"Exception").replace("</span>","").
		replace('<span_class="label  label-info" style="margin-right: 5px;">',"Exception").replace("</span>",""). 
		replace('<span_class="label  label-warning" style="margin-right: 5px;">',"Exception").replace("</span>","") )
} 
	
function getCleanedString(cadena){
   // Definimos los caracteres que queremos eliminar
   var specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

   // Los eliminamos todos
   for (var i = 0; i < specialChars.length; i++) {
       cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
   }   

   // Lo queremos devolver limpio en minusculas
   cadena = cadena.toLowerCase();

   // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
   cadena = cadena.replace(/ /g,"_");

   // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
   cadena = cadena.replace(/á/gi,"a");
   cadena = cadena.replace(/é/gi,"e");
   cadena = cadena.replace(/í/gi,"i");
   cadena = cadena.replace(/ó/gi,"o");
   cadena = cadena.replace(/ú/gi,"u");
   cadena = cadena.replace(/ñ/gi,"n");
   return cadena;
}

/* realiza un peticion html generica */
function getHtmlData(options,cbk){

 
 	request(options, function (error, response, body) {
 	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  cbk(body); // Print the HTML for the Google homepage.
	});

}


function storeJson(path,data){
	fs.open(path, 'a', (err, fd) => {
	  if (err) throw err;
	  fs.appendFile(fd, data, 'utf8', (err) => {
	    fs.close(fd, (err) => {
	      if (err) throw err;
	    });
	    if (err) throw err;
	  });
	});
}


function logFile(data){
	fs.open('./data/log.txt', 'w', (err, fd) => {
	  if (err) throw err;
	  fs.appendFile(fd, data, 'utf8', (err) => {
	    fs.close(fd, (err) => {
	      if (err) throw err;
	    });
	    if (err) throw err;
	  });
	});
}

function merge_json(json1,json2){
	return  mergeJSON.merge(json1, json2);
}

function createCSV(data,cbk){

	 

}
module.exports = {
	remove_repited: removeRepited,
	clean_tag: cleanTag,
	clean_string: getCleanedString,
	get_html_data: getHtmlData,
	log_file: logFile,
	merge_json: merge_json,
	store_json : storeJson,
	create_csv: createCSV
}