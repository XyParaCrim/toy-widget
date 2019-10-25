/*图片加载器，用于内存管理*/

const images = new Map()

const ImageRegistry = {
  register (imageURL) {
    let img = images.get(imageURL)
    if (img == null) {
      img = new Image()
      img.src = imageURL
      images.set(imageURL, img)
    }
    return img
  },
  isLoaded (imageURL) {
    let img = this.images.get(imageURL)
    if (img == null) { img = this.register(imageURL) }
    if (img.complete) { return true }
    return false
  },
  get (imageURL) {
    return images.get(imageURL)
  },
  clear () {
    images.clear()
  }
}

export default ImageRegistry
