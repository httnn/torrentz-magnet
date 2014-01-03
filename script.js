$(document).ready(function() {
    var pathName = location.pathname.replace(/\//g, "");
    var magnetLogoURL = chrome.extension.getURL("icon16.png");
    if(pathName.length === 40) {
        var torrentName = $(".download>h2>span").html().replace(/<[^>]*>/g, "");
        var magnetLink = "magnet:?xt=urn:btih:" + pathName + "&dn=" + encodeURI(torrentName);
        $(".download").children("dl").eq(0).after('<dl><dt><a href="' + magnetLink + '"><span class="u" style="background: transparent url(\'' + magnetLogoURL + '\') no-repeat 5px center;">Magnet</span></a></dt></dl>');
    } else if(pathName.match(/search/i)) {
        $(".results>dl").each(function() {
            var link = $(this).find("dt>a");
            var torrentName = link.html().replace(/<[^>]*>/g, "");
            var infoHash = link.attr("href").replace(/\//g, "");
            var magnetLink = "magnet:?xt=urn:btih:" + infoHash + "&dn=" + encodeURI(torrentName);
            $(this).find("dt").append('<a href="' + magnetLink + '"><img style="float:right;" src="' + magnetLogoURL + '" /></a>');
        });
    }
});