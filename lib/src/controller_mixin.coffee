IHID.InfinitePagination.ControllerMixin = Ember.Mixin.create Ember.Evented,
  canLoadMore: true
  currentPage: 1
  isLoading: false
  resetLoadMore: -> @set('currentPage', 1)

  loadMore: ->
    return unless @get('canLoadMore')
    @incrementProperty('currentPage')
    @updateData()

  hasItems: (->
    @get('content.length') > 0
  ).property('content.length')

  search: ->
    @set('currentPage', 1)
    @get('model').clear()
    @updateData()

  updateData: ->
    @set('isLoading', true)
    controller = @
    @get('searchModel').find(@paginationParams()).addObserver 'isLoaded', ->
      controller.set('isLoading', false)
      controller.get('content').addObjects(@)
  
  paginationParams: ->
    page: @get('currentPage')
