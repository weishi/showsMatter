var options={
    load: function(){
        $('#xlUsername').val(localStorage["xlUsername"]);
        $('#xlPassword').val(localStorage["xlPassword"]);
        $('#siteURL').val(localStorage["siteURL"]);
    },

    save: function(){
        localStorage["xlUsername"]=$('#xlUsername').val();
        localStorage["xlPassword"]=$('#xlPassword').val();
        localStorage["siteURL"]=$('#siteURL').val();
    }
};


document.addEventListener('DOMContentLoaded', function () {
    $('#saveNotifier').hide();
    $('#clearNotifier').hide();
    options.load();
    $('#saveCredential').click(function(){
        options.save();
        $('#saveNotifier').show().fadeOut(3000);
    });
    $('#clearHistory').click(function(){
        showHistory.clear();
        $('#clearNotifier').show().fadeOut(3000);
    });
});
