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
    var self = this;

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
    var number = '16144408217';
    Slide.User.load(number, function(user) {
      user.getProfile(function (profile) {
        self.profile = Slide.User.deserializeProfile(profile);
      });
      user.listen(function(payload) {
        var vendorUUID = payload.vendorUser;
        var vendorForm = payload.form;
        new Slide.VendorUser(vendorUUID).load(function(vendorUser) {
          var row = $('.list-item').eq(0).clone();
          row.find('.title').text(payload.form.name);
          row.prependTo('.list-view');
          // TODO: open conversation with VendorForm
           new Slide.Conversation(
            {type: 'form', upstream: vendorForm.id },
            {type: 'vendor_user', downstream: vendorUser.uuid, key: vendorUser.public_key},
            function(conv) {
              conv.submit(vendorUser.uuid, {'slide/life:bank/card': 'hello'});
            });
        });
      });
    });

    this.getFormList(number, function(forms) {
      console.log('forms', forms);
    });
  };

  SlideMobile.prototype.getFormList = function(number, cb) {
    var self = this;
    this.loadForms(number, function(forms) {
      self.requests = [];
      for (vendorUserUuid in forms) {
        vendorUserForms = forms[vendorUserUuid];
        for (formName in vendorUserForms) {
          self.requests.push({
            form: formName,
            fields: vendorUserForms[formName].fields
          });
        }
      }
      cb(self.requests);
    });
  };

  // SlideMobile.prototype.submit = function (fields, vendorUser, vendorForm, cb) {
  //   var self = this;
  //   new Slide.Conversation(
  //     {type: 'vendor_form', upstream: vendorForm.id},
  //     {type: 'user', downstream: self.user.number, key: self.user.publicKey}, //TODO: change user to vendor-user
  //     function (conv) {
  //       conv.submit(vendorUser.uuid, fields);
  //       cb();
  //     }
  //   );
  // };

  SlideMobile.prototype.loadUser = function (number, cb) {
    if (this.user) {
      cb(this.user);
    } else {
      Slide.User.load(number, function (user) {
        this.user = user;
        cb(this.user);
      });
    }
  };

  SlideMobile.prototype.loadRelationships = function (number, cb) {
    if (this.vendorUsers) {
      cb(this.vendorUsers)
    } else {
      this.loadUser(number, function (user) {
        user.loadRelationships(function (vendorUsers) {
          this.vendorUsers = vendorUsers;
          cb(vendorUsers);
        });
      });
    }
  };

  SlideMobile.prototype.loadForms = function (number, cb) {
    if (this.forms) {
      cb(this.forms);
    } else {
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

    this.pages.requests = this.initializeRequestsPage();
    this.pages.profile = this.initializeProfilePage();
    this.pages.relationships = this.initializeRelationshipsPage();

    $.each(this.pages, function (page, $html) {
      self.$container.append($html);
    });

    this.$container.on('click', '.nav-bar .back-button', function () {
      self.popToMaster();
    });
  };

  SlideMobile.prototype.initializeRequestsPage = function () {
    var self = this;
    var $requests = this.buildPage('requests', {
      requests: this.requests,
      title: 'Requests'
    });

    var $master = $requests.find('.page.master');
    var $detail = $requests.find('.page.detail');
    $requests.on('click', '.list-item', function () {
      var request = self.requests[$(this).data('target')];
      console.log(self.requests);
      console.log($(this).data('target'));
      Slide.Form.createFromIdentifiers($detail.find('.body'), request.fields, function (form) {
        form.build(self.profile, {
          onSubmit: function () {
            self.popToMaster();
          }
        });

        self.updateNavbar($detail, { title: request.form, back: true });
        self.pushToDetail();
      });
    });

    return $requests;
  };

  SlideMobile.prototype.initializeProfilePage = function () {
    var self = this;
    var $profile = this.buildPage('profile', {
      categories: this.categories,
      title: 'Profile'
    });

    var $master = $profile.find('.page.master');
    var $detail = $profile.find('.page.detail');
    $master.on('click', '.list-item', function () {
      var category = self.categories[$(this).data('target')];
      Slide.Form.createFromIdentifiers($detail.find('.body'), category.fields, function (form) {
        form.build(self.profile, {
          onSubmit: function () {
            var serializedPatch = Slide.User.serializeProfile(form.getPatchedUserData());
            self.user.patchProfile(serializedPatch, function (profile) {
              self.profile = Slide.User.deserializeProfile(profile);
            });
            self.popToMaster();
          }
        });

        self.updateNavbar($detail, { title: category.description, back: true });
        self.pushToDetail();
      });
    });

    return $profile;
  };

  SlideMobile.prototype.initializeRelationshipsPage = function () {
    var self = this;
    var $relationships = this.buildPage('relationships', {
      title: 'Relationships',
      detail: {
        back: true
      }
    });

    var $master = $relationships.find('.page.master');
    var $detail = $relationships.find('.page.detail');
    $master.on('click', '.list-item', function () {
      var $detail = $relationships.find('.page.detail');
      self.updateNavbar($detail, { title: $(this).text(), back: true });
      self.pushToDetail();
    });

    return $relationships;
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

  SlideMobile.prototype.updateNavbar = function ($page, options) {
    var navBar = Handlebars.partials['nav-bar'](options);
    $page.find('.nav-bar').replaceWith(navBar);
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

  SlideMobile.prototype.getRequests = function (number, cb) {
    this.loadForms(number, function (forms) {
      var requests = [];
      for (vendorUserUUID in forms) {
        vendorUserForms = forms[vendorUserUUID];
        for (formName in vendorUserForms) {
          requests.push({
            form: formName,
            fields: vendorUserForms[formName].fields
          });
        }
      }
      cb(requests);
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
