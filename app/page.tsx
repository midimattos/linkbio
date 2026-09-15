"use client";

import { useEffect } from "react";
import { siteConfig } from "@/site.config";

export default function Home() {
  function track(tipo: string, link?: string, preferBeacon = false) {
    const payload = {
      tipo,
      link: link ?? null,
      referrer: document.referrer || null,
    };

    const body = JSON.stringify(payload);

    if (
      preferBeacon &&
      typeof navigator.sendBeacon === "function"
    ) {
      const blob = new Blob([body], {
        type: "application/json",
      });

      const enviado = navigator.sendBeacon("/api/track", blob);

      if (enviado) return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    }).catch((error) => {
      console.error("Erro ao registrar estatística:", error);
    });
  }

  useEffect(() => {
    track("visita");
  }, []);

  function handleClick(url: string) {
    track("clique", url, true);
  }

  return (
    <main className="page">
      <div className="avatar">{siteConfig.initials}</div>

      <h1>{siteConfig.name}</h1>

      <p className="bio">{siteConfig.bio}</p>

      <div className="links">
        {siteConfig.links.map((link) => (
          <a
            key={link.label}
            className="linkBtn"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleClick(link.url)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </main>
  );
}
