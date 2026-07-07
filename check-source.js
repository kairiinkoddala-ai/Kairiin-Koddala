import { readFileSync } from 'fs';
const src = readFileSync('src/pages/other-work.astro', 'utf-8');

const checks = [
  ['src: other-fashion.jpg', src.includes('other-fashion.jpg')],
  ['src: other-tartu-poster.jpg', src.includes('other-tartu-poster.jpg')],
  ['src: other-tartu-billboard.jpg', src.includes('other-tartu-billboard.jpg')],
  ['src: animation1.gif', src.includes('animation1.gif')],
  ['src: animation2.gif', src.includes('animation2.gif')],
  ['src: animated-interactive-filter.mp4', src.includes('animated-interactive-filter.mp4')],
  ['src: other-painting.jpg', src.includes('other-painting.jpg')],
  ['labelEn: Fashion Photography', src.includes("labelEn: 'Fashion Photography'")],
  ['labelEn: Tartu Balti Filmipäevad 2024', src.includes("labelEn: 'Tartu Balti Filmipäevad 2024'")],
  ['labelEn: Poster in the Wild', src.includes("labelEn: 'Poster in the Wild'")],
  ['labelEn: Hand-drawn Animation', src.includes("labelEn: 'Hand-drawn Animation'")],
  ['labelEn: Character Animation', src.includes("labelEn: 'Character Animation'")],
  ['labelEn: KAI Designs', src.includes('KAI Designs')],
  ['labelEn: Still Life in Blue', src.includes("labelEn: 'Still Life in Blue'")],
  ['labelEt: Moefotograafia', src.includes('Moefotograafia')],
  ['labelEt: Plakat linnas', src.includes('Plakat linnas')],
  ['labelEt: Käsitsi joonistatud animatsioon', src.includes('Käsitsi joonistatud animatsioon')],
  ['labelEt: Tegelasanimatsioon', src.includes('Tegelasanimatsioon')],
  ['labelEt: Natüürmort sinises', src.includes('Natüürmort sinises')],
  ['descEn: Art direction & styling', src.includes('Art direction & styling')],
  ['descEt: Kunstiline juhtimine ja stilistika', src.includes('Kunstiline juhtimine ja stilistika')],
  ['data-label-en attribute', src.includes('data-label-en')],
  ['data-label-et attribute', src.includes('data-label-et')],
  ['function applyLang', src.includes('function applyLang')],
  ['applyLang: overlay__label', src.includes('other-work-overlay__label')],
  ['applyLang: overlay__desc', src.includes('other-work-overlay__desc')],
  ['applyLang: overlay__concept', src.includes('other-work-overlay__concept')],
  ['applyLang: skill-pill[data-tool-en]', src.includes('skill-pill[data-tool-en]')],
  ['@media (max-width: 767px)', src.includes('@media (max-width: 767px)')],
  ['grid-column: 1 / -1 !important', src.includes('grid-column: 1 / -1 !important')],
  ['gap: 2.5rem', src.includes('gap: 2.5rem')],
  ['other-work-overlay in template', src.includes('other-work-overlay')],
  ['ow-lightbox in script', src.includes('ow-lightbox')],
  ['loading="eager"', src.includes('loading="eager"')],
  ['no loading="lazy"', !src.includes('loading="lazy"')],
  ['prefers-reduced-motion (CSS+JS, >=2 occurrences)', (src.match(/prefers-reduced-motion/g) || []).length >= 2],
];

let allPass = true;
checks.forEach(function(x) {
  if (!x[1]) allPass = false;
  console.log((x[1] ? 'PASS' : 'FAIL') + ': ' + x[0]);
});
console.log('');
console.log(allPass ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED');
