export type UAInfo = {
  deviceType: string;
  os: string;
  browser: string;
  brand: string;
};

export function parseUA(ua: string): UAInfo {
  let deviceType = "Computador";
  if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";
  else if (/Mobi|Android/i.test(ua)) deviceType = "Celular";

  let os = "Desconhecido";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Desconhecido";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/Chrome\//i.test(ua) && !/Edg\//.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && !/Chrome/.test(ua)) browser = "Safari";

  let brand = "Desconhecida";
  if (os === "iOS" || os === "macOS") brand = "Apple";
  else if (os === "Android") {
    const m = ua.match(/Android\s[\d.]+;\s*([^)]+)\)/i);
    if (m) {
      const model = m[1].split(";").pop()?.trim() || "";
      if (/^SM-|Samsung/i.test(model)) brand = "Samsung";
      else if (/Redmi|Mi\s|POCO|Xiaomi/i.test(model)) brand = "Xiaomi";
      else if (/moto/i.test(model)) brand = "Motorola";
      else if (/Pixel/i.test(model)) brand = "Google";
      else if (/HUAWEI|Honor/i.test(model)) brand = "Huawei";
      else if (/ASUS/i.test(model)) brand = "Asus";
      else if (/OPPO|CPH/i.test(model)) brand = "Oppo";
      else if (/vivo/i.test(model)) brand = "Vivo";
      else if (/Infinix/i.test(model)) brand = "Infinix";
      else if (/realme|RMX/i.test(model)) brand = "Realme";
      else if (/LG-/i.test(model)) brand = "LG";
      else brand = model || "Desconhecida";
    }
  }
  return { deviceType, os, browser, brand };
}
