// ///////////////////////////////
//
// Module 2, Front end accés privé (Admin)
//
// ///////////////////////////////
function begin_admin() {
	
// ///////////////////////////////
// appellé depuis admin.html
// ///////////////////////////////	
 
admin_login();
}

function admin_login() { // afficher la page de login admin
	list="";
	list= list + '<h4>Entrer votre compte utilisateur:</h4><br>';
	list= list + '<textarea id="userid" name="userid" rows="1" cols="80">philippe.bauchard2@free.fr</textarea><br>';
	list= list + '<h4>Entrer votre mot de passe:</h4><br>';
	list= list+ '<textarea id="pwd" name="pwd" rows="1" cols="80" type="password" style="color: transparent;text-shadow: 0 0 8px rgba(0,0,0,0.5);"></textarea><br>';	
	list= list+ '<button onclick="envoyermdp()">Envoyer</button><br>';

	docupdate(list);
}

//
// envoi du login et du mot de passe
//
function envoyermdp() {

	uid= document.getElementById("userid").value;
	pwd= document.getElementById("pwd").value;
	// 
	// /api/adminlogin/&email&pwd
	//
		var url="http://127.0.0.1:8001/api/adminlogin/&"+encodeURIComponent(uid)+"&"+encodeURIComponent(pwd);
	//alert(url);
	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr0;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)
	}

}

//
// si login OK, on recupére le token et on le stocke dans la variable token.
//
function wrr0() {
	resp=this.responseText;
	if (resp =="notfound") {
		alert("Combinaison Compte utilisateur / mot de passe incorrect, veuillez ré-essayer.");
		return;
	}
	if (resp =="Mot de passe incorrect !") {
		alert("Combinaison Compte utilisateur / mot de passe incorrect, veuillez ré-essayer.");
		return;
	}
	// login OK, garder le token en mémoire et envoyer la page d'admin
	
    struct0=JSON.parse(resp);
	token=struct0.token;
	// on est loggé, jump sur page d'admin
	setTimeout(pageadmin,0);
}

function pageadmin() {
	list="";
	list= list + "<h1>Blog de LUC. Bienvenue sur la page d'admin !</h1>";
	list= list+ '<p>Choisir dans les options suivantes:</p><br>';
	
	list= list+ '<button onclick="admincomptes()">Créer un nouveau compte admin</button><br><br>';
	list= list+ '<button onclick="adminarticles()">Gérer les articles et commentaires</button><br><br>';
	list= list+ '<button onclick="deconnect()">Se déconnecter</button><br>';
	
	docupdate(list);

}

//
// page de gestion des comptes admin
//
function admincomptes() {
	list="";
		list = docheader()+"<h1>Création des comptes Admin. </h1>";
	list = list+ '<br><button onclick="deconnect()">Se déconnecter</button>';	
	list = list+"<h2><button onclick='setTimeout(pageadmin,0);'>Retour Menu principal</button></h2>";

	list= list + '<h4>Compte utilisateur (email):</h4>';
	list= list + '<textarea id="auserid" name="auserid" rows="1" cols="80"></textarea>';

	list= list + '<h4>Nom:</h4><br>';
	list= list + '<textarea id="anom" name="anom" rows="1" cols="80"></textarea>';

	list= list + '<h4>Prénom:</h4>';
	list= list + '<textarea id="aprenom" name="aprenom" rows="1" cols="80"></textarea>';
	
	list= list + '<h4>Mot de passe:</h4>';
	list= list+ '<textarea id="apwd" name="apwd" rows="1" cols="80"  style="color: transparent;text-shadow: 0 0 8px rgba(0,0,0,0.5);"></textarea><br>';	
	list= list+ '<button onclick="envoyeradmin()">Créer Admin</button><br>';

	docupdate(list);;
	
}

function envoyeradmin() {
//
// create compte admin admin
// /api/admin/create/&email&pwd&nom&prenom&token
//
	var err="Erreur: Au moins un champs n'est pas renseigné.";
	if (auserid == "") {
		alert(err);
		return;
	}
	if (anom == "") {
		alert(err);
		return;
	}
	if (aprenom == "") {
		alert(err);
		return;
	}
	if (apwd == "") {
		alert(err);
		return;
	}

	auserid=encodeURIComponent(document.getElementById("auserid").value);
	anom=encodeURIComponent(document.getElementById("anom").value);
	apremon=encodeURIComponent(document.getElementById("aprenom").value);
	apwd=encodeURIComponent(document.getElementById("apwd").value);

	var url="http://127.0.0.1:8001/api/admin/create/&"+auserid+"&"+apwd+"&"+anom+"&"+apremon+"&"+encodeURIComponent(token);

	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr7;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)

	}
}

function wrr7() {
		resp=this.responseText;
		if (resp == "OK") {
			alert("Le compte a été créé.");
		}	
		else alert(resp);
}

//
// gestion des articles
//
function adminarticles() {
// envoyer  liste des articles 
	var url="http://127.0.0.1:8001/api/articles";

	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)
	}

}	

// ///////////////////////////////
function wrr() {
// ///////////////////////////////
	resp=this.responseText;
    struct=JSON.parse(resp);

	list = docheader()+"<h1>Gestion des Articles et des commentaires. </h1>";
	list = list+ '<br><button onclick="deconnect()">Se déconnecter</button>';	
	list = list+"<h2><button onclick='setTimeout(pageadmin,0);'>Retour Menu principal</button></h2>";

	list=list+"<h2><button onclick='setTimeout(createarticle,0);'>Créer un article</button></h2>";

	list=list+tableheader();
	
	for (var i = 0; i < struct.length; i++) {
	 var str = "";
		str	=docentry();
		idart=struct[i].id;
		// <a href="#" onclick="clickEvenement(<%=ecranMenu.MENU_GRILLES_BASE%>; return false)"> Grille Base</a>
		str= str.replaceAll("$titre$","<p>"+struct[i].titre_article+"</p><button onclick='deletearticle("+idart+","+i+")'>Supprimer </button><button onclick='updatearticle("+idart+","+i+")'> Modifier article / Valider les commentaires</button><br>");
		var txt= struct[i].texte_article;
		if (txt.length > 300) txt=txt.substr(0,300)+"...";
		
		str= str.replaceAll("$texte$","<h4>"+txt+"</h4>");

		list = list +str;
    }
	
	list=list+tabletrailer();
	list = list+ doctrailer();
	
	docupdate(list);
}

//
// créer un article
//
function createarticle() {
	list = docheader()+"<h1>Creation article  </h1>"+"<button onclick='adminarticles()'>Retour articles</button><br>";
	list = list+ '<br><button onclick="deconnect()">Se déconnecter</button><br>';

	list=list+tableheader();
	var str = "";
	str	=docentry();
	initcontenu="texte";
	str= str.replaceAll("$titre$",'<textarea id="titrenarticle" name="titrenarticle" rows="1" cols="120">'+'titre'+'</textarea>');
	str= str.replaceAll("$texte$",'<textarea id="textenarticle" name="textenarticle" rows="30" cols="120">'+initcontenu+'</textarea>');

	list= list+str;
	list=list+tabletrailer();		

	list=list+"<button onclick='envoyercreate()'>Sauvegarder l'article</button><br><br>";
	
	list=list+doctrailer();	
	
	docupdate(list);
}

function envoyercreate() {
	
	modifiedtext= document.getElementById("textenarticle").value;
	if (initcontenu == modifiedtext) {
		alert ("Contenu inchangé !!");
		return;
	}
	msgtext = "Voulez-vous vraiment sauvegarder l'article avec ce nouveau texte ?\n OUI (OK) ou NON (Annuler).";
	 if (confirm(msgtext) == true) {
	// create article, besoin du token
	//
	// Request: /api/crud/article/create/&date_article&auteur_article&texte_article&titre_article&token
	// INSERT INTO article (date_article, auteur_article, texte_article , titre_article)
	//
	date_article=getdate("date-");
	auteur_article="Luc";
	texte_article=encodeURIComponent(modifiedtext);

	titre_article=encodeURIComponent(document.getElementById("titrenarticle").value);
//	alert(titre_article);

	var url="http://127.0.0.1:8001/api/crud/article/create/&"+date_article+"&"+auteur_article+"&"+texte_article+"&"+titre_article+"&"+token;
	console.log(url);
	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr3;
		oReq.open("get", url, false);
		oReq.send();
		
	}
	catch(err) {
		alert("erreur HTTP:"+err)
	}
		
	}
	else {
			alert("Sauvegarde article annulée.");
	}

}

function wrr3() {
	resp=this.responseText;
	if (resp =="OK") {
		alert("Création article effectuée.");
		setTimeout(adminarticles,0);
	}
	else {
		alert(resp);
	}
}

//
// delete un article
// /api/crud/article/delete/&id_article&token besoin du token
//
function deletearticle(vidart,vi) {
	var msgtext = "Voulez vous vraiment effacer cet article ?\n OUI (OK) ou NON (Annuler).";
	 
	if (confirm(msgtext) == true) {
		var url="http://127.0.0.1:8001/api/delete/&"+vidart+"&"+token;
		console.log(url);
		try {
			var oReq = new XMLHttpRequest(); // 
			oReq.onload = wrr6;
			oReq.open("get", url, false);
			oReq.send();
		}
		catch(err) {
			alert(err)
		}
		 
	 }
	 else {
		 alert("Suppression annulée.");
	 }
}	

function wrr6() {
	resp=this.responseText;
	if (resp =="OK") {
		alert("Suppression effectuée avec les réactions associées");
		setTimeout(adminarticles,0);
	}
	else {
		alert(resp);
	}
}

//
// mise à jour article
//
function updatearticle(i,j) {
	// i contient le no d'article (l'id) , j l'index dans struct
	gi=i;
	gj=j;
//
// récupérer toutes les réactions sur l'article y compris les non validées
//
	var url="http://127.0.0.1:8001/api/reactions/all/"+i;
	console.log(url);
	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr2;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)
	}
}

// ///////////////////////////////
function wrr2() {
// ///////////////////////////////
	resp=this.responseText;
    struct2=JSON.parse(resp);
// gi contient le no d'article, gj l'index dans struct

	list = docheader()+"<h1>Admin article  </h1>"+"<button onclick='adminarticles()'>Retour articles</button><br>";
	list = list+ '<br><button onclick="deconnect()">Se déconnecter</button><br>';
		
	nbreact=struct2.length;
	if (nbreact >1) 
		nbreact=nbreact+ " reactions.";
	else
		nbreact=nbreact+ " reaction.";

	list=list+tableheader();
	var str = "";
	str	=docentry();
	initcontenu=struct[gj].texte_article;
	str= str.replaceAll("$titre$","");
	str= str.replaceAll("$texte$",'<textarea id="textearticle" name="textearticle" rows="30" cols="120">'+struct[gj].texte_article+'</textarea>');
	list= list+str;
	list=list+tabletrailer();		

	list=list+"<button onclick='envoyermodif()'>Enregistrer les modifications article</button><br><br>";
	
	list=list+"<h2>Reactions</h2>";

	list=list+tableheader();
	
	// struct2, tableau  contient la liste des réactions
	// il faut mettre un bouton valider sur les reactions non validées
	for (var i = 0; i < struct2.length; i++) {
		var str = "";
		
		if (struct2[i].reaction_validee==1) {
			str	=docentry();
			str= str.replaceAll("$titre$","<h3>"+struct2[i].date_reaction+" "+struct2[i].auteur_reaction+"</h3>");
		}
		else {
			str	=reddocentry();
			str= str.replaceAll("$titre$","<h3>"+struct2[i].date_reaction+" "+struct2[i].auteur_reaction+"</h3><button onclick='validerreaction("+i+")'>Valider la réaction</button><br>");
		}
		var txt= struct2[i].texte_reaction;
		
		str= str.replaceAll("$texte$","<h4>"+txt+"</h4>");
		list = list +str;
    }
	
	list=list+tabletrailer();
	list=list+doctrailer();	
	
	docupdate(list);
}

//
// valider une réaction
//
function validerreaction(vi) {
//
// api/validerreaction/&id_article&id_reaction&token
//
	var vid_article=struct2[vi].id_article;
	var vid_reaction=struct2[vi].id;;

	var url="http://127.0.0.1:8001/api/validerreaction/&"+vid_article+"&"+vid_reaction+"&"+token;;
	console.log(url);
	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr5;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)
	}
}

function wrr5() {
	resp=this.responseText;
	if (resp =="OK") {
		alert("Réaction validée !");
		updatearticle(gi,gj);
	}
	else {
		alert(resp);
	}
}

//
// sauvegarder modif article
//
function envoyermodif() {
	
	modifiedtext= document.getElementById("textearticle").value;
	// console.log("initcontenu>>"+initcontenu);
	// console.log("modifiedtext>>"+modifiedtext); 
	if (initcontenu == modifiedtext) {
		alert ("Contenu inchangé !!");
		return;
	}
	 msgtext = "Voulez-vous vraiment remplacer l'article par ce nouveau texte ?\n OUI (OK) ou NON (Annuler).";
	 if (confirm(msgtext) == true) {
//
// update article , besoin du token
// api/updatearticle/&id_article&texte_article&token
//
//	modifiedtext= modifiedtext.replaceAll("%"," pcent ");
		var url="http://127.0.0.1:8001/api/updatearticle/&"+gi+"&"+encodeURIComponent(modifiedtext)+"&"+token;
		console.log(url);
		try {
			var oReq = new XMLHttpRequest(); // 
			oReq.onload = wrr4;
			oReq.open("get", url, false);
			oReq.send();
			
		}
		catch(err) {
			alert("erreur HTTP:"+err)
		}
			
	}
	else {
			alert("Modification annulée.");
	}
}

function wrr4() {
	resp=this.responseText;
	if (resp =="OK") {
		alert("Mise à jour article effectuée !");
	}
	else {
		alert(resp);
	}
}


function docentry() {
	var a= '<tbody><tr align="left"><td style="vertical-align: top;"><span style="font-weight: bold;">$titre$</span><br></td></tr><tr align="left"><td style="vertical-align: top; background-color: rgb(244, 246, 219);"><span style="font-weight: bold;">$texte$</span><br></td></tr></tbody>';
	return a;
}

function reddocentry() {
	var a= '<tbody><tr align="left"><td style="vertical-align: top;"><span style="font-weight: bold;">$titre$</span><br></td></tr><tr align="left"><td style="vertical-align: top; background-color: rgb(255, 102, 102);"><span style="font-weight: bold;">$texte$</span><br></td></tr></tbody>';
	return a;
}

function docheader() {
	var a='<html><meta http-equiv="Content-Type" content="text/html;charset=utf-8"><head><title></title></head><body>';
	return a;
}
function tableheader() {
	var a='<table style="text-align: left; width: 100%;" border="0" cellpadding="1" cellspacing="2">';
	return a;
}
function doctrailer() {
	var a='</body></html>';
	return a;
}
function tabletrailer() {
	var a='</table>';
	return a;
}

function deconnect() {
	token="";
	setTimeout(admin_login,0);
}

function docupdate(l) {
	document.open();
	document.write(l);
	document.close();
}
// ////////////////////////////////
function getdate(par)
// ////////////////////////////////
{
        var d = new Date();
        var day= d.getDate();

        var month = d.getMonth()+1;

        var year = d.getFullYear();

        var hr = d.getHours();
        var minute = d.getMinutes();
		var secs = d.getSeconds();

        if (month < 10) month = "0"+month;
        if (day < 10) day = "0"+day;
        if (minute < 10) minute = "0"+minute;
        if (secs < 10) secs = "0"+secs;
        if (hr < 10) hr = "0"+hr;

        if (par=="date-")
          return year+"-"+month+"-"+day;
        else return year+"-"+month+"-"+day+"-"+hr+"-"+minute+"-"+secs;
}