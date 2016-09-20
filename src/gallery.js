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
    this.onHashChange = this.onHashChange.bind(this);
    this.changeUrl = this.changeUrl.bind(this);

    window.addEventListener('hashchange', this.onHashChange);
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
        this.changeUrl(window.pictures[this.activePicture + 1].url);
      } else {
        this.changeUrl(window.pictures[0].url);
      }

    }.bind(this);

    this.galleryOverlay.classList.remove('invisible');
  };

  /**
   * Скрывает галлерею
   */
  Gallery.prototype.hide = function() {
    window.location.hash = '';

    this.galleryOverlay.classList.add('invisible');
    this.galleryClose.onclick = null;
    this.galleryImage.onclick = null;
  };

  Gallery.prototype.URL_MATCHER = /#photo\/(\S+)/;

  Gallery.prototype.onHashChange = function() {
    var photoUrl;
    var urlMatchHash = this.URL_MATCHER.exec(window.location.hash);
    var pictureIndex;

    if(urlMatchHash) {
      photoUrl = urlMatchHash[1];
      this.pictures.forEach(function(pictureObject, pictureNumber) {
        if(photoUrl === pictureObject.url) {
          pictureIndex = pictureNumber;
        }
      });

      if(pictureIndex || pictureIndex === 0) {
        this.show(pictureIndex);
      }
    } else {
      this.hide();
    }
  };

  Gallery.prototype.changeUrl = function(photoUrl) {
    if(photoUrl) {
      window.location.hash = 'photo/' + photoUrl;
    } else {
      window.location.hash = '';
    }
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
