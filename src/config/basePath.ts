/// <reference types="vite/client" />

// This directive references type definitions from the Vite client, which helps
// TypeScript understand the types that Vite provides, enhancing type-checking
// and autocompletion in the development environment.

export default function basePath() {
    return import.meta.env.VITE_WEB_BASEPATH || '/';
}
