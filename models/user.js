var mongodb = require('./db');

function User(user) {
  this.username = user.username;
  this.times=user.times;
};
module.exports = User;
mongodb.close();
User.prototype.save = function save(callback) {
  // 存入 Mongodb 的文檔
  var user = {
    username: this.username,
    times: this.times,
  };

   console.log("save 1");
 mongodb.close();
  mongodb.open(function(err, db) {
  mongodb.authenticate('sa', 'sa', function(err, result) { 
  console.log("save 2");
    if (err) {
      mongodb.close();
      return callback(err);
    }
    // 讀取 users 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 爲 name 屬性添加索引
   console.log("save 3");
      collection.ensureIndex('username', {unique: true});
      // 寫入 user 文檔
      collection.insert(user, {safe: true}, function(err, user) {
       mongodb.close();
       return callback(err, user);
      });
    });
  });
   });
};
User.prototype.update = function update(callback) {
  // 存入 Mongodb 的文檔
  var user = {
    username: this.username,
  };
  console.log("update 1");
mongodb.close();
  mongodb.open(function(err, db) {
      mongodb.authenticate('sa', 'sa', function(err, result) { 
    if (err) {
      mongodb.close();
             console.log("err"+err);
      return callback(err);
    }
    console.log("update 2");
    // 讀取 record 集合
    db.collection('users', function(err, collection) {
      if (err) {
  
        return callback(err);
      }
      console.log("update 3");
      collection.update(user, {$inc: {times:1}}, function(err, user) {
        mongodb.close();
        return callback(err, user);
      });
       });
    });
  });
};
User.get = function get(username, callback) {
  console.log("get1");
mongodb.close();
  mongodb.open(function(err, db) {
    mongodb.authenticate('sa', 'sa', function(err, result) { 
      console.log("get2");
    if (err) {
      mongodb.close();
      //  console.log("err"+err);
      return callback(err);
    }
    // 讀取 users 集合
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        console.log("err"+err);
        return callback(err);
      }
      // 查找 name 屬性爲 username 的文檔
        console.log("get3");
      collection.findOne({username: username}, function(err, doc) {

        if (doc) {
          console.log(doc);
          var user = new User(doc);
    
         return callback(err, user);
        } else {       
   
          return callback(err, null);
        }
      });
         });
    });
  });
};
