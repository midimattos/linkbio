"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EventRow = {
  id: string;
  created_at: string;
  tipo: string;
  link: string | null;
  dispositivo: string | null;
  so: string | null;
  navegador: string | null;
  marca: string | null;
  idioma: string | null;
  ip: string | null;
  cidade: string | null;
  regiao: string | null;
  pais: string | null;
  referrer: string | null;
};

const COLS: (keyof EventRow)[] = [
  "created_at",
  "tipo",
  "link",
  "dispositivo",
  "marca",
  "so",
  "navegador",
  "idioma",
  "ip",
  "cidade",
  "regiao",
  "pais",
  "referrer",
];

export default function Dashboard() {
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [loadError, setLoadError] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/admin-events");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    if (data.ok) setEvents(data.events);
    else setLoadError(data.error || "Erro ao carregar dados.");
  }

  useEffect(() => {
    load();
  }, []);

  async function handleClear() {
    if (!confirm("Apagar todos os dados coletados? Essa ação não pode ser desfeita.")) return;
    await fetch("/api/admin-clear", { method: "POST" });
    load();
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin");
  }

  if (loadError) return <div className="page admin"><p className="error">{loadError}</p></div>;
  if (!events) return <div className="page admin"><p className="sub">Carregando...</p></div>;

  const visitas = events.filter((e) => e.tipo === "visita").length;
  const cliques = events.filter((e) => e.tipo === "clique").length;
  const paises = new Set(events.map((e) => e.pais).filter(Boolean)).size;

  return (
    <div className="page admin">
      <div className="topbar">
        <div>
          <h2>Painel de estatísticas</h2>
          <p className="sub">Visitas e cliques registrados na sua página de links.</p>
        </div>
        <button className="logoutBtn" onClick={handleLogout}>Sair</button>
      </div>

      <div className="stats">
        <div className="stat"><div className="n">{visitas}</div><div className="l">Visitas</div></div>
        <div className="stat"><div className="n">{cliques}</div><div className="l">Cliques</div></div>
        <div className="stat"><div className="n">{paises}</div><div className="l">Países distintos</div></div>
      </div>

      {events.length === 0 ? (
        <div className="empty">Ainda não há dados coletados.</div>
      ) : (
        <div className="tablewrap">
          <table>
            <thead>
              <tr>{COLS.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {events.map((row) => (
                <tr key={row.id}>
                  {COLS.map((c) => {
                    if (c === "created_at") {
                      const d = new Date(row.created_at);
                      return <td key={c}>{isNaN(d.getTime()) ? row.created_at : d.toLocaleString("pt-BR")}</td>;
                    }
                    return <td key={c}>{(row[c] as any) ?? "—"}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button className="clearBtn" onClick={handleClear}>Apagar todos os dados</button>
    </div>
  );
}
