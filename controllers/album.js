'use strict'

var path = require('path');
var fs = require ('fs');
var mongoosePaginate = require('mongoose-pagination');

/*Modelos*/
var Artist = require ('../models/artist');
var Album = require ('../models/album');
var Song = require('../models/song');

/*obtener Album por ID*/
function getAlbum(req,res){
	//variable para obtener el ID DEL ALBUM
	var albumId = req.params.id;
	//findById = Obtener el Objeto Album
	Album.findById(albumId).populate({path: 'artist'}).exec((err,album)=>{
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!album){
				res.status(404).send({message:'El album no existe'});
			}else{
				res.status(200).send({album});
			}
		}
	});

}

//function getAlbums(req,res){
//	var artistId = req.params.artist;
//	if(!artistId){
//		//Sacar todos los albums de la bbdd
//		var find = Album.find({}).sort('title');
//	}else {
//		//Sacar los albums de un artista concreto de la bbdd
//		var find = Album.find({artist:artistId}).sort('year');
//	}
//	
//	find.populate({path: 'artist'}).exec((err,albums) =>{
//		if(err){
//			res.status(500).send({message: 'Error en la petición'});
//		}else{
//			if(!albums){
//				res.status(404).send({message: 'No hay albums'});
//			}else{
//				res.status(200).send({albums});
//			}
//		}
//	});
//}
	

function getAlbums(req,res){
	if(req.params.page){
		var page = req.params.page;
	}else {
		var page = 1;
	}
	
	var itemsPerPage = 4;

	Album.find().sort('name').paginate(page,itemsPerPage, function(err,albums,total){
		if(err){
			res.status(500).send({message:'Error en la petición'});
		}else{
			if(!albums){
				res.status(404).send({message:'no hay artistas'});
			}else{
				return res.status(200).send({
					total_items:total,
					albums: albums
				});
			}

		}
	});
}	
	


function saveAlbum(req,res){
	var album = new Album();

	var params = req.body;

	

	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;



			if(album.title !=null && album.description != null){
				//guadar el usuario
				album.save((err,albumStored) => {
					if(err){
						res.status(500).send({message:'Error al guardar el album'});		
					}else{
						if(!albumStored){
						res.status(404).send({message:'no se ha registrado el album'});			
						}else{
							res.status(200).send({album:albumStored});		
						}
					}
				});
			}else{
				res.status(200).send({message:'Introduce todos los campos'});		
			}
	

}

function updateAlbum(req,res){
	 var albumId = req.params.id;
	 var update = req.body;

	 Album.findByIdAndUpdate(albumId, update, (err,albumUpdated) => {
	 	if(err){
	 		res.status(500).send({message: 'Error al actualizar el album'});
	 	}else{
	 		if(!albumUpdated){
	 			res.status(404).send({message:' no se ha podido actualizar el album'});
	 		}else{
	 			res.status(200).send({album: albumUpdated});
	 		}
	 	}
	 });
}

function deleteAlbum(req,res){
	var albumId = req.params.id;
	var fileAlbum = './uploads/albums/'; 
	var fileSong = './uploads/songs/';



	Album.findByIdAndRemove(albumId,(err,albumRemoved)=>{
	 	if(err){
	 		res.status(500).send({message: 'Error al borrar el albuma'});
	 	}else{
	 		if(!albumRemoved){
	 			res.status(404).send({message:' no se ha podido borrar el albuma'});
	 		}else{
	 			
	 			Song.find({album:albumRemoved._id}).remove((err,songRemoved)=>{
	 				if(err){
	 					res.status(500).send({message: 'Error al eliminar la canción'});
	 				}else{
	 					if(!songRemoved){
	 						res.status(404).send({message: 'El canción no ha sido eliminado'});
	 					}else{
							fs.exists(fileAlbum+albumRemoved.image,function(exists){
								if(exists){
									fs.unlinkSync(fileAlbum+albumRemoved.image);
								}	 						
							});

							fs.exists(fileSong+songRemoved.file,function(exists){
								if(exists){
									fs.unlinkSync(fileSong+songRemoved.file);
								}	 						
							});							
							
	 						res.status(200).send({album: albumRemoved});


	 					}
	 				}
	 			});
	 		}
	 	}		
	});
}



function uploadImage(req,res){
	var albumId = req.params.id;
	var file_name = 'no subido ...';

	if(req.files){
		var file_path =req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){

			Album.findByIdAndUpdate(albumId,{image:file_name},(err,albumUpdated) =>{
		 		if(!albumUpdated){
		 			res.status(404).send({message:' no se ha podido actualizar el album'});
		 		}else{
		 			res.status(200).send({album: albumUpdated});
		 		}
			});

		}else{
			res.status(200).send({message: 'extensiopn del archivo no valida...'});
		}

		
	}else{
		res.status(200).send({message: 'no ha subido ninguna imagen'});
	}
}

function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/albums/'+imageFile;
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:'no existe la imagen...'});
		}
	});
}





module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums,
	updateAlbum,
	deleteAlbum,
	uploadImage,
	getImageFile
};