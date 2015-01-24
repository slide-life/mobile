(function ($) {
  var REQUESTS = [
    {
      form: 'The Coop Signup',
      fields: ['name', 'address', 'bank.card']
    },
    {
      form: 'Insomnia Cookies Loyalty',
      fields: ['name', 'email', 'mobile-phone']
    }
  ];

  var CATEGORIES = {
    banking: {
      description: 'Banking',
      fields: ['bank.account', 'bank.card']
    },
    'contact-details': {
      description: 'Contact details',
      fields: ['email', 'mobile-phone', 'home-phone', 'work-phone']
    },
    education: {
      description: 'Education',
      fields: ['university']
    },
    healthcare: {
      description: 'Healthcare',
      fields: ['allergies']
    },
    identification: {
      description: 'Identification',
      fields: ['signature', 'ssn', 'passport', 'id-card', 'drivers-license']
    },
    personal: {
      description: 'Personal',
      fields: ['name', 'profile-picture', 'date-of-birth', 'country-of-citizenship', 'gender', 'sex', 'occupation', 'place-of-birth', 'religion', 'ethnicity', 'spoken-languages', 'address']
    }
  };

  var SlideMobile = function () {
    // Data
    this.categories = CATEGORIES;
    this.profile = {};
    this.requests = REQUESTS;

    // View logic
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;
    this.pages = {};

    // View initialization
    this.initializePages();
    this.initializeNavbarListeners();
  };

  SlideMobile.prototype.initializePages = function () {
    var self = this;

    this.pages.requests = this.initializeRequests();
    this.pages.profile = this.initializeProfile();
    this.pages.relationships = this.initializeRelationships();

    $.each(this.pages, function (page, $html) {
      self.$container.append($html);
    });
  };

  SlideMobile.prototype.initializeRequests = function () {
    var self = this;
    var $requests = this.buildPage('requests', { requests: this.requests });

    $requests.on('click', '.list-item', function () {
      var request = self.requests[$(this).data('target')];
      Slide.Form.createFromIdentifiers($requests.find('.page.detail'), request.fields, function (form) {
        form.build(self.profile, {
          onSubmit: function () {
            self.popToMaster();
          }
        });
        self.pushToDetail();
      });
    });

    return $requests;
  };

  SlideMobile.prototype.initializeProfile = function () {
    var self = this;
    var $profile = this.buildPage('profile', { categories: this.categories });

    $profile.on('click', '.list-item', function () {
      var category = self.categories[$(this).data('target')];
      Slide.Form.createFromIdentifiers($profile.find('.page.detail'), category.fields, function (form) {
        form.build(self.profile, {
          onSubmit: function () {
            self.popToMaster();
          }
        });
        self.pushToDetail();
      });
    });

    return $profile;
  };

  SlideMobile.prototype.initializeRelationships = function () {
  };

  SlideMobile.prototype.buildPage = function (page, data) {
    var $template = $(this.templates[page](data));
    $template.attr('data-page', page);
    return $template;
  };

  SlideMobile.prototype.presentPage = function (page) {
    this.$container.attr('data-page', page);
    this.$container.find('.content').removeClass('active');
    this.$container.find('.content[data-page=' + page + ']').addClass('active');
  };

  SlideMobile.prototype.getPage = function (page) {
    return this.pages[page];
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
  app.presentPage(app.$tabBar.find('.tab.active').data('target'));
})($);

