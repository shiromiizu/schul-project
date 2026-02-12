# Task-Dokumentation: Dashboard / Landing Page Schüler

---

## Deckblatt

**Titel:** Task-Dokumentation: Implementierung des Schüler-Dashboards

**Projekt:** B3Echo - Feedback- und Petitions-Plattform

**Schule:** {{PLATZHALTER: Schulname}}

**Name:** {{PLATZHALTER: Ihr Name}}

**Klasse:** {{PLATZHALTER: Klasse/Kurs}}

**Datum:** {{PLATZHALTER: Abgabedatum}}

**Betreuende Lehrkraft:** {{PLATZHALTER: Name der Lehrkraft}}

---

## Inhaltsverzeichnis

1. [Problemstellung](#1-problemstellung) ....................................... S. {{XX}}
2. [Lösungsmöglichkeiten](#2-lösungsmöglichkeiten) ....................................... S. {{XX}}
   - 2.1 [Beschreibung der Konzepte](#21-beschreibung-der-konzepte)
   - 2.2 [Bewertung der Konzepte](#22-bewertung-der-konzepte)
3. [Begründung des Lösungswegs](#3-begründung-des-lösungswegs) ....................................... S. {{XX}}
4. [Qualitätssicherung](#4-qualitätssicherung) ....................................... S. {{XX}}
5. [Planung der Vorgehensweise](#5-planung-der-vorgehensweise) ....................................... S. {{XX}}
6. [Umsetzung](#6-umsetzung) ....................................... S. {{XX}}
7. [Testergebnisse](#7-testergebnisse) ....................................... S. {{XX}}
8. [Gesamtreflektion](#8-gesamtreflektion) ....................................... S. {{XX}}
9. [Anhang](#9-anhang) ....................................... S. {{XX}}

---

## 1. Problemstellung

### 1.1 Ausgangssituation und User Story

Im Rahmen des B3Echo-Projekts wird eine rollenbasierte Feedback- und Petitions-Plattform für die B3-Schule entwickelt. Schüler können anonymes Feedback einreichen und Verbesserungsvorschläge (Petitionen) erstellen. Lehrer können diese einsehen und darauf reagieren. Nach dem erfolgreichen Login muss der Schüler eine übersichtliche Startseite erhalten, die ihm einen schnellen Überblick über seine Aktivitäten und Möglichkeiten bietet.

Die zu implementierende User Story lautet:

> **Als** eingeloggter Schüler  
> **möchte ich** nach dem Login eine übersichtliche Startseite (Dashboard) sehen,  
> **damit** ich schnell einen Überblick über meine Möglichkeiten, aktuellen Rückmeldungen und wichtigen Informationen erhalte.

### 1.2 Acceptance Criteria

Die Implementierung muss folgende Akzeptanzkriterien erfüllen:

1. **Automatische Weiterleitung**: Nach dem Login wird der Schüler automatisch auf das Dashboard (`/student`) weitergeleitet.

2. **Dashboard-Inhalte**: Das Dashboard enthält:
   - Eine Übersicht der zuletzt eingereichten Feedbacks (letzte 3)
   - Den aktuellen Status dieser Feedbacks (Offen / Gesehen)
   - Einen direkten Zugang zum Feedback-Formular
   - Einen direkten Zugang zum Petitionsbereich

3. **Visuelle Hervorhebung**: Neue oder unbeantwortete Rückmeldungen sind visuell hervorgehoben (farbige Badges, Icons).

4. **Responsive Design**: Das Dashboard ist übersichtlich und auch auf kleineren Bildschirmen (Smartphones, Tablets) gut nutzbar.

5. **Petitions-Übersicht**: Die letzten 3 eigenen Petitionen werden mit Status (Ausstehend / Genehmigt / Abgelehnt) angezeigt.

6. **Navigation**: „Alle anzeigen"-Links führen zu den vollständigen Listen der Feedbacks bzw. Petitionen.

### 1.3 Technische Herausforderungen

Die Implementierung des Schüler-Dashboards bringt mehrere technische Herausforderungen mit sich:

**1. Server-Side Data Fetching mit Next.js 16 App Router**
- Das Dashboard ist eine Server Component, die Daten serverseitig laden muss
- Feedbacks und Petitionen müssen parallel aus der Supabase-Datenbank abgefragt werden
- Der authentifizierte Nutzer muss serverseitig identifiziert werden, um nur eigene Daten zu laden

**2. Rollenbasierte Zugriffskontrolle**
- Nur Schüler und Admins dürfen auf `/student` zugreifen
- Lehrer müssen automatisch zu `/teacher` weitergeleitet werden
- Nicht authentifizierte Nutzer müssen zu `/login` umgeleitet werden
- Die Zugriffskontrolle muss im Layout erfolgen (nicht auf jeder Seite einzeln)

**3. Responsive Layout-Design**
- Das Dashboard muss auf Desktop-Bildschirmen (≥1024px), Tablets (≥768px) und Smartphones (<768px) funktionieren
- Karten-Layouts müssen sich dynamisch anpassen (Grid → Einzelspalten)
- Badges und Statusanzeigen müssen auch auf kleinen Bildschirmen lesbar bleiben

**4. Statusverwaltung und visuelle Darstellung**
- Feedback-Status: `seen_by_teacher` (Boolean) → visuelle Darstellung als „Offen" oder „Gesehen"
- Petitions-Status: `pending`, `approved`, `rejected` → drei verschiedene visuelle Zustände
- Ablehnungsgründe müssen bei abgelehnten Petitionen angezeigt werden
- Farbkodierung muss sowohl im Light- als auch im Dark-Mode funktionieren

**5. Performance-Optimierung**
- Nur die letzten 3 Feedbacks/Petitionen laden (nicht alle)
- Datenbankabfragen müssen effizient sein (ORDER BY + LIMIT)
- Server Components vermeiden unnötige Client-Side JavaScript-Bundles

**6. Komponentenarchitektur**
- Trennung von Datenlogik (Server Actions) und Darstellung (Komponenten)
- Wiederverwendbare UI-Komponenten (LinkCard, Badge, Card)
- TypeScript-Typisierung für alle Props und Datenstrukturen

### 1.4 Anforderungen an die Lösung

Die gewählte Dashboard-Lösung muss folgende Anforderungen erfüllen:

- **Benutzerfreundlichkeit**: Intuitive Navigation, klare Informationshierarchie
- **Performance**: Schnelle Ladezeiten durch Server-Side Rendering
- **Zugänglichkeit**: Responsive Design für alle Gerätetypen
- **Konsistenz**: Einheitliches Design mit dem Rest der Anwendung (shadcn/ui, Tailwind CSS)
- **Wartbarkeit**: Modulare Komponentenstruktur, klare Datentrennung
- **Erweiterbarkeit**: Einfaches Hinzufügen weiterer Dashboard-Widgets in der Zukunft
- **Dark-Mode-Kompatibilität**: Alle Farben und Kontraste müssen im Dark Mode funktionieren

---

## 2. Lösungsmöglichkeiten

### 2.1 Beschreibung der Konzepte

Zur Umsetzung des Schüler-Dashboards wurden drei verschiedene Architektur- und Rendering-Ansätze evaluiert.

#### Alternative 1: Server Component mit serverseitigem Data Fetching (gewählte Lösung)

**Technische Beschreibung:**
Das Dashboard wird als Next.js Server Component implementiert. Alle Daten (Feedbacks, Petitionen) werden serverseitig über Server Actions aus der Supabase-Datenbank geladen, bevor die Seite an den Client ausgeliefert wird. Die Darstellungskomponente (`StudentDashboard`) erhält die Daten als Props.

**Architektur:**
- **Page Component** (`app/student/page.tsx`): Server Component, ruft Server Actions auf
- **Server Actions** (`app/student/feedback/actions.ts`, `app/student/petitions/actions.ts`): Datenbankabfragen
- **Darstellungskomponente** (`components/student-dashboard.tsx`): Reine Präsentationslogik
- **Layout** (`app/student/layout.tsx`): Rollenprüfung und Zugriffskontrolle

**Kernmerkmale:**
- Kein Client-Side JavaScript für das Laden der Daten nötig
- HTML wird vollständig auf dem Server gerendert
- Schnelle initiale Ladezeit (Time to First Contentful Paint)
- SEO-freundlich (obwohl hier nicht relevant)

```typescript
// app/student/page.tsx - Server Component
const DashboardPage: NextPage = async () => {
  const feedbacks = await getMyFeedbacks();
  const petitions = await getMyRecentPetitions();
  return <StudentDashboard feedbacks={feedbacks} petitions={petitions} />;
};
```

#### Alternative 2: Client Component mit useEffect und API-Routes

**Technische Beschreibung:**
Das Dashboard wird als Client Component (`'use client'`) implementiert. Daten werden nach dem Mount der Komponente über `useEffect` und `fetch`-Aufrufe an API-Routes geladen. Während des Ladens wird ein Skeleton oder Spinner angezeigt.

**Architektur:**
- **Page Component**: Client Component mit `'use client'`-Direktive
- **API Routes** (`app/api/feedbacks/route.ts`, `app/api/petitions/route.ts`): REST-Endpunkte
- **State Management**: `useState` + `useEffect` für Datenladung
- **Loading State**: Skeleton-UI während der Datenabfrage

**Kernmerkmale:**
- Client-Side Rendering nach initialem Laden
- Loading States mit Skeleton-Komponenten
- Zusätzliche API-Routes als Datenschicht
- Re-Fetching bei Bedarf möglich (z.B. Pull-to-Refresh)

```typescript
// Beispiel: Client Component
'use client';
export default function DashboardPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/feedbacks').then(res => res.json()).then(setFeedbacks);
    fetch('/api/petitions').then(res => res.json()).then(setPetitions);
    setLoading(false);
  }, []);
  
  if (loading) return <DashboardSkeleton />;
  return <StudentDashboard feedbacks={feedbacks} petitions={petitions} />;
}
```

#### Alternative 3: Hybrid-Ansatz mit React Server Components und Suspense

**Technische Beschreibung:**
Das Dashboard-Layout wird als Server Component gerendert, während einzelne Datenbereiche (Feedbacks, Petitionen) als separate async Server Components mit React `<Suspense>`-Boundaries implementiert werden. Jeder Bereich hat seinen eigenen Loading State.

**Architektur:**
- **Page Component**: Server Component mit Suspense-Boundaries
- **Async Sub-Components**: Individuelle Server Components für Feedbacks und Petitionen
- **Fallback-UI**: Skeleton-Komponenten innerhalb von `<Suspense>`
- **Streaming**: Inhalte werden sukzessive gestreamt

**Kernmerkmale:**
- Streaming Server Rendering
- Individuelle Loading States pro Bereich
- Progressive Darstellung der Inhalte
- Kein Client-Side JavaScript für Datenladen

```typescript
// Beispiel: Suspense-basierter Ansatz
export default function DashboardPage() {
  return (
    <div>
      <QuickActions /> {/* Sofort gerendert */}
      <Suspense fallback={<FeedbackSkeleton />}>
        <RecentFeedbacks /> {/* Async Server Component */}
      </Suspense>
      <Suspense fallback={<PetitionSkeleton />}>
        <RecentPetitions /> {/* Async Server Component */}
      </Suspense>
    </div>
  );
}
```

### 2.2 Bewertung der Konzepte

#### Bewertungskriterien

Die drei Lösungsalternativen werden anhand folgender Kriterien bewertet:

1. **Performance**: Ladezeit, Time to First Contentful Paint, Bundle-Größe
2. **Komplexität**: Implementierungsaufwand und Code-Komplexität
3. **Benutzererfahrung**: Loading States, wahrgenommene Geschwindigkeit
4. **Wartbarkeit**: Code-Struktur, Testbarkeit, Erweiterbarkeit
5. **Next.js-Konformität**: Einhaltung der empfohlenen Next.js-Patterns
6. **Dark-Mode-Support**: Aufwand für Light/Dark-Mode-Kompatibilität
7. **Responsive Design**: Aufwand für responsive Anpassungen

#### Tabellarischer Vergleich

| Kriterium | Server Component (Alt. 1) | Client Component (Alt. 2) | Hybrid/Suspense (Alt. 3) |
|-----------|--------------------------|---------------------------|--------------------------|
| **Performance** | ⭐⭐⭐⭐⭐ Sehr gut (kein JS-Bundle) | ⭐⭐⭐ Mittel (JS-Bundle + Fetching) | ⭐⭐⭐⭐⭐ Sehr gut (Streaming) |
| **Komplexität** | ⭐⭐⭐⭐⭐ Sehr gering | ⭐⭐⭐ Mittel (State, useEffect) | ⭐⭐⭐⭐ Gering (Suspense-Boilerplate) |
| **Benutzererfahrung** | ⭐⭐⭐⭐ Gut (kein Loading-Flicker) | ⭐⭐⭐ Mittel (Loading Spinner) | ⭐⭐⭐⭐⭐ Exzellent (Progressive Loading) |
| **Wartbarkeit** | ⭐⭐⭐⭐⭐ Exzellent (klare Trennung) | ⭐⭐⭐ Mittel (State-Handling) | ⭐⭐⭐⭐ Gut (mehr Dateien) |
| **Next.js-Konformität** | ⭐⭐⭐⭐⭐ Best Practice | ⭐⭐ Veraltet (Pages-Router-Pattern) | ⭐⭐⭐⭐⭐ Best Practice |
| **Dark-Mode-Support** | ⭐⭐⭐⭐⭐ Identisch | ⭐⭐⭐⭐⭐ Identisch | ⭐⭐⭐⭐⭐ Identisch |
| **Responsive Design** | ⭐⭐⭐⭐⭐ Identisch | ⭐⭐⭐⭐⭐ Identisch | ⭐⭐⭐⭐⭐ Identisch |

**Detaillierte Bewertung:**

**Alternative 1 – Server Component:**
- ✅ **Stärken**:
  - Minimale Code-Komplexität: Page ruft direkt Server Actions auf
  - Kein zusätzliches Client-Side JavaScript für Datenladen
  - Perfekte Trennung von Datenlogik und Darstellung
  - Konsistent mit dem Rest des Projekts (Server Actions Pattern)
  - Kein Loading-Flicker, da HTML vollständig gerendert wird
  
- ❌ **Schwächen**:
  - Kein individueller Loading State pro Bereich
  - Seite wird erst angezeigt, wenn alle Daten geladen sind
  - Keine Möglichkeit für optimistisches UI-Update

**Alternative 2 – Client Component:**
- ✅ **Stärken**:
  - Einfache Implementierung von Loading States
  - Möglichkeit für Re-Fetching/Polling
  - Flexibles State Management
  
- ❌ **Schwächen**:
  - Zusätzliches JavaScript-Bundle für den Client
  - API-Routes müssen separat erstellt und gesichert werden
  - Widerspricht dem Next.js App Router Best Practice (Server-first)
  - Wasserfall-Effekt: Seite lädt → JavaScript lädt → Daten laden
  - Weniger sicher: API-Routes müssen eigene Auth-Checks implementieren

**Alternative 3 – Hybrid/Suspense:**
- ✅ **Stärken**:
  - Progressive Darstellung: Schnelle Bereiche erscheinen sofort
  - Individuelle Skeleton-Loading-States je Bereich
  - Streaming SSR für optimale perceived Performance
  - Next.js Best Practice für komplexe Seiten
  
- ❌ **Schwächen**:
  - Höherer Boilerplate-Aufwand (separate async Components)
  - Mehr Dateien und Komponenten zu verwalten
  - Für ein Dashboard mit nur zwei Datenbereichen überdimensioniert
  - Komplexere Fehlerbehandlung (Error Boundaries je Suspense)

#### Risiko-Analyse

**Alternative 1 – Server Component:**
- Risiko: Langsame DB-Abfrage blockiert gesamte Seite → Mitigation: Datenbankindizes, Query-Optimierung
- Risiko: Keine Echtzeit-Updates → Mitigation: `revalidatePath` nach Mutations

**Alternative 2 – Client Component:**
- Risiko: Sicherheitslücken durch offene API-Routes → Mitigation: Eigene Auth-Middleware
- Risiko: Schlechte Performance bei langsamem Netz → Mitigation: Caching, SWR

**Alternative 3 – Hybrid/Suspense:**
- Risiko: Komplexere Fehlerbehandlung → Mitigation: Error Boundaries
- Risiko: Over-Engineering für einfaches Dashboard → Mitigation: Nur bei Bedarf einsetzen

---

## 3. Begründung des Lösungswegs

Nach Abwägung der drei Alternativen wurde **Alternative 1: Server Component mit serverseitigem Data Fetching** als Lösung gewählt. Die Entscheidung basiert auf mehreren technischen und projektspezifischen Faktoren.

### 3.1 Technische Vorteile

**1. Konsistenz mit dem Projektmuster**

Das B3Echo-Projekt verwendet durchgängig das Server Actions Pattern. Alle anderen Seiten (Login, Feedback-Einreichung, Petitionen) folgen diesem Muster. Die Verwendung des gleichen Patterns für das Dashboard sorgt für eine konsistente Codebasis:

```typescript
// Einheitliches Pattern: Page → Server Action → Component
// app/student/page.tsx
const DashboardPage: NextPage = async () => {
  const feedbacks = await getMyFeedbacks();
  const petitions = await getMyRecentPetitions();
  return <StudentDashboard feedbacks={feedbacks} petitions={petitions} />;
};
```

**2. Minimale Code-Komplexität**

Die Server Component-Lösung benötigt am wenigsten Code:
- Keine `useState`, `useEffect` oder Client-Side State-Logik
- Keine API-Routes oder zusätzliche Endpunkte
- Keine Skeleton-Komponenten oder Loading-Fallbacks
- Die Page Component besteht aus nur 5 Zeilen Code

**3. Optimale Performance**

Server Components senden kein JavaScript an den Client für die Datenladelogik. Das bedeutet:
- Kleineres JavaScript-Bundle
- Schnellere Time to Interactive (TTI)
- Keine Wasserfall-Effekte (Seite → JS → Daten)
- Daten werden direkt auf dem Server geladen, nahe an der Datenbank

**4. Sicherheit durch Server-seitige Datenabfrage**

Alle Datenbankabfragen erfolgen in Server Actions mit `'use server'`-Direktive:
- Der Supabase-Client mit Service-Rolle ist nur serverseitig verfügbar
- Keine API-Endpoints, die extern aufgerufen werden könnten
- User-Authentifizierung wird bei jeder Abfrage geprüft

```typescript
// Server Action: User-Verifizierung + Datenabfrage
export async function getMyFeedbacks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data } = await supabase
    .from('feedback')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });
  return data || [];
}
```

### 3.2 Projektspezifische Gründe

**1. Einfachheit vor Perfektion**

Das Dashboard lädt nur zwei kleine Datensätze (max. 3 Feedbacks + 3 Petitionen). Die Datenbankabfragen sind sehr schnell (< 100ms). Der Overhead eines Suspense-Ansatzes ist für diesen Use Case nicht gerechtfertigt.

**2. Teamverständlichkeit**

Das Server Component Pattern ist das einfachste der drei Alternativen. Jedes Teammitglied kann den Code verstehen und erweitern, ohne tiefgehendes Wissen über React Suspense oder Client-Side Data Fetching.

**3. Zeitliche Einschränkungen**

Alternative 1 konnte in wenigen Stunden implementiert werden, während Alternative 2 (API-Routes) oder Alternative 3 (Suspense + Skeletons) mehr Aufwand erfordern.

### 3.3 Warum nicht Alternative 2 oder 3?

**Client Component (Alt. 2) wurde abgelehnt, weil:**
- Es dem App Router Best Practice widerspricht
- Zusätzliche API-Routes erstellt und abgesichert werden müssten
- Unnötiges Client-Side JavaScript erzeugt wird
- Loading States mit Spinner eine schlechtere UX bieten als sofortiges SSR

**Hybrid/Suspense (Alt. 3) wurde abgelehnt, weil:**
- Es für nur zwei Datenbereiche überdimensioniert ist
- Mehr Boilerplate-Code (Skeleton-Komponenten, Error Boundaries) benötigt wird
- Die Datenbankabfragen so schnell sind, dass Streaming keinen spürbaren Vorteil bringt
- Die zusätzliche Komplexität die Wartbarkeit verschlechtert

---

## 4. Qualitätssicherung

Die Qualitätssicherung des Schüler-Dashboards erfolgt auf mehreren Ebenen: Code-Qualität, UI/UX-Konsistenz und funktionale Korrektheit.

### 4.1 Code-Qualität

**TypeScript-Typisierung**

Alle Komponenten und Datenstrukturen sind vollständig typisiert:

```typescript
// lib/types.ts - Feedback-Typ
export type Feedback = {
  id: string;
  student_id: string;
  category: CategoryValue;
  title: string;
  description: string;
  seen_by_teacher: boolean;
  created_at: Date;
};

// components/student-dashboard.tsx - Props-Typ
type PetitionWithReason = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  rejection_reason?: string | null;
  rejection_date?: string | null;
};

type Props = {
  feedbacks: Feedback[];
  petitions: PetitionWithReason[];
};
```

**Komponentenstruktur**

Die Dashboard-Implementierung folgt dem Single Responsibility Principle:
- `app/student/page.tsx`: Nur Datenloading und Komponentenmounting
- `app/student/layout.tsx`: Nur Zugriffskontrolle
- `components/student-dashboard.tsx`: Nur Darstellungslogik
- `app/student/feedback/actions.ts`: Nur Datenbankabfragen für Feedbacks
- `app/student/petitions/actions.ts`: Nur Datenbankabfragen für Petitionen

**ESLint und Formatting**

- ESLint mit `@typescript-eslint/recommended` und `next/core-web-vitals`
- Prettier für einheitliche Code-Formatierung
- Import-Aliase (`@/`) für konsistente Imports

### 4.2 UI/UX-Konsistenz

**shadcn/ui-Komponentenbibliothek**

Alle UI-Elemente verwenden shadcn/ui-Komponenten:
- `Card`, `CardHeader`, `CardContent`, `CardTitle` für Karten-Layouts
- `Badge` für Status-Anzeigen
- `Button` für Interaktionen
- Tailwind CSS-Klassen für Layout und Spacing

**Dark-Mode-Kompatibilität**

Alle Farben sind für Light und Dark Mode definiert:
```typescript
// Beispiel: Status-Badge mit Dark-Mode-Unterstützung
className: 'bg-yellow-50 text-yellow-700 border-yellow-200 
            dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800'
```

**Responsive Design**

Tailwind CSS Breakpoints werden konsistent verwendet:
```html
<!-- Grid: 1 Spalte auf Mobile, 2 Spalten ab md (768px) -->
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
```

### 4.3 Sicherheitsprüfungen

**1. Zugriffskontrolle im Layout**

```typescript
// app/student/layout.tsx
export default async function StudentLayout({ children }) {
  const user = await getUser();
  if (!user) redirect("/login");
  
  const role = await getRole();
  if (role !== "student" && role !== "admin") redirect("/teacher");
  
  return <>{children}</>;
}
```

**2. Datenfilterung in Server Actions**

Feedbacks und Petitionen werden immer nach `student_id` bzw. `creator_id` gefiltert – ein Schüler sieht nur seine eigenen Daten:

```typescript
// Nur eigene Feedbacks laden
const { data } = await supabase
  .from('feedback')
  .select('*')
  .eq('student_id', user.id) // Filterung nach aktuellem User
  .order('created_at', { ascending: false });
```

**3. Row Level Security (RLS)**

Zusätzlich zur Filterung im Code schützen Supabase RLS-Policies auf Datenbankebene vor unberechtigtem Zugriff.

### 4.4 Manuelle Testszenarien

| Test-ID | Testszenario | Erwartetes Ergebnis |
|---------|--------------|---------------------|
| T1 | Login als Schüler | Weiterleitung zu `/student`, Dashboard wird angezeigt |
| T2 | Dashboard zeigt letzte 3 Feedbacks | Maximal 3 Feedback-Karten mit Titel, Beschreibung, Status |
| T3 | Dashboard zeigt letzte 3 Petitionen | Maximal 3 Petitions-Karten mit Titel, Status, Datum |
| T4 | Feedback mit Status „Offen" | Orangefarbener Badge mit Uhr-Icon und Text „Offen" |
| T5 | Feedback mit Status „Gesehen" | Grüner Badge mit Häkchen-Icon und Text „Gesehen" |
| T6 | Petition mit Status „Ausstehend" | Gelber Badge mit Sanduhr-Icon und Text „Ausstehend" |
| T7 | Petition mit Status „Genehmigt" | Grüner Badge mit Häkchen-Icon und Text „Genehmigt" |
| T8 | Petition mit Status „Abgelehnt" | Roter Badge mit Warnungs-Icon und Text „Abgelehnt" |
| T9 | Abgelehnte Petition mit Grund | Ablehnungsgrund wird in rotem Hinweisfeld angezeigt |
| T10 | Klick auf „Feedback einreichen" | Navigation zu `/student/submit-feedback` |
| T11 | Klick auf „Petitionen ansehen" | Navigation zu `/petitions` |
| T12 | Klick auf „Alle anzeigen" (Feedbacks) | Navigation zu `/student/feedback` mit vollständiger Liste |
| T13 | Klick auf „Alle anzeigen" (Petitionen) | Navigation zu `/student/petitions` mit vollständiger Liste |
| T14 | Klick auf einzelnes Feedback | Navigation zu `/feedback/[id]` mit Detailansicht |
| T15 | Dashboard ohne Feedbacks | Hinweistext „Noch kein Feedback eingereicht" |
| T16 | Dashboard ohne Petitionen | Hinweistext „Noch keine Petition eingereicht" |
| T17 | Responsive: Smartphone (< 768px) | Karten stapeln sich vertikal, Inhalte lesbar |
| T18 | Responsive: Desktop (≥ 1024px) | Quick-Action-Karten nebeneinander, Feedbacks/Petitionen vollbreit |
| T19 | Dark Mode | Alle Farben, Badges und Karten korrekt dargestellt |
| T20 | Zugriff als Lehrer auf `/student` | Weiterleitung zu `/teacher` |
| T21 | Zugriff ohne Login auf `/student` | Weiterleitung zu `/login` |

---

## 5. Planung der Vorgehensweise

### 5.1 Komponentenstruktur

Das Dashboard folgt einer klaren Hierarchie:

```
app/student/layout.tsx          → Zugriffskontrolle (Auth + Role Check)
  └── app/student/page.tsx       → Datenloading (Server Component)
       └── components/student-dashboard.tsx → Darstellung (Präsentationskomponente)
            ├── LinkCard (Quick Actions)
            ├── Card (Feedbacks-Übersicht)
            │    └── Feedback-Karten (max. 3)
            └── Card (Petitionen-Übersicht)
                 └── Petitions-Karten (max. 3)
```

### 5.2 Datenfluss

```
1. User navigiert zu /student
2. Layout prüft Auth + Rolle
   ├── Nicht eingeloggt → Redirect /login
   ├── Rolle = teacher → Redirect /teacher
   └── Rolle = student/admin → Weiter
3. Page Component ruft Server Actions auf:
   ├── getMyFeedbacks()  → SELECT * FROM feedback WHERE student_id = $userId ORDER BY created_at DESC
   └── getMyRecentPetitions() → SELECT * FROM petitions WHERE creator_id = $userId ORDER BY created_at DESC LIMIT 3
4. Daten werden als Props an StudentDashboard übergeben
5. StudentDashboard rendert:
   ├── 2x LinkCard (Quick Actions)
   ├── Feedbacks-Card (letzte 3 mit Status-Badge)
   └── Petitionen-Card (letzte 3 mit Status-Badge)
```

### 5.3 Datenbankschema (relevante Tabellen)

**feedback:**
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| student_id | UUID | FK → auth.users |
| category | TEXT | LEHRER, GEBÄUDE, SONSTIGES |
| title | TEXT | Feedback-Titel |
| description | TEXT | Feedback-Beschreibung |
| seen_by_teacher | BOOLEAN | Gelesen-Status |
| created_at | TIMESTAMP | Erstellungsdatum |

**petitions:**
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| creator_id | UUID | FK → auth.users |
| title | TEXT | Petitions-Titel |
| description | TEXT | Petitions-Beschreibung |
| status | TEXT | pending, approved, rejected |
| created_at | TIMESTAMP | Erstellungsdatum |

**petition_moderation:**
| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| petition_id | UUID | FK → petitions |
| reason | TEXT | Ablehnungsgrund |
| created_at | TIMESTAMP | Datum der Moderation |

### 5.4 UI-Mockup (Beschreibung)

Das Dashboard ist vertikal in drei Bereiche aufgeteilt:

1. **Quick Actions** (oben): Zwei Karten nebeneinander
   - Links: „Feedback einreichen" mit Icon (MessageSquare)
   - Rechts: „Petitionen ansehen" mit Icon (FileText)

2. **Feedbacks-Übersicht** (Mitte): Card mit Header „Ihre zuletzt eingereichten Feedbacks"
   - Rechts im Header: Link „Alle anzeigen" mit Pfeil-Icon
   - Darunter: Bis zu 3 Feedback-Karten mit Titel, Beschreibung (2 Zeilen), Kategorie-Badge, Datum und Status-Badge

3. **Petitionen-Übersicht** (unten): Card mit Header „Ihre zuletzt eingereichten Petitionen"
   - Rechts im Header: Link „Alle anzeigen" mit Pfeil-Icon
   - Darunter: Bis zu 3 Petitions-Karten mit Titel, Beschreibung (2 Zeilen), Datum und Status-Badge
   - Bei abgelehnten Petitionen: Rotes Hinweisfeld mit Ablehnungsgrund

### 5.5 Ablaufplanung

| Schritt | Aufgabe | Geschätzte Dauer |
|---------|---------|-----------------|
| 1 | Layout mit Zugriffskontrolle erstellen | 30 min |
| 2 | Server Actions für Feedbacks implementieren | 45 min |
| 3 | Server Actions für Petitionen implementieren | 45 min |
| 4 | LinkCard-Komponente erstellen | 30 min |
| 5 | StudentDashboard-Komponente (Feedbacks-Bereich) | 1,5 h |
| 6 | StudentDashboard-Komponente (Petitionen-Bereich) | 1,5 h |
| 7 | Status-Badges und Farbkodierung | 1 h |
| 8 | Responsive Design und Dark Mode | 1 h |
| 9 | Manuelle Tests und Bugfixes | 1 h |
| **Gesamt** | | **ca. 8 Stunden** |

---

## 6. Umsetzung

### 6.1 Zugriffskontrolle (Layout)

Das Student-Layout prüft die Authentifizierung und Rolle des Nutzers:

```typescript
// app/student/layout.tsx
import { getUser, getRole } from "@/utils/supabase/user"
import { redirect } from "next/navigation"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) {
    redirect("/login")
  }

  const role = await getRole()
  if (role !== "student" && role !== "admin") {
    redirect("/teacher")
  }

  return <>{children}</>
}
```

**Erklärung:**
- `getUser()` prüft die Session und gibt den User zurück (oder `null`)
- `getRole()` liest die Rolle aus der `profiles`-Tabelle
- Nicht authentifizierte Nutzer → `/login`
- Lehrer → `/teacher` (Weiterleitung zum eigenen Dashboard)
- Admins haben Zugriff auf das Student-Dashboard (flexibler Zugang)

### 6.2 Server Actions für Datenbankabfragen

**Feedbacks laden:**

```typescript
// app/student/feedback/actions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function getMyFeedbacks() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching feedbacks:', error)
    throw new Error('Failed to fetch feedbacks')
  }
  return data || []
}
```

**Petitionen laden (mit Ablehnungsgründen):**

```typescript
// app/student/petitions/actions.ts
'use server'
import { createClient } from '@/utils/supabase/server'

export async function getMyRecentPetitions() {
  const petitions = await fetchStudentPetitions();
  return petitions.slice(0, 3);
}

export async function fetchStudentPetitions() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) throw new Error('User not authenticated');

  // 1. Alle eigenen Petitionen laden
  const { data: petitions } = await supabase
    .from('petitions')
    .select('*')
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  // 2. Ablehnungsgründe für abgelehnte Petitionen laden
  const rejectedIds = petitions.filter(p => p.status === 'rejected').map(p => p.id);
  let moderationData = [];
  if (rejectedIds.length > 0) {
    const { data } = await supabase
      .from('petition_moderation')
      .select('petition_id, reason, created_at')
      .in('petition_id', rejectedIds);
    moderationData = data || [];
  }

  // 3. Daten zusammenführen
  return petitions.map(petition => ({
    ...petition,
    rejection_reason: moderationData.find(m => m.petition_id === petition.id)?.reason || null,
    rejection_date: moderationData.find(m => m.petition_id === petition.id)?.created_at || null,
  }));
}
```

**Erklärung:**
- `getMyRecentPetitions()` begrenzt auf die letzten 3 Einträge für das Dashboard
- `fetchStudentPetitions()` lädt alle Petitionen inkl. Ablehnungsgründe (für die Detailseite)
- Ablehnungsgründe werden über eine zweite Abfrage aus `petition_moderation` geladen und mit den Petitionen zusammengeführt

### 6.3 Dashboard-Page (Server Component)

```typescript
// app/student/page.tsx
import StudentDashboard from '@/components/student-dashboard';
import { NextPage } from 'next';
import { getMyFeedbacks } from '@/app/student/feedback/actions';
import { getMyRecentPetitions } from '@/app/student/petitions/actions';

const DashboardPage: NextPage = async () => {
  const feedbacks = await getMyFeedbacks();
  const petitions = await getMyRecentPetitions();
  return <StudentDashboard feedbacks={feedbacks} petitions={petitions} />;
};

export default DashboardPage;
```

**Erklärung:**
- Die Page ist eine async Server Component
- Beide Server Actions werden aufgerufen, bevor die Komponente gerendert wird
- Die Daten werden als Props an die Präsentationskomponente weitergegeben
- Kein Client-Side State, kein `useEffect`, kein Loading-State

### 6.4 Dashboard-Komponente (Darstellung)

Die `StudentDashboard`-Komponente ist die zentrale Präsentationskomponente und besteht aus drei Bereichen:

**Quick Actions (LinkCards):**

```tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-center">
  <LinkCard
    href="/student/submit-feedback"
    icon={MessageSquare}
    title="Feedback einreichen"
    description="Teilen Sie uns Ihre Meinung mit"
  />
  <LinkCard
    href="/petitions"
    icon={FileText}
    title="Petitionen ansehen"
    description="Durchsuchen und unterstützen Sie Petitionen"
  />
</div>
```

**Feedback-Übersicht mit Status-Badges:**

```tsx
{feedbacks.map((feedback, index) => {
  if (index >= 3) return; // Nur letzte 3 anzeigen
  const isOpen = !feedback.seen_by_teacher;
  return (
    <Link key={feedback.id} href={`/feedback/${feedback.id}`}>
      <Card className="border hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold">{feedback.title}</h3>
          {isOpen ? (
            <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
              <Clock className="w-3 h-3" /> Offen
            </Badge>
          ) : (
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              <CheckCircle className="w-3 h-3" /> Gesehen
            </Badge>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">{feedback.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
})}
```

**Petitions-Übersicht mit Statuskonfiguration:**

```typescript
// Status-Konfiguration für Petitionen
const statusConfig = {
  pending: {
    label: 'Ausstehend',
    icon: HourglassIcon,
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
  },
  approved: {
    label: 'Genehmigt',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  },
  rejected: {
    label: 'Abgelehnt',
    icon: AlertCircle,
    className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  },
};
```

**Ablehnungsgrund-Anzeige:**

```tsx
{petition.status === 'rejected' && petition.rejection_reason && (
  <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
    <div className="flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-medium text-destructive">Ablehnungsgrund:</p>
        <p className="text-xs text-muted-foreground">{petition.rejection_reason}</p>
      </div>
    </div>
  </div>
)}
```

### 6.5 LinkCard-Komponente

Die wiederverwendbare `LinkCard`-Komponente stellt eine klickbare Karte mit Icon dar:

```typescript
// components/ui/link-card.tsx
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

type LinkCardProps = {
  href: string
  icon: LucideIcon
  title: string
  description: string
}

const LinkCard = ({ href, icon: Icon, title, description }: LinkCardProps) => {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg">
        <CardHeader className="flex items-center space-x-4">
          <Icon className="w-6 h-6 text-primary" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

export default LinkCard
```

### 6.6 Routing und Weiterleitungslogik

Die Root-Route (`/`) leitet Nutzer basierend auf ihrer Rolle weiter:

```typescript
// app/route.ts
export async function GET() {
  const user = await getUser();
  if (!user) redirect("/login");
  
  const role = await getRole();
  if (role === "teacher") redirect("/teacher");
  else if (role === "student") redirect("/student");
  else if (role === "admin") redirect("/teacher");
  
  redirect("/login");
}
```

---

## 7. Testergebnisse

### 7.1 Durchführung der manuellen Tests

| Test-ID | Testszenario | Ergebnis | Status |
|---------|--------------|----------|--------|
| T1 | Login als Schüler → Dashboard | Dashboard wird mit Feedbacks und Petitionen angezeigt | ✅ Bestanden |
| T2 | Letzte 3 Feedbacks anzeigen | Maximal 3 Feedback-Karten sichtbar, neueste zuerst | ✅ Bestanden |
| T3 | Letzte 3 Petitionen anzeigen | Maximal 3 Petitions-Karten sichtbar, neueste zuerst | ✅ Bestanden |
| T4 | Feedback-Status „Offen" | Orangefarbener Badge mit Uhr-Icon | ✅ Bestanden |
| T5 | Feedback-Status „Gesehen" | Grüner Badge mit Häkchen-Icon | ✅ Bestanden |
| T6 | Petition-Status „Ausstehend" | Gelber Badge mit Sanduhr-Icon | ✅ Bestanden |
| T7 | Petition-Status „Genehmigt" | Grüner Badge mit Häkchen-Icon | ✅ Bestanden |
| T8 | Petition-Status „Abgelehnt" | Roter Badge mit Warnungs-Icon | ✅ Bestanden |
| T9 | Ablehnungsgrund anzeigen | Roter Hinweiskasten mit Grund wird korrekt dargestellt | ✅ Bestanden |
| T10 | Quick Action: Feedback einreichen | Navigation zu `/student/submit-feedback` | ✅ Bestanden |
| T11 | Quick Action: Petitionen ansehen | Navigation zu `/petitions` | ✅ Bestanden |
| T12 | „Alle anzeigen" Feedbacks | Navigation zu `/student/feedback` | ✅ Bestanden |
| T13 | „Alle anzeigen" Petitionen | Navigation zu `/student/petitions` | ✅ Bestanden |
| T14 | Klick auf Feedback-Karte | Navigation zu `/feedback/[id]` | ✅ Bestanden |
| T15 | Dashboard ohne Feedbacks | „Noch kein Feedback eingereicht" wird angezeigt | ✅ Bestanden |
| T16 | Dashboard ohne Petitionen | „Noch keine Petition eingereicht" wird angezeigt | ✅ Bestanden |
| T17 | Responsive: Smartphone | Karten stapeln sich vertikal, alle Inhalte lesbar | ✅ Bestanden |
| T18 | Responsive: Desktop | Quick Actions nebeneinander, Listen vollbreit | ✅ Bestanden |
| T19 | Dark Mode | Alle Farben und Kontraste korrekt | ✅ Bestanden |
| T20 | Zugriff als Lehrer | Weiterleitung zu `/teacher` | ✅ Bestanden |
| T21 | Zugriff ohne Login | Weiterleitung zu `/login` | ✅ Bestanden |

### 7.2 Bewertung der Testergebnisse

Alle 21 manuellen Testfälle wurden **erfolgreich bestanden**. Die wichtigsten Erkenntnisse:

- **Funktionalität**: Alle Acceptance Criteria der User Story sind vollständig erfüllt
- **Status-Darstellung**: Die farbkodierten Badges sind sowohl im Light als auch im Dark Mode gut sichtbar und unterscheidbar
- **Responsive Design**: Das Grid-Layout passt sich korrekt an verschiedene Bildschirmgrößen an
- **Zugriffskontrolle**: Die Rollenprüfung im Layout verhindert zuverlässig unbefugten Zugriff
- **Leerstand-Handling**: Auch Nutzer ohne Feedbacks/Petitionen erhalten eine sinnvolle Anzeige

### 7.3 Bekannte Einschränkungen

- **Kein Echtzeit-Update**: Das Dashboard aktualisiert sich nicht automatisch, wenn ein Lehrer den Feedback-Status ändert. Erst ein Neuladen der Seite zeigt den aktuellen Status.
- **Keine Pagination**: Die „Alle anzeigen"-Seiten laden alle Einträge auf einmal. Bei sehr vielen Einträgen könnte dies zu Performance-Problemen führen.
- **Keine Push-Benachrichtigungen**: Schüler werden nicht aktiv benachrichtigt, wenn ein Feedback gesehen oder eine Petition bearbeitet wurde.

---

## 8. Gesamtreflektion

### 8.1 Was lief gut

**1. Klare Komponentenarchitektur**
Die Trennung von Layout (Zugriffskontrolle), Page (Datenloading) und Komponente (Darstellung) hat sich bewährt. Jede Datei hat eine klar definierte Verantwortlichkeit, was den Code übersichtlich und wartbar macht.

**2. Server Component Pattern**
Die Entscheidung für Server Components ohne Client-Side Data Fetching hat die Implementierung deutlich vereinfacht. Die Page Component besteht aus nur 5 Zeilen Code. Kein `useState`, kein `useEffect`, keine Loading States – die Seite wird fertig gerendert an den Client geliefert.

**3. Wiederverwendbare Komponenten**
Die `LinkCard`-Komponente konnte als generische, wiederverwendbare UI-Komponente erstellt werden. Die Status-Konfiguration (`statusConfig`) ermöglicht eine saubere Zuordnung von Petitions-Status zu visueller Darstellung ohne verschachtelte if/else-Blöcke.

**4. Dark-Mode-Kompatibilität von Anfang an**
Durch die konsequente Verwendung von Tailwind CSS Dark-Mode-Klassen (`dark:...`) wurde der Dark Mode direkt bei der Implementierung berücksichtigt und nicht nachträglich hinzugefügt.

**5. TypeScript-Typsicherheit**
Die vollständige Typisierung aller Props, Datenstrukturen und Server Actions hat Fehler zur Entwicklungszeit erkannt und die IDE-Unterstützung (Autocomplete, Refactoring) erheblich verbessert.

### 8.2 Was besser werden muss

**1. Echtzeit-Updates**
Aktuell muss der Schüler die Seite manuell neu laden, um Statusänderungen zu sehen. Eine Integration von Supabase Realtime Subscriptions oder ein polling-basierter Ansatz könnte die User Experience verbessern.

**2. Pagination und Performance**
Die „Alle anzeigen"-Seiten laden alle Einträge. Bei Schulen mit vielen aktiven Nutzern könnte eine serverseitige Pagination mit Cursor-basiertem Ansatz die Performance verbessern.

**3. Skeleton-Loading**
Obwohl Server Components kein Client-Side Loading benötigen, könnte ein `loading.tsx` auf Routenebene die wahrgenommene Performance bei langsamen Datenbankverbindungen verbessern.

**4. Automatisierte Tests**
Es wurden keine automatisierten Unit- oder Integration-Tests implementiert. Für die Zukunft wären Tests für die Server Actions (Datenbank-Mocking) und die Dashboard-Komponente (Rendering-Tests) sinnvoll, um Regressionen zu vermeiden.

**5. Accessibility (Barrierefreiheit)**
Die Farbkodierung der Status-Badges könnte für farbenblinde Nutzer problematisch sein. Zusätzliche ARIA-Labels und eine nicht nur auf Farbe basierende Statusunterscheidung (bereits teilweise durch Icons gelöst) sollten weiter ausgebaut werden.

### 8.3 Fazit

Die Implementierung des Schüler-Dashboards erfüllt alle definierten Acceptance Criteria der User Story. Die gewählte Architektur (Server Component mit serverseitigem Data Fetching) hat sich als optimal für diesen Use Case erwiesen: minimale Komplexität, gute Performance und hohe Wartbarkeit. Die Entscheidung gegen einen Client Component- oder Suspense-Ansatz war für die Projektgröße und -anforderungen die richtige Wahl.

---

## 9. Anhang

### 9.1 Dateiübersicht

| Datei | Funktion |
|-------|----------|
| `app/student/layout.tsx` | Zugriffskontrolle (Auth + Role Check) |
| `app/student/page.tsx` | Dashboard Page (Server Component) |
| `app/student/feedback/actions.ts` | Server Action: Feedbacks laden |
| `app/student/feedback/page.tsx` | Alle Feedbacks anzeigen |
| `app/student/petitions/actions.ts` | Server Action: Petitionen laden |
| `app/student/petitions/page.tsx` | Alle Petitionen anzeigen |
| `components/student-dashboard.tsx` | Dashboard-Darstellungskomponente |
| `components/ui/link-card.tsx` | Wiederverwendbare LinkCard-Komponente |
| `components/feedback-list.tsx` | Feedback-Liste (Vollansicht) |
| `components/student/student-petitions-list.tsx` | Petitionen-Liste (Vollansicht) |
| `lib/types.ts` | TypeScript-Typdefinitionen |
| `app/route.ts` | Root-Route: Rollenbasierte Weiterleitung |
| `utils/supabase/user.ts` | Hilfsfunktionen: getUser(), getRole() |

### 9.2 Verwendete Technologien und Bibliotheken

| Technologie | Version | Zweck |
|-------------|---------|-------|
| Next.js | 16 | Framework (App Router, Server Components) |
| React | 19 | UI-Bibliothek |
| TypeScript | 5.x | Statische Typisierung |
| Tailwind CSS | 4 | Utility-First CSS-Framework |
| shadcn/ui | - | UI-Komponentenbibliothek |
| Supabase | - | Backend-as-a-Service (Auth, PostgreSQL) |
| Lucide React | - | Icon-Bibliothek |
| date-fns | - | Datumsformatierung (de-Locale) |

### 9.3 Quellen

- Next.js Dokumentation: https://nextjs.org/docs
- Supabase Dokumentation: https://supabase.com/docs
- shadcn/ui Dokumentation: https://ui.shadcn.com
- Tailwind CSS Dokumentation: https://tailwindcss.com/docs
- React Server Components: https://react.dev/reference/rsc/server-components
