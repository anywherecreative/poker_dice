var roll = 0;
var MAX_ROLL = 3;
var roundDone = false;
/*
Javascript (JS for short) uses what's known as the DOM or document Object Model
to manipulate and change different elements on the page.  However when the page
isn't done loading JS has no way to access these items, which can lead to
weird results.  We use this function to make sure everything is loaded before we
proceed.

The ready function is an example of an event which is just a fancy name for
something happening on our webpage.  In this case, when the document is fully
loaded and is "ready" to be scripted. There are several different dom events
such as "click", "hover" and "drag" all of which allow us to respond to the user
in a specific way.

Javascript itself is event-driven and therefore primarily uses these events in
order to interact with the user.
*/
$(document).ready(function() {

  for(var a = 1;a < 6;a++) {
    $('#dice').append('<li></li>');
  }

  /*
  here is another example of an event.  In this case it's the click event. A
  click event is fired whenever the user presses the left mouse button and
  releases it over an item.  A click event is also fired on phones when a user
  taps on an element.

  You'll also notice a strange string inside of the brackets below '#roll' if
  you look back at our index.html page you'll notice a tag with an attribute
  id and a value of roll.  an id is given to an HTML element to give it a unique
  identifier.  No two elements can have the same id which makes it ideal for
  scripting a specific object, in this case a button.

  In CSS and by extension JQuery, and id is represented by placing a hash sign
  infront of the name #roll for example.  There are other types of selectors
  that can be used also.
  */
  $('#roll').click(function() {
    if(roll >= 3) {
      $(this).attr('disabled','disabled');
      return;
    }
    roundDone = false;
    for(var a = 1;a < 6;a++) {
      //a random number between 1 and 6
      number = Math.floor((Math.random() * 6) + 1);
      if($('#dice LI:nth-child(' + a + ')').data('hold') != true) {
        $('#dice LI:nth-child(' + a + ')').text(number);
      }
    }
    roll++;
  });
  $('#dice LI').click(function() {
    if(roll == 0 || roundDone || $(this).text() == "") {
      return;
    }
    if($(this).data('hold')) {
      $(this).data('hold',false);
      $(this).removeClass('hold');
    }
    else {
      $(this).data('hold',true);
      $(this).addClass('hold');
    }
  });
  $('.card DL DT').click(function() {
    $('#dice .hold').data('hold',false).removeClass('hold');
    if(roundDone) {
      return;
    }
    if($('#dice LI:first-child').text() == "") {
      alert('Click roll to begin a new game');
      return;
    }
    roundDone = true;
    $('#roll').removeAttr('disabled');
    roll = 0;
    if($(this).data('item') == "4kind") {
      if($("[data-value='4kind']").text() == "") {
        if(runCheck(4)) {
          $("[data-value='4kind']").text(40);
        }
        else {
          $("[data-value='4kind']").text(0);
        }
      }
    }
    if($(this).data('item') == "3kind") {
      if($("[data-value='3kind']").text() == "") {
        if(runCheck(3)) {
          $("[data-value='3kind']").text(30);
        }
        else {
          $("[data-value='3kind']").text(0);
        }
      }
    }
    if($(this).data('item') == "pokerdice") {
      if($("[data-value='pokerdice']").text() == "") {
        if(runCheck(5)) {
          $("[data-value='pokerdice']").text(50);
        }
        else {
          $("[data-value='pokerdice']").text(0);
        }
      }
    }
    if($(this).data('item') == "pair") {
      if($("[data-value='pair']").text() == "") {
        if(runCheck(2)) {
          $("[data-value='pair']").text(20);
        }
        else {
          $("[data-value='pair']").text(0);
        }
      }
    }
    if($(this).data('item') == "number") {
      if($("[data-value='" + $(this).data('number') + "']").text() == "") {
        $("[data-value='" + $(this).data('number') + "']").text($(this).data('number')*numberOf($(this).data('number')));
      }
      else {
        return;
      }
    }
    if($(this).data('item') == "small-straight") {
      if($("[data-value='small-straight']").text() == "") {
        if(straightCheck() >= 4) {
          $("[data-value='small-straight']").text(30);
        }
        else {
          $("[data-value='small-straight']").text(0);
        }
      }
    }
    if($(this).data('item') == "large-straight") {
      if($("[data-value='large-straight']").text() == "") {
        if(straightCheck() == 5) {
          $("[data-value='large-straight']").text(40);
        }
        else {
          $("[data-value='large-straight']").text(0);
        }
      }
    }
    if($(this).data('item') == "full-house") {
      if($("[data-value='full-house']").text() == "") {
        if(fullHouse()) {
          $("[data-value='full-house']").text(35);
        }
        else {
          $("[data-value='full-house']").text(0);
        }
      }
    }
  });
});

function runCheck(length) {
  var run = 1;
  var last = null;
  var success = false;
  dice = getDice().sort(function(a, b) {
    return a - b;
  });
  for(var a = 0;a <= dice.length;a++) {
    if(dice[a] == last) {
      run++;
    }
    else {
      run = 1;
    }
    if(run == length) {
      success = true;
      break;
    }
    last = dice[a];
  }
  return success;
}

/**
 * This function will return the length of a straight
 * @return int length of straight
 **/
function straightCheck() {
  var straight = 1;
  var longest = 1;
  var last = null;
  var success = false;
  dice = getDice().sort(function(a, b) {
    return a - b;
  });
  for(var a = 0;a < dice.length;a++) {
    var temp = parseInt(last)+1;
    if(dice[a] == temp) {
      straight++;
      if(straight > longest) {
        longest = straight;
      }
      console.log(a + 'is a yes');
    }
    else {
      straight = 1;
      console.log(a + 'is a no');
    }
    last = dice[a];
  }
  console.log(straight + " " + longest);
  return longest;
}

/**
 * this function returns the number of times a value occurs
 * e.g if you roll 2 dice of value 3 it will return 2
 * @param value int the value to look for
 * @return int the number of times value occurs
 **/
function numberOf(value) {
  var dice = getDice();
  var occurance = 0;
  for(var a = 0;a < dice.length;a++) {
    if(dice[a] == value) {
      occurance++;
    }
  }
  return occurance;
}

/**
 * This function returns true if the player gets a fullHouse
 * @return boolean true on fullhouse, false otherwise.
 **/
function fullHouse() {
  var dice = getDice();
  var firstMatch;
  var secondMatch;
  for(var a = 0; a < dice.length;a++) {
    if(firstMatch == null || firstMatch == dice[a]) {
      firstMatch = dice[a];
    }
    else if(secondMatch == null || secondMatch == dice[a]) {
      secondMatch = dice[a]
    }
    else {
      return false;
    }
  }
  return true;
}

/**
 * this function gets the value of all dice and returns as array
 **/
function getDice() {
  var dice = new Array(5);
  for(var a = 0;a < 5;a++) {
    dice[a] = $('#dice LI:nth-child('+(a+1)+')').text();
  }
  return dice;
}
