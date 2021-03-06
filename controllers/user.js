﻿'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt =require('../services/jwt');

//metodo pruebas request y response
function pruebas(req,res){
	res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongol'
	});
}

function saveUser(req,res){
	var user = new User();

	var params = req.body;

	console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';
	user.lat = params.lat;
	user.lng = params.lng;


	if (params.password) {
		//Encriptar contraseña y guardar datos
		bcrypt.hash(params.password,null,null,function(err,hash){
			user.password = hash;
			if(user.name !=null && user.surname != null && user.email != null && params.lat==10){
				//guadar el usuario
				user.save((err,userStored) => {
					if(err){
						res.status(500).send({message:'Error al guardar el usuario'});
					}else{
						if(!userStored){
						res.status(404).send({message:'no se ha registrado el usuario'});
						}else{
							res.status(200).send({user:userStored});
						}
					}
				});
			}else{
				res.status(200).send({message:'Introduce todos los campos5'});
			}
		});
	}else {
		res.status(200).send({message:'Introduce la contraseña'});
	}

}

function getImageFile(req,res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	fs.exists(path_file,function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message:'no existe la imagen...'});
		}
	});
}

function loginUser(req,res){
	var params = req.body;
	var email =params.email;
	var password = params.password;

	User.findOne({email:email.toLowerCase()},(err,user)=>{
		if(err){
			res.status(500).send({mssage: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
			//Comprobar la contraseña
			bcrypt.compare(password,user.password,function(err,check){
				if(check){
					//devolver los datos el usuario logueado
					if(params.gethash){
						//devolver un token de jwt
						res.status(200).send({
							token: jwt.createToken(user)
						});
					}else{
						res.status(200).send({user});
					}
				}else{
					res.status(404).send({message: 'El usuario no hya podido loguearse'});
				}
			});


			}
		}

	})
}

function updateUser(req,res){
	 var userId = req.params.id;
	 var update = req.body;

	 if(userId != req.user.sub){
	 	return res.status(500).send({message: 'no tienes permiso para actualizar este usuario'});

	 }

	 User.findByIdAndUpdate(userId, update, (err,userUpdated) => {
	 	if(err){
	 		res.status(500).send({message: 'Error al actualizar el usuario'});
	 	}else{
	 		if(!userUpdated){
	 			res.status(404).send({message:' no se ha podido actualizar el usuario'});
	 		}else{
	 			res.status(200).send({user: userUpdated});
	 		}
	 	}
	 });
}

function uploadImage(req,res){
	var userId = req.params.id;
	var file_name = 'No Subido...';


	if(req.files){
		var file_path =req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[2];
		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png'||file_ext == 'jpg'||file_ext == 'gif'){

			User.findByIdAndUpdate(userId,{image:file_name},(err,userUpdated) =>{
		 		if(!userUpdated){
		 			res.status(404).send({message:' no se ha podido actualizar el usuario'});
		 		}else{
		 			res.status(200).send({image: file_name,user: userUpdated});
		 		}
			});

		}else{
			res.status(200).send({message: 'extensiopn del archivo no valida...'});
		}


	}else{
		res.status(200).send({message: 'no ha subido ninguna imagen'});
	}
}

function getUsers(req,res){
		//Sacar todos los songs de la bbdd
		var find = User.find({});


	find.populate({
		path: 'user'
	}).exec((err,users) =>{
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!users){
				res.status(404).send({message: 'No hay usuarios'});
			}else{
				res.status(200).send({users});
			}
		}
	});
}
//exportar modulo para poderlo usar.
module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile,
	getUsers
};
