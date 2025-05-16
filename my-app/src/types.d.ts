// CSS modules
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// For jest-dom
declare module '@testing-library/jest-dom' {}

// For path resolution in Vite config
declare const __dirname: string; 