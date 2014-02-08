try {
	var pathName = location.pathname.replace(/\//g, "");
	var magnetLogoURL = chrome.extension.getURL("icon16.png");
	if(pathName.length === 40) {
		var torrentName = document.querySelector(".download>h2>span").innerHTML.replace(/<[^>]*>/g, "");
		var magnetLink = "magnet:?xt=urn:btih:" + pathName + "&dn=" + encodeURI(torrentName);
		document.querySelector(".download dl").insertAdjacentHTML("afterend", '<dl><dt><a href="' + magnetLink + '"><span class="u" style="background: transparent url(\'' + magnetLogoURL + '\') no-repeat 5px center;">Magnet</span></a></dt></dl>');
	} else if(pathName.match(/search/i)) {
		var searchItems = document.querySelectorAll(".results>dl");
		for(var i = 0; i < searchItems.length; i++) {
			var currentItem = searchItems[i];
			var link = currentItem.querySelector("dt>a");
			var torrentName = link.innerHTML.replace(/<[^>]*>/g, "");
			var infoHash = link.getAttribute("href").replace(/\//g, "");
			var magnetLinkURI = "magnet:?xt=urn:btih:" + infoHash + "&dn=" + encodeURI(torrentName);
			currentItem.querySelector("dt").innerHTML += '<a href="' + magnetLinkURI + '"><img style="float:right;" src="' + magnetLogoURL + '" /></a>';
		}
	}
} catch(e) {}