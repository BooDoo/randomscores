//Polygon review score randomizer
//TODO:
// - Closure/Self-executing function?
// - Track state in boolean / Catch intervalID so behavior can be toggled

var scoreRadials = $('div.review_meta > div.review_score, .review_score > em.score'),
    scoreLabels = $('div.score > strong'),
    scores = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

function makeScoreString(score) {
  var scoreString = score.toString();
  scoreString = scoreString.substr(0, scoreString.length-1) + '.' + scoreString.substr(-1);
  return scoreString;
}

function randomizePolygon() {
  $(scoreRadials).each(function (i) {
    var lastClassIndex = this.classList.length-1,
        lastClass = this.classList[lastClassIndex],
        newScore = scores[Math.floor(Math.random() * scores.length)]
    $(this).removeClass(this.classList[lastClassIndex]);
    $(this).addClass("score_" + newScore);
    if (i < scoreLabels.length) {
      $(scoreLabels[i]).text(makeScoreString(newScore));
      console.log($(scoreLabels[i]).text());
    }
  });
}

randomizePolygon();
setInterval(randomizePolygon, 60000*5); //randomize scores every 5 minutes