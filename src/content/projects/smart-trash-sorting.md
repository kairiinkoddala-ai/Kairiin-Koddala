---
title: "Nutikas Prügisorteerimise Juhend"
titleEt: "Nutikas Prügisorteerimise Juhend"
description: "A gamified micro-elective mobile app designed to fix waste sorting behaviour at the Estonian Academy of Arts. Built on 87-respondent survey data, a physical campus bin audit, and iterative usability testing — pivoting from smart hardware to an active educational loop."
descriptionEt: "Mängustatud mikro-valikaine mobiilirakendus, mis on loodud jäätmete sorteerimiskäitumise parandamiseks Eesti Kunstiakadeemias. Põhineb 87 vastajaga küsitlusel, füüsilisel ülikoolilinnaku prügikastide auditis ja iteratiivsel kasutatavustestimisel — pöördudes nutikast riistvarast aktiivse hariduslikku tsüklisse."
coverImage: ./images/cover-trash.jpg
gallery:
  - image: ./images/gallery-1.jpg
    alt: "Core user flow map and low-fidelity wireframes tracking the progress map, streaks, and interactive gaming screens"
    caption: "UX Architecture — user flow map and low-fidelity wireframes"
  - image: ./images/gallery-2.jpg
    alt: "Side-by-side view showing the transformation of feedback loops from loose cartoon feedback to structured, explanatory correction screens"
    caption: "Testing iterations — feedback loop evolution across design rounds"
tags:
  - UX/UI Design
  - Mobile App
  - Sustainability
  - Behavioural Design
tools:
  - Figma
  - Protopie
  - Miro
role: Interaction Designer, UX/UI Designer & Information Architect
roleEt: Interaktsioonidisainer, UX/UI disainer ja infokorraldaja
timeline:
  startDate: 2023-01-01
  endDate: 2023-03-31
problem: "According to local environmental data, half of Tallinn's residents fail to sort their everyday waste correctly, causing recyclable resources to be incinerated instead of reused. A student survey of 87 EKA respondents found that while 0% expressed anti-environmental sentiments, only one single respondent successfully sorted all 9 waste categories correctly. 32% simply could not find the right recycling bins on campus. A physical campus audit revealed a heavy systemic bias: the vast majority of available bins were exclusively for general waste, meaning the environment was built to reward convenience over sustainability."
problemEt: "Kohalike keskkonnandmete kohaselt ei sorteeri pool Tallinna elanikest oma igapäevaseid jäätmeid õigesti, põhjustades ringlussevõetavate ressursside põletamise taaskasutamise asemel. 87 EKA vastajaga üliõpilaste uuring leidis, et kuigi 0% väljendas keskkonnavaenulikke hoiakuid, sorteeris ainult üks vastaja kõik 9 jäätmekategooriat õigesti. 32% lihtsalt ei leidnud ülikoolilinnakus õigeid ringlussevõtu prügikaste. Füüsiline ülikoolilinnaku audit paljastas raske süsteemse kallutatuse: valdav enamus saadaolevatest prügikastidest oli ainult olmejäätmete jaoks, mis tähendab, et keskkond oli üles ehitatud mugavuse premeerimiseks jätkusuutlikkuse asemel."
solution: "We realized that bombarding students with more text-heavy sorting guidelines would lead to information fatigue. Instead, we designed a gamified micro-elective course (1 EAP) completed entirely at the user's own pace through a dedicated low-fidelity mobile prototype. The app features interactive sorting mini-games that build subconscious learning loops, a live campus-wide competitive leaderboard, a continuous streak counter, and a QR-code scanning mechanic where students scan physical codes on real campus bins to compile a personal searchable trash bin database."
solutionEt: "Mõistsime, et üliõpilaste pommitamine rohkemate tekstirohkete sorteerimise juhistega viib teabeväljaväsimuseni. Selle asemel kujundasime mängustatud mikro-valikaine kursuse (1 EAP), mis on täielikult lõpetatud kasutaja enda tempos pühendatud madala täpsusega mobiiliprototüübi kaudu. Rakendus sisaldab interaktiivseid sorteerimise minimänge, mis loovad alateadlikke õppimistsükleid, reaalajas ülikoolilinnaku-laiust konkurentsitabelit, pidevat seerialoendurit ja QR-koodi skaneerimise mehhanismi, kus üliõpilased skaneerivad füüsilisi koode päris ülikoolilinnaku prügikastidel, et koostada isiklik otsitav prügikastide andmebaas."
outcome: "Iterative usability tests proved that providing friendly, explanatory corrective feedback directly inside the app fundamentally reshaped underlying habits. The pivot from reactive physical machine to active educational loop addressed the root behavioural problem — not just the symptoms."
outcomeEt: "Iteratiivsed kasutatavustestid tõestasid, et sõbralike, selgitavate parandavate tagasiside andmine otse rakenduses kujundas põhimõtteliselt ümber aluseks olevad harjumused. Pöördumine reaktiivsest füüsilisest masinast aktiivsesse hariduslikku tsüklisse käsitles käitumusliku probleemi juurt — mitte ainult sümptomeid."
featured: true
sortOrder: 6
publishedAt: 2023-09-01
---

## The Team

Aries Puusepp, Laura Sööt, Kairiin Koddala

## The Problem

This internal project was launched at the Estonian Academy of Arts (EKA) to tackle a glaring community issue: according to local environmental data, half of Tallinn's residents fail to sort their everyday waste correctly, causing recyclable resources to be incinerated instead of reused.

To understand why this friction persists on our own campus, our team conducted desk research, read sorting manuals, analyzed public forum comment sections, and launched a targeted student survey that gathered **87 respondents**. Interestingly, while 0% of EKA students expressed anti-environmental sentiments or a total lack of interest, only **one single respondent** out of 87 successfully sorted all 9 waste categories correctly. The quantitative data revealed that **32% of students simply could not find the right recycling bins on campus.**

To investigate this further, we went on a physical "trash bin hunt" across the university campus, mapping every single disposal container onto a tablet-based floor plan. The spatial audit revealed a heavy systemic bias: the vast majority of available bins were exclusively for general waste (olmeprägi), meaning the environment was built to reward convenience over sustainability.

## The Solution

We realized that bombarding students with more text-heavy sorting guidelines would lead to information fatigue. Instead, we designed an innovative gamified micro-elective course (1 EAP) offered through the center of general theoretical subjects. The entire elective is completed entirely at the user's own pace through a dedicated low-fidelity mobile prototype app featuring interactive sorting mini-games.

- **Subconscious Learning Loops** — By practicing sorting workflows through high-speed interactive games, correct disposal categories become an automated subconscious reaction.
- **Gamified Mechanics** — The app features a live, campus-wide competitive leaderboard and a continuous "streak" counter to incentivize social engagement.
- **Spatial Crowdsourcing (The Bin Hunt)** — Students scan physical QR codes placed on real campus bins to compile a personal "trash bin database," which maps out nearby recycling locations searchable by keywords like "bio" or "paper."

## The Mistake We Made

When we started, we fell into a classic designer trap: we assumed this was a hardware engineering challenge. We spent a lot of time brainstorming high-tech, automated, motorized smart bins where the lids would open automatically based on sensors, or localized video screens over public trash points.

## The Pivot

Our user testing and stakeholder interviews with EKA's environmental specialist forced a massive pivot. We learned that automated smart hardware is a temporary band-aid that treats the visual symptom without shifting human intent. If the machine does the thinking for you, the user's core awareness remains completely unchanged when they leave campus.

We also uncovered the threat of **over-sorting (ülesorteerimine)** — when users are overly incentivized but under-educated, they accidentally toss contaminated general waste into clean recycling bins, ruining entire batches of reusable plastic and paper. Our iterative usability tests proved that providing friendly, explanatory corrective feedback directly inside the app fundamentally reshaped their underlying habits. We pivoted from designing a reactive physical machine to building an active educational loop that targets the root behavioural problem, not just the symptoms.
