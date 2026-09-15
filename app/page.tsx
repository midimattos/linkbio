"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/site.config";

export default function Home() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const c = localStorage.getItem("linkbio_consent");
    if (c === "1") {
      setConsented(true);
      track("visita");
    }
  }, []);

  function track(tipo: string, link?: string, preferBeacon = false) {
    const payload = { tipo, link, referrer: document.referrer || null };
    const body = JSON.stringify(payload);

    if (preferBeacon && typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/track", blob)) return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: preferBeacon,
    }).catch(() => {});
  }

  function accept() {
    localStorage.setItem("linkbio_consent", "1");
    setConsented(true);
    track("visita");
  }

  function handleClick(url: string) {
    if (consented) track("clique", url, true);
  }

  return (
    <main className="page">
      <div className="avatar">{siteConfig.initials}</div>
      <h1>{siteConfig.name}</h1>
      <p className="bio">{siteConfig.bio}</p>
      <div className="links">
        {siteConfig.links.map((l) => (
          <a
            key={l.label}
            className="linkBtn"
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(l.url)}
          >
            {l.label}
          </a>
        ))}
      </div>
      {!consented && (
        <div className="consent">
          <p>
            Para registrar estatísticas de visita e clique (como data, hora, localização, IP, dispositivo e navegador),
            aceite a coleta de dados.
          </p>
          <button onClick={accept}>Aceitar coleta</button>
        </div>
      )}
    </main>
  );
}
