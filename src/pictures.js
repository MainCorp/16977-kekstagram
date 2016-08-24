'use strict';

callJsonp.counter = 0;

/**
 * @param {String} url
 * @param {Function} callback
 */
function callJsonp(url, callback) {
  var cbnum = 'cb' + callJsonp.counter++;

  var script = document.createElement('script');
  script.src = url + '?callback=' + cbnum;
  document.body.appendChild(script);

  window[cbnum] = function(data) {
    callback(data);
    document.body.removeChild(script);
    delete window[cbnum];
  };
}

callJsonp('http://localhost:1506/api/pictures', function(pictures) {
  console.log(pictures);
});
