module.exports = {
	
	village: {
	  url: 'https://service.prerender.io/https://www.villagecines.com/',
	  url_raw: 'https://www.villagecines.com/',
	  path_raw:'./data/rawvillage.txt' 
	},
	cinemalp : {
		url: 'http://www.cinemalaplata.com.ar',
	  	pttr:/Seccion=&amp;IdTitulo=[0-9]{1,4}/g,
	  	url_movie: 'http://www.cinemalaplata.com.ar/sinopsis.aspx?',
	  	querys:{
	  		titulo: 'ctl00_pnTitu',
	  		genero: 'ctl00_cph_lblGenero',
	  		idioma: 'ctl00_cph_lblIdioma',
	  		origen: 'ctl00_cph_lblPaisOrigen',
	  		duracion:'ctl00_cph_lblDuracion',
	  		director:'ctl00_cph_lblDirector',
	  		actores:'ctl00_cph_lblActores',
	  		clasificacion:'ctl00_cph_lblCalificacion' 
	  	},
	  	queryFunciones:'ctl00_cph_pnFunciones'
	}, 

}
 