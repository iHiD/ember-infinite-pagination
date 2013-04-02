(function() {
  var template;

  window.IHID || (window.IHID = {});

  window.IHID.InfinitePagination = {
    setupRoute: function(store, model, controller) {
      var content;

      content = store.filter(model, controller.paginationParams(), function(data) {
        return true;
      });
      return controller.set('content', content);
    }
  };

  IHID.InfinitePagination.ControllerMixin = Ember.Mixin.create(Ember.Evented, {
    canLoadMore: true,
    currentPage: 1,
    isLoading: false,
    resetLoadMore: function() {
      return this.set('currentPage', 1);
    },
    loadMore: function() {
      if (!this.get('canLoadMore')) {
        return;
      }
      this.incrementProperty('currentPage');
      return this.updateData();
    },
    search: function() {
      this.set('currentPage', 1);
      this.get('model').clear();
      return this.updateData();
    },
    updateData: function() {
      var _this = this;

      this.set('isLoading', true);
      return this.get('model').type.find(this.paginationParams()).addObserver('isLoaded', function() {
        return _this.set('isLoading', false);
      });
    },
    paginationParams: function() {
      return {
        page: this.get('currentPage')
      };
    }
  });

  template = "{{#if isLoading}}\n  Fetching some more stuff <img width=\"10\" src=\"img/ajax-loader.gif\" />\n{{else}}\n  {{#if canLoadMore}}\n    <a {{action \"loadMore\" target=\"controller\" }}> click to load more</a>\n  {{else}}\n    <strong><em>no more items</em></strong>\n  {{/if}}\n{{/if}}";

  IHID.InfinitePagination.LoadMoreView = Ember.View.extend({
    template: Ember.Handlebars.compile(template),
    didInsertElement: function() {
      var _this = this;

      return this.$().bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
        if (isInView) {
          return Ember.tryInvoke(_this.get('controller'), 'loadMore');
        }
      });
    }
  });

}).call(this);