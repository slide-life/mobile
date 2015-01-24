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
    })
  };

  var app = new SlideMobile();
})($);
