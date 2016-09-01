'use strict';
define(['./load', './picture', './gallery'], function(callJsonp, Picture, Gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  /**
   * Отображает загруженные изображения
   * @param {Picture[]} pictures
   */
  function showPictures(pictures) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function(picture, i) {
      var newPicture = new Picture(picture, i);
      fragment.appendChild(newPicture.element);
    });

    picturesContainer.appendChild(fragment);
    Gallery.setPictures(pictures);
    filters.classList.remove('hidden');
  }

  filters.classList.add('hidden');
  callJsonp('http://localhost:1506/api/pictures', showPictures);
});
