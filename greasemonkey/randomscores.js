// ==UserScript==
// @name          Reviewomizer
// @namespace     http://whistling-fish.org
// @description   Randomize review scores
// @include       http://*.polygon.com/
// ==/UserScript==
//Polygon review score randomizer:

var scoreRadials = $('div.review_meta > div.review_score, .review_score > em.score'),
    scoreLabels = $('div.score > strong'),
    scores = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

function makeScoreString(score) {
  var scoreString = score.toString();
  scoreString = scoreString.substr(0, scoreString.length-1) + '.' + scoreString.substr(-1);
  return scoreString;
}

function randomizeScores() {
  $(scoreRadials).each(function (i) {
    var lastClassIndex = this.classList.length-1,
        lastClass = this.classList[lastClassIndex],
        newScore = scores[Math.floor(Math.random() * scores.length)]
    $(this).removeClass(this.classList[lastClassIndex]);
    $(this).addClass("score_" + newScore);
    if (i < scoreLabels.length) {
      $(scoreLabels[i]).text(makeScoreString(newScore));
    }
  });
}

randomizeScores();
setInterval(randomizeScores, 60000*5); //randomize scores every 5 minutes