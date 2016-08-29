'use strict';

define(function() {
  callJsonp.counter = 0;

  /**
   * Делает JSONp запрос
   * @param {String} url адрес запроса
   * @param {Function} callback функция обработки данных
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

  return callJsonp;
});
