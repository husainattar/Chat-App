
var socket=io();

socket.on('connect',function(){
   var user={
       name :"<%= user.name %>",
       room :"<%= user.room %>"
   };
   console.log(user);
   socket.emit("join",user);
   console.log("User connected on client");
});

socket.on("List",function(users){
    var ol=$('<ol></ol>');
   console.log(users);
    users.forEach(function(user){
        ol.append($('<li></li>').text(user));
    });
  console.log(users);
    $("#List").html(ol);
});

socket.on("Welcome",function(data){
    alert(data);
});

socket.on("New",function(data){
    alert(data);
});

//sends Messages
$("#submit").click(function(e){

   e.preventDefault();
   var message=$("#exampleInputEmail1").val();
   socket.emit("createMessage",message);
   $("#exampleInputEmail1").val("");
});

socket.on("showMessage",function(data){
    var li=$('<li></li>');
    li.text(data);
    $("#msgs").append(li);
});


//Sends Location
$("#submitLoc").click(function(e){
   e.preventDefault();
    geoLocation();
});

socket.on("showPos",function(position){
    var li=$('<li></li>');
    var a=$('<a target="_blank" > My Current Location</a>');
    console.log(position);
    const latitude  = position.lat;
    const longitude = position.long;
    a.attr('href',`https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`);
    li.text(position.name+"  Location is:");
    li.append(a);
    $("#msgs").append(li);
    document.querySelector('#submitLoc').textContent = 'Send Location';
});


function geoLocation() {

  const status = document.querySelector('#submitLoc');

  function success(position) {
  pos={
      lat:position.coords.latitude,
      long:position.coords.longitude
  };
    socket.emit("createLoc",pos);
  }
  function error() {
    status.textContent = 'Unable to retrieve your location';
  }

  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by your browser';
  } else {
    status.textContent = 'Sending….';
    navigator.geolocation.getCurrentPosition(success, error);
  }

}


socket.on('disconnect',function(){
    console.log("Disconnected-from-server");
});

