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
