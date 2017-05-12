var mongoose = require('mongoose');

module.exports = function (user, password, cluster, db, callback) {
    var url = 'mongodb://' + user + ':' + password + '@' + cluster.join(',') + '/' + db + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
    mongoose.connect(url, function (error, database) {
        if (error) {
            console.log(error);
        } else {
            callback();
        }
    });
};