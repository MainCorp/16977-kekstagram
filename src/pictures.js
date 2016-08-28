'use strict';
define(['./load', './picture'], function(callJsonp, getPictureElement) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

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

  filters.classList.add('hidden');
  callJsonp('http://localhost:1506/api/pictures', showPictures);
});
