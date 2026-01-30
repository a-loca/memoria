class Picture {
  constructor(id, width, height, description, created_at, urls, user, blurhash) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.description = description;
    this.created_at = created_at;
    this.urls = urls;
    this.user = user;
    this.blurhash = blurhash;
  }

  static newPicture(data) {
    return new Picture(
      data.id,
      // Needed for masonry layout computation
      data.width,
      data.height,
      // Description with capitalized first letter
      String(data.alt_description).charAt(0).toUpperCase() + String(data.alt_description).slice(1),
      // Creation date
      new Date(data.created_at),
      data.urls,
      // user data
      {
        id: data.user.id,
        name: data.user.name,
        portfolio: data.user.portfolio_url,
      },
      // Blurhash placeholder while loading img
      data.blur_hash
    );
  }

  hasDetails(){
    // Check if there has already been an API request to fetch
    // additional data
    return this.location != undefined && this.exif != undefined;
  }

  addDetails(details) {
    this.location = details.location;
    this.exif = details.exif;
  }
}

export default Picture;
