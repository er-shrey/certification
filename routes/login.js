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
		method: 'POST',
		url: configApi.baseHeader+configApi.apiUrls.forgotPassword,
		form:{	
			username   :	req.body.param["username"],
			baseHeader :	configApi.emailHeader
		}
	}, function(error, response, body){
		var data = JSON.parse(body);
		if(error){			
			res.json({
				status  : "ERROR",
				error	:  error
			});
		}else if(data.status=="Success" || data.message=="success"){
			res.json({
				status :	'SUCCESS',
				message:	data
			});
		}else if(data.status=="Error" || data.message=="Does not seem to recognize the user.  Please check the email provided, or if the problem persists, contact your administrator"){
			res.json({
				status :	'FAILED',
				message:	data
			});
		}else{
			res.json({
					status    : "ERROR",
					message   : "Something went wrong! Please try again later."
			});
		}
	}); 
});

router.post('/resetPassword', function(req, res, next) {
	var password= req.body["password"]; 
	var token = req.body["token"];
	request({
		method: 'POST',
		url: configApi.baseHeader+configApi.apiUrls.resetPassword,
		form:{
			token	:	req.body["token"],
			newpass :	b64DecodeUnicode(req.body["password"])
		}
	},function(error, response, body){
		var data = JSON.parse(body);
		if(error){			
			res.json({
				status  : "ERROR",
				error	:  error
			});
		}else if(data.status=="Success" || data.message=="success"){
			res.json({
				status :	'SUCCESS',
				message:	data
			});
		}else if(data.status=="fail" || data.message=="fail"){
			res.json({
					status    : "ERROR",
					message   : "Something went wrong! Please try again later."
			});
		}else{
			res.json({
					status    : "ERROR",
					message   : "Something went wrong! Please try again later."
			});
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