/* eslint-disable no-unused-vars */
/**
 * An interface that must be implemented for each apartment site that is
 * needed to be supported. (e.g. StreetEasy inherits this, Zillow, etc).
 *
 * This interface defines two functions for injecting commute times into pages,
 * as the logic for doing so will depend on the HTML layout of the respective
 * websites.
 *
 * If support for <apartment_site>.com is wished to be added, this interface
 * must be inherited and its functions be implemented. If they are not, they
 * will throw FunctionNotDefined errors. The functions should be implemented so
 * that given a response containing the commute time(s) of the listing(s),
 * these times are nicely injected into the site's content.
 */
class ApartmentSite {
/* eslint-disable no-unused-vars */

  /**
   * The constructor for this ApartmentSite object.
   *
   * Simply records the name of the site.
   *
   * @param {string} siteName The name of the apartment site, as a string. This
   *  is not the url.
   */
  constructor(siteName) {
    this.siteName = siteName;
  }

  /**
   * Extracts the human-readable address string of a listing (singular) page.
   *
   * @throws {FunctionNotDefined} This function will throw a FunctionNotDefined
   * error if it is called directly as a function of ApartmentSite or by one of
   * its children classes if they have not overridden this function with their
   * own implementation.
   */
  extractListingAddress() {
    throw FunctionNotDefined;
  }

  /**
   * Extracts the human-readable listing addresses from a listings (plural)
   * page.
   *
   * @throws {FunctionNotDefined} This function will throw a FunctionNotDefined
   * error if it is called directly as a function of ApartmentSite or by one of
   * its children classes if they have not overridden this function with their
   * own implementation.
   */
  extractListingAddresses() {
    throw FunctionNotDefined;
  }

  /**
   * Injects commute times into the apartment site's listing page.
   *
   * @param {object} response The result response from which to get the
   *  duration.
   * @throws {FunctionNotDefined} This function will throw a FunctionNotDefined
   * error if it is called directly as a function of ApartmentSite or by one of
   * its children classes if they have not overridden this function with their
   * own implementation.
   */
  injectCommuteTime(response) {
    throw FunctionNotDefined;
  }

  /**
   * Injects multiple commute times into the apartment site's listings (plural)
   * page.
   *
   * See injectCommuteTime(response) for more information.
   *
   * @param {object} response The response containing the durations for all the
   *  listings in the page.
   * @throws {FunctionNotDefined} This function will throw a FunctionNotDefined
   * error if it is called directly as a function of ApartmentSite or by one of
   * its children classes if they have not overridden this function with their
   * own implementation.
   */
  injectCommuteTimes(response) {
    throw FunctionNotDefined;
  }

  /**
   * An entry point function that is executed once the URL for this apartment
   * site is visited and triggers the execution of the logic which would
   * ultimately be responsible for injecting commute times into the page.
   *
   * This function should essentially be the entry point for the respective
   * content script for the apartment site that this object represents.
   */
  run() {
    let listingAddress = this.extractListingAddress();
    if (listingAddress) {
      console.log('Found a listing page!');
      reportListingPage(listingAddress, this);
    } else {
      let listingAddresses = this.extractListingAddresses();
      console.log(listingAddresses);
      if (listingAddresses.length > 0) {
        reportListingsPage(listingAddresses, this);
      } else {
        console.log('Not a listing or listings page.');
      }
    }
  }
}

/**
 * Reports the extracted information gleaned from the listing (singular) page.
 *
 * @param {string} listingAddress The address string of the listing.
 * @param {string} source Denotes the source apartment site of this message.
 */
function reportListingPage(listingAddress, source) {
  chrome.runtime.sendMessage(
    {
      'source': source.siteName,
      'type': 'listing',
      'addressInfo': listingAddress,
    },
    source.injectCommuteTime
  );
}

/**
 * Reports the extracted information gleaned from the listings (plural) page.
 *
 * @param {array} listingAddresses An array of all listing addresses found on
 *  listings page.
 * @param {string} source Denotes the source apartment site of this message.
 */
function reportListingsPage(listingAddresses, source) {
  chrome.runtime.sendMessage(
    {
      'source': source.siteName,
      'type': 'listings',
      'addressInfo': listingAddresses,
    },
    source.injectCommuteTimes
  );
}

/**
 * A very simple helper function that wraps a given duration in parentheticals.
 *
 * This function prepends the starting parentheses with a whitespace, since
 * this wrapped duration string is expected to be concatenated to a larger
 * string.
 *
 * In the conclusion of this function, a suffix for duration of a
 * commute route will be made and returned.
 *
 * e.g.
 *  Given: '43 min'
 *  Returned: ' (43 min)'
 *
 * @param {string} duration A string representing the duration.
 * @return {string} Defined as: ' (' + duration + ')'
 */
function createDurationSuffix(duration) {
  return ' (' + duration + ')';
}
