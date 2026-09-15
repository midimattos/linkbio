import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { parseUA } from "@/lib/parseUA";

export async function POST(req: NextRequest) {
  const rawBody = await req.text().catch(() => "");
  let body: any = {};
  if (rawBody) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      const form = new URLSearchParams(rawBody);
      body = {
        tipo: form.get("tipo"),
        link: form.get("link"),
        referrer: form.get("referrer"),
      };
    }
  }

  const ua = req.headers.get("user-agent") || "";
  const info = parseUA(ua, {
    mobileHint: req.headers.get("sec-ch-ua-mobile"),
    platformHint: req.headers.get("sec-ch-ua-platform"),
  });
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  let cidade: string | null = null;
  let regiao: string | null = null;
  let pais: string | null = null;

  if (ip) {
    try {
      const r = await fetch(`https://ipapi.co/${ip}/json/`);
      if (r.ok) {
        const g = await r.json();
        cidade = g.city || null;
        regiao = g.region || null;
        pais = g.country_name || null;
      }
    } catch {
      // localização é best-effort; se falhar, seguimos sem ela
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("events").insert({
      tipo: body.tipo === "clique" ? "clique" : "visita",
      link: body.link || null,
      dispositivo: info.deviceType,
      so: info.os,
      navegador: info.browser,
      marca: info.brand,
      idioma: req.headers.get("accept-language")?.split(",")[0] || null,
      referrer: body.referrer || null,
      ip,
      cidade,
      regiao,
      pais,
    });
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
