// Gera os caminhos SVG (projeção de Mercator) dos mapas do reel a partir do Natural Earth (world-atlas).
// saída: um arquivo JS com `const MAPAS = {...}` para colar no topo do beats.js
const fs = require("fs");
const topo = require("topojson-client");
const out = process.argv[2];
const R = Math.PI / 180;
const merc = ([lon, lat]) => [lon * R, Math.log(Math.tan(Math.PI / 4 + (lat * R) / 2))];

function mapa(file, box, size, keep, ptsLL) {
  const w = JSON.parse(fs.readFileSync(require.resolve("world-atlas/" + file)));
  const fc = topo.feature(w, w.objects.countries);
  const [x0, y1] = merc([box[0], box[1]]), [x1, y0] = merc([box[2], box[3]]);
  const k = Math.min(size[0] / (x1 - x0), size[1] / (y1 - y0));
  const P = (ll) => { const [x, y] = merc(ll); return [+((x - x0) * k).toFixed(1), +((y1 - y) * k).toFixed(1)]; };
  const paths = {};
  for (const f of fc.features) {
    const id = String(f.id || f.properties.name);
    if (keep && !keep.includes(id)) continue;
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    let d = "";
    for (const poly of polys) for (const ring of poly) {
      // descarta anéis inteiramente fora da caixa (ex.: territórios ultramarinos)
      if (!ring.some(([lo, la]) => lo >= box[0] - 15 && lo <= box[2] + 15 && la <= box[1] + 15 && la >= box[3] - 15)) continue;
      let last = null, seg = "";
      ring.forEach((ll, i) => { const p = P(ll); if (last && Math.abs(p[0] - last[0]) < 0.6 && Math.abs(p[1] - last[1]) < 0.6) return; seg += (seg ? "L" : "M") + p[0] + " " + p[1]; last = p; });
      d += seg + "Z";
    }
    if (d) paths[id] = d;
  }
  const pts = {}; for (const [n, ll] of Object.entries(ptsLL)) pts[n] = P(ll);
  return { w: +((x1 - x0) * k).toFixed(0), h: +((y1 - y0) * k).toFixed(0), paths, pts };
}

const SA = ["076", "858", "032", "600", "068", "604", "152", "170", "862", "218", "328", "740", "591", "188", "558"];
const sa = mapa("countries-50m.json", [-84, 14, -32, -57], [980, 1120], SA,
  { saoPaulo: [-46.63, -23.55], brasilia: [-47.88, -15.79], montevideo: [-56.16, -34.9], uyC: [-56.0, -32.8], brC: [-52.5, -11] });
const world = mapa("countries-110m.json", [-85, 55, 15, -40], [1000, 1150], null,
  { brC: [-51, -11], saoPaulo: [-46.63, -23.55], lisboa: [-9.14, 38.72], ptC: [-8.2, 39.6] });
fs.writeFileSync(out, "// mapas: Natural Earth via world-atlas 2.0.2 (domínio público), Mercator. Gerado por gerar-mapas.cjs\nconst MAPAS = " + JSON.stringify({ sa, world }) + ";\n");
console.log("sa", sa.w, sa.h, Object.keys(sa.paths).length, "world", world.w, world.h, Object.keys(world.paths).length, (fs.statSync(out).size / 1024).toFixed(0) + " KB", sa.pts, world.pts);
