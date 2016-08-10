'use strict';

var getMessage = function(a, b) {
  if (typeof a === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    } else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if (typeof a === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 + ' атрибутов';
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      var artifactsSquare = b.reduce(function(sum, current, i) {
        return sum + a[i] * b[i];
      }, 0);

      return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
    } else {
      var amountOfRedPoints = a.reduce(function(sum, current) {
        return sum + current;
      }, 0);

      return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
    }
  }
};
