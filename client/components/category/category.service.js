'use strict';

export function CategoryService(Util, CategoryResource) {
  'ngInject';

  var safeCb = Util.safeCb;

  var Category = {

    /**
     * Change category content
     *
     * @param  {Object} category  - category info
     * @param {Function} callback - function(error, category)
     *
     * @return {Promise}
     */
    changeCategoryContent(category, callback ? : Function) {
      return CategoryResource.changeCategoryContent({
        id: category._id
      },
        category,
        () => safeCb(callback)(null, category),
        err => safeCb(callback)(err)
      )
        .$promise;
    },

    /**
     * Create a new category
     *
     * @param  {Object}   category - category info
     * @param  {Function} callback - function(error, category)
     * @return {Promise}
     */
    createCategory(category, callback ? : Function) {
      return CategoryResource.save(
        category,
        () => safeCb(callback)(null, category),
        err => safeCb(callback)(err)
      )
        .$promise;
    }
  };

  return Category;
}

