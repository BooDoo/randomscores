//Inject and run review score randomizer, and then remove it.
var polygonRE = /polygon\.com/ig,
    metacriticRE = /metacritic\.com/ig,
    scriptFile;

if (polygonRE.test(document.location.href)) {
    scriptFile = "polygon.js";
}

if (metacriticRE.test(document.location.href)) {
    scriptFile = "metacritic.js";
}

var s = document.createElement('script');
	s.src = chrome.extension.getURL(scriptFile);
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
(document.head||document.documentElement).appendChild(s);
