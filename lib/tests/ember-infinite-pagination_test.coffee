module "IHID"

test "it is defined and an Ember.Namespace", ->
  ok IHID, "IHID is defined"

module "IHID.InfinitePagination",
  setup: ->
    window.controller = Ember.Object.create()#WithMixins IHID.InfinitePagination.ControllerMixin
    window.model = Ember.Object.create()#WithMixins IHID.InfinitePagination.ControllerMixin

  tearDown: ->
    window.controller.destroy()
    
test "setupRoute sets controller's variables correctly", ->
  IHID.InfinitePagination.setupRoute(model, controller)
  equal controller.get('currentPage'), 1
  equal controller.get('searchModel'), model
  equal JSON.stringify(controller.get('content')), "[]"

test "controller.updateData should not be called if preload is true", ->
  expect(0)
  controller.reopen updateData: ->
    ok false, "updateData should not be called without preloading specified"
  IHID.InfinitePagination.setupRoute(model, controller)

test "controller.updateData should be called if preload is true", ->
  controller.reopen updateData: ->
    ok true, "updateData should be called without preloading specified"
  IHID.InfinitePagination.setupRoute(model, controller, true)
