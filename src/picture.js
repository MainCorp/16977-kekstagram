'use strict';
/**
 * @typedef {Object} Picture
 * Картинка
 * @property {Number} likes
 * @property {Number} comments
 * @property {String} url
 */

define(['./load-image', './gallery'], function(loadImage, Gallery) {
  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

  /**
   * Шаблонизирует картинку
   * @param {Picture} data информация о картинке
   * @return {HTMLElement} picture DOM элемент
   */
  var Picture = function(data, index) {
    this.data = data;
    this.index = index;
    this.element = elementToClone.cloneNode(true);
    this.pictureImg = this.element.querySelector('img');

    this.element.querySelector('.picture-comments').textContent = this.data.comments;
    this.element.querySelector('.picture-likes').textContent = this.data.likes;

    loadImage(data.url, function(isImageLoaded) {
      if (isImageLoaded === true) {
        this.pictureImg.src = data.url;
        this.pictureImg.width = 182;
        this.pictureImg.height = 182;
      } else {
        this.element.classList.add('picture-load-failure');
      }
    }.bind(this));

    this.onSwitchActiviyGallery = function(evt) {
      evt.preventDefault();
      Gallery.show(this.index);
    }.bind(this);

    this.element.addEventListener('click', this.onSwitchActiviyGallery);
  };

  Picture.prototype.remove = function() {
    this.element.removeEventListener('click', this.onSwitchActiviyGallery);
  };

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  return Picture;
});
