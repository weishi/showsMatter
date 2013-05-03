function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month, date)
  // input dd/mm/yyyy
  return new Date(parts[2], parts[1]-1, parts[0]); // months are 0-based
};


var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-40619774-1']);
_gaq.push(['_trackPageview']);

(function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
          var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

document.addEventListener('DOMContentLoaded', function () {
    
    $('.warning').hide();
    $('#add').click(myShows.add);
    $('#clear').click(myShows.clear);

    myShows.init(localStorage["siteURL"]);
    myShows.load();

    if(typeof localStorage["xlUsername"] !== 'undefined' && localStorage["xlUsername"]!=""){
        xunleiLixian.login(
            localStorage["xlUsername"],
            localStorage["xlPassword"],
            function(){
                $('#login').fadeOut('slow');
            }
        );
    }else{
        $('#login').hide();
        $('.warning#credential').fadeIn('slow');
    }

});
