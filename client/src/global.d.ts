// Extend the global Window interface to include Buffer and process
declare global {
    interface Window {
      Buffer: typeof Buffer;
    }
  }
  export {};
  