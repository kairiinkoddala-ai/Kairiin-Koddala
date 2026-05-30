---
title: "Teenusedisain Maksu- ja Tolliametis"
titleEt: "Teenusedisain Maksu- ja Tolliametis"
description: "Redesigned the internal Confluence environment used across all MTA digital product teams, and built the first responsive mobile prototype at MTA — the Customs Duty Calculator — which shipped to production. Introduced advanced Figma component logic that eliminated layout drift across the entire engineering handoff system."
descriptionEt: "Kujundasin ümber kõigi MTA digitaalsete tootemeeskondade kasutatava sisemise Confluence'i keskkonna ning ehitasin MTA esimese reageeriva mobiiliprototüübi — Tollimaksukalkulaatori — mis jõudis tootmisse. Tutvustasin täiustatud Figma komponentide loogikat, mis kõrvaldas paigutuse nihke kogu inseneride üleandmissüsteemis."
coverImage: ./images/cover-mta.jpg
gallery:
  - image: ./images/gallery-1.jpg
    alt: "Responsive mobile layout designs inside Figma next to the live public production calculator"
    caption: "Figma mobile layouts alongside the live production Customs Duty Calculator"
  - image: ./images/gallery-2.jpg
    alt: "Before-and-after tree diagram showing the messy internal wiki structure versus the clean, newly sectioned system"
    caption: "IA Mapping — before and after the Confluence restructure"
tags:
  - Service Design
  - Information Architecture
  - Government Services
tools:
  - Figma
  - Confluence
  - Miro
role: Service Design Intern
roleEt: Teenusedisaini praktikant
timeline:
  startDate: 2024-01-01
  endDate: 2024-06-30
problem: "The internal digital documentation used by active product teams across MTA was deeply fragmented and chaotic. Product managers, developers, and designers relied on this space for baseline reference data, but the architecture was so messy that critical resources — like the organization's mobile-view layout guidelines — were completely outdated and lost in the noise. A navigation test with 13 internal team members found that only 2 out of 13 successfully located specific, vital product guidelines."
problemEt: "MTA aktiivsete tootemeeskondade kasutatav sisemine digitaalne dokumentatsioon oli sügavalt killustunud ja kaootilised. Tootejuhid, arendajad ja disainerid tuginesid sellele ruumile alustaseme viiteandmete jaoks, kuid arhitektuur oli nii segane, et kriitilised ressursid — nagu organisatsiooni mobiilivaate paigutuse juhised — olid täiesti aegunud ja müras kadunud. Navigatsioonitest 13 sisemise meeskonnaliikmega leidis, et ainult 2 13-st leidis edukalt konkreetsed, elutähtsad tootejuhised."
solution: "I treated the internal wiki like a user-facing product. I ran a rigorous navigation test with 13 internal team members, systematically mapped their pages, isolated technical engineering data away from high-level product management overviews, and re-architected the entire menu layout. I designed clean structural diagrams to make onboarding intuitive, validating the structure with users before pushing the new Confluence architecture live. As a bonus sprint, I took over the mobile-first responsive architecture design for MTA's public Customs Duty Calculator — introducing advanced Figma component logic with embedded interactive states, hover behaviors, and responsive Auto-Layout directly inside single master components, eliminating the outdated practice of building separate static frames for every micro-interaction."
solutionEt: "Käsitlesin sisemist wikit kasutajale suunatud tootena. Viisin läbi range navigatsioonitesti 13 sisemise meeskonnaliikmega, kaardistasim süstemaatiliselt nende lehed, eraldadasim tehnilised inseneeriandmed kõrgetasemeliste tootehalduse ülevaadetest ja kujundasin kogu menüü paigutuse ümber. Kujundasin puhta struktuuridiagrammid, et muuta sisseelamine intuitiivseks, valideerides struktuuri kasutajatega enne uue Confluence'i arhitektuuri käivitamist. Lisasprintina võtsin üle MTA avaliku Tollimaksukalkulaatori mobiilile orienteeritud reageeriva arhitektuuri disaini — tutvustades täiustatud Figma komponentide loogikat koos manustatud interaktiivsete olekute, hõljumiskäitumiste ja reageeriva Auto-Layoutiga otse üksikutes põhikomponentides, kõrvaldades vananenud tava ehitada iga mikrointeraktsiooni jaoks eraldi staatilisi kaadrid."
outcome: "The Customs Duty Calculator mobile prototype shipped to live production (avalik.emta.ee/tollimaksukalkulaator). The redesigned Confluence environment is in active daily use across all MTA digital product teams. The Figma component system eliminated layout drift and streamlined the engineering handoff for a system running live for thousands of Estonian taxpayers."
outcomeEt: "Tollimaksukalkulaatori mobiiliprototüüp jõudis otseülekandesse (avalik.emta.ee/tollimaksukalkulaator). Ümberkujundatud Confluence'i keskkond on aktiivses igapäevases kasutuses kõigis MTA digitaalsetes tootemeeskondades. Figma komponentide süsteem kõrvaldas paigutuse nihke ja lihtsustas inseneride üleandmist süsteemile, mis töötab otse tuhandete Eesti maksumaksjate jaoks."
featured: true
sortOrder: 8
publishedAt: 2024-07-01
---

## The Team

Kairiin Koddala & Mentor (Alvar Pihlapuu)

## The Problem: Fragmented Internal Documentation

During my service design internship at the Estonian Tax and Customs Board (MTA), I was tasked with an information architecture project. The internal digital documentation used by active product teams across the organization was deeply fragmented and chaotic. Product managers, developers, and designers relied on this space for baseline reference data, but the architecture was so messy that critical resources — like the organization's mobile-view layout guidelines — were completely outdated and lost in the noise.

## The Solution: Information Architecture & Usability Validation

I didn't just guess how to fix the layout; I treated the internal wiki like a user-facing product.

- **User Diagnostics** — I ran a rigorous navigation test with 13 internal team members, asking them to locate specific, vital product guidelines. Only **2 out of 13** successfully found the information.
- **Structural Restructuring** — I systematically mapped their pages, isolated technical engineering data away from high-level product management overviews, and re-architected the entire menu layout.
- **Visual Systems** — I designed clean, simplifying structural diagrams to make onboarding intuitive, validating the structure with users before pushing the new Confluence architecture live across all product teams.

## The Bonus Sprint: Shaking Up the Customs Duty Calculator

Because my Figma system skills were sharp, I was pulled into a second, live product challenge. MTA had functional desktop views for their public Customs Duty Calculator, but they completely lacked an optimized mobile view. Hiring external design agencies for quick, iterative changes was highly expensive, so I took over the mobile-first responsive architecture design.

## The Mistake I Witnessed & Fixed

The internal design habit at the agency was to build entirely separate, static Figma frames for every single minor interaction state — creating one whole frame where an info box is closed, and duplicating a massive second frame just to show it open. This layout bloat caused elements to accidentally shift when duplicated and cluttered the developer handoff file.

## The Pivot

I introduced the internal product teams to advanced Figma component logic. I demonstrated how to embed interactive states, hover behaviors, and responsive Auto-Layout directly inside single master components. Instead of developers switching between multiple heavy static views, they could now interact with a single fluid component. This technical shift eliminated layout drift, kept workspaces incredibly clean, and streamlined the engineering handoff for a system running live for thousands of Estonian taxpayers.
