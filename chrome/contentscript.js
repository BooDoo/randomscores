//Inject and run review score randomizer, and then remove it.
var s = document.createElement('script');
	s.src = chrome.extension.getURL('randomscores.js');
	s.onload = function() {
		this.parentNode.removeChild(this);
	};
(document.head||document.documentElement).appendChild(s);