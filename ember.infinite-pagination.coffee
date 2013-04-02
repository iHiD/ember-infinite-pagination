window.IHID or= {}
window.IHID.InfinitePagination =

  setupRoute: (store, model, controller) ->
    content = store.filter model, controller.paginationParams(), (data) ->
      true

    controller.set 'content', content

IHID.InfinitePagination.ControllerMixin = Ember.Mixin.create Ember.Evented,
  canLoadMore: true
  currentPage: 1
  isLoading: false
  resetLoadMore: -> @set('currentPage', 1)

  loadMore: ->
    return unless @get('canLoadMore')
    @incrementProperty('currentPage')
    @updateData()

  search: ->
    @set('currentPage', 1)
    @get('model').clear()
    @updateData()

  updateData: ->
      @set('isLoading', true)
      @get('model').type.find(@paginationParams()).addObserver 'isLoaded', =>
          @set('isLoading', false)
  
  paginationParams: ->
    page: @get('currentPage')

template = """
{{#if isLoading}}
  Fetching some more stuff <img width="10" src="img/ajax-loader.gif" />
{{else}}
  {{#if canLoadMore}}
    <a {{action "loadMore" target="controller" }}> click to load more</a>
  {{else}}
    <strong><em>no more items</em></strong>
  {{/if}}
{{/if}}
"""

IHID.InfinitePagination.LoadMoreView = Ember.View.extend
  template: Ember.Handlebars.compile(template)
  didInsertElement: ->
    @$().bind 'inview', (event, isInView, visiblePartX, visiblePartY) =>
      Ember.tryInvoke(@get('controller'), 'loadMore') if isInView
