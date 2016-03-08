var alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";
var maxLength = alphabet.length;

function encodeToBase57(indexNum){
    var encodedString = "";
    while (indexNum){
        var remainder = indexNum % maxLength;
        indexNum = Math.floor(indexNum / maxLength);
        encodedString = alphabet[remainder].toString() + encodedString;
    }
    return encodedString;
}

function decodeFromBase57(urlString){
    var decoded = 0;
    while (urlString){
        var index = alphabet.indexOf(urlString[0]);
        var power = urlString.length - 1;
        decoded += index * (Math.pow(maxLength, power));
        urlString = urlString.substring(1);
    }
    return decoded;
}

module.exports.encodeToBase57 = encodeToBase57;
module.exports.decodeFromBase57 = decodeFromBase57;