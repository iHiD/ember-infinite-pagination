Infinite Pagination for EmberJS
-----

This adds infinite pagination to [Ember JS](http://emberjs.com/). It works, but it is a work in progress and maybe be riddled with bugs.

Please add issues galore as I intend to make this good :smiley:

## Usage

In your route: 
```
App.BlogPostsRoute = Ember.Route.extend

  setupController: (controller, model) ->
      IHID.InfinitePagination.setupRoute(Meducation.store, Meducation.Resource, controller)
```
      
In your controller:
```
Meducation.ResourcesController = Ember.ArrayController.extend(
  IHID.InfinitePagination.ControllerMixin,

  # Some logic for whether more items can be loaded. 
  # Defaults to: 
  canLoadMore: (->
    @get('currentPage') < 10
  ).property('currentPage')
)
```
      
In your template:

```
{{#each blog_post in controller}}
  {{render 'blog_post' blog_post}}
{{/each}}

{{view IHID.InfinitePagination.LoadMoreView}}
```

## Credit

The original idea and code for this was by @pangratz. See [this Stack Overflow question](http://stackoverflow.com/questions/11907093/infinite-scroll-with-ember-js-lazy-loading) and [these](https://github.com/pangratz/dashboard/commit/68d1728ec26dae5062eae5be43d61083cfc34f14) [commits](https://github.com/iHiD/meducation_mobile_app/commit/8bd955df461f2813de643cc47b9d8e032b1cec9c) for history. I am now turning that into something more generic and maintainable.

## Licence
Copyright (c) 2013 Jeremy Walker and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.