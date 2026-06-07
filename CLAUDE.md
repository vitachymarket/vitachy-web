# vitachy-web

Web de marca estática de Vitachy (Astro + Tailwind v4 + Cloudflare Pages).

Documento maestro de implementación: docs/CLAUDE_CODE_VITACHY_WEB.md
— léelo COMPLETO antes de cualquier tarea. Si contradice a los otros
documentos, prevalece él.

Contexto adicional:
- docs/INFRAESTRUCTURA_VITACHY_WEB.md (infra, DNS, decisiones técnicas)
- docs/VITACHY_PLATFORM_PARA_WEB.md (fuente de contenido, backend interno)

Reglas rápidas: 100% estático, sin secretos en el repo (es público),
sin referencias a 192.168.1.x, push a main = deploy a producción.