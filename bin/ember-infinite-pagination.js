/*! Infinite Pagination for EmberJS
* (c) 2013 Jeremy Walker <jez.walker@gmail.com>
* MIT Licensed.
*
* Written by iHiD (Jeremy Walker) - Based on an idea by @pangratz
*
* https://github.com/iHiD/ember-infinite-pagination
*/
(function() {
    var template;
    window.IHID || (window.IHID = {});
    window.IHID.InfinitePagination = {
        setupRoute: function(model, controller, preload) {
            var content;
            content = [];
            controller.set("currentPage", 1);
            controller.set("searchModel", model);
            controller.set("content", content);
            if (preload) {
                return controller.updateData();
            }
        }
    };
    template = '{{#if isLoading}}\n  Fetching some more stuff <img width="10" src="img/ajax-loader.gif" />\n{{else}}\n  {{#if canLoadMore}}\n    <a {{action "loadMore" }}> click to load more</a>\n  {{else}}\n    <strong><em>no more items</em></strong>\n  {{/if}}\n{{/if}}';
    IHID.InfinitePagination.LoadMoreView = Ember.View.extend({
        template: Ember.Handlebars.compile(template),
        didInsertElement: function() {
            var _this = this;
            return this.$().bind("inview", function(e, isInView) {
                if (isInView) {
                    return Ember.tryInvoke(_this.get("controller"), "loadMore");
                }
            });
        }
    });
}).call(this);

(function() {
    IHID.InfinitePagination.ControllerMixin = Ember.Mixin.create(Ember.Evented, {
        canLoadMore: true,
        currentPage: 1,
        isLoading: false,
        resetLoadMore: function() {
            return this.set("currentPage", 1);
        },
        loadMore: function() {
            if (!this.get("canLoadMore")) {
                return;
            }
            this.incrementProperty("currentPage");
            return this.updateData();
        },
        hasItems: function() {
            return this.get("content.length") > 0;
        }.property("content.length"),
        search: function() {
            this.set("currentPage", 1);
            this.get("model").clear();
            return this.updateData();
        },
        updateData: function() {
            var controller;
            this.set("isLoading", true);
            controller = this;
            return this.get("searchModel").find(this.paginationParams()).addObserver("isLoaded", function() {
                controller.set("isLoading", false);
                return controller.get("content").addObjects(this);
            });
        },
        paginationParams: function() {
            return {
                page: this.get("currentPage")
            };
        }
    });
}).call(this);