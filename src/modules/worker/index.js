const getters = require('../getters')

module.exports = {

	/* Traigo todo le html */
	fetchData(){

		getters.fetchMovieData()
	},
	filterData(){
		console.log("filter")
	} 
}