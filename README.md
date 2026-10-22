# JARVIS Steve Energiekarte (V6.4)

Individuelle Home-Assistant-Energiekarte mit Steves Hausansicht, animierten PV-/Netzleitungen, automatischer Raumzuordnung und Tarif-Eingabe. Die freigegebene V6.3-Optik bleibt erhalten.

> **Hinweis:** Das Hintergrundbild zeigt einen privaten Hausgrundriss mit Raumnamen. Dieses Repository ist bewusst öffentlich.

## Installation über HACS

1. In HACS unter **Benutzerdefinierte Repositories** `https://github.com/Franz1302/jarvis-steve-energy-card` eintragen und Typ **Dashboard** wählen.
2. Das Repository installieren. Die Dateien `dist/steve-energy-card.js` und `dist/Steve_Energie_Background.png` müssen im Repository liegen. HACS installiert sie gemeinsam.
3. Im Dashboard eine **Panel-Ansicht** anlegen und die YAML aus [KARTE_HACS.yaml](KARTE_HACS.yaml) als Kartenkonfiguration einfügen. Falls nötig die Dashboard-Ressource `/hacsfiles/jarvis-steve-energy-card/steve-energy-card.js` als JavaScript-Modul hinzufügen.
4. Browser neu laden.

## Stromtarife und Cashflow

Die Stromkosten-/Cashflow-Anzeige der Karte anklicken und die Tarife für **Strombezug** und **PV-Einspeisung** in **ct/kWh** eintragen. Für geräteübergreifende Speicherung zwei Home-Assistant-Zahlenhelfer anlegen:

| Entitäts-ID | Einheit | Bereich |
| --- | --- | --- |
| `input_number.steve_bezugstarif_ct` | ct/kWh | 0–200, Schritt 0.01 |
| `input_number.steve_einspeisetarif_ct` | ct/kWh | 0–200, Schritt 0.01 |

Ohne Helfer werden die Eingaben nur im jeweiligen Browser gespeichert.

**Monatlicher Cashflow:** Einspeisung (kWh) × Einspeisetarif / 100 − Netzbezug (kWh) × Bezugstarif / 100. Fixe Gebühren, Steuern und Abgaben sind nicht automatisch enthalten. Die Monatszähler und Vorzeichen des Netzsensors müssen vor produktiver Kostennutzung überprüft werden.

## Energielinien ohne Netzleistungs-Sensor

Die Linien können auch **ohne aktuellen Netzleistungs-Sensor** erscheinen: Wenn Home Assistant einen eingeschalteten Verbraucher in einem zugeordneten Raum erkennt, wird bei verfügbarer PV-Leistung oberhalb der Schaltschwelle die blaue Linie angezeigt; ansonsten die rote Linie als **angenommene Netzversorgung**. Die angenommene rote Linie bedeutet **keine gemessene Netzleistung** und verändert weder Energiezähler noch Cashflow. Sobald ein bestätigter OBI-Live-Watt-Sensor vorliegt, wird dieser separat in der Karten-YAML für die echte Netzflussrichtung hinterlegt.

Die Karte berücksichtigt sowohl Watt-Sensoren als auch den Ein/Aus-Zustand zugeordneter `light.`- und `switch.`-Entitäten. Voraussetzung ist die passende Raumzuordnung im Home Assistant.

## Automatische Raumzuordnung

Verbraucher in Home Assistant einem Bereich zuordnen. Passende Leistungssensoren in W/kW werden von der Karte nach Bereich erkannt. Ohne Leistungssensor kann bei Licht/Schalter nur der Aktivzustand berücksichtigt werden, kein erfundener Wattwert. `area_map`, `exclude_entities` und manuelle `rooms`-Einträge erlauben Korrekturen.

**Status:** HACS-Installation und Live-Messwerte bei Steve sind noch nicht am Zielsystem geprüft.
