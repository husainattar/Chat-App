//using static db rather than dynamic-db.
//Schema or Class which can be used to store Users Data.

var User = class User
{
    constructor()
    {
      this.users=[];
    }

    addUsers(id,name,room){
        var user={id,name,room};
        this.users.push(user);
        return user;
    }


    getUser(id){
        var sender={};
       this.users.forEach(function(user){
            if(user.id === id)
            {
                sender=user;
            };
        });
        return sender;
    }

  remove(id){
        var user=this.getUser(id);
        if(user)
        {
           this.users= this.users.filter((user)=>user.id!==id);
        }
        return user;
    }
    getList(room){

        var activeusers=[] ;

        this.users.forEach(function(user){
            if(user.room === room)
            {
                activeusers.push(user);
            };
        });

        var names=[];

        activeusers.forEach(function(user){
            names.push(user.name);
        })

        return names;
    }

}

module.exports = User;
