/**
 * Footer — Two-section personal footer with Spotify embed
 * ─────────────────────────────────────────────────────────────────────────────
 * SECTION 1 — Pre-footer CTA
 *   Solid pink background, dark olive text, large italic "Let's work together"
 *
 * SECTION 2 — Main footer
 *   Dark olive background, pink text, 3-card responsive grid:
 *     Card 1 — Creative Work preview → opens lightbox gallery
 *     Card 2 — Spotify "Currently Listening" embed
 *     Card 3 — Contact & socials
 * ─────────────────────────────────────────────────────────────────────────────
 */

import './Footer.css';

// ─── Color tokens (matching global.css palette) ───────────────────────────────
// Dark Olive Green  →  #2E2D1E  (--color-bg-secondary)
// Soft/Vibrant Pink →  #C97FA8  (--color-accent)

// ─── SPOTIFY CONFIG ───────────────────────────────────────────────────────────
// Replace the placeholder below with your actual Spotify Playlist ID.
// You can find it in the playlist URL:
//   https://open.spotify.com/playlist/YOUR_PLAYLIST_ID_HERE
//
// Example: "37i9dQZF1DXcBWIGoYBM5M"
const SPOTIFY_PLAYLIST_ID = '1veoo70S9n76MfU0pjvQMJ';

// ─── CREATIVE WORK PREVIEW ────────────────────────────────────────────────────
// Thumbnail images shown in the footer card preview mosaic.
// These are the first 4 items from the Other Work page.
const CREATIVE_PREVIEW = [
  {
    src: '/Kairiin-Koddala/other-fashion.jpg',
    alt: 'Fashion photography',
    label: 'Photography',
  },
  {
    src: '/Kairiin-Koddala/other-tartu-poster.jpg',
    alt: 'Tartu Balti Filmipäevad 2024 poster',
    label: 'Graphic Design',
  },
  {
    src: '/Kairiin-Koddala/other-painting.jpg',
    alt: 'Oil painting — blue still life',
    label: 'Painting',
  },
  {
    src: '/Kairiin-Koddala/animation1.gif',
    alt: 'Hand-drawn animation',
    label: 'Animation',
  },
];

// ─── Contact data ─────────────────────────────────────────────────────────────
const CONTACT = {
  linkedin: {
    label: 'LinkedIn',
    display: 'Kairiin Koddala',
    href: 'https://www.linkedin.com/in/kairiin-koddala-7a9132258/',
  },
  email: {
    label: 'Gmail',
    display: 'kairiinkoddala@gmail.com',
    href: 'mailto:kairiinkoddala@gmail.com',
  },
  phone: {
    label: 'Phone',
    // Replace with your actual number or remove if not needed
    display: '+372 000 0000',
    href: 'tel:+3720000000',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Footer component
// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
  return (
    <footer className="footer-root" aria-label="Site footer">

      {/* ── SECTION 1: Pre-footer CTA ─────────────────────────────────────── */}
      <section className="footer-cta" id="section-contact" aria-label="Call to action">
        <div className="footer-cta__inner">
          {/* Decorative label */}
          <span className="footer-cta__eyebrow" aria-hidden="true">
            Available for work
          </span>

          {/* Main CTA heading */}
          <h2 className="footer-cta__heading">
            Let's work<br />together
          </h2>

          {/* Subtle CTA link */}
          <a
            href={CONTACT.email.href}
            className="footer-cta__link"
            aria-label="Send an email to start a collaboration"
          >
            Get in touch
            <svg className="footer-cta__arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* ── SECTION 2: Main footer ────────────────────────────────────────── */}
      <section className="footer-main" aria-label="Footer content">
        <div className="footer-main__inner">

          {/* Section heading */}
          <h3 className="footer-main__heading">
            Or get to know me a little more
          </h3>

          {/* 3-column card grid */}
          <div className="footer-grid" role="list">

            {/* ── Card 1: Creative Work ───────────────────────────────────── */}
            <article
              className="footer-card footer-card--creative"
              role="listitem"
              aria-label="Creative work preview — click to view all work"
            >
              {/* Card header */}
              <div className="footer-card__header">
                <span className="footer-card__label">Creative Work</span>
                {/* Palette icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: 'rgba(201,127,168,0.5)' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2v-.5c0-.28-.11-.53-.29-.71a.996.996 0 0 1 0-1.41c.18-.18.29-.43.29-.71V16c0-1.1.9-2 2-2h2c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" opacity=".5"/>
                  <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" opacity=".5"/>
                  <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" opacity=".5"/>
                  <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" opacity=".5"/>
                </svg>
              </div>

              {/* Short intro text */}
              <p className="footer-card__desc">
                Art, graphic experiments, illustrations, and visual explorations — the side of me that exists outside of UX briefs.
              </p>

              {/* Image mosaic preview */}
              <div
                className="gallery-preview"
                role="group"
                aria-label="Preview of creative work"
              >
                {CREATIVE_PREVIEW.map((item, i) => (
                  <a
                    key={i}
                    className="gallery-preview__tile"
                    href="/Kairiin-Koddala/other-work"
                    aria-label={`View other work — ${item.label}`}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                    />
                    <span className="gallery-preview__tile-label">{item.label}</span>
                  </a>
                ))}
              </div>

              {/* CTA — link to the Other Work page */}
              <a
                className="footer-card__cta"
                href="/Kairiin-Koddala/other-work"
                aria-label="View all other creative work"
              >
                View All Work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </article>

            {/* ── Card 2: Spotify "Currently Listening" ───────────────────── */}
            <article
              className="footer-card footer-card--spotify"
              role="listitem"
              aria-label="Currently listening on Spotify"
            >
              {/* Card header */}
              <div className="footer-card__header">
                <span className="footer-card__label">Currently Listening</span>
                {/* Spotify logo mark */}
                <svg className="footer-card__spotify-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.307a.748.748 0 0 1-1.03.25c-2.819-1.723-6.365-2.112-10.542-1.157a.748.748 0 1 1-.334-1.458c4.571-1.045 8.492-.595 11.656 1.337a.748.748 0 0 1 .25 1.028zm1.472-3.27a.936.936 0 0 1-1.287.308c-3.226-1.983-8.144-2.558-11.963-1.4a.937.937 0 0 1-.543-1.79c4.361-1.323 9.782-.682 13.485 1.595a.936.936 0 0 1 .308 1.287zm.127-3.403c-3.868-2.297-10.248-2.509-13.942-1.388a1.123 1.123 0 1 1-.652-2.148c4.243-1.288 11.296-1.04 15.752 1.607a1.123 1.123 0 0 1-1.158 1.929z"/>
                </svg>
              </div>

              {/* Animated sound bars (decorative) */}
              <div className="footer-card__sound-bars" aria-hidden="true">
                <span className="footer-card__bar footer-card__bar--1" />
                <span className="footer-card__bar footer-card__bar--2" />
                <span className="footer-card__bar footer-card__bar--3" />
                <span className="footer-card__bar footer-card__bar--4" />
                <span className="footer-card__bar footer-card__bar--5" />
              </div>

              {/*
               * HOW TO UPDATE YOUR PLAYLIST:
               * 1. Open Spotify → your playlist → ··· → Share → Copy link
               * 2. URL: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
               * 3. Copy the ID after "/playlist/"
               * 4. Replace YOUR_PLAYLIST_ID_HERE at the top of this file
               *
               * theme=0 = dark theme (blends with the olive background)
               */}
              <div className="footer-card__spotify-wrap">
                <iframe
                  title="Kairiin's Spotify Playlist"
                  src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </article>

            {/* ── Card 3: Contact & Socials ────────────────────────────────── */}
            <article
              className="footer-card footer-card--contact"
              role="listitem"
              aria-label="Contact and social links"
            >
              {/* Card header */}
              <div className="footer-card__header">
                <span className="footer-card__label">Say Hello</span>
                <span className="footer-card__dot" aria-hidden="true" />
              </div>

              {/* Contact list */}
              <ul className="footer-contact-list" role="list">
                {/* LinkedIn */}
                <li className="footer-contact-item">
                  <span className="footer-contact-item__platform">{CONTACT.linkedin.label}</span>
                  <a
                    href={CONTACT.linkedin.href}
                    className="footer-contact-item__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit LinkedIn profile of ${CONTACT.linkedin.display}`}
                  >
                    {CONTACT.linkedin.display}
                    <svg className="footer-contact-item__arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>

                {/* Email */}
                <li className="footer-contact-item">
                  <span className="footer-contact-item__platform">{CONTACT.email.label}</span>
                  <a
                    href={CONTACT.email.href}
                    className="footer-contact-item__link"
                    aria-label={`Send email to ${CONTACT.email.display}`}
                  >
                    {CONTACT.email.display}
                    <svg className="footer-contact-item__arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>

                {/* Phone */}
                <li className="footer-contact-item">
                  <span className="footer-contact-item__platform">{CONTACT.phone.label}</span>
                  <a
                    href={CONTACT.phone.href}
                    className="footer-contact-item__link"
                    aria-label={`Call ${CONTACT.phone.display}`}
                  >
                    {CONTACT.phone.display}
                  </a>
                </li>
              </ul>

              {/* Availability note */}
              <p className="footer-card__availability">
                <span className="footer-card__availability-dot" aria-hidden="true" />
                Open to new opportunities
              </p>
            </article>

          </div>{/* /footer-grid */}

          {/* Bottom bar */}
          <div className="footer-bottom" role="contentinfo">
            <span className="footer-bottom__copy">
              © {new Date().getFullYear()} Kairiin Koddala
            </span>
            <span className="footer-bottom__made">
              Designed &amp; built with intention
            </span>
          </div>

        </div>
      </section>

      {/* ── Lightbox gallery (portal-like, rendered at footer root level) ─── */}

    </footer>
  );
}
