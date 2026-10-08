# Simulador TAC Cabeza — Quiz de casos + protocolo

## Qué es
SPA (index.html + styles.css + app.js + casesData.js) con 13 casos reales distintos al PDF.
Cada caso pide: patología (texto libre) + protocolo (select) + 10 parámetros técnicos + 4 posicionamiento + 5 contraste.
Valida contra el PDF con ✓ verde / ✗ roja + `Esperado vs Colocado`. Tolerante a tildes, mayúsculas, unidades (120 vs 120kV, 0.5s vs 0.5 seg) y orden de ventana (1500/4500 = 4500/1500).

## Casos (Wikimedia Commons CC BY-SA, uso educativo con crédito + link Radiopaedia para profundizar)
- EDH, SDH, AVE isquémico MCA, HSA, HIC ganglionar, Hidrocefalia, Meningioma, Sinusitis, Macroadenoma, Colesteatoma, Fractura ósea, Aneurisma CTA, Celulitis orbitaria
- Imágenes vía `Special:FilePath` (estable, sin descargar). Fuente y link Radiopaedia en cada caso.

## Protocolos (del PDF)
Cerebro sin/con, Cerebro óseo (0.9/0.45, 1500/500), Angio (0.9/0.45 STD 0.5s FOV350 350/40 300mAs, 5cc/s 70cc arterial), Silla (1/0.5 STD FOV150 400/50 120-140 350, 150mm piso→clinoides, 2-3cc/s 80cc 90s), CPN (0.9/0.45 AR 0.5s FOV150 1700/500 150mAs, 150mm frontal→paladar), Facial (doble ventana 1500/500-300/50, 200mm frontal→mandíbula), Oído (0.9/0.45 AR 0.5s FOV150 4500/1500-350/50 512 120 300, mentón/150mm/supino/peñasco, 3/50/40).

Nota Radiopaedia: bloquea scraping automático (bot-challenge), por eso se usan imágenes abiertas Commons + enlaces de estudio a Radiopaedia, no hotlink directo.

## Ayuda y clínica
- Botón verde **AYUDA** junto al caso: revela el nombre de la patología (queda marcado como "Ayuda usada").
- Recuadro naranjo **Antecedentes del paciente**: edad + síntomas típicos para razonar el diagnóstico (redactados según la patología de cada caso).

## Ejecutar local
Opción 1 — doble clic en `quiz-tc-cabeza/index.html`
Opción 2 — Live Server VSCode / `npx serve` / `python -m http.server 8000` dentro de `quiz-tc-cabeza/` y abrir http://localhost:8000
Requiere internet para las imágenes.
