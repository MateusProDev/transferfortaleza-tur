const localOrigin = "https://local-image.invalid";

export function shouldOptimizeImage(src: string): boolean {
  try {
    const url = new URL(src, localOrigin);

    return url.origin === localOrigin
      || (url.protocol === "https:" && url.hostname === "res.cloudinary.com");
  } catch {
    return false;
  }
}
