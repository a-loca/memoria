class Picture {
  constructor(id, description, created_at, urls, user, blur_hash) {
    this.id = id;
    this.description = description;
    this.created_at = created_at;
    this.urls = urls;
    this.user = user;
    this.blur_hash = blur_hash;
  }

  static newPicture(data) {
    return new Picture(
      data.id,
      data.alt_description,
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
