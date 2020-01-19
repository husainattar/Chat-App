var messages={
    greet:"Welcome To The Chat App",

    joinalert: function(user){
        return user+"  Joined The Chat";
    },

    disalert: function(user){
        return user+"  Disconnect The Chat";
    }
};

module.exports=messages;