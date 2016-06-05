var mapa;
var mapaDiv = document.getElementById('map');
var arrayMarcadores = [];
var urlBase = "http://nameless-lowlands-10872.herokuapp.com/ocorrencias/lista/?"

function initMap() {
  var aquidauana = {
    lat: -20.462302,
    lng: -55.791090
  };

  mapa = new google.maps.Map(mapaDiv, {
    disableDefaultUI: true,
    scrollwheel: false,
    zoom: 15
  });

  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         self.mapa.setCenter(initialLocation);
         self.geolocationDesativada = false;
     });
   } else {
     self.mapa.setCenter(aquidauana);
   }

  mapa.addListener('tilesloaded', function(){
    var ne = mapa.getBounds().getNorthEast();
    var sw = mapa.getBounds().getSouthWest();
    if (urlBase.slice(-1) != "?"){
      urlBase = urlBase + "&";
    }
    caminho = urlBase + "lat=" + ne.lat().toFixed(6) + "&lat=" + sw.lat().toFixed(6) + "&lng=" + ne.lng().toFixed(6) + "&lng=" + sw.lng().toFixed(6);
    console.log(caminho);

    carregaOcorrencias(caminho);
  });
}

function carregaOcorrencias(caminho){
  limpaMarcadores();
  $.ajax({
    url: caminho
  }).then(function(data){
    for (i = 0; i < data.length; i++){
      var coordenadas = {
        lat: Number(data[i].latitude),
        lng: Number(data[i].longitude)
      };
      var cores = ["red", "orange", "purple"];
      console.log(data.tipo);
      var imagem = "http://maps.google.com/mapfiles/ms/icons/" + cores[data[i].tipo - 1] +  "-dot.png";
      console.log(imagem);
      adicionarOcorrencia(mapa, coordenadas, imagem);
    }
    console.log(arrayMarcadores.length);
  });
}

function limpaMarcadores(){
  for (var i = 0; i < arrayMarcadores.length; i++){
    arrayMarcadores[i].setMap(null);
  }
  arrayMarcadores.length = 0;
}

function adicionarOcorrencia (mapa, latLng, imagem){
  var marcador = new google.maps.Marker({
    position: latLng,
    map: mapa,
    icon: imagem
  });
  arrayMarcadores.push(marcador);
}

function buscarRotas(){
  if (event.keyCode == 13){
    var destino = document.getElementById("search").value;
    alert(destino);
    calcRoute();
  }
}
