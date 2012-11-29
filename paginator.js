/**
 * paginator.js
 * ------------
 * A super fast paginator, built in Prototype.
 * 
 * Usage:
 *   paginated = new Paginator(myElement, options);
 *   paginated.build();
 * 
 * Available methods:
 *   build()     - Builds the layout and throws the element's children into individual pages
 *   goToPage(n) - Go to a specific page
 *   destroy()   - Reverts the paginated element back to its original state.
 * 
 * Available options and their defaults:
 *   amount:   3
 *   numbers:  true
 *   paddles:  true
 *   prevText: 'Previous'
 *   nextText: 'Next'
 * 
 * Paginator also has callbacks available. These are options with a function as a value.
 * Available callbacks:
 *   onInvalidPage
 * 
 * Credits:
 *   Author: Jake Bellacera (http://jakebellacera.com)
 *   URL:    http://github.com/jakebellacera/paginator
 */

var Paginator, PaginatorPage;

Paginator = Class.create({
  initialize: function (container, opts) {
    // Override any default settings
    this.settings = Object.extend({
      amount: 3,
      numbers: true,
      paddles: true,
      prevText: 'Previous',
      nextText: 'Next',
      onInvalidPage: function (n) {
        alert('Went to invalid page:' + n);
      }
    }, opts);

    // Set the container
    this.container = container;

    return this;
  },

  // Build
  build: function () {
    var self = this;

    // Unset destroyed status
    self.built = true;

    // Get the child elements
    self.children = self.container.childElements();

    // Pages accessor
    self.pages = [];

    // Set the current page to 0
    self.curPage = 0;

    // Create the pages' container
    self.wrap = new Element('div', {'class': 'pagination-pages'});
    self.container.insert(self.wrap);

    // Build the pages
    for (var i = 0; i < Math.ceil(self.children.length/self.settings.amount); i++) {
      self.pages.push( new PaginatorPage( new Element('div', { 'class': 'page-' + (i+1)}) ) );
      self.wrap.insert(self.pages[i].node);

      // Put scoped child elements into the page
      self.children.slice(i * self.settings.amount, ((i+1) * self.settings.amount) || 9e9).each(function (child) {
        self.pages[i].add(child);
      });
    }

    // Build the navigation
    self.createNav();

    // Go to the first page
    self.goToPage(self.curPage);

    return self;
  },

  // Build navigation
  createNav: function () {
    var self = this, a;

    if (self.built) {
      // Create the navigation container
      self.nav = new Element('div', { 'class': 'pagination-nav' });
      self.container.insert(self.nav);

      // Numbers navigation handler (1,2,3,4,etc)
      if (self.settings.numbers === true) {
        self.numbers = new Element('div', {'class': 'pagination-numbers'});

        for (var i = 0; i < self.pages.length; i++) {
          // Create a number URL
          a = new Element('a', {'href': '#'}).insert(i+1);
          a.on('click', function () {
            if (!this.hasClassName('active')) {
              self.goToPage(this.previousSiblings().length);
            }
            return false;
          });
          self.numbers.insert(a);
        }

        // Put numbers nav inside nav container
        self.nav.insert(self.numbers);
      }

      // Paddle navigation handler (next/prev)
      if (self.settings.paddles) {
        // Prev button
        self.prevPaddle = new Element('a', {'href': '#', 'class': 'pagination-paddle prev'}).insert(self.settings.prevText);
        self.prevPaddle.on('click', function () {
          if (!this.hasClassName('disabled')) {
            self.goToPage(self.curPage - 1);
          }
        });

        // Next button
        self.nextPaddle = new Element('a', {'href': '#', 'class': 'pagination-paddle next'}).insert(self.settings.nextText);
        self.nextPaddle.on('click', function () {
          if (!this.hasClassName('disabled')) {
            self.goToPage(self.curPage + 1);
          }
        });

        // Append paddle buttons to the navigation container
        self.nav.insert({
          top: self.prevPaddle,
          bottom: self.nextPaddle
        });
      }
    } else {
      throw("Paginator is not built. Please run build() before executing this method.");
    }

    return self;
  },

  // Page traversing handler
  goToPage: function (pageNumber) {
    var self = this;

    try {
      if (self.built) {
        self.pages[pageNumber].node.show().siblings().each(function (siblingPage) {
          siblingPage.hide();
        });

        self.curPage = pageNumber;

        // Handle number nav
        if (self.settings.numbers) {
          self.numbers.childElements()[self.curPage].addClassName('active').siblings().each(function (sibling) {
            sibling.removeClassName('active');
          });
        }

        // Handle paddle nav
        if (self.settings.paddles) {
          if (self.curPage === 0) {
            self.prevPaddle.addClassName('disabled');
          } else {
            self.prevPaddle.removeClassName('disabled');
          }

          if (self.curPage === (self.pages.length - 1)) {
            self.nextPaddle.addClassName('disabled');
          } else {
            self.nextPaddle.removeClassName('disabled');
          }
        }
      } else {
        throw("Error: Paginator is not built. Please run build() before executing this method.");
      }

    } catch (TypeError) {
      self.settings.onInvalidPage(pageNumber);
    }

    return self;
  },

  // Completely remove paginator
  destroy: function () {
    var self = this;

    if (self.built) {
      self.pages.each(function (page) {
        // Move elements back into container
        page.destroy(self.container);
      });

      // remove wrapper
      self.wrap.remove();

      // Remove navigation
      self.nav.remove();

      // Set destroyed status
      self.built = false;
    } else {
      throw("Error: Paginator is not built. Please run build() before executing this method.");
    }

    return self;
  }
});

PaginatorPage = Class.create({
  intialize: function (container) {
    this.container = container.hide();
    return this;
  },

  // Add a child element
  add: function (ele) {
    return this.container.insert(ele);
  },

  // Destructor method. Moves all child elements to a new location
  // and then removes itself.
  destroy: function (newLocation) {
    this.container.remove().childElements().each(function (child) {
      newLocation.insert(child);
    });
    return this;
  }
});
