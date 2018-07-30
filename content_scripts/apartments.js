/**
 * Loaded when any Apartments.com URL is visited.
 *
 * @author may
 */

/**
 * Implements the ApartmentSite interface with StreetEasy specific
 * functionality.
 */
class Apartments extends ApartmentSite {
  /**
   * Extracts the human-readable listing addresses from a series of article
   * titles.
   *
   * @return {array} A series of listing addresses that were extracted.
   */
  extractListingAddresses() {
    let locationClassElems = Array.from(
      document.getElementsByClassName('location')
    );
    let locationElems = locationClassElems.splice(1);
    return locationElems.map((location) => {
      console.log('Location inner text: "' + location.innerText + '"');
      return location.innerText;
    });
  }

  /**
   * Cleans a given raw address by removing its neighborhood designation and
   * stripping the string of any beginning and trailing whitespace.
   *
   * @param {string} rawAddress The raw address string to clean.
   * @return {string} The cleaned version of the given raw address.
   */
  static cleanAddress(rawAddress) {
    return rawAddress.substring(0, rawAddress.indexOf('–')).trim();
  }

  /**
   * Extracts the human-readable address string of a listing from the page.
   *
   * @return {string} A string representing the address of the listing.
   */
  extractListingAddress() {
    let propertyAddressElems = document.getElementsByClassName(
      'propertyAddressRow'
    );
    console.log('Found property address elems:');
    console.log(propertyAddressElems);
    let propertyAddressElem = propertyAddressElems[0];
    console.log('Found property address elem:');
    console.log(propertyAddressElem);
    if (typeof propertyAddressElem === 'undefined') {
      console.log('Did not find the property address element.');
      return;
    }
    let addressRaw = propertyAddressElem.innerText;
    let address = Apartments.cleanAddress(addressRaw);
    console.log('Address of the current unit: ' + address);
    return address;
  }

  /**
   * Injects multiple commute times into the StreetEasy listings (plural) page.
   *
   * See injectCommuteTime(response) for more information.
   *
   * @param {object} response The response containing the durations for all the
   *  listings in the page.
   */
  injectCommuteTimes(response) {
    if (response) {
      console.log('Got response:');
      console.log(response);
      let durations = response.durations;
      let titleElems = document.getElementsByClassName('placardTitle');
      for (let i = 0; i < durations.length; i++) {
        titleElems[i].innerText += createDurationSuffix(durations[i]);
      }
    }
  }

  /**
   * Injects commute times into the StreetEasy listing page.
   *
   * @param {object} response The result response from which to get the
   *  duration.
   */
  injectCommuteTime(response) {
    if (response) {
      console.log('Got response:');
      console.log(response);
      let duration = response.duration;
      let listingTitle = document.getElementsByClassName('propertyName')[0];
      listingTitle.innerText += createDurationSuffix(duration);
    }
  }
}

apartments = new Apartments('apartments');
apartments.run();
