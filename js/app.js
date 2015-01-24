(function ($) {
  var SlideMobile = function () {
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;

    this.initializeNavbarListeners();
    this.presentTabBarView(this.$tabBar.find('.tab.active').data('target'));
  };

  SlideMobile.prototype.presentTabBarView =  function (target) {
    this.$container.html(this.templates[target]());
  };

  SlideMobile.prototype.initializeNavbarListeners = function () {
    var self = this;
    this.$tabBar.find('.tab').on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      self.presentTabBarView($(this).data('target'));
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

