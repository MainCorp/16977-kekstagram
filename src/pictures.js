'use strict';
define(['./load', './throttle', './picture', './gallery'], function(load, throttle, Picture, Gallery) {

  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');
  var currentPage = 0;
  var footer = document.querySelector('.footer');
  var filterValue = filters.querySelector('input:checked').value;

  /**
   * @const
   */
  var PAGE_SIZE = 12;
  var GAP = 100;

  var Pictures = function() {
    this.checkPosition = this.checkPosition.bind(this);
    this.loadPictures = this.loadPictures.bind(this);
    this.picturesScroll = this.picturesScroll.bind(this);
    this.setFilter = this.setFilter.bind(this);

    filters.classList.add('hidden');
    this.loadPictures();

    filters.addEventListener('change', this.setFilter, true);
    window.addEventListener('scroll', throttle(this.checkPosition, 100));
  };

  /**
   * Показывает загруженные изображения, callback функции load
   * @param {Picture[]} pictures
   */
  Pictures.prototype.showPictures = function(pictures) {
    var fragment = document.createDocumentFragment();
    window.pictures = pictures;

    pictures.forEach(function(picture, i) {
      var newPicture = new Picture(picture, i);

      fragment.appendChild(newPicture.element);
    });

    picturesContainer.appendChild(fragment);
    Gallery.setPictures(pictures);
    Gallery.onHashChange();
    filters.classList.remove('hidden');
  };

  Pictures.prototype.setFilter = function(evt) {
    if (event.target.tagName.toLowerCase() === 'input') {
      currentPage = 0;
      filterValue = evt.target.value;
      localStorage.setItem('filter', filterValue);
      picturesContainer.innerHTML = '';
      this.loadPictures();
    }
  };

  /**
   * Догружает следующую пачку фотографий
   */
  Pictures.prototype.picturesScroll = function() {
    currentPage++;
    return this.loadPictures();
  };

  /**
   * @return {Boolean} - Возвращает true, когда футер почти появился на экране
   */
  Pictures.prototype.getPositionReached = function() {
    var footerPosition = footer.getBoundingClientRect();
    return footerPosition.bottom - window.innerHeight - GAP <= 0;
  };

  /**
   * Проверяет доступность следующей страницы
   * @param {Picture[]} data - фотографии
   * @param {Number} pagelist страница
   * @return {Boolean} - Возвращает true, когда страница меньше кол-ва фотографий
   */
  Pictures.prototype.isNextPageAvailable = function(data, pagelist) {
    return pagelist < Math.floor(data.length / PAGE_SIZE);
  };

  /**
   * throttle
   */
  Pictures.prototype.checkPosition = function() {
    if (this.getPositionReached() && this.isNextPageAvailable(window.pictures, currentPage)) {
      this.picturesScroll();
    }
  };

  /**
   * Загрузка изображений
   */
  Pictures.prototype.loadPictures = function() {
    this.setStorageFilter();
    var param = {
      from: currentPage * PAGE_SIZE,
      to: PAGE_SIZE * (currentPage + 1),
      filter: filterValue
    };

    load('http://localhost:1506/api/pictures', param, this.showPictures);
  };

  Pictures.prototype.setStorageFilter = function() {
    filterValue = localStorage.getItem('filter') || 'filter-popular';
    filters.elements['filter-' + filterValue].checked = true;
  };

  return new Pictures();
});
