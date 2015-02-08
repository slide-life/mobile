(function ($) {
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

  var FIXTURE = {
    user: {
      profile: {
        'slide.life:university.id': '428190849018301',
        'slide.life:university.current-level': 'Freshman'
      },
      keys: {
        private: 'something',
        public: 'something',
        symmetric: 'something'
      },
      relationships: {
        'huit': {
          id: 'huit',
          vendor: {
            name: 'HUIT',
            profile: [
              {
                description: 'Test attribute',
                value: 'Test'
              }
            ]
          },
          conversations: {
            'huit-A': {
              id: 'huit-A',
              name: 'Sign up',
              messages: {
                'huit-A-0': {
                  id: 'huit-A-0',
                  kind: 'request',
                  fields: [
                    'slide.life:university'
                  ]
                },
                'huit-A-1': {
                  id: 'huit-A-1',
                  kind: 'response',
                  responses: {
                    'slide.life:university.id': '428190849018301',
                    'slide.life:university.current-level': 'Freshman'
                  },
                  responseTo: 'huit-A-0'
                }
              }
            },
            'huit-B': {
              id: 'huit-B',
              name: 'Some other request',
              messages: {
                'huit-B-0': {
                  id: 'huit-B-0',
                  kind: 'request',
                  fields: [
                    'slide.life:name'
                  ]
                }
              }
            }
          },
          requests: {
            'huit-B-0': {
              id: 'huit-B-0',
              conversation: {
                id: 'huit-B',
                name: 'Some other request'
              },
              kind: 'request',
              fields: [
                'slide.life:name'
              ]
            }
          }
        }
      }
    }
  };

  var SlideMobile = function (cb) {
    var self = this;

    // Data
    this.user = FIXTURE.user;
    this.categories = CATEGORIES;

    // View logic
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;
    this.pages = {};

    var self = this;

    this.loginOrRegisterUser(function (user) {
      //Notification listeners
      self.bindPushNotificationListeners();

      //View initialization
      self.initializePages();
      self.initializeNavbarListeners();

      //Finished
      cb(self);
    });
  };

  SlideMobile.prototype.loginOrRegisterUser = function (cb) {
    if (this.user) {
      cb(this.user);
    } else {
      this.user = FIXTURE.user;
      cb(this.user);
      //TODO
    }
  };

  SlideMobile.prototype.getProfile = function () {
    return this.user.profile;
  };

  SlideMobile.prototype.getRelationships = function () {
    //TODO
    return this.user.relationships;
  };

  SlideMobile.prototype.getRelationship = function (relationshipId) {
    var self = this;

    var relationships = this.getRelationships()
    console.log(relationships);
    return relationships[relationshipId];
    /*
    this.getConversations(relationshipId, function (conversations) {
      this.getRequests(relationshipId, function (requests) {
      });
    });*/
  };

  SlideMobile.prototype.getConversations = function (relationshipId, cb) {
  };

  SlideMobile.prototype.getMessages = function (relationshipId, conversationId, cb) {
  };

  SlideMobile.prototype.getRequests = function (relationshipId, cb) {
  };

  SlideMobile.prototype.bindPushNotificationListeners = function () {
    var self = this;
    //this.user.listen(function (payload) {
      //console.log(payload);
      //TODO
    //});
  }

  SlideMobile.prototype.initializePages = function () {
    var self = this;

    this.pages.profile = this.buildPage('profile');
    this.pages.relationships = this.buildPage('relationships');

    $.each(this.pages, function (page, $html) {
      self.$container.append($html);
    });

    this.$container.on('click', '.nav-bar .back-button', function () {
      self.popActivePageToMaster();
    });
  };

  SlideMobile.prototype.buildForm = function ($page, title, fields, submitForm) {
    var self = this;

    Form.createFromIdentifiers($page.find('.body'), fields, function (form) {
      var profile = self.getProfile();
      form.build(profile, {
        onSubmit: function () {
          submitForm(form);
          self.popActivePageToMaster();
        }
      });

      self.updateNavbar($page, { title: title, back: true });
      self.pushActivePageToDetail();
    });
  };

  SlideMobile.prototype.buildRelationshipPage = function ($page, relationship, cb) {
    $page.html(this.templates['relationship']({
      relationship: relationship
    }));

    this.updateNavbar($page, { title: relationship.vendor.name, back: true });
    this.pushActivePageToDetail();
  };

  //SlideMobile.prototype.buildRequestsPage = function (page, data) {
    //$master.on('click', '.list-item', function () {
      //var request = self.requests[$(this).data('target')];
  //};

  SlideMobile.prototype.buildProfilePage = function (page, data) {
    var self = this;
    var $profile = $(this.templates[page]({
      categories: this.categories,
      title: 'Profile'
    }));
    $profile.attr('data-page', page);

    var $master = $profile.find('.page.master');
    var $detail = $profile.find('.page.detail');
    $master.on('click', '.list-item', function () {
      var category = self.categories[$(this).data('target')];
      self.buildForm($detail, category.description, category.fields, function (form) {
        console.log(form.getPatchedUserData());

        /* TODO: refactored
        var serializedPatch = Slide.User.serializeProfile(form.getPatchedUserData());
        self.user.patchProfile(serializedPatch, function (profile) {
          self.profile = Slide.User.deserializeProfile(profile);
        });*/
      });
    });

    return $profile;
  };

  SlideMobile.prototype.buildRelationshipsPage = function (page, data) {
    var self = this;

    var $relationships = $(this.templates[page]({
      title: 'Relationships',
      relationships: this.getRelationships()
    }));
    $relationships.attr('data-page', page);

    var $master = $relationships.find('.page.master');
    var $detail = $relationships.find('.page.detail');
    $master.on('click', '.list-item', function () {
      var relationshipId = $(this).data('target');
      var relationship = self.getRelationship(relationshipId);
      self.buildRelationshipPage($detail, relationship);
    });

    return $relationships;
  };

  SlideMobile.prototype.buildPage = function (page, data) {
    if (page === 'profile') {
      return this.buildProfilePage(page, data);
    } else if (page === 'relationships') {
      return this.buildRelationshipsPage(page, data);
    } else {
      throw new Error('Invalid page');
    }
  };

  SlideMobile.prototype.replacePage = function (page, data) {
    var $oldPage = this.pages[page];
    var $page = this.buildPage(page, data);
    this.pages[page].replaceWith($page);
    this.pages[page] = $page;

    if ($oldPage.hasClass('active')) {
      this.presentPage(page);
    }

    if ($oldPage.hasClass('pushed')) {
      this.pushToDetail(page);
    }
  }

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

  SlideMobile.prototype.pushToDetail = function (page) {
    this.pages[page].addClass('pushed');
  };

  SlideMobile.prototype.popToMaster = function () {
    this.pages[page].removeClass('pushed');
  };

  SlideMobile.prototype.pushActivePageToDetail = function () {
    this.getActivePage().addClass('pushed');
  };

  SlideMobile.prototype.popActivePageToMaster = function () {
    this.getActivePage().removeClass('pushed');
  };

  var app = new SlideMobile(function (app) {
    app.presentPage(app.$tabBar.find('.tab.active').data('target'));
  });
})($);
