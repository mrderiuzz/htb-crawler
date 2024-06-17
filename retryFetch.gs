/**
 * UrlFetchApp is run by retrying when an error occurs.
 */
class RetryFetch {
  /**
   * @param {string} url URL
   * @param {object} params Object
   * @param {number} numberOfRetr Number of retry when an error occurs with the HTTP request.
   * @param {number} waitTime Wait time between the HTTP request.
   * @return {UrlFetchApp.HTTPResponse}
   */
  constructor(url, params = {}, numberOfRetry = 10, waitTime = 1.5) {
    this.url = url;
    if (!params.muteHttpExceptions) {
      params.muteHttpExceptions = true;
    }
    this.params = params;
    this.numberOfRetry = numberOfRetry;
    this.totalNumberOfRetry = numberOfRetry;
    this.waitTime = waitTime;
    this.his = [];
  }

  fetch() {
    const retryCodes = [408, 500, 502, 503, 504, 522, 524];
    const res = UrlFetchApp.fetch(this.url, this.params);
    const statusCode = res.getResponseCode();
    this.his.push({ date: new Date(), params: this.params, statusCode });
    if (retryCodes.includes(statusCode) && this.numberOfRetry > 0){
      const idx = this.his.length - 1;
      this.his[idx].responseHeader = res.getAllHeaders();
      this.his[idx].error = res.getContentText();
      this.his[idx].responseCode = res.getResponseCode();
      this.numberOfRetry--;
      console.log(`Status code: ${this.his[idx].responseCode}, Retry: ${this.totalNumberOfRetry - this.numberOfRetry}`);
      Utilities.sleep(this.waitTime * 1000);
      this.fetch();
    } else if (this.numberOfRetry == 0) {
      console.info("exceeded number of tries");
      return null;
    }
    return res;
  }

  /**
   * Return history of fetch requesting in this Class.
   * @return {array} History.
   */
  get history() {
    return this.his;
  }
}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}