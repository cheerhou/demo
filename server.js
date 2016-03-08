var express = require("express");
var app = express();

var mongoose = require("mongoose");

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;

var hostAddress = "http://" + ipaddress + ":" + port + "/";
var connectionString = "127.0.0.1:27017/demo";

var Converter = require('./convert.js');
var Data = require('./mongodb.js');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect('mongodb://' + connectionString);
console.log("You are connected to: " + connectionString);

app.use(express.static(__dirname + '/public'));

//app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', function(req, res){
//    res.sendFile(path.join(__dirname, 'index.html'));
//});

app.post('/api/generate', function (req, res) {
    var longUrl = req.body.url;
    var shortUrl = '';

    // check if url already exists in database
    Data.findOne({long_url: longUrl}, function (err, resultSets) {
        if (resultSets) {
            shortUrl = hostAddress + Converter.encode(resultSets._id);
            res.send({'shortUrl': shortUrl});
        } else {
            var newUrl = Data({long_url: longUrl});

            newUrl.save(function (err) {
                if (err)
                    console.log(err);
                shortUrl = hostAddress + Converter.encode(newUrl._id);
                res.send({'shortUrl': shortUrl});
            });
        }
        console.log("encode shortUrl is : " + shortUrl);
    });

});

app.get('/:urlId', function (req, res) {
    var urlId = req.params.urlId;
    var id = Converter.decode(urlId);
    console.log("decode id is " + id + " ,from " + urlId);

    Data.findOne({_id: id}, function (err, result) {
        if (err) {
            console.log(err);
        } else {

            if (result) {
                console.log("db records with id " + id + " : " + result);
                res.redirect(result.long_url);
            } else {
                res.redirect(hostAddress);
            }
        }

    });

});

app.listen(port, ipaddress);