'use strict';
const angular = require('angular');

export default angular.module('hystoreApp.starRating', [])
  .directive('starRating', function() {
    return {
      template: require('./star-rating.pug'),
      restrict: 'EA',
      scope: {
        ratingValue: '=ngModel',
      },
      link: scope => {
        const updateStars = () => {
          scope.stars = [];
          for(let i = 0; i < 5; i++) {
            const star = { filled: i < scope.ratingValue };
            scope.stars.push(star);
          }
        };

        scope.toggle = idx => {
          scope.ratingValue = idx + 1;
        };

        scope.$watch('ratingValue', (oldValue, newValue) => {
          if(newValue) {
            updateStars();
          }
        });
      }
    };
  })
  .name;
