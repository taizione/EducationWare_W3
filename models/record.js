var mongodb = require('./db');

function Record(username,coursename,times,dates) {
  this.user = username;
  this.coursename=coursename;
  this.times=times;
  this.dates=dates;
};


module.exports = Record;

Record.prototype.save = function save(callback) {
  // 存入 Mongodb 的文檔
  var record = {
    user: this.user,
    coursename: this.coursename,
    times: 1,
    dates:new Date(),

  };
  mongodb.open(function(err, db) {
    mongodb.authenticate('sa', 'sa', function(err, result) {
    if (err) {
      return callback(err);
    }
    // 讀取 record 集合
    db.collection('records', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 爲 name 屬性添加索引
      collection.ensureIndex({"user": 1, "coursename": 1 }, {unique: true});

      //如果和符合索引相同的值已经存在

      collection.insert(record, {safe: true}, function(err, record) {
        mongodb.close();
        callback(err, record);
      });
       });
    });
  });
};

Record.prototype.update = function update(callback) {
  // 存入 Mongodb 的文檔
  var record = {
    user: this.user,
    coursename: this.coursename,
  };
  console.log("coursename"+this.coursename);
  mongodb.open(function(err, db) {
     mongodb.authenticate('sa', 'sa', function(err, result) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    // 讀取 record 集合
    db.collection('records', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      console.log("here");
      collection.update(record, {$inc: {times:1}, $set:{dates:new Date()}}, function(err, record) {
          console.log("there");
        mongodb.close();
        callback(err, record);
      });
       });
    });
  });
};

Record.get = function get(username,coursename, callback) {
 mongodb.close();
  mongodb.open(function(err, db) {
     mongodb.authenticate('sa', 'sa', function(err, result) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    // 讀取 posts 集合
    db.collection('records', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      var query = {};
      if (username) {
        query.user = username;
        query.coursename=coursename;
      }
      collection.findOne(query,function(err, doc) {
        mongodb.close();
        if (doc) {
          // 封裝文檔爲 User 對象
          var record = new Record(doc);
        
          callback(err, record);
        } else {
         
          callback(err, null);
        }
      });
      });
    });
  });
};


Record.calculateTimes = function calculateTimes(callback) {
mongodb.close();
mongodb.open(function(err, db) {
     mongodb.authenticate('sa', 'sa', function(err, result) {
    if (err) {
      mongodb.close();
      return callback(err);
    }


    // 讀取 posts 集合
    db.collection('records', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
    //聚合查询
    collection.aggregate([
        { $group: {
            _id: "$coursename",
            total: { $sum: "$times"  }
        }}
    ], function (err, docs) {
        if (err) {
            console.log(err);
            mongodb.close();
            return;
        }
        var results = {};
        docs.forEach(function(doc, index) {
          results[doc._id]=doc.total;
        });

         callback(null, results);
    });
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      
    });
  });
       });
}
 

Record.list = function list(username,callback) {
mongodb.close();
  mongodb.open(function(err, db) {
    mongodb.authenticate('sa', 'sa', function(err, result) {
    if (err) {
      mongodb.close();
      return callback(err);
    }
    // 讀取 posts 集合
    db.collection('records', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 查找 user 屬性爲 username 的文檔，如果 username 是 null 則匹配全部
      var query = {};
      console.log("username")+username;
      if (username) {
        query.user = username;
      }
      collection.find(query).sort({coursename: -1}).toArray(function(err, docs) {
        mongodb.close();
        if (err) {
          mongodb.close();
          callback(err, null);
        }
        // 封裝 posts 爲 Post 對象
        var records = [];
        docs.forEach(function(doc, index) {
          var record = new Record(doc.username,doc.coursename,doc.times,doc.dates);
          records.push(record);
          console.log("record"+record.username+record.coursename+record.times);
        });
        mongodb.close();
        callback(null, records);
 
      });
    });
  });
});
}