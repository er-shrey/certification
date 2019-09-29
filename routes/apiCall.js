var express = require('express');
var router = express.Router();
var request = require('request');
var session = require('express-session');
var configApi=require('../config/config.json');
var multer  = require('multer');
var fs  = require('fs');
var path = require('path');

router.post('/getData', function(req, res, next) {
	var token=req.session.token;
	var params = {};
	if(req.body.data){
		var params = req.body.data;
	}
	request({
		url	:	configApi.baseHeader+req.body.url,
		qs	:	params,
		method:	'POST',
		json:	true, 
		headers:{
			'User-Agent':       'Super Agent/0.0.1',
			'Content-Type':     'application/x-www-form-urlencoded',
			'Authorization':	"JWT "+token,
		}
	},function(error, response, body){
		if(error){
			console.log(error);
		}else{
			var statusCode = response.statusCode;
			if(statusCode !== 200){
				res.status(statusCode).json(body);
			}else{
				res.json(body);
			}
		}
	});
});

router.post('/getAllData', function(req, res, next) {
	var params = {};
	if(req.body.data){
		var params = req.body.data;
	}
	request({
		url	:	configApi.baseHeader+req.body.url,
		qs	:	params,
		method:	'POST',
		json:	true, 
		headers:{
			'User-Agent':       'Super Agent/0.0.1',
			'Content-Type':     'application/x-www-form-urlencoded',
		}
	},function(error, response, body){
		if(error){
			console.log(error);
		}else{
			var statusCode = response.statusCode;
			if(statusCode !== 200){
				res.status(statusCode).json(body);
			}else{
				res.json(body);
			}
		}
	});
});

var storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public")
    },
    filename: function (req, file, cb) {
     scoreCardFileName = Date.now() + '-' +file.originalname
        cb(null, scoreCardFileName)
  }
});

var uploadFile = multer({ storage: storageFile })

router.post('/fileUpload', uploadFile.single('file'), function (req, res) {
	if(req.session.loginStatus){
		var token=req.session.token;
		var data = req.body;
		data.file = "files/" + scoreCardFileName;
		const formData =  { 
			year:data.year,
			month:data.month,
			fileTypeId:data.fileTypeId,
			userName:data.userName,
			file: fs.createReadStream(__dirname+"/../public/" + data.file)
		}
		request({
			url: configApi.backendApiBase+"url",
			formData: formData,
			method: 'POST',
			json:true,
			headers:{
				'User-Agent':       'Super Agent/0.0.1',
				'Content-Type':     'application/x-www-form-urlencoded',
				'http_authorization':	token
			},
			encoding: null
		}, function(error, response, body){
			if(response){
				var statusCode = response.statusCode;
				if(statusCode !== 200){
					res.status(statusCode).json(body);
				} else {
					res.send({'data':body});
					fs.unlink(path.join(__dirname+"/../public/" + data.file), (err) => {
						//file Deteled
					});
				}
			}else{
				if(error) {
					console.log(error);
				}
				res.json('');
			}
			if(error) {
				console.log(error);
			}
		});
	}
	else{
		res.json('');
	}
});
module.exports = router;