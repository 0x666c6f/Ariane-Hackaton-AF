var LOC_URL;
var RESP_URL;


function onPost(body) {  popsApi.sendMessage("pop:"+JSON.parse(body)['key']+";10;1;0;1");
  popsApi.sendMessage("vib:200;2000");
}

function gac(params) {
var paramsAsArray =params.split(";");
console.log("parameters", paramsAsArray);

var version = paramsAsArray[0];
var state = paramsAsArray[1];
  LOC_URL = 'http://afgo-amsel.rhcloud.com/pops/receiveGeoloc';
  RESP_URL = 'http://afgo-amsel.rhcloud.com/pops/receiveAnswer';
  // Fonctionne au début
  restApi.posttopartener('{"question":"hebergement","choix":"hotel","hotel":"hotel n1","taxi":"oui"}',RESP_URL);
  popsApi.sendMessage("gnl:");
  // 24 items  10 menus

  // ---|------------------"Go" (1)
  // ---|---------------------|------------------"Infos vol" (11)
  // ---|---------------------|---------------------|------------------"Statut : recalé" (111)
  // ---|---------------------|---------------------|------------------"Date : 28/11/16" (112)
  // ---|---------------------|---------------------|------------------"Retour" (113)
  // ---|---------------------|------------------"Hébergement" (12)
  // ---|---------------------|---------------------|------------------"Hotel" (121)
  // ---|---------------------|---------------------|---------------------|------------------"Hilton, 200m" (1211)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Porte 9, 23h" (12111)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Retour" (12112)
  // ---|---------------------|---------------------|---------------------|------------------"Mercure 1,2km" (1212)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Porte 4, 23h" (12121)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Retour" (12122)
  // ---|---------------------|---------------------|---------------------|------------------"Novotel, 684m" (1213)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Porte 1, 23h" (12131)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Retour" (12132)
  // ---|---------------------|---------------------|---------------------|------------------"Retour" (1214)
  // ---|---------------------|---------------------|------------------"Domicile" (122)
  // ---|---------------------|---------------------|---------------------|------------------"Oui" (1221)
  // ---|---------------------|---------------------|---------------------|---------------------|------------------"Terminal 2, 22h" (12211)
  // ---|---------------------|---------------------|---------------------|------------------"Non" (1222)
  // ---|---------------------|---------------------|---------------------|------------------"Retour" (1223)
  // ---|---------------------|---------------------|------------------"Retour" (123)
  // ---|---------------------|------------------"Retour" (13)
  popsApi.sendMessage("grp:"+";g:"+"amo:1;"+'Ariane / by Air France'+";2;1;1"+";g:"+"amo:11;"+'Menu'+";1;1;0"+";g:"+"amo:111;"+'Infos vol'+";1;1;0");
  popsApi.sendMessage("grp:"+";g:"+"amm:111;"+'Statut : recalé'+";g:"+"amm:112;"+'Date : 28/11/16'+";g:"+"amm:113;"+'Retour'+";do:"+"got:11"+";g:"+"amm:11;"+'Infos vol');
  popsApi.sendMessage("grp:"+";g:"+"amo:121;"+'Hébergement'+";1;1;0"+";g:"+"amo:1211;"+'Hôtels'+";1;1;0"+";g:"+"amo:12111;"+'Infos Navette'+";1;1;0");
  popsApi.sendMessage("grp:"+";g:"+"amm:12111;"+'Porte 9, 23h'+";do:"+"pop:"+'Choix validé !'+";10;1;0;1"+";do:"+"got:1"+";g:"+"amm:12112;"+'Retour'+";do:"+"got:121");
  popsApi.sendMessage("grp:"+";g:"+"amm:1211;"+'Hilton, 200m'+";g:"+"amo:12121;"+'Infos Navette'+";1;1;0");
  popsApi.sendMessage("grp:"+";g:"+"amm:12121;"+'Porte 4, 23h'+";do:"+"pop:"+'Choix validé !'+";10;1;0;1"+";do:"+"got:1"+";g:"+"amm:12122;"+'Retour'+";do:"+"got:121");
  popsApi.sendMessage("grp:"+";g:"+"amm:1212;"+'Mercure 1,2km'+";g:"+"amo:12131;"+'Infos Navette'+";1;1;0");
  popsApi.sendMessage("grp:"+";g:"+"amm:12131;"+'Porte 1, 23h'+";do:"+"pop:"+'Choix validé !'+";10;1;0;1"+";do:"+"got:1"+";g:"+"amm:12132;"+'Retour'+";do:"+"got:111");
  popsApi.sendMessage("grp:"+";g:"+"amm:1213;"+'Novotel, 684m'+";g:"+"amm:1214;"+'Retour'+";do:"+"got:121"+";g:"+"amm:121;"+'Hotel'+";g:"+"amo:1221;"+'Taxi ?'+";1;1;0");
  popsApi.sendMessage("grp:"+";g:"+"amo:12211;"+'Infos Taxi'+";1;0;0"+";g:"+"amm:12211;"+'Terminal 2, 22h'+";do:"+"pop:"+'Choix validé !'+";10;1;0;1"+";do:"+"got:1");
  popsApi.sendMessage("grp:"+";g:"+"amm:1221;"+'Oui'+";g:"+"amm:1222;"+'Non'+";do:"+"pop:"+'Choix validé !'+";10;1;0;1"+";do:"+"got:1");
  popsApi.sendMessage("grp:"+";g:"+"amm:1223;"+'Retour'+";do:"+"got:121"+";g:"+"amm:122;"+'Domicile'+";g:"+"amm:123;"+'Retour'+";do:"+"got:11");
  popsApi.sendMessage("grp:"+";g:"+"amm:12;"+'Hébergement'+";g:"+"amm:13;"+'Retour'+";do:"+"got:1"+";g:"+"amm:1;"+'Go');

}

function snl(params) {
var paramsAsArray =params.split(";");
console.log("parameters", paramsAsArray);

var date = paramsAsArray[0];
var time = paramsAsArray[1];
var lat = paramsAsArray[2];
var long = paramsAsArray[3];
var hdop = paramsAsArray[4];
var alt = paramsAsArray[5];
  restApi.posttopartener(['{"lat":',lat,',"lon":',long,'}'].join(''),LOC_URL);
}