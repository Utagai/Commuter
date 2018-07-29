/**
 * Extracts the human-readable listing addresses from a series of article
 * titles.
 *
 * @return {array} A series of listing addresses that were extracted.
 */
function extractListingAddresses() {
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
function cleanAddress(rawAddress) {
  return rawAddress.substring(0, rawAddress.indexOf('–')).trim();
}

/**
 * Extracts the human-readable address string of a listing from the page.
 *
 * @return {string} A string representing the address of the listing.
 */
function extractListingAddress() {
  let propertyAddressElems = document.getElementsByClassName(
    'propertyAddressRow'
  );
  let properyAddressElem = propertyAddressElems[0];
  if (typeof propertyAddressElem === 'undefined') {
    console.log('Did not find the property address element.');
    return;
  }
  let addressRaw = properyAddressElem.innerText;
  let address = cleanAddress(addressRaw);
  console.log('Address of the current unit: ' + address);
  return address;
}
