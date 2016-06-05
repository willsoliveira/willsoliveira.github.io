var map;
var directionsDisplay;
var directionsService;
var stepDisplay;
var arrayMarcadores = [];
var urlBase = "https://nameless-lowlands-10872.herokuapp.com/ocorrencias/lista/?"
var initialLocation;

function initMap() {
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Create a map and center it on Manhattan.
  var aquidauana = {
    lat: -20.462302,
    lng: -55.791090
  };

  var mapOptions = {
    zoom: 13,
    disableDefaultUI: true,
    scrollwheel: false
  }

  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(function (position) {
         initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         self.map.setCenter(initialLocation);
         self.geolocationDesativada = false;
     });
   } else {
     self.mapa.setCenter(aquidauana);
   }

  map.addListener('tilesloaded', function(){
    var ne = map.getBounds().getNorthEast();
    var sw = map.getBounds().getSouthWest();
    if (urlBase.slice(-1) != "?"){
      urlBase = urlBase + "&";
    }
    caminho = urlBase + "lat=" + ne.lat().toFixed(6) + "&lat=" + sw.lat().toFixed(6) + "&lng=" + ne.lng().toFixed(6) + "&lng=" + sw.lng().toFixed(6);
    console.log(caminho);

    carregaOcorrencias(caminho);
  });

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map
  }
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
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
      var imagem = "https://maps.google.com/mapfiles/ms/icons/" + cores[data[i].tipo - 1] +  "-dot.png";
      console.log(imagem);
      adicionarOcorrencia(map, coordenadas, imagem);
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

function adicionarOcorrencia (map, latLng, imagem){
  var marcador = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: imagem
  });
  arrayMarcadores.push(marcador);
}

function calcRoute(initialLocation, destino) {
  // Retrieve the start and end locations and create
  // a DirectionsRequest using WALKING directions.
  var request = {
      origin: initialLocation,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      console.log("" + response.routes[0].warnings + "");
      directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
}

function showSteps(directionResult) {
  var myRoute = directionResult.routes[0].legs[0];
}

$('#search').keypress(function(e){
  if (e.keyCode == 13){
    var destino = document.getElementById("search").value;
    console.log(destino);
    calcRoute(initialLocation, destino);
  }
});
