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

  function track(tipo: string, link?: string) {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, link, referrer: document.referrer || null }),
    }).catch(() => {});
  }

  function accept() {
    localStorage.setItem("linkbio_consent", "1");
    setConsented(true);
    track("visita");
  }

  function handleClick(label: string, url: string) {
    if (consented) track("clique", label);
    window.open(url, "_blank");
  }

  return (
    <main className="page">
      <div className="avatar">{siteConfig.initials}</div>
      <h1>{siteConfig.name}</h1>
      <p className="bio">{siteConfig.bio}</p>
      <div className="links">
        {siteConfig.links.map((l) => (
          <button key={l.label} className="linkBtn" onClick={() => handleClick(l.label, l.url)}>
            {l.label}
          </button>
        ))}
      </div>
      {!consented && (
        <div className="consent">
          Esta página coleta dados de navegação (tipo de dispositivo, aproximação de
          localização, origem do acesso) para fins estatísticos.
          <br />
          <button onClick={accept}>Entendi</button>
        </div>
      )}
    </main>
  );
}
