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