'use strict'

//modulo mongoose para acceder a la base de datos
var mongoose = require('mongoose');

// permitirnos crear un objeto de tipo esquema, que posteriormente a nosotros guardar datos se van a guardar
//en una coleccion concreta y en un documento concreto dentro de esa colección
var Schema = mongoose.Schema;

//creando un schema para nuestro modelo User
var TrackerSchema = Schema ({
	key: String,
	lat: Number,
	lng: Number,
	nombre: String
});

//exportar el fichero
module.exports = mongoose.model('Tracker',TrackerSchema);
