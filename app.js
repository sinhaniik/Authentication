require("dotenv").config()
const md5 = require('md5');
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const ejs = require( 'ejs' );
const mongoose = require("mongoose")
const {connect} = require("mongoose");

const {Schema} = mongoose;

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

app.post("/register", async (req, res) => {
	try {
		const newUser = new User({
			email: req.body.username,
			password: md5(req.body.password)
		});

		await newUser.save();
		res.render("secrets.ejs");
	} catch (err) {
		console.log(err);
	}
});

app.post("/login", (req, res) => {
	const newEmail = req.body.username;
	const newPass = md5(req.body.password);

	User.findOne({email: newEmail})
		.then((foundUser) => {
			if (foundUser && foundUser.password === newPass) {
				res.render("secrets.ejs");
			}
		})
		.catch((err) => {
			console.log(err);
		});
});
app.listen( 3000 , function () {
	console.log( 'server started on the port 3000' );
} );