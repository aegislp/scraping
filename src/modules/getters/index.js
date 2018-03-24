const getter_village = require('./villagecine') 
const getter_cinemalp = require('./cinemalaplata') 
const utils = require('./utils')
const stringSimilarity = require('string-similarity');

var info = {
	peliculas: [],
	peliculas_dis: [],
	cines: [],
	distribuidoras:[],
	generos:[],
	idiomas:[],
	d_peliculas: []
}

function get_distribuidora(movie,movies_dis){

 
	//recorrro el arra y segun el nivel de concidencia coloco esa distribuidora
	var distribuidora = "NA";

	for (var mov  in  movies_dis ) {
		var dis = movies_dis[mov]
		let sim = stringSimilarity.compareTwoStrings(movie.titulo,mov);
		console.log("DIS",movie.titulo,dis,sim)
		if(movie.lote == "CINEMALAPLATA" && sim > 0.4){

			console.log("RECO",movie.titulo,dis,sim)
			distribuidora =  dis
		} 
		
	}
	 
	return distribuidora;

	 


}
/*

*/
function homologarDatos(movies){
 
 	var dis_peliculas = [];
	for (var i = 0 ; i < movies.length; i++) {
		
		let mov = movies[i];

		info.peliculas[utils.clean_string(mov.titulo)] = mov.titulo

		if(mov.lote == "VILLAGECINES"){
			info.peliculas_dis[utils.clean_string(mov.titulo)] = mov.distribuidora
		}
		
		info.cines[utils.clean_string(mov.lugar)] = mov.lugar
		info.distribuidoras[utils.clean_string(mov.distribuidora)] = mov.distribuidora
		info.generos[utils.clean_string(mov.genero)] = mov.genero
		info.idiomas[utils.clean_string(mov.idioma)] = mov.idioma

		if(!info.d_peliculas[utils.clean_string(mov.distribuidora)]){
			info.d_peliculas[utils.clean_string(mov.distribuidora)] = []
		}
		info.d_peliculas[utils.clean_string(mov.distribuidora)].push( mov.titulo)
	}


	for (var i = 0 ; i < movies.length; i++) {
		let mov = movies[i];

		 
		if(mov.lote == "CINEMALAPLATA"){

			//console.log("SD",mov.titulo,get_distribuidora(mov,info.peliculas_dis))
			movies[i].distribuidora =  get_distribuidora(mov,info.peliculas_dis)
		}
	}

	return movies

}
module.exports = {
	


	fetchMovieData(cbk){

		var data = []

		var getters = [getter_village,getter_cinemalp];
	 
		var promises = getters.map(function(getter) {

		  return new Promise(function(resolve, reject) {

		  	getter.getMovies((cartelera)=>{
		  		data = data.concat(cartelera)
			 


				resolve();
			})		
		    
		  });
		
		});

		Promise.all(promises).then(function() { 

			console.log("termino todo")
			
			EM.emit('finish:all',homologarDatos(data)) 
			 
		})
		.catch(console.error);


		 

	}



}

	

	