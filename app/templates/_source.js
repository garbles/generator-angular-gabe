if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports){
  module.exports = '<%= namespacedPackageName %>';
}

(function(window, angular, undefined) {'use strict';

angular.module('<%= namespacedPackageName %>', []);

})(window, window.angular);
