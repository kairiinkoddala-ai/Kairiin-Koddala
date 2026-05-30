import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const layoutPath = resolve(__dirname, '../../layouts/Layout.astro');
const cssPath = resolve(__dirname, '../../styles/global.css');

const layoutContent = readFileSync(layoutPath, 'utf-8');
const cssContent = readFileSync(cssPath, 'utf-8');

describe('Layout.astro — Google Fonts URL', () => {
  it('contains family=Outfit in the Google Fonts URL', () => {
    expect(layoutContent).toContain('family=Outfit');
  });

  it('contains family=Fraunces in the Google Fonts URL', () => {
    expect(layoutContent).toContain('family=Fraunces');
  });

  it('does NOT contain Space+Grotesk', () => {
    expect(layoutContent).not.toContain('Space+Grotesk');
  });

  it('does NOT contain Instrument+Serif', () => {
    expect(layoutContent).not.toContain('Instrument+Serif');
  });

  it('contains rel="preconnect" for fonts.googleapis.com', () => {
    expect(layoutContent).toContain('href="https://fonts.googleapis.com"');
  });

  it('contains rel="preconnect" for fonts.gstatic.com', () => {
    expect(layoutContent).toContain('href="https://fonts.gstatic.com"');
  });

  it('contains display=swap in the fonts URL', () => {
    expect(layoutContent).toContain('display=swap');
  });
});

describe('global.css — CSS custom properties', () => {
  it('--font-sans value starts with Outfit', () => {
    // Match the line that sets --font-sans
    const match = cssContent.match(/--font-sans\s*:\s*([^;]+);/);
    expect(match).not.toBeNull();
    const value = match[1].trim();
    expect(value.startsWith("'Outfit'")).toBe(true);
  });

  it('--font-serif value starts with Fraunces and includes Georgia', () => {
    const match = cssContent.match(/--font-serif\s*:\s*([^;]+);/);
    expect(match).not.toBeNull();
    const value = match[1].trim();
    expect(value.startsWith("'Fraunces'")).toBe(true);
    expect(value).toContain('Georgia');
  });
});
