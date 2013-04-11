window.IHID or= {}
window.IHID.InfinitePagination =

  setupRoute: (model, controller, preload) ->
    content = []
    controller.set('currentPage', 1)
    if preload

      model.find(controller.paginationParams()).addObserver "isLoaded", ->
        content.addObjects(this)
    
    controller.set 'search_model', model
    controller.set "content", content

template = """
{{#if isLoading}}
  Fetching some more stuff <img width="10" src="img/ajax-loader.gif" />
{{else}}
  {{#if canLoadMore}}
    <a {{action "loadMore" }}> click to load more</a>
  {{else}}
    <strong><em>no more items</em></strong>
  {{/if}}
{{/if}}
"""

IHID.InfinitePagination.LoadMoreView = Ember.View.extend
  template: Ember.Handlebars.compile(template)
  didInsertElement: ->
    @$().bind 'inview', (e, isInView) =>
      Ember.tryInvoke(@get('controller'), 'loadMore') if isInView
