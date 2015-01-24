(function ($) {
  var SlideMobile = function () {
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;

    this.initializePages();
    this.initializeNavbarListeners();
    this.presentPage(this.$tabBar.find('.tab.active').data('target'));
  };

  SlideMobile.prototype.initializePages = function () {
    var self = this;
    this.$tabBar.find('.tab').map(function () {
      var page = $(this).data('target');
      var $template = $(self.templates[page]());

      $template.attr('data-page', page);

      self.$container.append($template);
    });
  };

  SlideMobile.prototype.presentPage = function (target) {
    this.$container.attr('data-page', target);
    this.$container.find('.content').removeClass('active');
    this.$container.find('.content[data-page=' + target + ']').addClass('active');
  };

  SlideMobile.prototype.getActivePage = function () {
    return this.$container.find('.content.active');
  };

  SlideMobile.prototype.initializeNavbarListeners = function () {
    var self = this;
    this.$tabBar.find('.tab').on('click', function () {
      $(this).addClass('active').siblings().removeClass('active');
      self.presentPage($(this).data('target'));
    });
  };

  SlideMobile.prototype.pushToDetail = function () {
    this.getActivePage().addClass('pushed');
  };

  SlideMobile.prototype.popToMaster = function () {
    this.getActivePage().removeClass('pushed');
  };

  var app = new SlideMobile();
})($);

