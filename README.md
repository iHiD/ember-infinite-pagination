Infinite Pagination for EmberJS
-----

This adds infinite pagination to [Ember JS](http://emberjs.com/). It works, but it is a work in progress and maybe be riddled with bugs.

Please add issues galore as I intend to make this good :smiley:

## Usage

In your route, you need to setup the controller to have the correct data. Simply pass in your store, model and controller, and the data will be loaded from your paginationParams (see under config).
``` javascript
App.BlogPostsRoute = Ember.Route.extend({
  setupController: function(controller) {
    IHID.InfinitePagination.setupRoute(App.store, App.BlogPost, controller)
  }
})
```
      
In your controller, extend the controller mixin:
``` javascript
Meducation.ResourcesController = Ember.ArrayController.extend(IHID.InfinitePagination.ControllerMixin)
```
      
In your template, use the LoadMoreView, e.g.:

``` handlebars
{{#each blog_post in controller}}
  {{render 'blog_post' blog_post}}
{{/each}}

{{view IHID.InfinitePagination.LoadMoreView}}
```

## Configuration

You can override certain options in the controller.

### Can I load more data?

Specify whether more data can be loaded from the server. Defaults to:

``` javascript
canLoadMore:function() {
    this.get('currentPage') < 10
}.property('currentPage')
```

### Changing the parameters

By default, the current page is added to the request. You can add more parameters like so:
``` javascript
paginationParams: function(){
    $.extend(this._super(), {searchCriteria: $('.search').val()})
}
```

### Searching

There is some build in support for searching. To implement it, add the following to your view (you'll need a textbox with a class of search in your template).

``` javascript
didInsertElement: function() {
    $('.search').keypress(function(){
      Ember.tryInvoke(this.get('controller'), 'search')
    })
}
```

This resets the page to 1. You'll need to add whatever parameters you need as per above.

## Development

This project uses [Grunt.js](http://gruntjs.com/), so after checking out the repo, a simple
`npm install` will install all dependencies needed to build this library.

The source files are located in `lib/src` and the tests are in `lib/tests`.

To run the tests invoke `grunt test`.

## Contributing

Add issues, send pull requests. All the normal stuff. VERY happy to hear from you!

As normal:
* Fork
* Branch
* Hack
* Commit
* Pull request

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