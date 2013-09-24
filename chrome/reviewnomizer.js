// TODO: 
// - Track state in boolean / Catch intervalID so behavior can be toggled

(function randomizeScores() {
  //Does what it says on the tin
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  //Make score within (inclusive) min, max range [increment by decimal value, force trailing 0]
  function getRandomScore(min, max, step, tail) {
    if (typeof min !== "number")
      {min = 0;}
    if (typeof max !== "number")
      {max = 10;}
    if (typeof step !== "number")
      {step = 0;}
    
    var score = getRandomInt(min,max)
      , factor;
    
    if (step && score < max) {
      var factor = 1/step;
      score += getRandomInt(0,factor-1) / factor;
    }
    
    if (tail && score % 1 === 0) {
      score = score + '.' + Array(tail+1).join('0');
    }
    
    return score;
  }

  //Randomize Polygon
  function doPolygon($) {

    var scoreRadials = $('div.review_meta > div.review_score, .review_score > em.score, a.block_img > em.score')
      , scoreLabels = $('div.score > strong');

    Array.prototype.forEach.call(scoreRadials, function (el,n) {
      var lastClassIndex = el.classList.length-1
        , lastClass = el.classList[lastClassIndex]
        , newScore = getRandomScore(1,10,.5,true);
      
      el.classList.remove(lastClass);
      el.classList.add("score_" + newScore*10);
      
      if (n < scoreLabels.length) {
        scoreLabels[n].textContent = newScore;
      } //what's this about?
      
    });
  }
  
  //Randomize IGN
  function doIGN($) {
    var breakdown = $('.breakdown-box-body')[0]
      , scoreBoxes = $('.scoreBox')
      , ratingRows = $('.ratingRow')
      , phrases = 
        [
          "Disaster",
          "Unbearable",
          "Painful",
          "Awful",
          "Bad",
          "Mediocre",
          "OK",
          "Good",
          "Great",
          "Amazing",
          "Masterpiece"
        ]
      , bigScore = getRandomScore(0,10,.1)
      , bigPhrase = phrases[Math.floor(bigScore)];
    
    $('.editorsChoice').hide();
    
    if (breakdown) {
      $('.score.value').text(bigScore);
      $('.score-text').text(bigPhrase);
    }
    
    Array.prototype.forEach.call(scoreBoxes, function(el) {
      var newScore = getRandomScore(0,10,.1)
        , newPhrase = phrases[Math.floor(newScore)];
        
      $('.scoreBox-score', el).text(newScore);
      $('.scoreBox-scorePhrase', el).text(newPhrase);
    });
    
    Array.prototype.forEach.call(ratingRows, function(el) {
      var newScore = getRandomScore(0,10,.1)
        , newPhrase = phrases[Math.floor(newScore)]
        , sliderPos = (newScore * 25) - 5;;
      
      $('.ratingValue',el).text(newScore)
      $('.ratingText',el).text(newPhrase)
      
      if ($(el).hasClass('userRating')) {
        $('.ratings-scrubber-fill').css('width', sliderPos);
        $('.ratings-scrubber-slider').css('left', sliderPos);
      }
    })
    
  }
  
  //Randomize MetaCritic
  // TODO: 
  // - Monitor for DOMMutationEvents to catch hover scores?
  // - Abstract away from jQuery?
  function doMetacritic($) {
    function randomMetascore(scoreType, target) {
      var score = getRandomInt(0,100),
          displayScore = score,
          classes;
          
      if (target) {
        //Strip class string to last occurence of "_" (inclusive)
        classes = target.attr('class');
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

    function setDefaultTextscore() {
      return setScoreValue($(this), "text");
    }

    (function randomizeMetacritic() {
      var defaultMetascoreSelector = "span.data.metascore, div.data.metascore, li.product .data.metascore",
          summaryMetascoreSelector = ".score_summary.metascore_summary", //big number at top
          hoverMetascoreSelector = ".hover_metascore_wrap div.data.metascore",
          hoverAvguserscoreSelector = ".hover_userscore_wrap div.data.avguserscore",
          defaultUserscoreSelector = ".review_grade.userscore, .data.userscore",
          defaultCritscoreSelector = ".review_grade.critscore, .data.critscore",
          defaultAvguserscoreSelector = ".data.avguserscore",
          defaultTextscoreSelector = ".data.textscore",
          removalSelector = ".score_counts, .review_helpful, .summary";
      
      $(removalSelector).remove();
      
      $(defaultMetascoreSelector).not($(summaryMetascoreSelector).find(defaultMetascoreSelector)).each(setDefaultMetascore);
      $(summaryMetascoreSelector).each(setSummaryMetascore);
      $(hoverMetascoreSelector).each(setHoverMetascore);
      $(hoverAvguserscoreSelector).each(setHoverAvguserscore);
      $(defaultUserscoreSelector).each(setDefaultUserscore);
      $(defaultCritscoreSelector).each(setDefaultCritscore);
      $(defaultAvguserscoreSelector).each(setDefaultAvguserscore);
      $(defaultTextscoreSelector).each(setDefaultTextscore);
    })();
  };

  //Randomize Giantbomb
  function doGiantbomb($) {
    var targets =  $('.score');

    Array.prototype.forEach.call(targets, function(target) {
      var lastIndex = target.className.length-1;
      target.className = target.className.substr(0, lastIndex) + getRandomInt(0,5);
    })
  }

  //Randomize Destructoid
  function doDestructoid($) {
    var mainScore = $('div.rating .value')[0]
      , mainDesc = $(mainScore).parent().next() //jQuery dependent
      //, mainDesc = mainScore.parentElement.nextElementSibling
      , newMainScore = getRandomScore(1,10,.5)
      , badges = $('.product_review_badge')
      , sidebarScores = $('.sidebar_flush_right b')
      , badgeLabels = ["Worst", "Failure", "Bad", "Poor", "Below Avg", "Mediocre", "Alright", "Good", "Great", "Superb", "Flawless"]
      , longLabels = ["The Worst", "Complete Failure", "Bad", "Poor", "Below Average", "Mediocre", "Alright", "Good", "Great", "Superb", "Flawless Victory"]
      , descs = [
          "OH GOD WHY",
          "The lowest of the low. There is no potential, no skill, no depth and no talent. These games have nothing to offer the world, and will die lonely and forgotten.", 
          "A disaster. Any good qualities it might have had are quickly swallowed up by glitches, poor design choices or a plethora of other issues. The desperate or the gullible may find a glimmer of fun hidden somewhere in the pit.", 
          "Something went wrong somewhere along the line. The original idea might have promise, but in practice the game has failed. Threatens to be interesting sometimes, but rarely.", 
          "Has some high points, but they soon give way to glaring faults. Not the worst games, but are difficult to recommend.", 
          "An exercise in apathy, neither Solid nor Liquid. Not exactly bad, but not very good either. Just a bit 'meh,' really.", 
          "May be slightly above average or simply inoffensive. Fans of the genre should enjoy them a bit, but a fair few will be left unfulfilled.", 
          "A solid game that definitely has an audience. Might lack replay value, could be too short or there are some hard-to-ignore faults, but the experience is fun.", 
          "Impressive efforts with a few noticeable problems holding it back. Won't astound everyone, but is worth your time and cash.", 
          "A hallmark of excellence. There may be flaws, but they are negligible and won't cause massive damage to what is a supreme title.", 
          "Games rated 10 aren't perfect, since nothing is, but they come as close as you could get in a given genre. The new must-have game in its sector, we're talking pure ecstasy."
        ]
      
    //Randomize score/label/description of review feature
    if (mainScore) {
      mainScore.textContent = newMainScore;
      mainDesc.firstChild.textContent = longLabels[Math.floor(newMainScore)] + ":";
      mainDesc.childNodes[1].textContent = " " + descs[Math.floor(newMainScore)] + "	Check out ";
    }
    
    //Randomize score/label on browse reviews page badges
    Array.prototype.forEach.call(badges, function(badge) {
      var newScore = getRandomScore(1,10,.5);
      badge.firstChild.firstChild.textContent = newScore + "/10";
      badge.firstChild.firstElementChild.textContent = badgeLabels[Math.floor(newScore)];
    });
    
    //Randomize scores in "Reviews" dropdown
    Array.prototype.forEach.call(sidebarScores, function(sidebar) {
      sidebar.textContent = getRandomScore(1,10,.5);
    });
  }

  //Randomize USGamer
  function doUSGamer($) {
    var target = $('.ratings .score')[0]
      , newScore = getRandomScore(0,5,.5)
      , newHtml = '\n';
      
    while (newScore > 0) {
      if (newScore >= 1) {
        newHtml += '<span class="icon-star empty"></span>\n';
        newScore -= 1;
      }
      else {
        newHtml += '<span class="icon-star-half empty"></span>\n';
        newScore -= 0.5;
      }
    }
    
    target.innerHTML = newHtml;
  }

  //Randomize Eurogamer
  function doEurogamer($) {
    var target = $('big[property="v\:value"]')[0]
      , newScore = getRandomScore(1,10);
    
    if (target)
      {target.textContent = newScore;}
  }

  //Randomize Joystiq
  function doJoystiq($) {
    var images = $('.post-body img')
      , image = images[images.length-1]
      , newScore = getRandomScore(0,5,.5)
      , imgUrl = target.src
      , staticEndIndex =  imgUrl.search(/review-/i)
      , static = imgUrl.substring(0,staticEndIndex)
      , fileEndIndex = imgUrl.indexOf('.', staticEndIndex)
      , file = imgUrl.substring(staticEndIndex, fileEndIndex)
      , suffix = imgUrl.substring(fileEndIndex, imgUrl.length)
      , files = {
          "0": "review-no-stars",
          "0.5": "review-one-star",
          "1": "review-one-star",
          "1.5": "review-one-half-stars",
          "2": "review-two-stars",
          "2.5": "review-two-half-stars",
          "3": "review-three-stars",
          "3.5": "review-three-half-stars",
          "4": "review-four-stars",
          "4.5": "review-four-half-stars",
          "5": "review-five-stars"
        }
        , newUrl = static+files[newScore]+suffix;
        
        target.src = newUrl;
  }

  //Randomize Escapist
  function doEscapist($) {
    
    var target   = $('.rating_tag')[0]
      , newScore = getRandomScore(0,5,.5)
      , starOff  = {src:"http://cdn.themis-media.com/media/global/images/icons/reviewstar_off.png" , class:"rating_tag_0"}
      , starHalf = {src:"http://cdn.themis-media.com/media/global/images/icons/reviewstar_half.png", class:"rating_tag_half"} //not working?
      , starOn   = {src:"http://cdn.themis-media.com/media/global/images/icons/reviewstar_on.png"  , class:"rating_tag_1"}
      , newHTML  = ''
      , n;
   
    for (n = 5; target && n > 0; n--) {
      if (newScore >= 1) {
        newHTML += '<img src="' + starOn.src + '" class="' + starOn.class + '">';
        newScore -= 1;
      }
      else if (newScore >= .5) {
        newHTML += '<img src="' + starHalf.src + '" class="' + starHalf.class + '">';
        newScore -= .5;
      }
      else {
        newHTML += '<img src="' + starOff.src + '" class="' + starOff.class + '">';
      }
    }
    
    target.innerHTML = newHTML;
    
  }

  //Randomize Gameinformer
  // TODO:
  // ? Override "login" label on your-rating? Or don't touch your-score?
  function doGameinformer($) {
    var targets = $('.sku-rating');
    
    $('.sku-award').hide();
    
    Array.prototype.forEach.call(targets, function(target, n) {
      var newScore = getRandomScore(0,10,.25);

      $('.sku-rating-summary > span', target).text(newScore);
      $('.sku-rating-bars > div', target).html(makeBarsGI(newScore));
    });
    
    function makeBarsGI(newScore) {
      var html = '';

      for (n = 0; n < 40; n += 1) {
        var quarter = n % 4
          , scoreEq = (n+1) / 4
          , margin = quarter * -5
          , isFull = (scoreEq <= newScore) ? 'ui-stars-star-on ' : '';
        html += '<div class="ui-stars-star '
                + isFull
                + 'ui-stars-star-disabled" style="width: 5px;"><a title="" style="margin-left:' + margin + 'px;">'
                + Math.floor(scoreEq) + ['.25','.50','.75','.00'][quarter] + '</a></div>\n';

      }

      return html;
    }
  }

//Randomize Gamespot
// TODO:
//  - Get and apply labels for ".scoreword" element.
//  - Randomize scores on review index page ('.value'...)
//  Do I need to change text color based on score?
//  Is the scale 0-10 at .1 increments?
  function doGamespot($) {
    var targets = $('span[itemprop="ratingValue"], .viewerScore .score > .data, .community_score > .wrap > .data, span.gameScore > span.value, div.review span.data')
      , metaScore = $('.data > .scoreWrap')[0]
      , metaWrap = $('.criticScore > .wrap')[0]
      , metaClass = "wrap "
      , newMetaScore = getRandomScore(0,100);
    
    Array.prototype.forEach.call($('.scoreword.choice'), function(el) {
      el.style.display = "none"
    });
    
    Array.prototype.forEach.call(targets, function(target) {
      var newScore = getRandomScore(0,10,.1,true);
      if (newScore === "10.0" || newScore === "0.0")
        newScore = newScore.substr(0,newScore.indexOf('.'));
        
      target.textContent = newScore;
      
      if (target.previousElementSibling && target.previousElementSibling.textContent === "Your Score") {
        var scaleStatus = $('.scale_status')[0]
          , scaleScore = newScore*10;
          
        if (scaleStatus) {
          scaleStatus.style.width = scaleScore + "px";
          $('.handle')[0].style.left = (scaleScore - 10) + "px";
        }
      }
    });
    
    if (metaScore && metaWrap) {
      metaScore.textContent = newMetaScore;
      
      if (newMetaScore < 41) {
        metaClass += "terrible";
      }
      else if (newMetaScore < 62) {
        metaClass += "mixed";
      }
      else if (newMetaScore < 81) {
        metaClass += "favorable";
      }
      else {
        metaClass += "outstanding";
      }
      
      metaWrap.className = metaClass;
    }
  }

  //EXECUTION ENTRYPOINT
  var sites = [
        {"url": "ign.com", "func": doIGN},
        {"url": "joystiq.com", "func": doJoystiq},
        {"url": "usgamer.net", "func": doUSGamer},
        {"url": "eurogamer.net", "func": doEurogamer},
        {"url": "gamespot.com", "func": doGamespot},
        {"url": "escapistmagazine.com", "func": doEscapist},
        {"url": "gameinformer.com", "func": doGameinformer},
        {"url": "polygon.com", "func": doPolygon},
        {"url": "metacritic.com", "func": doMetacritic},
        {"url": "giantbomb.com", "func": doGiantbomb},
        {"url": "destructoid.com", "func": doDestructoid}
      ]
    , selector
    , site
    , intervalId;

    if ('jQuery' in this) {
      selector = this.jQuery;
    }
    else if ('querySelectorAll' in document) {
      selector = document.querySelectorAll.bind(document);
    }
    else {
     selector = $$ || $;
   }

    //Assign when initialized using .reduce()?
    sites.forEach(function(el,n) {  
      if (~document.location.href.toLowerCase().indexOf(el.url)) {
        site = el;
      }
    });
    
    if (site && selector) {
      site.func(selector); //randomize now
      intervalId = setInterval(site.func, 60000*5, selector); //randomize scores every 5 minutes
    }
})();
