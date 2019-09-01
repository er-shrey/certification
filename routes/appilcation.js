var express = require('express');
var router = express.Router();
const request = require('request');
var configApi=require('../config/config.json');

/*
	......... Redirect to CEREBRA APP ..........
*/
var landingPageUrl = "production/certification/index";

router.get('/', function(req, res, next) {
	if(req.session && req.session.loginStatus){
		res.render(landingPageUrl, { sessionToken:req.session.token});			
	}else{
		res.redirect('/');
	}
});

router.get('/redirect', function(req, res, next) {
	var redirect = !true;
	if(redirect){
		res.json({url : "http://localhost:4300"});
	}else{
		res.json({});
	}
});

module.exports = router;
