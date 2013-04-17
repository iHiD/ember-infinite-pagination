module "IHID.InfinitePagination.ControllerMixin",
  setup: ->
    window.controller = Ember.Object.createWithMixins IHID.InfinitePagination.ControllerMixin

  tearDown: ->
    window.controller.destroy()
    
test "defaults are set correctly", ->
  equal controller.currentPage, 1, "Current page is 1"
  equal controller.canLoadMore, true, "Can load more is true"
  equal controller.isLoading, false, "Is loading is false"

test "resetLoadMore sets currentPage back to 1", ->
  controller.currentPage = 10
  equal controller.currentPage, 10, "precond - currentPage is set to 10"
  controller.resetLoadMore()
  equal controller.currentPage, 1, "currentPage of controller has been reset to 1"

test "hasItems correctly determines if there are items", ->
  equal controller.get('hasItems'), false
  controller.set('content', [1,2,3,4])
  equal controller.get('hasItems'), true

test "loadMore increments currentPage and invokes updateData", ->
  expect 2

  controller.currentPage = 1
  controller.reopen updateData: ->
    ok true, "updateData has been called"

  controller.loadMore()

  equal controller.currentPage, 2, "currentPage has been incremented"

test "search resets page and clears model", ->

  controller.currentPage = 4
  controller.model = [1,2,3,4]
  controller.reopen updateData: ->
    ok true, "updateData has been called"

  controller.search()
  equal controller.currentPage, 1, "currentPage has been incremented"
  equal controller.model.length, 0, "model has been cleared"

test "search calls updateData()", ->
  controller.model = [1,2,3,4]
  controller.reopen updateData: ->
    ok true, "updateData has been called"
  controller.search()

test "update Data toggles isLoading", ->
  controller.set('content', [])
  controller.set('searchModel', {find: -> {addObserver: (s,f) -> f() }})
  controller.set('isLoading', true)
  controller.updateData()
  equal controller.get('isLoading'), false

test "update Data toggles addsObjects to content", ->
  controller.set('content', [])
  o = [1,2,3,4]
  o.addObserver = ((eventName,callback) -> callback.call(@))
  controller.set('searchModel', {find: (params) -> o})
  controller.updateData()
  equal JSON.stringify(controller.get('content')), JSON.stringify([1,2,3,4])

test "paginationParams adds currentPage", ->
  controller.currentPage = 4
  equal JSON.stringify(controller.paginationParams()),
        JSON.stringify({page: 4}),
        "paginationParams are set correctly"
