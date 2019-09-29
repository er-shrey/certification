var express = require('express');
var router = express.Router();
const request = require('request');
var jsonfile = require('jsonfile')
var atob = require('atob');
var session = require('express-session');
var configApi=require('../config/config');
var fs=require('fs');

var landingPageUrl = "/certification/";
var loginPageUrl = "production/authentication/index";

function b64DecodeUnicode(str){
	return decodeURIComponent(atob(str).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

router.get('/', function(req, res, next){
	res.render(loginPageUrl);
});

router.post('/loginValidate', function(req, res, next) {
	request({
		url: configApi.baseHeader+"skillcall/login",
		form:{
			username:	req.body["username"],
			password:	b64DecodeUnicode(req.body["password"])
		},
		method: 'POST',
		headers:{
			'User-Agent'  :     'Super Agent/0.0.1',
			'Content-Type':     'application/x-www-form-urlencoded'
		}
    },function(error, response, body){
		if(error){
			res.json({
				status  : "ERROR",
				error	:  error
			});
		}else{
			var jsonResponse = JSON.parse(body);
			var token = jsonResponse['token'];
			if(token){		
				req.session['loginStatus'] = true;
				req.session['token'] = token;			
				res.json({   
					status    : "SUCCESS",
					pageUrl	  :  landingPageUrl,              //*** Application OR Config
					token	  :  token
				});
			}else if(jsonResponse["non_field_errors"]){
				res.json({
					status  : "FAILED",
					message : jsonResponse["non_field_errors"]
				});
			}else{
				res.json({
					status    : "ERROR",
					message   : "Something went wrong! Please try again later."
				});
			}				
		}
	});
});

router.post('/forgotPassword', function(req, res, next) {
	request({
		url	:	configApi.baseHeader+"skillcall/forgotPassword",
		qs	:	req.body,
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

router.post('/resetPassword', function(req, res, next) {
	var params = {
		"password": b64DecodeUnicode(req.body.password),
		"token": req.body.token,
		"username": req.body.username,
	};
	request({
		url	:	configApi.baseHeader+"skillcall/changePassword",
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

router.get('/logout', function(req, res, next) {
	var token=req.session.token;
	var params = {};
	request({
		url	:	configApi.baseHeader+configApi.apiUrls.userlogout,
		qs	:	params,
		method:	'GET',
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
			req.session.destroy();
			res.send('');
		}
	});
});

module.exports = router;