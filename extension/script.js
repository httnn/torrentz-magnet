var magnetLogoURL = chrome.extension.getURL('icon16.png');

function Torrent(hash, name, trackers) {
	this.hash = hash;
	this.name = name;
	this.trackers = trackers || [];
};

Torrent.prototype = {
	getMagnetURI: function () {
		var trackers = this.trackers.length > 0 ? '&tr=' + this.trackers.join('&tr=') : '';
		return 'magnet:?xt=urn:btih:' + this.hash + '&dn=' + encodeURI(this.name) + trackers;
	},
	getLink: function (link) {
		var a = document.createElement('a');
		a.innerHTML = '<img style="float:right;" src="' + magnetLogoURL + '" />';
		a.setAttribute('href', this.getMagnetURI());
		a.addEventListener('mouseover', function () {
/*			getTrackers(link, function (t) {
				console.log(t);
			});*/
		}, false);
		console.log(a);
		return a;
	}
};

function getTrackers(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function() {
		if (request.status >= 200 && request.status < 400){
			var trackers = [];
			var parser = new DOMParser();
			var t = parser.parseFromString(request.responseText, 'text/html').querySelectorAll('.trackers dl dt a');
			for (var i = 0; i < t.length; i++)
				trackers.push(t[i].innerText);
			
			callback(trackers);
	  	}
	};
	request.send();
};

var pathName = location.pathname.replace(/\//g, '');
if (pathName.length === 40) {
	var torrentName = document.querySelector('.download h2 span').innerHTML.replace(/<[^>]*>/g, '');
	var magnetLink = 'magnet:?xt=urn:btih:' + pathName + '&dn=' + encodeURI(torrentName);
	document.querySelector('.download dl').insertAdjacentHTML('afterend', '<dl><dt><a href="' + magnetLink + '"><span class="u" style="background: transparent url("' + magnetLogoURL + '") no-repeat 5px center;">Magnet</span></a></dt></dl>');
} else if (pathName.match(/search/i)) {
	var searchItems = document.querySelectorAll('.results dl');
	for (var i = 0; i < searchItems.length; i++) {
		var currentItem = searchItems[i];
		var link = currentItem.querySelector('dt a');
		var torrent = new Torrent(link.getAttribute('href').replace(/\//g, ''), link.innerHTML.replace(/<[^>]*>/g, ''));
		currentItem.querySelector('dt').appendChild(torrent.getLink(link.getAttribute('href')));
	}
}