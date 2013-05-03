function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month, date)
  // input dd/mm/yyyy
  return new Date(parts[2], parts[1]-1, parts[0]); // months are 0-based
};



document.addEventListener('DOMContentLoaded', function () {
    
    $('.warning').hide();
    $('#add').click(myShows.add);
    $('#clear').click(myShows.clear);

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