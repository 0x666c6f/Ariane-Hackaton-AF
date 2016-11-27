var LOC_URL;
var question;
var RESP_URL;
var reponse;


function snl(params) {
var paramsAsArray =params.split(";");
console.log("parameters", paramsAsArray);

var date = paramsAsArray[0];
var time = paramsAsArray[1];
var lat = paramsAsArray[2];
var long = paramsAsArray[3];
var hdop = paramsAsArray[4];
var alt = paramsAsArray[5];
  popsApi.sendMessage("vib:200;2000");
  popsApi.sendMessage("led:RED;FAST");
  restApi.posttopartener(['{"id":"',imei,'","message":"','Received request for getting location','"}'].join(''),'http://www.displayer.kermit.orange-labs.fr/message');
  restApi.posttopartener(['{"lat":',lat,',"lon":',long,'}'].join(''),LOC_URL);
  popsApi.sendMessage("led:OFF;FIX");
}

function onPost(body) {  popsApi.sendMessage("vib:200;5000");
  question = JSON.parse(body)['value'];
  if (JSON.parse(body)['request'] == 'getLocation') {
    popsApi.sendMessage("gnl:");
    popsApi.sendMessage("led:RED;FAST");
    popsApi.sendMessage("vib:200;500");
  }
  if (JSON.parse(body)['element'] == 'question') {
    // 0 items  1 menus
    popsApi.sendMessage("grp:"+";g:"+"amo:1;"+JSON.parse(body)['value']+";1;1;1"+";g:"+"amm:1;"+reponse+";do:"+"hap:1"+";g:"+"amm:2;"+reponse+";do:"+"hap:1");
    popsApi.sendMessage("grp:"+";g:"+"amm:3;"+reponse+";do:"+"hap:1"+";g:"+"amm:4;"+reponse+";do:"+"hap:1"+";g:"+"amm:5;"+reponse+";do:"+"hap:1");

  }
}

function gac(params) {
var paramsAsArray =params.split(";");
console.log("parameters", paramsAsArray);

var version = paramsAsArray[0];
var state = paramsAsArray[1];
  LOC_URL = 'http://afgo-amsel.rhcloud.com/pops/receiveGeoloc';
  RESP_URL = 'http://afgo-amsel.rhcloud.com/pops/receiveAnswer';
}