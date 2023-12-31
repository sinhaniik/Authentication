require("dotenv").config()
const bcrypt = require("bcrypt")
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const ejs = require( 'ejs' );
const mongoose = require("mongoose")
const {connect} = require("mongoose");

const {Schema} = mongoose;
const salt = 10;
const app = express();
app.use( express.static( 'public' ) );
app.set( 'view engine' , 'ejs' );
app.use( bodyParser.urlencoded( {
	extended: true ,
} ) );

connect('mongodb://127.0.0.1:27017/usersDB', { useNewUrlParser: true});

const UsersSchema = new Schema({
	email: String,
	password: String
});

const User = mongoose.model("users", UsersSchema);


app.get( '/' , function ( req , res ) {
	res.render( 'home.ejs' );
} );

app.get( '/login' , function ( req , res ) {
	res.render( 'login.ejs' );
} );

app.get( '/register' , function ( req , res ) {
res.render( 'register.ejs' );
} );

app.post( '/register' , async ( req , res ) => {
	bcrypt.hash( req.body.password , salt , function ( err , hash ) {
		try {
			const newUser = new User( {
				email: req.body.username ,
				password: hash,
			} );
			
			newUser.save();
			res.render( 'secrets.ejs' );
		} catch ( err ) {
			console.log( err );
		}
	} );
} );

app.post( '/login' , ( req , res ) => {
	const newEmail = req.body.username;
	const newPass = req.body.password;
	
	User.findOne( { email: newEmail , password: newPass } ).
	  then( ( foundUser ) => {
		  bcrypt.compare( req.body.password , bcrypt.hash ,
			function ( err , result ) {
				if ( result === true ) {
					res.render( 'secrets.ejs' );
				} else {
					console.log( err );
				}
			} );
	  } );
} );
app.listen( 3000 , function () {
	console.log( 'server started on the port 3000' );
} );