'use strict'

//modulo mongoose para acceder a la base de datos
var mongoose = require('mongoose');

// permitirnos crear un objeto de tipo esquema, que posteriormente a nosotros guardar datos se van a guardar
//en una coleccion concreta y en un documento concreto dentro de esa colección
var Schema = mongoose.Schema;

//creando un schema para nuestro modelo Album
var AlbumSchema = Schema ({
	title: String,
	description: String,
	year: Number,
	image: String,
	//guardar un Id de otro objeto, "ref" entidad en la que esta guardado ese ID de objeto
	artist: {type: Schema.ObjectId, ref:'Artist'}
});

//exportar el fichero
module.exports = mongoose.model('Album',AlbumSchema);