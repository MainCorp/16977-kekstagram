'use strict';
/**
 * @typedef {Object} Picture
 * Картинка
 * @property {Number} likes
 * @property {Number} comments
 * @property {String} url
 */

define(['./load-image'], function(loadImage) {
  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

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

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  return getPictureElement;
});
