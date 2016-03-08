var express = require("express");
var app = express();

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;
//var http = require("http");
//app.set('port',port);
//app.set('ip', ipaddress);

var hostAddress = 'http://' + ipaddress + ':' + port + '/';
var path = require('path');
var connectionString = '127.0.0.1:27017/demo';

var converter = require('./convert.js');
var Data = require('./mongodb.js');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
    console.log(connection_string);
}
mongoose.connect('mongodb://' + connectionString);


//app.use(express.static(__dirname + '/public'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/generate', function (req, res) {
    var longUrl = req.body.url;
    var shortUrl = '';

    // check if url already exists in database
    Data.findOne({long_url: longUrl}, function (err, resultSets) {
        if (resultSets) {
            shortUrl = hostAddress + converter.encodeToBase57(resultSets._id);

            // the document exists, so we return it without creating a new entry
            res.send({'shortUrl': shortUrl});
        } else {
            //create a new url is it doesn't exist
            var newUrl = Data({
                long_url: longUrl
            });

            // save the new link
            newUrl.save(function (err) {
                if (err)
                    console.log(err);
                shortUrl = hostAddress + converter.encodeToBase57(newUrl._id);
                res.send({'shortUrl': shortUrl});
            });
        }
        console.log("shortUrl: " + shortUrl);

    });

});

app.get('/:urlStr', function (req, res) {
    var urlStr = req.params.urlStr;
    var id = converter.decodeFromBase57(urlStr);
    console.log("decodeFromBase57 id:" + urlStr + " : " + id);

    // check if url already exists in database
    Data.findOne({_id: id}, function (err, result) {
        if (err) {
            console.log(err);
            //res.redirect(result.long_url);
        }
        if(result) {
            console.log("decodeFromBase57 result" + result);
            res.redirect(result.long_url);
        } else {
            res.redirect(hostAddress);
        }

    });

});

//http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
//    console.log("✔Express server listening at %s:%d ", app.get('ip'),app.get('port'));
//    //server();
//});
app.listen(port, ipaddress);