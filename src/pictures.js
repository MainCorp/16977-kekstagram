'use strict';
/**
 * @typedef {Object} Picture
 * Картинка
 * @property {Number} likes
 * @property {Number} comments
 * @property {String} url
 */

var picturesContainer = document.querySelector('.pictures');
var filters = document.querySelector('.filters');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

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

/**
 * Шаблонизирует картинку
 * @param {Picture} data информация о картинке
 * @return {HTMLElement} picture DOM элемент
 */
function getPictureElement(data) {
  var picture = elementToClone.cloneNode(true);
  var pictureImg = picture.querySelector('img');

  picture.querySelector('.picture-comments').textContent = data.comments;
  picture.querySelector('.picture-likes').textContent = data.likes;

  loadImage(data.url, function(isImageLoaded) {
    if (isImageLoaded === true) {
      pictureImg.src = data.url;
      pictureImg.width = 182;
      pictureImg.height = 182;
    } else {
      picture.classList.add('picture-load-failure');
    }
  });

  return picture;
}

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

/**
 * Отображает загруженные изображения
 * @param {Picture[]} pictures
 */
function showPictures(pictures) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function(picture) {
    fragment.appendChild(getPictureElement(picture));
  });

  picturesContainer.appendChild(fragment);
  filters.classList.remove('hidden');
}

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

filters.classList.add('hidden');
callJsonp('http://localhost:1506/api/pictures', showPictures);
