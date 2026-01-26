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
      data.width,
      data.height,
      String(data.alt_description).charAt(0).toUpperCase() + String(data.alt_description).slice(1),
      new Date(data.created_at),
      data.urls,
      // user data
      {
        id: data.user.id,
        name: data.user.name,
        portfolio: data.user.portfolio_url,
      },
      data.blur_hash
    );
  }
}

export default Picture;
