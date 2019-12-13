const dev = process.env.NODE_ENV !== 'production';

export const server = dev ? 'http://localhost:5000' : 'https://gentle-anchorage-49741.herokuapp.com/';

export function resolve(url) {
  // wrapper to avoid Node complaint
  if (typeof window !== "undefined") {
    return new URL(url, server)
  }
}