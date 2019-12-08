const dev = process.env.NODE_ENV !== 'production';

export const server = 'http://localhost:5000';

export function resolve(url) {
  return new URL(url, server)
}