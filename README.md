# Commuter

Stupid chrome extension for displaying commute route and time of an apartment
listing on sites like StreetEasy, Apartments.com, and Zillow.

This was made because I am lazy and also happen to enjoy programming. Whatever.

**This is a work-in-progress.**

## Using this
If you are crazy enough to want to use this stupid thing, then you'll have to
get your own fresh pair of credentials/keys from Google Cloud Platform. You'll
need to get a key that has the Directions API, Maps API and Geocoding API all
activated. Then, put this into a `keys.js` file at the root level of this
extension.

Your `keys.js` file should look like:

```
# keys.js

'use keys';

/* eslint-disable no-unused-vars */
const gmapsKey = '<YOUR_KEY_HERE>';
/* eslint-disable no-unused-vars */
```

## Extending this
If you're even crazier and want to extend this, you should take a look at
`apt_site.js`. The basic idea is that if you want to add support for another
listings site, then you have to subclass `ApartmentSite` accordingly. Looking
at `apt_site.js`, `streeteasy.js` and `apartments.js` would help illuminate how
this is done. `zillow.js` has nothing because I do not support it yet. I
probably won't ever support it, because I never used it and probably won't use
it.

The basic premise is that you have a class, `ApartmentSite`:

```
class ApartmentSite {

  constructor(siteName) {
    ...
  }

  extractListingAddress() {
    throw FunctionNotDefined;
  }

  extractListingAddresses() {
    throw FunctionNotDefined;
  }

  injectCommuteTime(response) {
    throw FunctionNotDefined;
  }

  injectCommuteTimes(response, i) {
    throw FunctionNotDefined;
  }

  run() {
    ...
  }
}
```
New apartment sites should subclass this and implement the `extract*` and
`inject*` functions. If it does not, this super class will throw
`FunctionNotDefined` errors. The implementations of these functions will depend
inherently on the site you are aiming to support, because generally, as you
will see in the pre-existing examples such as `apartments.js`, the underlying
logic relies on ugly HTML digging to find necessary information or inject
things in the right places.

Once these are implemented, you begin execution by providing the following two
lines:

```
newApartmentSite = new NewApartmentSite('Name of new apartment site');
newApartmentSite.run();
```

You should be set.

## Screenshots
### Show commute times on apartment pages
![Show commute times on apartment pages][Apt Page Commute Time]
### Show a Google Maps display of the commute route
![Show a maps display of the commute route][Google Maps Display]
### Show commute times for each listing
![Show commute times for each listing][Listings Page Commute Times]

[Apt Page Commute Time]: https://i.imgur.com/fDDCtV3.png
[Google Maps Display]: https://i.imgur.com/NF6l5CS.png
[Listings Page Commute Times]: https://i.imgur.com/BWHskZE.png
