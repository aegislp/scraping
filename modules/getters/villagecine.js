const info= require('./info');
const utils = require('./utils');
const jsdom = require("jsdom");

const { village } = info 
const { JSDOM } = jsdom;
 

/* obtengo la info del html de la ficha tenica, es variable*/
function getMovieInfo(ficha_tecnica_dom){

	let tag;
	let value;
	let movie = {};

	for (i = 0; i < ficha_tecnica_dom.length; ++i) {

		tag = utils.clean_tag(ficha_tecnica_dom[i])
		value = ficha_tecnica_dom[i].nextSibling

		if( (typeof tag == "string" && tag != "undefined"  &&  tag != "calificacion"  &&  tag.indexOf("exception") === -1    )  && value){
			//	console.log(typeof tag,tag,value.nodeValue.replace("\n",""))
			movie[tag] = value.nodeValue.replace("\n","").replace(":","").trim();
		}else if(tag.indexOf("exception") !== -1 ){
			//ya marque como excepcion la clasificacion por un error que trae en el html	
			//	console.log("calificacion",value.nodeValue.replace("\n","").replace("\n",""))
			movie["clasificacion"] = value.nodeValue.replace("\n","").replace("\n","").trim();
		}

	} 

	return movie;
}

function getFunciones(board){

	//el primer hijo es el tipo de cine(2d,3d) y el segundo son los horarios
	//board> div > ul > li:nth-child(1) > span
	let funciones = [];	

	let tipo_dom    = board.children[0].children[0].children[0].children[0].textContent;
	let formato_dom = board.children[0].children[0].children[2].children[0].textContent;
	let idioma_dom  = board.children[0].children[0].children[4].children[0].textContent; 

	//itero para obtener los horarios
	let horarios = board.children[1].getElementsByTagName("a");
 
	for (var i = 0; i < horarios.length; i++) {
			 
		funciones.push({
			tipo: tipo_dom,
			formato: formato_dom,
			idioma: idioma_dom,
			horario: horarios[i].textContent

		})
	}
	
	return funciones;

}
/*
	Obtiene la info del board que son paneles de boostrap
*/
function getCatelera(panel){

	let lugar = panel.getElementsByClassName("panel-title")[0].children[0].textContent.trim()
	//puede tener vaios horarios y varias idiomas, cada uno es un board-item		
	var board = panel.getElementsByClassName("panel-body")[0].getElementsByClassName("board")[0].getElementsByClassName("board-item");

	let cartelera =  []

	for (var k = 0; k < board.length; k++) {
		
		let funciones = getFunciones(board[k]);

		let funcion = "";

		for(var index in funciones){
			funcion = funciones[index];
			funcion["lugar"] = lugar;
		    cartelera.push(funcion);
		}

		 
	}
	return cartelera;

}

/*
	obtiene el dato para un sola pelicula, pero itera por las distntas funciones
	de los dinstintos cines para obtener los horarios y los idomas

*/
function getSingleMovie(link,cbk){
 	var cartelera_movie = [];

	//obtengo el dato para una pelicula
	utils.get_html_data({url:village.url+link},(data)=>{
 
		let movie_and_board;

		let doc = new JSDOM(data);
		//console.log(doc.window.document.getElementById("ficha-tecnica").children[0].outerHtml)
		 
		//traigo la info de la ficha tecnica 
 
		var  titulo  = doc.window.document.getElementById("app").getElementsByClassName("title")[0].textContent
		EM.emit('log:msg','Obteneniendo '+titulo) 
		var ficha_tenica_dom = doc.window.document.getElementById("ficha-tecnica").children[0].children
	 	
	 	let movie = getMovieInfo(ficha_tenica_dom);
	 	movie["titulo"] = titulo.trim()
	 	movie["lote"] = "VILLAGECINES"
		 
		//tengo que iterar por las tabs
		 let lugares = doc.window.document.getElementById("accordion").children;

		//cada panel es un cine en un lugar distinto
	 

		for (var i = 0; i < lugares.length; i++) {

		 
			 getCatelera(lugares[i]).map((funcion)=>{

			 		cartelera_movie.push(utils.merge_json(funcion,movie))
			 		 
			 });

			 
			
		} 
	 		
	 	cbk(cartelera_movie)
	});	
 
}
 
function getMovies(cbk){
 	var movies = [];
 	EM.emit('log:msg','Obteneniendo peliculas VILLAGECINES') 
 	utils.get_html_data({url:info.village.url},(data)=>{
		 
		let doc = new JSDOM(data);
		
		let links_movies = doc.window.document.getElementsByClassName('movie-item');
 		
 		let links = []

 		for (i = 0; i < links_movies.length; ++i) {
		 	links.push(links_movies[i].getAttribute('href'))	
  		} 

  		var promises = links.map(function(link) {

		  return new Promise(function(resolve, reject) {
		  	EM.emit('log:msg','URL: '+link) 
		  	getSingleMovie(link,(catelera)=>{

				catelera.map((funcion)=>{ movies.push(funcion) });
				resolve();
			})		
		    
		  });
		
		});

		Promise.all(promises).then(function() { 
			EM.emit('log:msg','VILLAGECINES scrapineado') 
			EM.emit('finish:village')  
			cbk(movies)	
		})
		.catch(console.error);	
 

		 

	});

}



module.exports = {
	getMovies: getMovies
}

	
