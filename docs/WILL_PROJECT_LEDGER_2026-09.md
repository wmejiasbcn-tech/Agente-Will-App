# WILL — REGISTRO CONSOLIDADO DE TRABAJO 2026-09

## Propósito

Registro operativo del trabajo realizado y de las conclusiones consolidadas para Will App. Este documento pertenece al repositorio de Will, no al repositorio general del ecosistema WAIPL.

## 1. Arquitectura de interacción consolidada

Se estableció que el carácter no directivo de Will **no significa pasividad**. Will puede conducir activamente el proceso de comprensión y reflexión, de forma análoga a una facilitación profesional que ayuda a la persona a construir su propio criterio.

Arquitectura interna:

`COMPRENDER → CONTEXTUALIZAR → INDIVIDUALIZAR → PERSONALIZAR → CONDUCIR EL PROCESO REFLEXIVO → CONSTRUIR LA PROPIA VALORACIÓN → DECISIÓN → PERSONA`

No es una ruta visible ni obligatoria.

Regla: contextualizar sitúa; individualizar reconoce la singularidad; personalizar adapta la información; conducir facilita el proceso; decidir sigue perteneciendo a la persona.

## 2. RRRR + RRDD

Se corrigió el uso de RRDD como etiqueta paraguas.

La fórmula canónica queda establecida como:

`RRRR + RRDD = REDUCCIÓN DE RIESGOS + REDUCCIÓN DE DAÑOS`

La interfaz y el conocimiento de Will deben mostrar ambas dimensiones. RRRR y RRDD son complementarias, no una secuencia obligatoria.

Se detectó como fallo que Explore Topics mostraba una clasificación obligatoria y utilizaba RRDD como paraguas. Se reparó incorporando la fórmula, las dos dimensiones y las ramas de RRDD sexual y RRDD sustancias.

## 3. Contextos que no deben mezclarse automáticamente

Se consolidó la separación entre salud sexual, placer sexual, consumo no problemático, Chemsex, SLAM y prevención.

Fallos conceptuales prohibidos:

- sexo = prevención;
- sexo = Chemsex;
- consumo = problema;
- Chemsex = SLAM;
- SLAM = Chemsex;
- placer = prevención.

## 4. Salud sexual y prevención incorporadas

Se incorporó DoxyPEP al conocimiento explícito de Will y se diferenció conceptualmente de PrEP y PEP frente al VIH.

Se incorporó además una regla contextual para anticoncepción de emergencia:

- rotura del preservativo → Prevención;
- relación sexual sin preservativo → RRRR + RRDD Sexual.

La clasificación depende de la situación expresada, no del nombre aislado de la herramienta.

## 5. Transferencia de decisión

Se estableció que ante «¿qué harías tú?», «si fueras yo», «tú qué elegirías» o equivalentes, Will no debe responder con una decisión prestada.

Tampoco debe entrar en un bucle de negativa seca. Debe mantener la colaboración y conducir la reflexión: opciones, variables, incertidumbres, criterios y necesidades de información.

## 6. Implementación P0

La arquitectura constitucional de conducción no directiva se incorporó al runtime mediante el cambio aplicado en `api/app.ts` y desplegado en Vercel.

Referencia de implementación: commit `4f326377dbe4d30fd246cfb83284db13c79e907f`.

La verificación posterior confirmó la presencia del principio de conducción proceso/decisión, transferencia de decisión, RRRR + RRDD, diferenciación de dominios, límites no operacionales y epistemología.

Estado: implementación P0 cerrada; comportamiento conversacional real pendiente de batería funcional completa.

## 7. Seguridad y robustez

Se identificaron cuatro alertas CodeQL: dos de system prompt injection, missing rate limiting y permisos ausentes en workflow.

Se aplicaron correcciones para:

- eliminar datos derivados de la petición del system prompt;
- añadir rate limiting;
- añadir permisos explícitos de solo lectura al CI;
- actualizar dependencias/overrides de seguridad;
- eliminar workflow temporal de hotfix.

Commit principal de la corrección de flujo request → system prompt/rate limiting: `7ad5e943830dc6b13f7d10fbdd01df3ab4903e45`.

Posteriormente se priorizó voz y se hizo local-first el endpoint de síntesis.

## 8. Voz

La implementación actual utiliza ElevenLabs. Se detectó que la prueba original con `no_tts_key` no reproducía el fallo de forma estable cuando existía la clave de servidor publicada.

Se estableció como siguiente corrección experimental invertir el orden del cliente para preferir el endpoint local antes del publicado, sin rediseñar la arquitectura de voz.

Commit: `96ff00bae49f8beae799c153ae865557e1bbb4bb`.

La estabilidad funcional en dispositivo móvil real sigue pendiente de verificación.

## 9. Recursos por ciudad/lugar

Se detectó un fallo importante: las búsquedas podían devolver pocos resultados, hospitales dominantes o servicios irrelevantes —por ejemplo, podología— simplemente por proximidad.

Se estableció un estándar de búsqueda para Will:

1. centros comunitarios / ONG especializadas;
2. centros sociosanitarios especializados;
3. centros sanitarios especializados;
4. centros hospitalarios.

Dentro de estas categorías, la relevancia temática y especificidad deben preceder a la proximidad.

El buscador debe funcionar para ciudades, regiones, países y lugares de cualquier parte del mundo sin depender de un país concreto.

No debe afirmarse que se han encontrado «todos» los recursos cuando las fuentes abiertas no permiten garantizar exhaustividad. Tampoco debe interpretarse una búsqueda vacía como inexistencia de recursos.

Se aplicaron además medidas de resiliencia a geocodificación y consultas externas, pero la estandarización completa del ranking debe verificarse sobre el estado actual de `main` antes de considerarse cerrada.

## 10. Interfaz móvil

Observaciones y reparaciones registradas:

- navegación superior móvil: se añadió indicación visual para descubrir opciones desplazadas horizontalmente;
- control de accesibilidad A/A+/A++/A+++: se añadió escala tipográfica proporcional visible;
- Explore Topics: corrección de la presentación de RRRR + RRDD;
- recursos: copy corregido para no convertir un fallo técnico en afirmación de ausencia.

PR móvil: `b3cb28e`.

## 11. Fallos y aprendizaje metodológico

Principio operativo consolidado: no basta con producir una explicación correcta en conversación. Una conclusión que debe formar parte de Will debe pasar a su repositorio y, cuando corresponda, a su corpus/runtime, y después ser verificada.

También se consolidó que:

- una implementación «parecida» no satisface una especificación concreta;
- la creatividad del agente está limitada por la intención especificada;
- las pruebas deben verificar comportamiento real y no solo presencia de código;
- un despliegue verde no equivale automáticamente a comportamiento funcional verificado;
- un resultado de búsqueda geográfica no puede confundirse con un recurso relevante para Will;
- los problemas detectados deben quedar registrados junto con reparación y estado de verificación.

## 12. Estado de cierre

Este registro debe actualizarse cuando una conclusión de trabajo pase a ser canónica, cuando se produzca una reparación significativa o cuando una prueba modifique el estado de una incidencia.

La fuente de verdad de implementación es `main` del repositorio de Will App. Los documentos históricos sirven para trazabilidad y no deben utilizarse para afirmar que algo sigue vigente sin contrastarlo con el estado actual del código.
