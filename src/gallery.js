'use strict';

define(function() {
  /**
   * @constructor
   */
  var Gallery = function() {
    this.pictures = [];
    this.activePicture = 0;
    this.galleryOverlay = document.querySelector('.gallery-overlay');
    this.galleryClose = this.galleryOverlay.querySelector('.gallery-overlay-close');
    this.galleryImage = this.galleryOverlay.querySelector('.gallery-overlay-image');
    this.countLikes = this.galleryOverlay.querySelector('.likes-count');
    this.countComments = this.galleryOverlay.querySelector('.comments-count');
  };

  /**
   * @param {Picture[]} pictures - массив объектов фотографий
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  /**
   * Показывает нашу галлерею
   * @param {Number} num - номер активной фотографии
   */
  Gallery.prototype.show = function(num) {
    this.setActivePicture(num);

    this.galleryClose.onclick = this.hide.bind(this);

    this.galleryImage.onclick = function() {
      if (this.activePicture < this.pictures.length - 1) {
        this.setActivePicture(this.activePicture + 1);
      } else {
        this.setActivePicture(0);
      }
    }.bind(this);

    this.galleryOverlay.classList.remove('invisible');
  };

  /**
   * Скрывает галлерею
   */
  Gallery.prototype.hide = function() {
    this.galleryOverlay.classList.add('invisible');
    this.galleryClose.onclick = null;
    this.galleryImage.onclick = null;
  };

  /**
   * Устанавливает активную фотографию
   * @param {Number} num - номер активной фотографии
   */
  Gallery.prototype.setActivePicture = function(num) {
    this.activePicture = num;
    var indexPicture = this.pictures[this.activePicture];
    this.galleryImage.src = indexPicture.url;
    this.countLikes.innerHTML = indexPicture.likes;
    this.countComments.innerHTML = indexPicture.comments;
  };

  return new Gallery();
});
