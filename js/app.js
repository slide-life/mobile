(function ($) {
  var SlideMobile = function () {
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;

    this.initializeNavbarListeners();
    this.contentViews = [].map.call(this.$tabBar.find('.tab'), function(tab) {
      return $(tab).data('target');
    }).map(function(target, i) {
      var template = this.templates[target]();
      var $template = $(template);
      $template.attr("data-page-id", i+1);
      this.$container.append($template);
      return $template;
    }.bind(this));
    this.presentTabBarView(this.contentViews[0]);
  };

  SlideMobile.prototype.presentTabBarView = function (target) {
    $(".container").attr("data-page", target.data("page-id"));
  };

  SlideMobile.prototype.initializeNavbarListeners = function () {
    var self = this;
    this.$tabBar.find('.tab').on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      self.presentTabBarView(self.contentViews[$(this).index()]);
    });
  };

  SlideMobile.prototype.pushToDetail = function() {
    this.$container.find('.content').addClass('pushed');
  };

  SlideMobile.prototype.popToMaster = function() {
    this.$container.find('.content').removeClass('pushed');
  };

  var app = new SlideMobile();
  window.app = app;
})($);

