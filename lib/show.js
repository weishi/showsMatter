var showGenerator = {

    _site: '',
    _maxEpisode: 25,
    
    setSiteURL: function(siteURL){
        this._site=siteURL;
    },

    populateShow: function(magArray, showid){
        var magList=$('<ul/>');
        magArray.sort(function(a,b){
            var adate=parseDate($(a).find('td:nth-child(4)').html());
            var bdate=parseDate($(b).find('td:nth-child(4)').html());
            return bdate-adate;
        });
        for(var i=0;i<magArray.length;i++){
            var row=$(magArray[i]);
            var url=row.find('a[href*="magnet:"]').attr('href');
            var date=row.find('td:nth-child(4)').html();
            var ago=moment(date, "DD/MM/YYYY").subtract('day',1).hours('18').fromNow();
            var seed=row.find('td:nth-child(5)').html();
            var titleStr=row.find('a[title]').html();
            var title=$('<span/>', {
                title: "Date: "+ date + " | Seed: " + seed,
                text: titleStr + " | "+ ago, 
                class: "episodeTitle"
            });
            var mag=$('<img/>', {
                title: url,
                src: "images/download.png",
                class: "episodeAction"
            });
            if(showHistory.contains(titleStr)){
                mag.attr('src','images/downloaded.png');
            }
            mag.data('url', url);
            mag.data('title', titleStr);
            mag.on('click', function(event){
                $(this).attr('src','images/loading.gif');
                $(this).unbind('click');
                showHistory.add($(this).data('title'));
                var ctx=this;
                var thisURL=$(this).data('url');
                xunleiLixian.addTask(thisURL, function(){
                    $(ctx).attr('src','images/done.png');
                });
            });
            var maglink = $('<li/>', {
             class: "episodeEntry"
            }).append(mag).append(title);
            magList.append(maglink);
            magList.hide();
        }
        $('#show'+showid.toString()).append(magList);
    },

    requestShow: function (show, showid) {
        var magArray=[];
        var tokens=[];
        for(var ep=1; ep<this._maxEpisode;ep++){
            var token = $.Deferred();
            var epStr=sprintf('S%02uE%02u',parseInt(show.showSeason),ep);
            tokens.push($.get(this._site, {
                page: "torrents",
                active: "1",
                category: "7",
                search: show.showTitle+ " 720p publichd " + epStr
                },
                function (data) {
                    var doc = document.implementation.createHTMLDocument('');
                    doc.documentElement.innerHTML = data;
                    var links = $(doc).find('a[href*="magnet:"]').closest('tr');
                    if(links.length>0){
                        links.sort(function(a,b){
                            var aseed=parseInt($(a).find('td:nth-child(5)').html());
                            var bseed=parseInt($(b).find('td:nth-child(5)').html());
                            return bseed-aseed;
                        });
                        magArray.push(links[0]);
                    }
                }
            ))
        }
        /* Wait until all async calls finish */
        $.when.apply($,tokens).then(function() {
            $('li#show'+showid.toString()+' img.showAction').attr('src','images/remove.png');
            showGenerator.populateShow(magArray,showid);
        },function(e) {
            $('#query').show();
        });
    },

};


var showHistory={
    add: function(title){      
        if(!showHistory.contains(title)){
            var history = showHistory.get();
            history.push(title);
            localStorage['history']=JSON.stringify(history);
        }

    },

    get: function () {
        var history = localStorage["history"];
        if (history == "" || typeof history == 'undefined') {
            return [];
        } else {
            return JSON.parse(history);
        }
    },

    contains: function(title){
        var history=showHistory.get();
        for(var i=0; i<history.length;i++){
            if(history[i]==title){
                return true;
            }
        }
        return false;
    },

    clear: function(){
        localStorage['history']="";
    }
};

var myShows = {

    init: function (siteURL){
        showGenerator.setSiteURL(siteURL);
    },

    load: function () {
        var savedShows = myShows.get();
        $("li").remove();
        for (var i = 0; i < savedShows.length; i++) {
            var showEntry = myShows.makeShow(savedShows[i], i);
            $("ul").append(showEntry);
            showGenerator.requestShow(savedShows[i],i);
        }
    },

    add: function () {
        var $inputs = $('#newShow :input');
        var newShow = {};
        $inputs.each(function() {
            newShow[this.name] = $(this).val();
        });
        myShows.put(newShow);
    },

    put: function (show) {
        var savedShows = myShows.get();
        savedShows.push(show);
        localStorage["savedShows"] = JSON.stringify(savedShows);
        myShows.load();
    },

    get: function () {
        var savedShows = localStorage["savedShows"];
        if (savedShows == "" || typeof savedShows == 'undefined') {
            return [];
        } else {
            return JSON.parse(savedShows);
        }
    },

    remove: function(i){
        var savedShows = myShows.get();
        savedShows.splice(i,1);
        localStorage["savedShows"] = JSON.stringify(savedShows);
        myShows.load();
    },

    clear: function(){
        localStorage["savedShows"]="";
        myShows.load();
    },

    makeShow: function(show, i){
        var title=$('<span/>', {
            text: show.showTitle,
            class: "showTitle"
        });
        var season=$('<span/>', {
            text: "Season " + show.showSeason,
            class: "showSeason"
        });
        var showhide=$('<img/>', {
            src: 'images/expand.png',
            class: "showhide"
        });
        showhide.on('click', function(event){
            $(this).closest('li').find('ul').toggle('fast','swing',function(){
                if($(this).is(':visible')){
                    $(this).siblings('div.showEntry')
                .children('img.showhide').attr('src','images/collapse.png');
                }else{
                    $(this).siblings('div.showEntry')
                .children('img.showhide').attr('src','images/expand.png');
                }
            });
        });
        var removeBtn=$('<img/>',{
            src: "images/loading.gif",
            class: "showAction"
        });
        removeBtn.on('click', function(event){
            myShows.remove(i);
        });
        var result=$('<li/>', {
            id: 'show'+i.toString(),
        }).append(
            $('<div/>', {class: 'showEntry'}).append(removeBtn).append(title).append(season).append(showhide)
        );
        return result;
    }
};
