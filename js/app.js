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
          self.loadConversations(r, function (cs) {
            self.getRequests(cs, function (rqs) {
              Slide.Relationship.inlineReferences(r, cs, rqs, function (r) {
                r.vendor = r.left;
                store[r.id] = r;
                if (Object.keys(store).length == rs.length) {
                  cb(store);
                }
              });
            });
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
      var relationship = relationships[relationshipId];
      relationship.requests = relationship.requests.filter(function (r) {
        return !r.read;
      });
      relationship.user = self.user;
      cb(relationship);
    });
  };

  SlideMobile.prototype.loadConversations = function (relationship, cb) {
    relationship.getConversations({
      success: cb,
      failure: function() {
        cb([]);
      }});
  };

  SlideMobile.prototype.getConversations = function (relationshipId, cb) {
    var self = this;
    this.getRelationships(function (relationships) {
      self.loadConversations(relationships[relationshipId], cb);
    });
  };

  SlideMobile.prototype.getMessages = function (conversations, conversationId, types, cb) {
    var conversation = conversations[conversationId];
    conversation.getMessages(types, {
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

  SlideMobile.prototype.getRequests = function (conversations, cb) {
    var done = 0;
    var self = this;
    var ids = Object.keys(conversations);
    ids.forEach(function (conversationId) {
      self.getMessages(conversations, conversationId, ['request'], function (requests) {
        done += 1;
        conversations[conversationId].requests = requests;
        if (done == ids.length) {
          var rs = [];
          ids.forEach(function (id) {
            rs = rs.concat(conversations[id].requests);
          });
          cb(rs);
        }
      });
    });
  };

  SlideMobile.prototype.patchUser = function (form, cb) {
    var self = this;

    var data = { private: form.getPatchedUserData() };
    this.user.patch(data, {
      success: function (user) {
        self.user = user;
        self.persistUser(user);
        console.log('self.user:', self.user);
      },
      failure: function (fail) {
        console.log('failed to patch user');
      }
    });
  };

  SlideMobile.prototype.bindPushNotificationListeners = function () {
    var self = this;
    this.user.listen(function (message, socket) {
      console.log('requesting', message.blocks);
      self.switchToTab(1);
      self.replacePage('relationships');
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

        self.switchToTab(0);
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
          self.reloadPage();
        }
      });

      self.updateNavbar($page, { title: title, back: true });
      self.pushActivePageToDetail();
    });
  };

  SlideMobile.prototype.buildRelationshipPage = function ($page, relationship, cb) {
    var self = this;
    $page.html(this.templates['relationship']({
      relationship: relationship
    }));

    var $detail = $page.parents('.content').find('.page.detail');
    var $detail2 = $page.parents('.content').find('.page.detail2');
    $page.on('click', '.list-item', function () {
      var id = $(this).data('target');
      var request = relationship.requests.filter(function(r) {
        return r.id == id;
      })[0];
      self.buildForm($detail2, relationship.name, request.blocks, function (form) {
        self.patchUser(form, function (success) {
          console.log('patched user');
        });
        var data = form.getUserData();
        // TODO: better structure this data
        request.conversation.respond(request, data, {
          success: function (r) { console.log(r); },
          failure: function (evt) { console.log(evt); }
        });
      });
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
        self.patchUser(form, function (success) {
          console.log('patched user');
        });
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
    var self = this;
    this.buildPage(page, data, function($page) {
      self.pages[page].replaceWith($page);
      self.pages[page] = $page;

      if ($oldPage.hasClass('active')) {
        self.presentPage(page);
      }

      if ($oldPage.hasClass('pushed')) {
        self.pushToDetail(page);
      }
    });
  }

  SlideMobile.prototype.reloadPage = function () {
    var active = $('[data-page].active').data('page');
    this.replacePage(active);
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

  SlideMobile.prototype.switchToTab = function (index) {
    var tabs = this.$tabBar.find('.tab');
    var tab = tabs.eq(index);
    tab.addClass('active').siblings().removeClass('active');
    this.presentPage(tab.data('target'));
  };
  SlideMobile.prototype.initializeNavbarListeners = function () {
    var self = this;
    this.$tabBar.find('.tab').on('click', function () {
      var index = $(this).index();
      self.switchToTab(index);
    });
  };

  SlideMobile.prototype.pushToDetail = function (page, found) {
    page = found ? page : this.pages[page];
    if (page.is('.pushed')) {
      page.removeClass('pushed');
      page.addClass('pushed2');
    } else {
      page.addClass('pushed');
    }
  };

  SlideMobile.prototype.popToMaster = function (page, found) {
    page = found ? page : this.pages[page];
    if (page.is('.pushed2')) {
      page.removeClass('pushed2');
      page.addClass('pushed');
    } else {
      page.removeClass('pushed');
    }
  };

  SlideMobile.prototype.pushActivePageToDetail = function () {
    this.pushToDetail(this.getActivePage(), true);
  };

  SlideMobile.prototype.popActivePageToMaster = function () {
    this.popToMaster(this.getActivePage(), true);
  };

  var app = new SlideMobile(function (app) {
    app.presentPage(app.$tabBar.find('.tab.active').data('target'));
  });
})($);
