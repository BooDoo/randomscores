//Metacritic Score Randomizer
//TODO:
// - Monitor for DOMMutationEvents to catch hover scores
// - Closure/Self-executing function?
// - Track state in boolean / Catch intervalID so behavior can be toggled

function randomMetascore(scoreType, target) {
  var score = Math.floor(Math.random()*100),
      displayScore = score,
      classes;
      
  if (target) {
    classes = $(target).attr("class");
    classes = classes.substr(0, classes.lastIndexOf("_") + 1);
  }
      
  if (scoreType === "crit") {
    classes = classes || "review_grade critscore critscore_";
  }
  else if (scoreType === "avguser") {
    classes = classes || "data avguserscore avguserscore_";
    displayScore = score < 100 ? String.prototype.substr.call((score / 10) + ".0", 0, 3) : 10;
  }
  else if (scoreType === "user") {
    classes = classes || "review_grade userscore userscore_";
    displayScore = Math.round(score / 10);
  }
  else if (scoreType === "text") {
    classes = classes || "data textscore textscore_";
  }
  else {
    classes = classes || "data metascore score_";
  }
  
  if (score < 41) {
    classes += "terrible";
  }
  else if (score < 62) {
    classes += "mixed";
  }
  else if (score < 81) {
    classes += "favorable";
  }
  else {
    classes += "outstanding";
  }
  
  return {"score": displayScore, "classes": classes};
}

function getMetascore(target) {
  var meta = {};
  target = $(target);

  meta.score = target.text().trim();
  meta.classes = target.attr("class");
  
  return meta;
}

function setDefaultMetascore() {
  var target = $(this),
      meta = randomMetascore("default", target),
      wrap = target.closest("span.product_wrap"),
      wrapHeight = Math.floor(120 + ((meta.score / 100) * 120));
  
  if (wrapHeight < 160) { 
    wrapHeight = 160;
  }
  
  target.text(meta.score).attr("class", meta.classes);
  wrap.height(wrapHeight).data("height", wrapHeight); //only applies to scores with graph view
  
  return target;
}

function setScoreValue(target, type) {
  var meta = randomMetascore(type || "default", target);
      
  target.text(meta.score).attr("class", meta.classes);
  
  return target;
}

function setSummaryMetascore() {
  var target = $(".data.metascore", $(this)),
      meta = randomMetascore("default", target);
      
  target.attr("class", meta.classes);
  $(".score_value", target).text(meta.score);
      
  return $(this);
}

function setHoverMetascore() {
  return setScoreValue($(this), "default");
}

function setHoverAvguserscore() {
  return setScoreValue($(this), "avguser");
}

function setDefaultUserscore() {
  return setScoreValue($(this), "user");
}

function setDefaultCritscore() {
  return setScoreValue($(this), "crit");
}

function setDefaultAvguserscore() {
  return setScoreValue($(this), "avguser");
}

function randomizeMetacritic() {
  var defaultMetascoreSelector = "span.data.metascore, div.data.metascore, li.product .data.metascore",
      summaryMetascoreSelector = ".score_summary.metascore_summary", //big number at top
      hoverMetascoreSelector = ".hover_metascore_wrap div.data.metascore",
      hoverAvguserscoreSelector = ".hover_userscore_wrap div.data.avguserscore",
      defaultUserscoreSelector = ".review_grade.userscore, .data.userscore",
      defaultCritscoreSelector = ".review_grade.critscore, .data.critscore",
      defaultAvguserscoreSelector = ".data.avguserscore",
      removalSelector = ".score_counts, .review_helpful, .summary";
  
  $(removalSelector).remove();
  
  $(defaultMetascoreSelector).not($(summaryMetascoreSelector).find(defaultMetascoreSelector)).each(setDefaultMetascore);
  $(summaryMetascoreSelector).each(setSummaryMetascore);
  $(hoverMetascoreSelector).each(setHoverMetascore);
  $(hoverAvguserscoreSelector).each(setHoverAvguserscore);
  $(defaultUserscoreSelector).each(setDefaultUserscore);
  $(defaultCritscoreSelector).each(setDefaultCritscore);
  $(defaultAvguserscoreSelector).each(setDefaultAvguserscore);
}

randomizeMetacritic();
setInterval(randomizeMetacritic, 60000*5); //randomize scores every 5 minutes