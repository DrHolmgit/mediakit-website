# 🎨 Media Kit Website

Din personlige nettside for å vise frem bilder, apper og informasjon.

---

## ✏️ Slik oppdaterer du nettsiden

Åpne filen **`content.json`** i en teksteditor (f.eks. Notisblokk eller VS Code).
Alt innhold på nettsiden styres fra denne **én filen** — du trenger ikke røre noe annet.

---

## 📝 Hva du kan endre

### Profil-informasjon
```json
"profile": {
  "name": "Ditt Navn",
  "title": "Din tittel / tagline",
  "bio": "Skriv om deg selv her",
  "profileImage": "images/profile.jpg",
  "email": "din@epost.no"
}
```
- Bytt ut teksten mellom anførselstegnene `" "` med din egen tekst
- Legg profilbildet ditt i `images/`-mappen og skriv filnavnet under `profileImage`

---

### Sosiale medier
```json
"socials": [
  { "name": "Instagram", "url": "https://instagram.com/dittbrukernavn", "icon": "instagram" },
  { "name": "YouTube", "url": "https://youtube.com/@dittbrukernavn", "icon": "youtube" }
]
```
Støttede ikoner: `instagram`, `youtube`, `tiktok`, `twitter`, `facebook`, `linkedin`, `globe`

---

### Legge til et nytt bilde i galleriet
1. Kopier bildet ditt inn i `images/`-mappen
2. Åpne `content.json` og finn `"gallery"`
3. Legg til en ny linje i `"items"`:
```json
{
  "image": "images/ditt-bilde.jpg",
  "caption": "Bildetekst her",
  "category": "Foto"
}
```
> **Husk komma** etter `}` hvis det kommer flere bilder etter.

---

### Legge til en ny app/prosjekt
1. Legg app-ikonet i `images/`-mappen (valgfritt)
2. Finn `"apps"` i `content.json` og legg til i `"items"`:
```json
{
  "name": "App Navn",
  "description": "Beskrivelse av appen",
  "icon": "images/app-ikon.png",
  "link": "https://lenke-til-appen.no",
  "badge": "Ny",
  "platform": "iOS & Android"
}
```

---

### Endre fargetema
```json
"theme": {
  "accentColor": "#6C63FF"
}
```
Bytt ut `#6C63FF` med en valgfri farge (HEX-kode).
Eksempler: `#FF6B6B` (rød), `#00C896` (grønn), `#FFB347` (oransje)

---

## 🖼️ Bilder

Legg alltid bildene dine i **`images/`**-mappen og bruk formatet:
```
"image": "images/filnavn.jpg"
```

---

## 🌐 Publisering (GitHub Pages)

Nettsiden publiseres automatisk via GitHub Pages.
Etter du har endret `content.json` og lastet opp:
1. Gå til GitHub-repoet ditt
2. Klikk **"Add file"** → **"Upload files"** → last opp endrede filer
3. Nettsiden oppdateres automatisk innen 1–2 minutter ✅
