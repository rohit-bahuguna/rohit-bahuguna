# Portfolio & CMS Domain Model

This domain encompasses the content authoring, asset management, presentation rendering, and visitor telemetry for the personal portfolio.

## Language

### Content & Presentation

**Section Configuration**:
The structured JSON data defining the layout, copy, and controls of a distinct page region (Header, Hero, About, Theme, Contact, Footer).
_Avoid_: Page settings, UI state, template props

**Theme Palette**:
The canonical color definitions and derived CSS variables that govern both the public portfolio and the administrative dashboard.
_Avoid_: Skin, dark mode toggles, color schemes

**Project Showcase**:
A curated record representing a professional work achievement, characterized by title, media thumbnail, tech stack tags, and outbound URLs.
_Avoid_: Portfolio item, portfolio card, gallery post

**Skill Badge**:
A proficiency entry categorized under a technical discipline (Frontend, Backend, Database, Tools/DevOps).
_Avoid_: Tech tag, skill item, expertise

### Assets & Media

**Media Asset**:
A physical file stored on persistent local disk storage accompanied by an SQLite metadata record tracking its filename, MIME type, dimensions, and size.
_Avoid_: Upload, attachment, image object

**Media Picker**:
An embedded modal interface allowing form fields to select an existing Media Asset or upload a new one without leaving context.
_Avoid_: File browser, image chooser, asset popup

### Publishing & Delivery

**Draft State**:
The staged version of content or section configuration stored in SQLite awaiting administrative review prior to public release.
_Avoid_: Unpublished changes, temp edits, staging copy

**Live State**:
The active, published version of portfolio content currently served to public visitors and cached statically by ISR.
_Avoid_: Production version, published copy

**Preview Mode**:
An authenticated rendering state allowing an administrator to view staged Draft State on the live portfolio UI without invalidating or polluting the public static cache.
_Avoid_: Staging site, test view, debug mode

**On-Demand Revalidation**:
The programmatic invalidation and re-rendering of Next.js static page cache triggered immediately upon executing a publish action.
_Avoid_: Cache busting, SSR reload, full rebuild

**Cloudflare Ingress Tunnel**:
An encrypted, outbound-only connection managed by `cloudflared` bridging a local loopback port (`127.0.0.1:$PORT`) to the Cloudflare edge, removing the need for open inbound firewall ports on the VPS.
_Avoid_: Reverse proxy tunnel, port forwarding, public listener

**Obfuscated Admin Path**:
A secret, variable URL route prefix defined strictly in `.env` (`ADMIN_SECRET_PATH`) that maps externally to the CMS dashboard while returning 404 on predictable `/admin` paths.
_Avoid_: Secret URL, hidden dashboard, admin backdoor

**Edge Cache Purge**:
The automated API call to Cloudflare CDN edge nodes immediately following Next.js revalidation, expelling stale cached HTML across worldwide edge data centers.
_Avoid_: CDN wipe, cloud flush, manual purge

### Telemetry & Safety

**Interaction Event**:
An immutable log entry recording a visitor action (resume download, project link click, page visit) enriched with client headers, GeoIP coordinates, and bot classification tags.
_Avoid_: Analytic hit, click metric, tracking beacon

**Reference Guard**:
A validation check in the Media Library that blocks asset deletion when foreign references exist in projects, hero buttons, or section configs.
_Avoid_: Asset lock, delete protection
