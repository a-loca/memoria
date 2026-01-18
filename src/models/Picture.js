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
      data.description,
      data.created_at,
      data.urls,
      data.user,
      data.blur_hash
    );
  }
}

export default Picture;
