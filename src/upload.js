/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

define(['./resizer', 'browser-cookies'], function(Resizer, browserCookies) {

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;
  var collectionResizeForm = document.getElementById('upload-resize').elements;
  var resizeLeftSide = collectionResizeForm['resize-x'];
  var resizeOnTopSide = collectionResizeForm['resize-y'];
  var resizeSize = collectionResizeForm['resize-size'];
  var resizeBtn = collectionResizeForm['resize-fwd'];

  resizeLeftSide.min = 0;
  resizeOnTopSide.min = 0;
  resizeSize.min = 0;
  resizeLeftSide.value = 0;
  resizeOnTopSide.value = 0;
  resizeSize.value = 0;


  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */

  function resizeFormIsValid() {
    var size = parseInt(resizeSize.value, 10);
    var left = parseInt(resizeLeftSide.value, 10);
    var top = parseInt(resizeOnTopSide.value, 10);
    var validLeftSide = (left + size <= currentResizer._image.naturalWidth);
    var validTopSide = (top + size <= currentResizer._image.naturalHeight);

    resizeBtn.disabled = !validLeftSide || !validTopSide;

    return true;
  }

  resizeLeftSide.addEventListener('input', resizeFormIsValid);
  resizeOnTopSide.addEventListener('input', resizeFormIsValid);
  resizeSize.addEventListener('input', resizeFormIsValid);

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */

  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  var collectionFilterForm = filterForm['upload-filter'];
  var defaultFilter = collectionFilterForm.value;
  collectionFilterForm.value = browserCookies.get('upload-filter') || defaultFilter;

   /* Запись в куки выбранный пользователем фильтр */

  function getDays(date) {
    var nowYear = date.getFullYear();
    var lastYear = nowYear - 1;
    var birthdayHopperGrace = new Date(nowYear, 11, 9);
    var ms = (24 * 60 * 60 * 1000);

    if (date < birthdayHopperGrace) {
      birthdayHopperGrace = new Date(lastYear, 11, 9);
    }

    var calcDate = (date - birthdayHopperGrace) / ms;

    return calcDate;
  }

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */

  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    browserCookies.set('upload-filter', collectionFilterForm.value, {expires: getDays(new Date())});
    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  /**
   * Записывает новые значения в поле ввода
   */
  function listenerResize() {
    var leftNumber = Number(resizeLeftSide.value);
    var topNumber = Number(resizeOnTopSide.value);
    var sizeNumber = Number(resizeSize.value);

    currentResizer.setConstraint(leftNumber, topNumber, sizeNumber);
  }

  /**
   * Получает полученные значения
   */
  function takeValuesFromResize() {
    var currentResizerContraint = currentResizer.getConstraint();
    resizeLeftSide.value = Math.ceil(currentResizerContraint.x);
    resizeOnTopSide.value = Math.ceil(currentResizerContraint.y);
    resizeSize.value = Math.ceil(currentResizerContraint.side);
  }

  resizeForm.addEventListener('change', listenerResize);
  window.addEventListener('resizerchange', takeValuesFromResize);

  cleanupResizer();
  updateBackground();
});
