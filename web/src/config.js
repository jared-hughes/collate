const dev = process.env.NODE_ENV !== 'production';

export const server = 'http://localhost:5000';

export function resolve(url) {
  // wrapper to avoid Node complaint
  if (typeof window !== "undefined") {
    return new URL(url, server)
  }
}