class UnsplashService {
  static PHOTO_INFO_URL = `https://api.unsplash.com/photos/`;
  static COLLECTION_ID = "O-KfLXUK3BE";

  static buildRequestURL(collection_id, picsPerPage, page, access_key) {
    return `https://api.unsplash.com/collections/${collection_id}/photos/?per_page=${picsPerPage}&page=${page}&client_id=${access_key}`;
  }

  static async getNextPage(numPicsPerPage = 30, page = 1) {
    const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    const url = this.buildRequestURL(this.COLLECTION_ID, numPicsPerPage, page, ACCESS_KEY);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();

      return result;
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default UnsplashService;
