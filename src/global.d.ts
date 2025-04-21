export {};

declare global {
  interface Window {
    electronAPI?: {
      selectFile: () => Promise<string | null>;
      openFile: (filePath: string) => Promise<string>;
    };
  }
}
