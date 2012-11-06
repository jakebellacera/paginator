# paginator.js

A superfast paginator, built in Prototype.

## Usage

```javascript
Paginator(myElement, options);
```

To page an element's children, simply pass the element to a new Paginator object.

```javascript
myElement = document.getElementById('myElement');
paginator = new Paginator(myElement);
paginator.build();
```

### Options

Available options and their defaults for Paginator are:

```javascript
options = {
  amount: 3,            // Number of items per page
  numbers: true,        // Show numbers navigation
  paddles: true,        // Show next/prev navigation
  prevText: 'Previous', // Text for previous paddle
  nextText: 'Next'      // Text for next paddle
}
```

You can also set options after Paginator has been built via the `settings` hash:

```javascript
paginated = paginator(myElement);

paginated.settings.amount = 3;
paginated.settings.numbers = true;
paginated.settings.paddles = true;
paginated.settings.prevText = 'Previous';
paginated.settings.nextText = 'Next';
```

### Callbacks

Paginator supports callbacks. A callback is a function that is fired after a specific event. There is currently only one callback. You set callbacks in the options hash.

#### onInvalidPage(_pageNumber[int]_)

```javascript
{
  onInvalidPage: function (pageNumber) {
    alert('Went to invalid page:' + pageNumber);
  }
}

`onInvalidPage` is fired when the user goes to an invalid page. This should never happen and is installed for precautionary reasons.

### Methods

Paginator currently supports three methods: `build`, `goToPage` and `destroy`.

#### build

Builds and binds events to the paginator. Returns the `Paginator` instance. `build` cannot be ran once it's built.

```javascript
paginated = paginator(myElement);
paginated.build();
```

#### goToPage(_pageNumber[int]_)

Tells the Paginator instance to go to a specific page. If the page number is out of bounds, the `onInvalidPage` callback will fire. Returns the `Paginator` instance.

_Note: `goToPage` requires the Paginator instance to be built. Run `build` prior to using this method._

```javascript
paginated = paginator(myElement);
paginated.build();
paginated.goToPage(5);
```

#### destroy

Reverts the `Paginator` instance back to the visual state prior to being built.

_Note: An unbuilt `Paginator` instance cannot be destroyed._

```javascript
paginated = paginator(myElement);
paginated.build();
paginated.destroy();
```

## Contributing

Find a bug? Want to add a feature? Fork this repo and then submit a pull request. :thumbsup:
