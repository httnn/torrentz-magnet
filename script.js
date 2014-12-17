var magnetLogoURL = chrome.extension.getURL('icon16.png');

function Torrent(link, name, single) {
	this.link = link;
	this.name = name;
	if(single) {
		this.parseTrackers();
		this.linkElement = document.createElement('dl');
		this.linkElement.innerHTML = '<dt><a href="' + this.getMagnetURI() + '"><span class="u" style="background: transparent url("' + magnetLogoURL + '") no-repeat 5px center;">Magnet</span></a></dt>';
	} else {
		var t = this;
		this.linkElement = document.createElement('a');
		this.linkElement.setAttribute('href', this.getMagnetURI());
		this.linkElement.setAttribute('title', 'Fetching trackers...');
		this.linkElement.style.float = 'right';
		this.linkElement.style.opacity = 0.7;
		this.linkElement.innerHTML = '<img src="' + magnetLogoURL + '" />';
		this.linkElement.addEventListener('mouseover', function () {
			if(!t.trackers)
				t.timeout = setTimeout(function () { t.getTrackers() }, 100);
		});
		this.linkElement.addEventListener('mouseout', function () {
			if(t.timeout)
				clearTimeout(t.timeout);
		});
	}
};

Torrent.prototype = {
	getMagnetURI: function () {
		var trackers = this.trackers ? '&tr=' + this.trackers.join('&tr=') : '';
		return 'magnet:?xt=urn:btih:' + this.getHash() + '&dn=' + encodeURI(this.name) + trackers;
	},
	parseTrackers: function(html) {
		this.trackers = [];
		var doc = html ? (new DOMParser()).parseFromString(html, 'text/html') : document;
		var q = doc.querySelectorAll('.trackers dl dt a');
		for (var i = 0; i < q.length; i++)
			this.trackers.push(q[i].innerText);
	},
	getTrackers: function () {
		var t = this;
		var request = new XMLHttpRequest();
		request.open('GET', this.link, true);
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				t.parseTrackers(request.responseText);
				t.linkElement.setAttribute('href', t.getMagnetURI());
				t.linkElement.setAttribute('title', 'Trackers added!');
				t.linkElement.style.opacity = 1;
			}
		};
		request.send();
	},
	getHash: function () {
		return this.link.replace(/\//g, '');
	}
};

var pathName = location.pathname.replace(/\//g, '');
if (pathName.length === 40) {
	var name = document.querySelector('.download h2 span').innerHTML.replace(/<[^>]*>/g, '');
	var torrent = new Torrent(location.href, name, true);
	document.querySelector('.download dl').insertAdjacentElement('afterend', torrent.linkElement);
} else if (pathName.match(/search/i)) {
	var searchItems = document.querySelectorAll('.results dl');
	for (var i = 0; i < searchItems.length; i++) {
		var currentItem = searchItems[i];
		var link = currentItem.querySelector('dt a');
		var torrent = new Torrent(link.getAttribute('href'), link.innerHTML.replace(/<[^>]*>/g, ''));
		torrent.linkElement = currentItem.querySelector('dt').appendChild(torrent.linkElement);
	}
}