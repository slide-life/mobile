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
    this.categories = CATEGORIES;

    // View logic
    this.$container = $('.container');
    this.$tabBar = $('.tab-bar');
    this.templates = SlideMobileTemplates;
    this.pages = {};

    var self = this;

    this.loginOrRegisterUser(function (user) {
      self.user = user;
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
    var self = this;
    this.loadUser(function(next) {
      Slide.User.create({ value: prompt('Enter a phone number.'), type: 'phone' },
        prompt('Enter a password.'), {
          success: function(user) {
            self.persistUser(user);
            next(user);
          },
          failure: function() { console.log('failed'); }
        });
    }, cb);
  };

  SlideMobile.prototype.persistUser = function(user) {
    localStorage.user = JSON.stringify(Slide.User.toObject(user));
  };

  SlideMobile.prototype.loadUser = function(middleware, cb) {
    if (localStorage.user) {
      cb(Slide.User.fromObject(JSON.parse(localStorage.user)));
    } else {
      middleware(cb);
    }
  };

  SlideMobile.prototype.getProfile = function () {
    return this.user.profile;
  };

  SlideMobile.prototype.getRelationships = function (cb) {
    var self = this;
    this.user.getRelationships({
      success: function(rs) {
        var store = {};
        if (rs.length == 0) {
          cb(store);
        }
        rs.forEach(function (r) {
          Slide.Relationship.inlineReferences(r, function (r) {
            r.vendor = r.left;
            store[r.id] = r;
            if (Object.keys(store).length == rs.length) {
              cb(store);
            }
          });
        });
      },
      failure: function() {
        console.log('fail');
      } });
  };

  SlideMobile.prototype.getRelationship = function (relationshipId, cb) {
    var self = this;
    this.getRelationships(function (relationships) {
      self.getConversations(relationshipId, function (conversations) {
        self.getMessages(conversations, Object.keys(conversations)[0], function (requests) {
          var relationship = relationships[relationshipId];
          relationship.conversations = conversations;
          relationship.requests = requests;
          cb(relationship);
        });
      });
    });
  };

  SlideMobile.prototype.getConversations = function (relationshipId, cb) {
    this.getRelationships(function (relationships) {
      var relationship = relationships[relationshipId];
      relationship.getConversations({
        success: cb,
        failure: function() {
          cb([]);
        }});
    });
  };

  SlideMobile.prototype.getMessages = function (conversations, conversationId, cb) {
    var conversation = conversations[conversationId];
    conversation.getMessages({
      success: function(ms) {
        cb(ms.map(function(m) {
          m.conversation = conversation;
          return m;
        }));
      },
      failure: function() {
        cb([]);
      }});
  };

  SlideMobile.prototype.getRequests = function (relationshipId, cb) {
    // TODO
    cb(FIXTURE.user.relationships.huit.requests);
  };

  SlideMobile.prototype.bindPushNotificationListeners = function () {
    var self = this;
    this.user.listen(function (message, socket) {
      console.log('requesting', message.blocks);
      // TODO: mkdir -p relationship/conversation/request and reload view data
    });
  }

  SlideMobile.prototype.initializePages = function () {
    var self = this;
    this.buildPage('profile', {}, function(profile) {
    self.buildPage('relationships', {}, function(relationships) {

      self.pages.profile = profile;
      self.pages.relationships = relationships;
      $.each(self.pages, function (page, $html) {
        self.$container.append($html);
      });

      self.$container.on('click', '.nav-bar .back-button', function () {
        self.popActivePageToMaster();
      });

    });
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

    var $detail = $page.find('.page.detail');
    $page.on('click', '.list-item', function () {
      console.log('take action', $page);
    });

    this.updateNavbar($page, { title: relationship.left.name, back: true });
    this.pushActivePageToDetail();
  };

  SlideMobile.prototype.buildProfilePage = function (page, data, cb) {
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
      // TODO: form needs to be populated with profile data.
      self.buildForm($detail, category.description, category.fields, function (form) {
        var data = { private: form.getPatchedUserData() };
        self.user.patch(data, {
          success: function (user) {
            self.profile = user.profile;
          },
          failure: function(fail) {
          } });
      });
    });

    cb($profile);
  };

  SlideMobile.prototype.buildRelationshipsPage = function (page, data, cb) {
    var self = this;

    this.getRelationships(function (relationships) {
      var $relationships = $(self.templates[page]({
        title: 'Relationships',
        relationships: relationships
      }));
      $relationships.attr('data-page', page);

      var $master = $relationships.find('.page.master');
      var $detail = $relationships.find('.page.detail');
      $master.on('click', '.list-item', function () {
        var relationshipId = $(this).data('target');
        self.getRelationship(relationshipId, function (relationship) {
          self.buildRelationshipPage($detail, relationship);
        });
      });

      cb($relationships);
    });
  };

  SlideMobile.prototype.buildPage = function (page, data, cb) {
    if (page === 'profile') {
      this.buildProfilePage(page, data, cb);
    } else if (page === 'relationships') {
      this.buildRelationshipsPage(page, data, cb);
    } else {
      new Error('Invalid page');
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
