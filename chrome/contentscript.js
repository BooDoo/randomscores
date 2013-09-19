//Inject and run review score randomizer, and then remove it.
var scriptFile = 'reviewnomizer.js'
  , s = document.createElement('script');

s.src = chrome.extension.getURL(scriptFile);
s.onload = function() {
          this.parentNode.removeChild(this);
        };

(document.head||document.documentElement).appendChild(s);
