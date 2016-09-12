'use strict';

define(function() {
  /**
   * Делает XMLHttpRequest запрос
   * @param {String} url адрес запроса
   * @param {Object} courier
   * @param {Function} callback функция обработки данных
   */
  function load(url, courier, callback) {
    var xhr = new XMLHttpRequest();
    var getParams = Object.keys(courier);

    var newUrl = getParams.map(function(value) {
      return value + '=' + courier[value];
    });

    xhr.open('GET', url + '?' + newUrl.join('&'));
    xhr.send();
    xhr.onload = function() {
      var loadXHR = JSON.parse(xhr.response);

      callback(loadXHR);
    };
  }

  return load;
});
