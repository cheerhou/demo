//(function() {
//    angular
//        .module("ShortenerApp", [])
//        .controller("ShortenerController", ShortenerController);
//
//    function ShortenerController($scope) {
//        $scope.generate = generate;
//
//        function generate(longUrl) {
//            console.log("long url is " + longUrl);
//            //$http.post("/api/generate", longUrl)
//            //    .success(function(response){
//            //        $scope.longUrl = response;
//            //    });
//        }
//    }
//}) ();

$('button').on('click', function(){

    $.ajax({
        url: '/api/generate',
        type: 'POST',
        dataType: 'JSON',
        data: {url: $('#longUrl').val()},
        success: function(data){
            var resultHTML = '<a class="result" href="' + data.shortUrl + '">'
                + data.shortUrl + '</a>';
            $('#shortUrl').html(resultHTML);
        }
    });

});