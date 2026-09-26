# INC-2026-09-26 — Priorización general de recursos

## Estado

ABIERTA — revisión técnica y refuerzo de protocolo.

## Fecha

26/09/2026

## Ámbito

Búsqueda general de recursos de Will. Incidencia transversal, independiente de la ciudad, país, dispositivo o tester.

## Origen de la detección

Durante una prueba exploratoria en portátil se realizó una búsqueda de recursos para **Caracas**. Los primeros resultados mostrados fueron hospitales y clínicas privadas; los recursos comunitarios/ONG aparecieron aproximadamente a partir de la cuarta o quinta posición.

**Caracas es únicamente el caso de detección. No se clasifica como incidencia específica de Caracas y no se atribuye a TEST-004 ni a ningún tester.**

## Comportamiento esperado

La búsqueda general debe aplicar, como criterio transversal de relevancia/presentación, la siguiente prioridad:

1. Centros comunitarios y organizaciones comunitarias pertinentes.
2. Centros sociosanitarios pertinentes.
3. Centros médicos especializados públicos pertinentes.
4. Centros hospitalarios pertinentes.
5. Centros o clínicas privadas pertinentes.

La prioridad no implica excluir categorías posteriores. Un recurso hospitalario o privado puede aparecer cuando sea pertinente; no debe desplazar por defecto a un recurso comunitario, sociosanitario o especializado público pertinente.

## Revisión técnica realizada

La implementación actual contiene una función de clasificación y ordenación por categorías. En `api/geo.ts` existe una función `rankSite()` que actualmente establece prioridad para recursos comunitarios, sociosanitarios, sanitarios y hospitalarios, y posteriormente ordena por proximidad. La interfaz `OtherResourcesView` también muestra explícitamente al usuario el orden comunitario → sociosanitario → sanitario especializado → hospitalario.

Sin embargo, se ha identificado una brecha técnica relevante:

- el backend calcula y conserva el atributo `privateCare`;
- la función actual de ranking no utiliza `privateCare` para separar explícitamente la atención privada de la sanitaria pública;
- por tanto, una clínica privada clasificada como recurso sanitario puede competir en el mismo nivel que un centro sanitario público y quedar delante por proximidad;
- los tests existentes comprueban principalmente presencia/filtrado de recursos y datos canónicos, pero no verifican de extremo a extremo que la respuesta de `/api/geo/lookup` entregue el ranking efectivo exigido por el protocolo.

Además, la mera existencia de la regla de ordenación en el código no garantiza que el conjunto recuperado contenga suficientes recursos comunitarios pertinentes. La clasificación/filtro de las fuentes comunitarias debe revisarse junto con el ranking.

## Conclusión técnica

La incidencia no debe resolverse como una excepción geográfica. El caso demuestra que el protocolo de priorización necesita una **garantía transversal de ranking efectivo**, incluyendo explícitamente la distinción público/privado y una prueba de ordenación sobre la salida real del endpoint.

No se considera suficiente que la interfaz declare visualmente el orden esperado: la prioridad debe estar garantizada en la recuperación/ordenación efectiva de los resultados.

## Corrección requerida

1. Mantener la jerarquía comunitario → sociosanitario → sanitario especializado público → hospitalario → privado.
2. Utilizar explícitamente `privateCare` en el ranking para impedir que una clínica privada compita en el mismo nivel que un centro sanitario público cuando ambos sean pertinentes.
3. Mantener hospitales y clínicas privadas disponibles cuando sean pertinentes; no eliminarlos por categoría.
4. Revisar la admisión/clasificación de recursos comunitarios para evitar que recursos comunitarios pertinentes queden descartados antes del ranking.
5. Añadir una prueba de regresión que compruebe el **orden efectivo de la respuesta de `/api/geo/lookup`**, no solamente la existencia de recursos en los datos canónicos.
6. La prueba debe utilizar más de una localización para demostrar que la regla es geográfica y funcionalmente transversal. Caracas puede ser uno de los casos de regresión, pero no debe convertirse en una regla específica de Caracas.
7. Verificar también que el comportamiento desplegado corresponde al código que contiene esta regla, registrando el commit/deployment probado.

## Criterio de aceptación

Ante una consulta geográfica con recursos pertinentes disponibles en varias categorías, el resultado debe respetar la prioridad general establecida y ordenar por proximidad únicamente **dentro de la misma prioridad**, salvo que una regla explícita y trazable de relevancia indique otra cosa.

## Trazabilidad

Origen → observación real → revisión de `OtherResourcesView` / `api/geo.ts` → diagnóstico → corrección → test de regresión → deployment verificado.

## No atribución

Esta incidencia es **GENERAL / TÉCNICA**. No pertenece al registro individual de TEST-004 ni a ningún otro tester.
