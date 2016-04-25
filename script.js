var magnetLogoURL = chrome.extension.getURL('icon16.png');

function Torrent(link, name, single) {
	this.link = link;
	this.name = name;
	if(single) {
		this.parseTrackers();
		this.linkElement = document.createElement('dl');
		this.linkElement.innerHTML = '<dt><a href="' + this.getMagnetURI() + '"><span class="u magnet" style="background-image:url(' + magnetLogoURL + ');">Magnet</span></a></dt>';
	} else {
		var t = this;
		this.linkElement = document.createElement('span');
		this.linkElement.setAttribute('class', 'm');

		var a = document.createElement('a');
		a.setAttribute('href', this.getMagnetURI());
		a.setAttribute('title', 'Fetching trackers...');
		a.setAttribute('class', 'magnet');
		a.innerHTML = '<img src="' + magnetLogoURL + '" />';
		a.addEventListener('mouseover', function () {
			if(!t.trackers)
				t.timeout = setTimeout(function () { t.getTrackers() }, 100);
		});
		a.addEventListener('mouseout', function () {
			if(t.timeout)
				clearTimeout(t.timeout);
		});

		this.linkElement.appendChild(a);
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
				var a = t.linkElement.querySelector('a');
				a.setAttribute('href', t.getMagnetURI());
				a.setAttribute('title', 'Trackers added!');
				a.style.opacity = 1;
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
	var torrent = new Torrent(pathName, name, true);
	document.querySelector('.download dl').insertAdjacentElement('afterend', torrent.linkElement);
} else if (pathName.match(/search/i)) {
	var searchItems = document.querySelectorAll('.results dl');
	for (var i = 0; i < searchItems.length; i++) {
		var currentItem = searchItems[i];
		var link = currentItem.querySelector('dt a');
		var dd = currentItem.querySelector('dd');
		var torrent;

		if(!link) {
			continue;
		}

		torrent = new Torrent(link.getAttribute('href'), link.innerHTML.replace(/<[^>]*>/g, ''));
		dd.insertBefore(torrent.linkElement, dd.firstChild);
		dd.style.width = (parseInt(window.getComputedStyle(dd).width) + 50) + 'px';
	}
}
