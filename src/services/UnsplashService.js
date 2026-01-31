class UnsplashService {
  static PHOTO_INFO_URL = `https://api.unsplash.com/photos/`;
  static COLLECTION_ID = "oxGVBF-n7Ts";
  static ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  static _buildRequestURL(collection_id, picsPerPage, page, access_key) {
    return `https://api.unsplash.com/collections/${collection_id}/photos/?per_page=${picsPerPage}&page=${page}&client_id=${access_key}`;
  }

  static getNextPage(page = 1) {
    const numPicsPerPage = 30; // always request max number of images
    const url = this._buildRequestURL(this.COLLECTION_ID, numPicsPerPage, page, this.ACCESS_KEY);

    return this._send_request(url);
  }

  static getPictureDetails(id) {
    const url = this.PHOTO_INFO_URL + id + "?client_id=" + this.ACCESS_KEY;
    return this._send_request(url);
  }

  static async _send_request(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UnsplashService;
