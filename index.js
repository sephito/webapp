'use strict'

//librerias importar
var mongoose = require('mongoose');
var app = require ('./app');

//variable
var port = process.env.PORT || 3977;

//Para eliminar el aviso de mongoose que devuelve por la consola donde hemos lanzado el npm start
mongoose.Promise = global.Promise;

//conector localhost, port y database + función callback
mongoose.connect('mongodb://localhost:27017/curso_mean', (err,res) => {
	if(err){
		throw err;
	}else {
		console.log("La base de datos está corriendo correctamente...");
		app.listen(port,function(){
			console.log("Servidor del api rest de musica escuchando en https://localhost:"+port);
		});
	}
});
