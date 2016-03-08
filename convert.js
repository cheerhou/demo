var alphabet =  "abcdefghijklmnopqrstuvwxyz" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                "0123456789";
var maxLength = alphabet.length;

function encode(dbId){
    var encodedId = "";
    while (dbId){
        var remainder = dbId % maxLength;
        dbId = Math.floor(dbId / maxLength);
        encodedId = alphabet[remainder].toString() + encodedId;
    }
    return encodedId;
}

function decode(urlId){
    var decodedId = 0;
    while (urlId){
        var index = alphabet.indexOf(urlId[0]);
        var power = urlId.length - 1;
        decodedId += index * (Math.pow(maxLength, power));
        urlId = urlId.substring(1);
    }
    return decodedId;
}

module.exports.encode = encode;
module.exports.decode = decode;