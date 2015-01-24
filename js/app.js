
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

    var self = this;
    this.mock('12223334444', function () {
      console.log('mocked');
      self.submit({ 'slide/life:bank/card' : 'hello' }, self.vendorUsers[0], self.forms[self.vendorUsers[0].uuid]['Mock'], function () {
        console.log('submitted mock form');
      });
    });
  };

  SlideMobile.prototype.submit = function (fields, vendorUser, vendorForm, cb) {
    var self = this;
    new Slide.Conversation(
      {type: 'vendor_form', upstream: vendorForm.id},
      {type: 'user', downstream: self.user.number, key: self.user.publicKey}, //TODO: change user to vendor-user
      function (conv) {
        conv.submit(vendorUser.uuid, fields);
        cb();
      }
    );
  };

  SlideMobile.prototype.mock = function (number, cb) {
    var self = this;
    //create vendor, create user, create vendoruser, create form, ...
    Slide.User.register(number, function (user) {
      console.log('user created', user);
      self.user = user;
      Slide.Vendor.invite('Mock vendor', function (vendor) {
        vendor.register(function (vendor) {
          console.log('vendor registered', vendor);
          vendor.createForm('Mock', '', ['slide.life:base.phone-number'], function (vendorForm) {
            console.log('mocked form created', vendorForm);
            Slide.VendorUser.createRelationship(user, vendor, function (vendorUser) {
              console.log('vendor user created', vendorUser);
              self.vendorUsers = [vendorUser];
              self.forms = {};
              vendorUser.loadVendorForms(function (vendorForms) {
                console.log('vendor forms incl mock loaded', vendorForms);
                self.forms[vendorUser.uuid] = vendorForms;
                console.log('here');
                cb();
              });
            });
          });
        });
      });
    });
  };

  SlideMobile.prototype.loadUser = function (number, cb) {
    if (this.user) cb(this.user);
    else Slide.User.load(number, function (user) {
      this.user = user;
      cb(this.user);
    });
  };

  SlideMobile.prototype.loadRelationships = function (number, cb) {
    if (this.vendorUsers) cb(this.vendorUsers);
    else this.loadUser(number, function (user) {
      user.loadRelationships(function (vendorUsers) {
        this.vendorUsers = vendorUsers;
        cb(vendorUsers);
      });
    });
  };

  SlideMobile.prototype.loadForms = function (number, cb) {
    if (this.forms) cb(this.forms);
    else {
      var deferreds = [];
      this.forms = {};
      this.loadRelationships(number, function (vendorUsers) {
        vendorUsers.forEach(function (vendorUser) {
          var deferred = new $.Deferred();
          deferreds.push(deferred);
          vendorUser.loadVendorForms(function (vendorForms) {
            this.forms[vendorUser.uuid] = vendorForms;
            deferred.resolve();
          });
        });
      });

      $.when.apply($, deferreds).done(function () {
        cb(this.forms);
      });
    }
  };

  SlideMobile.prototype.initializePages = function () {
    var self = this;

    this.pages.requests = this.initializeRequests();
    this.pages.profile = this.initializeProfile();
    this.pages.relationships = this.initializeRelationships();

    $.each(this.pages, function (page, $html) {
      self.$container.append($html);
    });

    this.$container.on('click', '.nav-bar .back-button', function () {
      self.popToMaster();
    });
  };

  SlideMobile.prototype.initializeRequests = function () {
    var self = this;
    var $requests = this.buildPage('requests', {
      requests: this.requests,
      title: 'Requests'
    });

    $requests.on('click', '.list-item', function () {
      var request = self.requests[$(this).data('target')];
      var $detail = $requests.find('.page.detail');
      Slide.Form.createFromIdentifiers($detail, request.fields, function (form) {
        form.build(self.profile, {
          onSubmit: function () {
            self.popToMaster();
          }
        });

        $detail.prepend(Handlebars.partials['nav-bar']({
          title: request.form,
          back: true
        }));
        self.pushToDetail();
      });
    });

    return $requests;
  };

  SlideMobile.prototype.initializeProfile = function () {
    var self = this;
    var $profile = this.buildPage('profile', {
      categories: this.categories,
      title: 'Profile'
    });

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
