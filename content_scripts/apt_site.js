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
   * @param {number} i The ith listing for which the response pertains to.
   * @throws {FunctionNotDefined} This function will throw a FunctionNotDefined
   * error if it is called directly as a function of ApartmentSite or by one of
   * its children classes if they have not overridden this function with their
   * own implementation.
   */
  injectCommuteTimes(response, i) {
    throw FunctionNotDefined;
  }

  /**
   * Extracts listing address(es) and reports its findings to the backend for
   * processing.
   *
   * @param {object} site The ApartmentSite subclass object that is responsible
   *  for _run()'s logic.
   */
  _run(site) {
    let listingAddress = site.extractListingAddress();
    if (listingAddress) {
      console.log('Found a listing page!');
      reportListingPage(listingAddress, site);
    } else {
      let listingAddresses = site.extractListingAddresses();
      console.log(listingAddresses);
      if (listingAddresses.length > 0) {
        reportListingsPage(listingAddresses, site);
      } else {
        console.log('Not a listing or listings page.');
      }
    }
  }

  /**
   * An entry point function that is executed once the URL for this apartment
   * site is visited and triggers the execution of the logic which would
   * ultimately be responsible for injecting commute times into the page.
   *
   * This function should essentially be the entry point for the respective
   * content script for the apartment site that this object represents.
   *
   * This function initializes the destination global variables and then calls
   * _run() as a callback, which does the actual driving of the application.
   */
  run() {
    setDestGlobals(this, this._run);
  }
}

/**
 * Reports the extracted information gleaned from the listing (singular) page.
 *
 * @param {string} listingAddress The address string of the listing.
 * @param {string} site Denotes the source apartment site of this message.
 */
function reportListingPage(listingAddress, site) {
  chrome.runtime.sendMessage(
    {
      'site': site.siteName,
      'type': 'listing',
      'addressInfo': listingAddress,
    },
    site.injectCommuteTime
  );
}

/**
 * Reports the extracted information gleaned from the listings (plural) page.
 *
 * @param {array} listingAddresses An array of all listing addresses found on
 *  listings page.
 * @param {string} site Denotes the source apartment site of this message.
 */
function reportListingsPage(listingAddresses, site) {
  for (let i = 0; i < listingAddresses.length; i++) {
    /**
     * A local decorating function that wraps around injectCommuteTimes() of an
     * apartment site subclass. This fills-in the value of 'i' to the
     * injectCommuteTimes() call so that the correct duration string is
     * injected for each listing.
     *
     * @param {object} response The result response from which to get the
     *  duration.
     */
    function injectIthCommuteTime(response) {
      site.injectCommuteTimes(response, i);
    }

    chrome.runtime.sendMessage(
      {
        'site': site.siteName,
        'type': 'listing',
        'addressInfo': listingAddresses[i],
      },
      injectIthCommuteTime
    );
  }
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
