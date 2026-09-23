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
