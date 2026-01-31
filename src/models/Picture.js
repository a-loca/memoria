class Picture {
  constructor(id, width, height, description, createdAt, urls, user, blurhash) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.description = description;
    this.createdAt = createdAt;
    this.urls = urls;
    this.user = user;
    this.blurhash = blurhash;
  }

  static newFromApi(data) {
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

  static newFromStorage(data) {
    const picture = new Picture(
      data.id,
      data.width,
      data.height,
      data.description,
      data.createdAt,
      data.urls,
      data.user,
      data.blurhash
    );

    if (data.location != undefined || data.exif != undefined) {
      picture.location = data.location;
      picture.exif = data.exif;
    }

    return picture;
  }

  toStore(){
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      description: this.description,
      createdAt: this.createdAt,
      urls: this.urls,
      user: this.user,
      blurhash: this.blurhash,
      location: this.location,
      exif: this.exif,
    };
  }

  hasDetails() {
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
