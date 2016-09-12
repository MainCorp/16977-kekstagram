'use strict';
define(['./load', './picture', './gallery'], function(load, Picture, Gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var currentPage = 0;
  var lastCheckPositionTime = 0;
  var footer = document.querySelector('.footer');
  var filterValue = filters.querySelector('input:checked').value;

  /**
   * @const
   */
  var PAGE_SIZE = 12;
  var GAP = 100;

  /**
   * Показывает загруженные изображения, callback функции load
   * @param {Picture[]} pictures
   */
  function showPictures(pictures) {
    var fragment = document.createDocumentFragment();
    window.pictures = pictures;

    pictures.forEach(function(picture, i) {
      var newPicture = new Picture(picture, i);

      fragment.appendChild(newPicture.element);
    });

    picturesContainer.appendChild(fragment);
    Gallery.setPictures(pictures);
    filters.classList.remove('hidden');
  }

  /**
   * Догружает следующую пачку фотографий
   */
  function picturesScroll() {
    currentPage++;
    loadPictures();
  }

  /**
   * @return {Boolean} - Возвращает true, когда футер почти появился на экране
   */
  function getPositionReached() {
    var footerPosition = footer.getBoundingClientRect();
    return footerPosition.bottom - window.innerHeight - GAP <= 0;
  }

  /**
   * Проверяет доступность следующей страницы
   * @param {Picture[]} data - фотографии
   * @param {Number} pagelist страница
   * @return {Boolean} - Возвращает true, когда страница меньше кол-ва фотографий
   */
  function isNextPageAvailable(data, pagelist) {
    return pagelist < Math.floor(data.length / PAGE_SIZE);
  }

  /**
   * throttle
   */

  function checkPosition() {
    var date = Date.now();
    if(date - lastCheckPositionTime > 100) {
      if (getPositionReached() && isNextPageAvailable(window.pictures, currentPage)) {
        clearTimeout(scrollTimeout);
        var scrollTimeout = setTimeout(picturesScroll, 100);
      }
      lastCheckPositionTime = date;
    }
  }

  /**
   * Загрузка изображений
   */
  function loadPictures() {
    var param = {
      from: currentPage * PAGE_SIZE,
      to: PAGE_SIZE * (currentPage + 1),
      filter: filterValue
    };
    load('http://localhost:1506/api/pictures', param, showPictures);
  }

  filters.classList.add('hidden');
  loadPictures();

  filters.addEventListener('change', function(evt) {
    if (event.target.tagName.toLowerCase() === 'input') {
      currentPage = 0;
      filterValue = evt.target.value;
      picturesContainer.innerHTML = '';
      loadPictures();
    }
  }, true);

  window.addEventListener('scroll', checkPosition);
});
