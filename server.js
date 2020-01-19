var express=require("express"),
    app=express(),
    http=require("http"),
    server=http.createServer(app),//creating the http server passing the express object created
    io=require("socket.io")(server),//main module for socket.io and passing the http server
    msg=require("./general.js"),
    bodyparser=require("body-parser"),
    methodOver=require("method-override")
    user=require("./UserClass.js");//exporting the module which contains the User Class and its Schema

//configuration of APP
 app.use(express.static('public'));
 app.use(bodyparser.urlencoded({extended:true}));
 app.set("view engine","ejs");
 app.use(methodOver("_method"));

 var User = new user();//created an instance of User Class

app.get("/",(req,res)=>{

    res.render("index.ejs");//Starting page of Chat-App

});


app.post("/",function(req,res){
    //console.log(req.body.room);
    res.redirect("/"+req.body.room+"/"+req.body.user);//After submitting sending to the message area
});


app.get("/:room/:name",function(req,res){

   var user={
       room:req.params.room ,
       name:req.params.name
   };//using the params value for sending during joining to store in User Schema or Object Array
   //console.log(user);
   res.render("Chat.ejs",{user:user});
});


//Listens for the connection opened
     io.on('connection',function(socket){//Main Function to Listen all the Message from sockets
     // all the customized and defined methods goes here

  socket.on("join",function(user){
//used to join the user into specific room.
      // console.log(user);

       socket.join(user.room);//join the user (predefined-Method)

       User.remove(socket.id);//remove-user-from-User-Object-Array

       User.addUsers(socket.id,user.name,user.room);//Add-User-into-User-Object-Array

      // console.log(User.getList(user.room));

     //using io().emit() to emit everyone in the room and using .to() to send to specific room
     //using socket.broadcast().emit() to emit everyone in the room except you or sender of message and using .to() to send to specific room
    // using socket.emit() to emit to the specific socket only for-example sending welcome msg to only joining user.

       io.to(user.room).emit("List",User.getList(user.room));

       socket.emit("Welcome",msg.greet);

       socket.broadcast.to(user.room).emit("New",msg.joinalert(user.name));

  });
  //method on() to listen to specific message from client using specific title/message/tag

       socket.on("createMessage",function(data){ //used to listen and send general messages
          var user=User.getUser(socket.id);
          data=user.name+": "+data;
          console.log(data);
          io.to(user.room).emit("showMessage",data);
       })

         socket.on("createLoc",function(data){ //used to listen and send location
          var user=User.getUser(socket.id);
          //console.log(user);
           data.name=user.name;
           io.to(user.room).emit("showPos",data);
       })

    socket.on("disconnect",function(){//used to disconnect users.(predefined-one)
        var user=User.remove(socket.id);
        console.log(user);
         if(user)
         {
         io.to(user.room).emit("List",User.getList(user.room));
         io.to(user.room).emit("Welcome",msg.disalert(user.name));
           console.log("user-disconnected");
         }

         })
     });


server.listen(8080,()=>{
    console.log("App started");
    //console.log(msg.greet);
})