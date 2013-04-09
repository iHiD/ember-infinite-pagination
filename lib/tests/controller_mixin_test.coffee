module "IHID.InfinitePagination.ControllerMixin",
  setup: ->
    window.controller = Ember.Object.createWithMixins IHID.InfinitePagination.ControllerMixin

  tearDown: ->
    window.controller.destroy()

test "resetLoadMore sets currentPage back to 1", ->
  controller.currentPage = 10
  equal controller.currentPage, 10, "precond - currentPage is set to 10"
  controller.resetLoadMore()
  equal controller.currentPage, 1, "currentPage of controller has been reset to 1"

test "loadMore increments currentPage and invokes updateData", ->
  expect 2

  controller.currentPage = 1
  controller.reopen updateData: ->
    ok true, "updateData has been called"

  controller.loadMore()

  equal controller.currentPage, 2, "currentPage has been incremented"

test "search resets page and clears model", ->
  expect 3

  controller.currentPage = 4
  controller.model = [1,2,3,4]
  controller.reopen updateData: ->
    ok true, "updateData has been called"

  controller.search()
  equal controller.currentPage, 1, "currentPage has been incremented"
  equal controller.model.length, 0, "model has been cleared"

test "paginationParams adds currentPage", ->
  controller.currentPage = 4
  equal JSON.stringify(controller.paginationParams()),
        JSON.stringify({page: 4}),
        "paginationParams are set correctly"
