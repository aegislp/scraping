
const request = require('request');
const info = require('./info');
const utils = require('./utils');
const jsdom = require("jsdom");
 

const { cinemalp } = info 
const { JSDOM } = jsdom;

/*

	las funciones estan aparte de la ficha tecnica	

*/
function getFunciones(dom_document,movie){
 	
 	EM.emit('log:msg','funciones para:'+movie.titulo)  
 	var divs = dom_document.getElementById( cinemalp.queryFunciones).getElementsByTagName('div')
 	 
	var  funciones = []	
 
	 for (i = 0; i < divs.length; ++i) {
		console.log("div",i,divs[i]);debugger;
		let cine = divs[i].querySelector('h5 > span > a').textContent
		let formato = divs[i].querySelector('h5 > span > a').nextSibling.nodeValue.replace("-","")
		let aux = divs[i].querySelector('p > span').textContent 
		let idioma = aux.split(":")[0]	
		let horas = aux.replace(idioma+":","").split("-")
 
		for (var k = 0; k < horas.length; k++) {
			funciones.push( {lugar: 'La Plata - '+cine , 'formato': formato, 'idioma':idioma, 'horario' : horas[k] });
		}
	} 
	 
 	
	return funciones;

}

/* Obteniene el dato para una sola pelicula */
function getCinemaSingleMovie(link,cbk){

	
	EM.emit('log:msg','url:'+link) 

	var catelera_pelicula; 
	//obtengo el dato para una pelicula
	utils.get_html_data({url:link,encoding:'latin1'},(data)=>{

		//por cada query ontengo el dato
		utils.log_file(data)
		var doc = new JSDOM(data);

		var movie = {};
		//en cinema la plata puedo obtener todo por id del dom
	 
		for(var attributename in cinemalp.querys){
			var id =  cinemalp.querys[attributename];
			 
		    movie[attributename] =  doc.window.document.getElementById(id).textContent.trim()
		}
		movie["distribuidora"]= "NA";
		movie["lote"]= "CINEMALAPLATA";
	 	 
		catelera_pelicula = getFunciones(doc.window.document,movie).map((funcion)=>{
				return utils.merge_json(movie,funcion)		
		})	
		
		cbk(catelera_pelicula) 	 

	}); 
}
 
function getMovies(cbk){

	var movies = [];
	EM.emit('log:msg','Obteneniendo peliculas CINEMALPLATA') 
	utils.get_html_data({url:cinemalp.url,encoding:'latin1'},(data)=>{

		//parseo el dom para obtener los links de las peliculas, es mas facil hacerlo por patrones regulares
		//sobre el texto

	  	let links = utils.remove_repited(data.match(cinemalp.pttr));

	  	links = links.map((link)=>{
	  		return link.replace("&amp;","&")
	  	})
//	   	console.log(data.match(cinemalp.pttr))
	   	let promises = links.map((link)=>{

			return new Promise((resolve, reject)=> {

				//obtenego la cartelera para la peli	
				getCinemaSingleMovie(cinemalp.url_movie+link, (catelera)=>{
					catelera.map((funcion)=>{ movies.push(funcion) });
					resolve();	
					 
				})
  
			});

	   	})	
 
		Promise.all(promises)
			.then(function() { 
					cbk(movies); 
					EM.emit('log:msg','  CINEMALAPLATA scrapineado') 
					EM.emit('finish:cinemalp');  
					console.log("TERMINO CINEMALAPLATA 2")
			 })
			.catch(console.error);
 
	}); 
	 

}

module.exports = {

	getMovies: getMovies,


}