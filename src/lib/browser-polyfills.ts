import { Buffer as BufferPolyfill } from 'buffer';

// Shelby/crypto browser bundles expect small Node globals in browser runtime.
// Vite/Astro do not expose them by default.
type BrowserProcessShim = {
  env: Record<string, string | undefined>;
  browser?: boolean;
  version?: string;
  versions?: Record<string, string>;
};

type BrowserGlobal = {
  Buffer?: unknown;
  process?: BrowserProcessShim;
};

const target = globalThis as unknown as BrowserGlobal;

if (typeof target.Buffer === 'undefined') {
  target.Buffer = BufferPolyfill;
}

if (typeof target.process === 'undefined') {
  target.process = {
    env: {},
    browser: true,
    version: '',
    versions: {},
  };
} else if (!target.process.env) {
  target.process.env = {};
}

if (typeof window !== 'undefined') {
  const browserWindow = window as unknown as BrowserGlobal;
  if (typeof browserWindow.Buffer === 'undefined') {
    browserWindow.Buffer = BufferPolyfill;
  }
  if (typeof browserWindow.process === 'undefined') {
    browserWindow.process = target.process;
  }
}
