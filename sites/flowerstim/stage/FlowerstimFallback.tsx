import type { CSSProperties } from "react";
import { resolveAsset } from "@/lib/assets";
import type { AssetManifest, MediaRef } from "@/lib/types";
import type { FlowerstimStageContent, SplitHeading } from "./content-types";
import styles from "./stage.module.css";

/**
 * Статичная версия Flowerstim для браузеров без WebGL (или при потере
 * GPU-контекста). Тот же контент, те же фотографии и типографика, но без
 * 3D-камеры, переходов, лупы и beat-навигации — обычный вертикальный
 * скролл. Это осознанный DESIGN GAP (см. docs/flowerstim-integration.md
 * §7): утверждённый дизайн требует WebGL, fallback лишь не оставляет
 * посетителя с пустым экраном.
 */

const MONO = "'IBM Plex Mono',monospace";
const label: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
};
const heading: CSSProperties = {
  fontFamily: "var(--fs-serif)",
  fontWeight: "var(--fs-serif-w)",
  fontSize: "clamp(32px,3.9vw,54px)",
  lineHeight: 1.02,
  letterSpacing: "-.015em",
  color: "var(--fs-ink)",
  margin: 0,
};
const link: CSSProperties = {
  ...label,
  alignSelf: "flex-start",
  color: "var(--fs-ink)",
  textDecoration: "none",
  borderBottom: "1px solid var(--fs-ink)",
  padding: "6px 0 5px",
};
const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
  maxWidth: "min(520px,84vw)",
};
const section: CSSProperties = { padding: "12vh clamp(20px,6vw,96px)" };
const EXTERNAL = { target: "_blank", rel: "noopener" } as const;

function Split({ h }: { h: SplitHeading }) {
  return (
    <>
      {h.lead}
      <br />
      <em style={{ color: "var(--fs-accent)" }}>{h.accent}</em>
    </>
  );
}

export function FlowerstimFallback({
  content: c,
  assets,
  style,
}: {
  content: FlowerstimStageContent;
  assets: AssetManifest;
  style: CSSProperties;
}) {
  const src = (ref: MediaRef) => resolveAsset(ref, assets).sources[0]?.url;
  const alt = (ref: MediaRef) => resolveAsset(ref, assets).alt;
  const img = (ref: MediaRef, s: CSSProperties) => (
    // eslint-disable-next-line @next/next/no-img-element -- ассеты уже резолвлены в готовые файлы; оптимизация next/image не нужна для аварийного режима
    <img src={src(ref)} alt={alt(ref)} loading="lazy" style={{ display: "block", ...s }} />
  );

  return (
    <main className={styles.root} style={style}>
      <header style={{ ...section, position: "relative", minHeight: "100vh", padding: 0 }}>
        {img(c.assets.s01Background, {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        })}
        {img(c.assets.s01Bouquet, {
          position: "absolute",
          left: "50%",
          top: "8vh",
          height: "70vh",
          transform: "translateX(-50%)",
        })}
        <div
          style={{
            position: "absolute",
            left: "clamp(18px,4vw,64px)",
            right: "clamp(18px,4vw,64px)",
            bottom: "max(11vh,100px)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
          }}
        >
          <h1 style={{ ...heading, fontSize: "clamp(56px,9vw,140px)", lineHeight: 0.95 }}>
            <Split h={{ lead: c.title3d[0].t, accent: c.title3d[1].t }} />
          </h1>
          <div style={{ ...column, gap: 12, width: "min(272px,100%)" }}>
            <span style={{ fontFamily: "var(--fs-serif)", fontSize: 22, color: "var(--fs-ink)" }}>
              {c.hero.line.lead}
              <em style={{ color: "var(--fs-accent)" }}>{c.hero.line.accent}</em>
            </span>
            {c.hero.facts.map((fact) => (
              <span key={fact} style={label}>
                {fact}
              </span>
            ))}
            <span style={label}>{c.promo.heroLabel}</span>
            <a href={c.header.cta.href} {...EXTERNAL} style={link}>
              {c.header.cta.label}
            </a>
          </div>
        </div>
      </header>

      {[c.blockAssortment, c.blockPersonal].map((b, i) => (
        <section key={b.label} style={section}>
          {i === 0 ? img(c.assets.s02End, { width: "100%", marginBottom: "8vh" }) : null}
          <div style={column}>
            <span style={label}>{b.label}</span>
            <h2 style={heading}>
              <Split h={b.heading} />
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, maxWidth: "36ch" }}>{b.body}</p>
            <a href={b.link.href} {...EXTERNAL} style={link}>
              {b.link.label} →
            </a>
          </div>
        </section>
      ))}

      <section style={section}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 32,
          }}
        >
          {c.assets.s03Frames.map((ref, i) => (
            <a
              key={ref.assetId}
              href={c.exhibition.frames[i].href}
              {...EXTERNAL}
              style={{ display: "flex", flexDirection: "column", gap: 10, textDecoration: "none" }}
            >
              {img(ref, { width: "100%", aspectRatio: "4 / 5", objectFit: "cover" })}
              <span style={{ ...label, color: "#4A443E" }}>{c.exhibition.frames[i].caption}</span>
            </a>
          ))}
        </div>
      </section>

      <section style={{ ...section, display: "flex", flexWrap: "wrap", gap: "8vh 6vw" }}>
        {img(c.assets.s04Bouquet, { width: "min(520px,100%)", height: "auto" })}
        <div style={{ ...column, gap: 48 }}>
          <div style={column}>
            <span style={{ ...label, color: "#4A443E" }}>{c.signature.label}</span>
            <h2 style={heading}>
              <Split h={c.signature.heading} />
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>{c.signature.body}</p>
            <a href={c.signature.link.href} {...EXTERNAL} style={link}>
              {c.signature.link.label} →
            </a>
          </div>
          <div style={column}>
            <span style={label}>{c.delivery.label}</span>
            <h2 style={heading}>
              <Split h={c.delivery.heading} />
            </h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{c.delivery.body}</p>
            {c.delivery.rows.map(([k, v]) => (
              <span key={k} style={{ fontSize: 14 }}>
                {k} — {v}
              </span>
            ))}
            <a href={c.delivery.link.href} {...EXTERNAL} style={link}>
              {c.delivery.link.label} →
            </a>
          </div>
          <div style={column}>
            <span style={label}>{c.care.label}</span>
            <ol style={{ margin: 0, paddingLeft: 24, fontFamily: "var(--fs-serif)", fontSize: 24 }}>
              {c.care.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <a href={c.care.link.href} {...EXTERNAL} style={link}>
              {c.care.link.label} →
            </a>
          </div>
        </div>
      </section>

      <footer
        style={{
          ...section,
          textAlign: "center",
          display: "grid",
          gap: 28,
          justifyItems: "center",
        }}
      >
        <span style={label}>{c.final.label}</span>
        <h2 style={{ ...heading, fontSize: "clamp(48px,7vw,104px)" }}>
          {c.final.heading.lead}
          <em>{c.final.heading.accent}</em>
        </h2>
        <a
          href={c.final.cta.href}
          {...EXTERNAL}
          style={{
            ...label,
            fontSize: 12,
            color: "#FBF8F2",
            background: "var(--fs-ink)",
            padding: "18px 30px",
            textDecoration: "none",
          }}
        >
          {c.final.cta.label}
        </a>
        <span style={label}>{c.promo.finalBadge}</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: "24px 40px",
            maxWidth: 760,
            width: "100%",
            textAlign: "left",
          }}
        >
          {c.final.contacts.map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ ...label, color: "#4A443E" }}>{item.label}</span>
              <span style={{ fontSize: 16, lineHeight: 1.45, color: "var(--fs-ink)" }}>
                {item.text}
                {item.links?.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 ? " / " : null}
                    <a
                      href={l.href}
                      {...(l.external ? EXTERNAL : {})}
                      style={{ color: "var(--fs-ink)" }}
                    >
                      {l.label}
                    </a>
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
