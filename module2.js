//
// MODULE2 serveur Nodejs: route les requetes  MYSQL
//

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const fssync = require('fs');

const jwt = require('jsonwebtoken');
tokenchain='A Nice, ces raviolis de la Maison Barale « mêlent la singularité du citron confit à la chaleur épicée du gingembre »';

// ----------------------------------------
// connexion préalable à la database
// ----------------------------------------

var con = mysql.createConnection({
  host: "localhost",
  user: "philippe",
  password: "msqlpwd",
  database: "module2"
});

con.connect((err) => {
  if (err) {
    console.log("DB connection error: "+err);
	process.exit(0);
  }
});

//
// DB OK , on peut lancer le serveur web
//
console.log("Connected to Module2 DB");

// ----------------------------------
// serveur http
// ----------------------------------

var http=require('http');
res="";
var server=http.createServer(
    function(request,response) {
		requesturl=request.url;
        resp=response;
		console.log("requrl: "+requesturl);
//----------------------------------------------------------------------------
//   **** pages html
//----------------------------------------------------------------------------

		if (requesturl == "/") {
			response.end(getfile("index.html"));
		}
		else if (requesturl == "/index.html") {
			response.end(getfile("index.html"));
		}
		else if (requesturl == "/admin.html") {
			response.end(getfile("admin.html"));
		}
		else if (requesturl == "/admin.js") {
			response.end(getfile("admin.js"));
		}
		else if (requesturl == "/index.js") {
			response.end(getfile("index.js"));

		}
		else if (requesturl == "/favicon.ico") {

		}
//----------------------------------------------------------------------------
//   **** PUBLIC APIS ==> (get)articles, (get)cvluc, (get)reactions, createreaction
//----------------------------------------------------------------------------

//
// get articles
//
        else if (requesturl == "/api/articles") {
		con.query("SELECT * FROM article ORDER BY date_article DESC", callback_get);
		}
		//
// get cvluc
//
        else if (requesturl == "/api/cvluc") {
		con.query("SELECT * FROM cvluc ", callback_cvluc);
		}
//
// get reactions (uniquement les reactions validées d'un article donné)
// /api/reactions/<num_article>
//
        else if (requesturl.substr(0,18) == "/api/reactions/all") {
			numarticle=requesturl.substr(19);
//			console.log(numarticle);
//			try '
			var sql ="SELECT * FROM reactions WHERE (id_article="+numarticle+ " ) ORDER BY date_reaction DESC";
			console.log(sql);
			con.query(sql, callback_get);
		}

        else if (requesturl.substr(0,14) == "/api/reactions") {
			numarticle=requesturl.substr(15);
//			console.log(numarticle);
//			try '
			var sql ="SELECT * FROM reactions WHERE (id_article="+numarticle+ " AND reaction_validee = 1) ORDER BY date_reaction DESC";
			console.log(sql);
			con.query(sql, callback_get);
		}
//
// create reaction
//
// /api/createreaction/&1&phil&0230219&nouveau commentaire de philippe&optionnel  
//
        else if (requesturl.substr(0,19) == "/api/createreaction") {
			console.log();
			reqcreation=requesturl.substr(20);
//			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			id_article=arrayreq[1];
			auteur_reaction=decodeURIComponent(arrayreq[2]);
			date_reaction=arrayreq[3];
			texte_reaction=decodeURIComponent(arrayreq[4]);
			titre_article=decodeURIComponent(arrayreq[5]);
		
		var sql = "INSERT INTO reactions (id_article,  auteur_reaction , date_reaction , texte_reaction,titre_article) VALUES ('"
			+id_article
			+"', '"
			+auteur_reaction
			+"', '"
			+date_reaction
			+"', '"
			+texte_reaction
			+"', '"
			+titre_article
			+"')";

		console.log(sql);
		con.query(sql, callback_createreaction);
		}
//----------------------------------------------------------------------------------------------------------------------------------------------
// **** BACK OFFICE (PRIVATE) APIs // createarticle, deletearticle, deleteadmin, validerreaction, updatearticle, createadmin, getadmin, adminlogin
//----------------------------------------------------------------------------------------------------------------------------------------------
//

//
// create article, besoin du token
//
// Request: /api/crud/article/create/&date_article&auteur_article&texte_article&titre_article&token
// INSERT INTO article (date_article, auteur_article, texte_article , titre_article)
//
        else if (requesturl.substr(0,24) == "/api/crud/article/create") {
			reqcreation=requesturl.substr(25);
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			date_article=arrayreq[1];
			auteur_article=decodeURIComponent(arrayreq[2]);
			texte_article=decodeURIComponent(arrayreq[3]);
			texte_article= texte_article.replaceAll("'", "\'");
			titre_article=decodeURIComponent(arrayreq[4]);
			titre_article= titre_article.replaceAll("'", "\'");
			token=decodeURIComponent(arrayreq[5]);
			console.log("token>>"+token+"<<");
			
			try {
				const decodedToken = jwt.verify(token, tokenchain);
				var sql = "INSERT INTO article  (date_article, auteur_article, texte_article, titre_article) VALUES ('"
					+date_article
					+"', '"
					+auteur_article
					+"', '"
					+texte_article
					+"', '"
					+titre_article
					+"')";
			
					console.log(sql);
					con.query(sql, callback_createarticle);

			}
			catch(err) {
				console.log(err);
				resp.end("create article, invalid token: "+err);
			}
		}
//
// delete article
// /api/delete/&id_article&token besoin du token
// DELETE FROM article WHERE id = 

//
        else if (requesturl.substr(0,11) == "/api/delete") {
			reqcreation=requesturl.substr(12);
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");
			
			id_article=arrayreq[1];
			token=decodeURIComponent(arrayreq[2]);
			try {
				const decodedToken = jwt.verify(token, tokenchain);
				var sql = "DELETE FROM article WHERE id =  "+id_article;
			
				console.log(sql);
				con.query(sql, callback_deletearticle);
			}
			catch(err) {
				console.log(err);
				resp.end("delete article, invalid token: "+err);
			}
		}

//
// delete admin (non implémenté dans le front end, pas demandé);
// /api/crud/admin/delete/&userid&token besoin du token
// DELETE FROM admin WHERE id = 
//
//
        else if (requesturl.substr(0,22) == "/api/crud/admin/delete") {
			reqcreation=requesturl.substr(23);
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");
			
			userid=decodeURIComponent(arrayreq[1]);
			token=decodeURIComponent(arrayreq[2]);
			try {
				const decodedToken = jwt.verify(token, tokenchain);
				var sql = "DELETE FROM admin WHERE userid =  '"+userid+"'";
			
				console.log(sql);
				con.query(sql, callback_deleteadmin);
			}
			catch(err) {
				console.log(err);
				resp.end("delete admin, invalid token: "+err);
			}
		}

//
// valider reaction, besoin du token
// api/validerreaction/&id_article&id_reaction&token
// 
        else if (requesturl.substr(0,20) == "/api/validerreaction") {
			reqcreation=requesturl.substr(21);
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			id_article=arrayreq[1];
			id_reaction=arrayreq[2];
			token=decodeURIComponent(arrayreq[3]);

			try {
				const decodedToken = jwt.verify(token, tokenchain);
			
				var sql = "UPDATE reactions SET reaction_validee = true WHERE id_article="+id_article+"  AND id="+id_reaction;
			
				console.log(sql);
				con.query(sql, callback_validerreaction);
			}
			catch(err) {
				console.log(err);
				resp.end("Valider reaction, invalid token: "+err);
			}
		}
//
// update article , besoin du token
// api/updatearticle/&id_article&texte_article&token
// 
        else if (requesturl.substr(0,18) == "/api/updatearticle") {
			reqcreation=requesturl.substr(19);
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			id_article=arrayreq[1];
			texte_article=decodeURIComponent(arrayreq[2]);
			texte_article= texte_article.replaceAll("'", "\'");
			console.log(texte_article);
			token=arrayreq[3];

			try {
				const decodedToken = jwt.verify(token, tokenchain);
			
				var sql = 'UPDATE article SET texte_article = "'+texte_article+'" WHERE id='+id_article;
			
//				console.log("SQLORDER>>"+sql);
				con.query(sql, callback_updatearticle);
			}
			catch(err) {
				console.log(err);
				resp.end("Update article, invalid token: "+err);
			}
		}
//
// create admin
// /api/admin/create/&email&pwd&nom&prenom&token
//
        else if (requesturl.substr(0,17) == "/api/admin/create") { 
			reqcreation=requesturl.substr(18);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			email=decodeURIComponent(arrayreq[1]);
			pwd=decodeURIComponent(arrayreq[2]);
			nom=decodeURIComponent(arrayreq[3]);			
			prenom=decodeURIComponent(arrayreq[4]);
			token=decodeURIComponent(arrayreq[5]);
			
			try {
				const decodedToken = jwt.verify(token, tokenchain);
			
				// check if admin already exists
				var sql = "SELECT * FROM admin WHERE userid =  '"+email+"'";

				console.log(sql);
				con.query(sql, callback_createadmin);
			}
			catch(err) {
				console.log(err);
				resp.end("create admin, invalid token: "+err);
			}			

//					.catch(error => response.end(error));
					
		}


// 
// /api/getadmin/&email&token
//
        else if (requesturl.substr(0,13) == "/api/getadmin") { 
			reqcreation=requesturl.substr(14);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			email=decodeURIComponent(arrayreq[1]);
			token=decodeURIComponent(arrayreq[2]);

			try {
				const decodedToken = jwt.verify(token, tokenchain);			
				var sql = "SELECT * FROM admin WHERE userid =  '"+email+"'";

				console.log(sql);
				con.query(sql, callback_getadmin);
			}
			catch(err) {
				console.log(err);
				resp.end("get admin, invalid token: "+err);
			}			
				
		}


// 
// /api/adminlogin/&email&pwd
//
        else if (requesturl.substr(0,15) == "/api/adminlogin") { 
			reqcreation=requesturl.substr(16);
			reqcreation=reqcreation.replaceAll("%20"," ");
			console.log(reqcreation);
			arrayreq=reqcreation.split("&");

			email=decodeURIComponent(arrayreq[1]);
			pwd=decodeURIComponent(arrayreq[2]);
			var sql = "SELECT * FROM admin WHERE userid =  '"+email+"'";

			console.log(sql);
			con.query(sql, callback_adminlogin);
				
		}
//
// sinon hello !! 
//
		else response.end("Hi, how are you today !?");

	} //  function(request,response)
); // var server=http.createServer(


port="8001";
server.listen(port);
console.log("Server is up, listening on port "+port);


// /////////////////////////////
function callback_get(err, result, fields){
// /////////////////////////////
	console.log("getarticles");
	if (err) throw err;

	resp.end(JSON.stringify(result));
}

// /////////////////////////////
function callback_cvluc(err, result, fields){
// /////////////////////////////
	console.log("getcvluc");
	if (err) throw err;

	resp.end(JSON.stringify(result));
}



// /////////////////////////////
function callback_createreaction(err, result, fields){
// /////////////////////////////
	console.log("createreaction");
	if (err) throw err;
	

	console.log(result);
	console.log(JSON.stringify(result));
	resp.end(JSON.stringify(result));
}

// /////////////////////////////
function callback_createarticle(err, result, fields){
// /////////////////////////////
	console.log("createarticle");
	if (err) throw err;
	console.log(result);
	console.log(JSON.stringify(result));

	resp.end("OK");
}

// /////////////////////////////
function callback_deletearticle(err, result, fields){
// /////////////////////////////
	console.log("deletearticle");
	if (err) throw err;
	console.log(result);
	console.log(JSON.stringify(result));

// on efface les reactions liées à cet articel
	var sql = "DELETE FROM reactions WHERE id_article =  "+id_article;
			
	console.log(sql);
	con.query(sql, callback_deletearticle2);

// resp.end(JSON.stringify(result));
}

// /////////////////////////////
function callback_deletearticle2(err, result, fields){
// /////////////////////////////
	console.log("deletearticle2");
	if (err) throw err;
	console.log(result);
	console.log(JSON.stringify(result));

resp.end("OK");
}

function callback_validerreaction(err, result, fields){
	resp.end("OK");
}

function callback_updatearticle(err, result, fields){
	console.log(err);
	console.log(result);
	resp.end("OK");
}
// /////////////////////////////
function callback_deleteadmin(err, result, fields){
// /////////////////////////////
	console.log("deleteadmin");
	if (err) throw err;
	console.log(result);
	console.log(JSON.stringify(result));

resp.end(JSON.stringify(result));
}
// /////////////////////////////
function callback_createadmin(err, result, fields){
// /////////////////////////////
	console.log("createadmin callback");
	if (err) throw err;
	console.log(result);
	console.log(JSON.stringify(result));

if 
	(result.length>0) {resp.end("alreadyexists");}
else {
	
	bcrypt
		.hash(pwd, 10)
		.then(hash => {
		var sql = "INSERT INTO admin  (userid, pwd, nom, prenom) VALUES ('"
			+email
			+"', '"
			+hash
			+"', '"
			+nom
			+"', '"
			+prenom
			+"')";
			
			console.log(sql);
			con.query(sql, callback_createadmin2);
					})
}

}

// /////////////////////////////
function callback_createadmin2(err, result, fields){
// /////////////////////////////
	resp.end("OK");
}


/ /////////////////////////////
function callback_getadmin(err, result, fields){
// /////////////////////////////

	console.log("get admin callback");
	if (err) throw err;
	console.log(result.length);
	console.log(JSON.stringify(result));
	
	if 
		(result.length==0) {resp.end("notfound");}
	else
		resp.end(JSON.stringify(result));
	}

 /////////////////////////////
function callback_adminlogin(err, result, fields){
// /////////////////////////////

	console.log("adminlogin callback");
	if (err) throw err;
	console.log(result.length);
	console.log(JSON.stringify(result));
	
	if 
		(result.length==0) {resp.end("notfound");}
	else {
		console.log(result[0]);
			console.log(result[0].userid);
			console.log(pwd);
	    bcrypt
			// actual passw, encrypted pwd
			.compare(pwd, result[0].pwd)
            .then(valid => {
                   if (!valid) {
                       resp.end('Mot de passe incorrect !');
                   }
                   else {
					   resp.end(JSON.stringify({
										userId: email,
										// le token renvoyé pour ce userid devra être renvoyé par le client sur les apis spécifiques à l'admin:
										// 	Créer, supprimer, mettre à jour un article ou un admin
										// 	Valider une réaction
										token: jwt.sign(
											{ userId: email },
											tokenchain,
											{ expiresIn: '4h' }
										)
									}
						));
						
				   }
            })
	
	}
}

// ///////////////////////////////////
function getfile(fichier) {
// ///////////////////////////////////
        try {
                var fic= fssync.readFileSync(fichier);
        }
        catch (err) {
                console.log(fichier +" NOT FOUND");
				fic=fichier +" NOT FOUND";
        }

return fic
}

