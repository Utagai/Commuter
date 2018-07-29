/**
 * Loaded when any StreetEasy URL is visited (including apartment pages).
 *
 * @author may
 */

/* eslint-disable no-unused-vars */
/**
 * Implements the ApartmentSite interface with StreetEasy specific
 * functionality.
 */
class StreetEasy extends ApartmentSite {
/* eslint-enable no-unused-vars */
  /* eslint-disable no-unused-vars */
  /**
   * Injects commute times into the StreetEasy listing page.
   *
   * @param {object} response The result response from which to get the
   *  duration.
   */
  injectCommuteTime(response) {
  /* eslint-enable no-unused-vars */
    if (response) {
      console.log(response);
      let duration = response.duration;
      let titleElems = document.getElementsByClassName('incognito');
      for (let i = 0; i < titleElems.length; i++) {
        titleElems[i].innerText += createDurationSuffix(duration);
      }
    }
  }

  /**
   * Finds and returns the title tag corresponding to the listing title from the
   * page.
   *
   * @param {string} articleTitle The HTML element referring to the article
   *  element containing the title.
   * @return {HTMLElement} found title tag.
   */
  static findTitleTag(articleTitle) {
    let titleDetails = Array.from(articleTitle.childNodes).filter(
      function(child) {
        return child.nodeName.toLowerCase() == 'h3';
      }
    )[0];

    return Array.from(titleDetails.childNodes).filter(function(child) {
      return child.nodeName.toLowerCase() == 'a';
    })[0];
  }

  /* eslint-disable no-unused-vars */
  /**
   * Injects multiple commute times into the StreetEasy listings (plural) page.
   *
   * See injectCommuteTime(response) for more information.
   *
   * @param {object} response The response containing the durations for all the
   *  listings in the page.
   */
  injectCommuteTimes(response) {
  /* eslint-enable no-unused-vars */
    if (response) {
      console.log(response);
      let durations = response.durations;
      let articleTitles = StreetEasy.extractArticleTitles();
      for (let i = 0; i < durations.length; i++) {
        let titleTag = StreetEasy.findTitleTag(articleTitles[i]);
        titleTag.innerText += createDurationSuffix(durations[i]);
        console.log('Title tag:');
        console.log(titleTag);
      }
    }
  }

  /* eslint-disable no-unused-vars */
  /**
   * Extracts the human-readable address string of a listing from the page.
   *
   * @return {string} A string representing the address of the listing.
   */
  extractListingAddress() {
    /* eslint-enable no-unused-vars */
    let infos = document
      .getElementsByClassName('backend_data BuildingInfo-item');
    if (infos.length == 0) {
      return null;
    }
    let listingInfo = infos[0];
    let listingAddress = listingInfo.innerText;
    console.log('Listing info found: ' + listingAddress);
    return listingAddress;
  }

  /* eslint-disable no-unused-vars */
  /**
   * Extracts the article titles from the page and returns them.
   *
   * This runs for a listings (plural) page, and therefore finds all the
   * articles with address information in them.
   *
   * @return {HTMLElement} The article element.
   */
  static extractArticleTitles() {
    /* eslint-enable no-unused-vars */
    let articles = Array.from(document.getElementsByTagName('article'));
    return articles.map(function(article) {
      let articleChildren = Array.from(article.childNodes);
      return articleChildren.filter(function(child) {
        return child.className == 'details row';
      })[0];
    });
  }

  /* eslint-disable no-unused-vars */
  /**
   * Extracts the human-readable listing addresses from a series of article
   * titles.
   *
   * @return {array} A series of listing addresses that were extracted.
   */
  extractListingAddresses() {
    /* eslint-enable no-unused-vars */
    let listingsContainer = document.getElementsByClassName('left-two-thirds '
      + 'items item-rows listings');
    if (listingsContainer.length == 0) {
      return [];
    }
    return StreetEasy.extractArticleTitles().map((articleTitle) => {
      return StreetEasy.findTitleTag(articleTitle).innerText + ', ' + destState;
    });
  }
}

streetEasy = new StreetEasy('streeteasy');
streetEasy.run();
