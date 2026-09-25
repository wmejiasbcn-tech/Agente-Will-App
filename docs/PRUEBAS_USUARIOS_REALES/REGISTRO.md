# Registro operativo — Pruebas de usuarios reales

## Instrucción de uso

Este documento registra el estado y los metadatos operativos de cada prueba. Los resultados deben incorporarse únicamente después de que la prueba haya ocurrido.

## Ronda 1

| TEST-ID | Tanda | Perfil | Fecha | Versión / commit probado | Dispositivo | Navegador | Modo | Estado |
|---|---|---|---|---|---|---|---|---|
| TEST-001 | R1A | Sanitario — enfermería infecciosas/VIH | — | — | — | — | — | PLANIFICADO |
| TEST-002 | R1A | Sanitario — enfermería infecciosas/VIH | — | — | — | — | — | PLANIFICADO |
| TEST-003 | R1A | Comunitario / asociativo — Stop | — | — | — | — | — | PLANIFICADO |
| TEST-004 | R1A | Comunitario / asociativo — Stop | — | — | — | — | — | PLANIFICADO |
| TEST-005 | R1A | Usuario con experiencia Chemsex | — | — | — | — | — | PLANIFICADO |
| TEST-006 | R1B | Mujer — sexualidad / salud sexual / placer | — | — | — | — | — | PLANIFICADO |
| TEST-007 | R1B | Mujer — asociativa / comunitaria | — | — | — | — | — | PLANIFICADO |
| TEST-008 | R1B | Hombre — sin consumo de sustancias | — | — | — | — | — | PLANIFICADO |
| TEST-009 | R1B | Hombre — experiencia Slam | — | — | — | — | — | PLANIFICADO |
| TEST-010 | R1B | Hombre — sexualidad sin Slam ni Chemsex | — | — | — | — | — | PLANIFICADO |

## Hito operativo — envío de la Tanda 1 (R1A)

El 25/09/2026 se realizó el envío correspondiente a los cinco testers de la Tanda 1. La evidencia disponible acredita el registro de fecha de envío y hora de envío individual.

| TEST-ID | Fecha de envío | Hora de envío | Hecho acreditado |
|---|---|---|---|
| TEST-001 | 25/09/2026 | 18:44 | Envío realizado |
| TEST-002 | 25/09/2026 | 20:09 | Envío realizado |
| TEST-003 | 25/09/2026 | 20:14 | Envío realizado |
| TEST-004 | 25/09/2026 | 20:16 | Envío realizado |
| TEST-005 | 25/09/2026 | 18:55 | Envío realizado |

**Importante:** este hito no acredita por sí mismo apertura, recepción efectiva, inicio de la prueba ni finalización de la prueba. Los estados de los cinco tests permanecen en PLANIFICADO hasta disponer de evidencia adicional.

## Campos mínimos por prueba

- TEST-ID
- tanda
- perfil / perspectiva
- fecha y hora
- versión o commit de Agente Will App probado
- deployment utilizado
- dispositivo
- sistema operativo
- navegador
- modo de interacción (TEXTO, VOZ, MIXTO)
- recorrido espontáneo
- observaciones
- incidencias
- evidencia disponible
- hallazgos
- acciones derivadas
- estado de cierre

## Regla de trazabilidad

Cuando una prueba se realice con una versión concreta, se debe registrar el **commit o deployment real utilizado**. No debe sustituirse posteriormente por una versión diferente.

Cuando sea posible, una incidencia técnica debe poder relacionarse con:
TEST-ID → sesión/fecha → entorno → comportamiento observado → evidencia → issue/acción.
