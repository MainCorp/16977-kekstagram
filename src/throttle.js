'use strict';

define(function() {
  function throttle(callback, time) {
    var lastCheckPositionTime = 0;

    return function() {
      var date = Date.now();

      if(date - lastCheckPositionTime > time) {
        callback();
        lastCheckPositionTime = date;
      }
    };
  }

  return throttle;
});
