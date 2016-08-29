'use strict';

define(function() {
  /**
   * @callback loadImageCallback
   * @param {Boolean} isImageLoaded если картинка загрузилась - true, иначе - false
   */

  /**
   * Загружает изображение
   * @param {String} url адрес картинки
   * @param {loadImageCallback} callback функция, которая будет вызвана, когда картинка будет загружена
   */
  function loadImage(url, callback) {
    var IMAGE_LOAD_TIMEOUT = 5000;
    var img = new Image();
    var imgLoadTimeout;

    img.addEventListener('load', function() {
      clearTimeout(imgLoadTimeout);
      callback(true);
    });

    img.addEventListener('error', function() {
      clearTimeout(imgLoadTimeout);
      callback(false);
    });

    imgLoadTimeout = setTimeout(function() {
      img.src = '';
      callback(false);
    }, IMAGE_LOAD_TIMEOUT);

    img.src = url;
  }

  return loadImage;
});
