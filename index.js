// ///////////////////////////////
//
// Module 2, Front end (accés public)
//
// ///////////////////////////////
function see_articles() {
	
// ///////////////////////////////
// appellé depuis index.html 
// ///////////////////////////////	

	hostaddr="127.0.0.1";
	setTimeout(homepage,100);

}

function homepage() {
	//
	// chargement des données de LUC (intro, photo, CV) depuis la table cvluc 
	//
	var url="http://"+hostaddr+":8001/api/cvluc";

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
// recupération des données de LUC et interrogation de la table ARTICLES
//
function wrr0() {
	resp=this.responseText;

    struct0=JSON.parse(resp);
	introtext=struct0[0].intro;
	detailcv=struct0[0].detailcv;
	lucimage=struct0[0].image;
	var url="http://"+hostaddr+":8001/api/articles";

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
//
// récupération des données de la table ARTICLE et formatage puis écriture de la page d'accueil
//
function wrr() {
// ///////////////////////////////

	resp=this.responseText;

    struct=JSON.parse(resp);

	list = docheader()+"<h1><a href onclick='getcvimage()'>Le Blog de LUC. </a><p> </p><button onclick='mecontacter()'>Me contacter</button></h1>";
	
	list=list+intro();
	list=list+tableheader();
	
	for (var i = 0; i < struct.length; i++) { // on crée une table avec tous les articles (tronqués à 300 caractères) dans l'odre antichronologique
	 var str = "";
		str	=docentry();
		idart=struct[i].id;
	
		str= str.replaceAll("$titre$","<h2><a href='#' onclick='zoomarticle("+idart+","+i+")' >"+struct[i].date_article+" "+struct[i].titre_article+"</a></h2>");
		var txt= struct[i].texte_article;
		if (txt.length > 300) txt=txt.substr(0,300)+"...";
		
		str= str.replaceAll("$texte$","<h4>"+txt+"</h4>");
		str= str.replaceAll("\n","<br>");
		list = list +str;
    }
	
	list=list+tabletrailer();
	list = list+ doctrailer();
	
	
	docupdate(list);
}

//
// création et affichage du formulaire de contact
//
function mecontacter() {
		list = docheader()+"<h1><a href onclick='setTimeout(homepage,100);'>"+"Le Blog de LUC</a>, page de contact.</h1>";

		list= list+'<textarea id="cnom" name="cnom" rows="1" cols="80">Votre prénom</textarea><br><br>';
		list= list+'<textarea id="cadr" name="cadr" rows="1" cols="80">Votre adresse email</textarea><br><br>';
				list= list+'<textarea id="cadr" name="cadr" rows="1" cols="80">Objet de votre message</textarea><br><br>';
		list= list+'<textarea id="cmessage" name="cmrssage" rows="10" cols="120">Votre message</textarea><br><br><br>';
		list= list+'<button onclick="envoyercontact()">Envoyer</button><br><br>';

	list=list+doctrailer();	
//	navigator.clipboard.writeText(list);
	
	docupdate(list);

}

//
// cette fonction serait à compléter pour prise en compte réelle (non demandé dans les specs)
//
function envoyercontact() {
	alert("Votre message a bien été pris en compte");
	setTimeout(homepage,100);
}

//
// lecture des réactions associées à un article
//
function zoomarticle(i,j) {
//	alert("zoom "+i+" "+j);	
	// i contient le no d'article, j l'index dans struct
	gi=i;
	gj=j;
	var url="http://"+hostaddr+":8001/api/reactions/"+i;
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

//
// callback construction du zomm article avec les réactions
//
function wrr2() {
	resp=this.responseText;
	
    struct2=JSON.parse(resp);

	// gi contient le no d'article, gj l'index dans struct

	list = docheader()+"<h1><a href onclick='setTimeout(homepage,100);'>"+"Le Blog de LUC</a></h1>";
	
		nbreact=struct2.length;
		if (nbreact >1) 
			nbreact=nbreact+ " reactions.";
		else
			nbreact=nbreact+ " reaction.";
//
// affichage etitre article et nombre de réactions
//
		list= list+"<h2>"+struct[gj].date_article+" "+struct[gj].titre_article+". <br>"+nbreact+"</h2><br>";
		list= list+'<textarea id="nom" name="text" rows="0" cols="10">Votre nom</textarea>';
		list= list+'<textarea id="commentaire" name="text" rows="0" cols="80">Votre commentaire</textarea><br>';
		list= list+'<button onclick="reagir()">Envoyer</button><br><br>';
//
// affichage texte de l'article
//
		list=list+tableheader();
		var str = "";
		str	=docentry();
		str= str.replaceAll("$titre$","");
		str= str.replaceAll("$texte$",struct[gj].texte_article);
		str= str.replaceAll("\n","<br>");
		list= list+str;
		list=list+tabletrailer();		
//
// affichade des reactions
//	
	list=list+"<h2>Reactions</h2>";

	list=list+tableheader();
//	
// struct2, tableau  contient la liste des réactions
//
	for (var i = 0; i < struct2.length; i++) {
		var str = "";
		str	=docentry();
		
		str= str.replaceAll("$titre$","<h3>"+struct2[i].date_reaction+" "+struct2[i].auteur_reaction+"</h3>");
		var txt= struct2[i].texte_reaction;
		
		str= str.replaceAll("$texte$","<h4>"+txt+"</h4>");
		str= str.replaceAll("\n","<br>");
		list = list +str;
    }
	
	list=list+tabletrailer();
	list=list+doctrailer();	
	
	docupdate(list);
}

//
// construction html texte d'intro + photo de Luc.
//
function intro() {
	var t=tableintro();
	t=t.replaceAll('c1',"<h4>"+introtext+"</h4>");
	t=t.replaceAll('c2','<img src="'+getimage()+'" style="border: 1px solid #000; max-width:328px; max-height:328px;" />');
	return t
	// return introtext+ '<br><img src="'+getimage()+'" alt="Luc" />';
}

//
// créer le commentaire en base
//
function reagir() {
	if (document.getElementById("nom").value=="Votre nom") {
		alert("Merci de renseigner votre nom");
		return;
	}
	if (document.getElementById("commentaire").value=="Votre commentaire") {
		alert("Merci de renseigner votre commentaire");
		return;
	}
//
// lancer la création de la reaction
// /api/createreaction/&1&phil&2023-02-27&nouveau commentaire de philippe
//
	reacnom=document.getElementById("nom").value;
	reaccommentaire=document.getElementById("commentaire").value;
	reaccommentaire= reaccommentaire.replaceAll("&"," et ");
	reaccommentaire= reaccommentaire.replaceAll("'"," ");
	reacdate=getdate("date-");
	
	var url="http://"+hostaddr+":8001/api/createreaction/&"+gi+"&"+reacnom+"&"+reacdate+"&"+reaccommentaire;
	console.log(url);
	try {
		var oReq = new XMLHttpRequest(); // 
		oReq.onload = wrr3;
		oReq.open("get", url, false);
		oReq.send();
	}
	catch(err) {
		alert(err)
	}

}
//
// callback création contribution 
//
function wrr3() {
		alert ("Merci pour votre contribution. Publication sauvegardée, en attente de la validation du modérateur de contenus.");
}

function docentry() {
	var a= '<tbody><tr align="left"><td style="vertical-align: top;"><span style="font-weight: bold;">$titre$</span><br></td></tr><tr align="left"><td style="vertical-align: top; background-color: rgb(244, 246, 219);"><span style="font-weight: bold;">$texte$</span><br></td></tr></tbody>';
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

function tableintro() {
	return '<table style="text-align: left; width: 100%;" border="0" cellpadding="0" cellspacing="0"> <tbody> <tr> <td style="vertical-align: top;background-color: rgb(204, 204, 204);">c1<br></td> <td style="vertical-align: top;background-color: rgb(204, 204, 204);">c2<br></td></tr></tbody></table>';
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

function docupdate(l) {
	document.open();
	document.write(l);
	document.close();
}
//
// renvoi image Luc en base64
//
function getimage() {
	return lucimage;
}
//
// renvoi CV de LUC en image base64
//
function getcvimage() {
var img = detailcv;  
	const myWindow = window.open();
	myWindow.document.open();
	myWindow.document.write('<img src="'+img+'" alt="Luc" />');
	myWindow.document.close();
}

