# Project Memory

**Última Actualización:** 20 Abril 2026 (22:45)

## Checkpoint Actual
- Se ha configurado exitosamente la migración a la nube utilizando Supabase para base de datos y autenticación (Login/Registro).
- Interfaz gráfica actualizada con notificaciones toast y modales.
- Pantalla del *Registrador de Pagos* implementada con auto-cálculo de transferencia y conexión con `db.saveRecord`.

## Process Registry
- [x] Migración a React/Vite.
- [x] Integración de Supabase.
- [x] Implementación y protocolo de reglas de memoria estricto añadido.
- [x] Sincronización y respaldo en GitHub de las nuevas reglas.
- [x] Desarrollo de UI "Registrador de Pagos" (AddRecord) y lógica de retenciones automática.
- [x] Corrección de integración con Supabase para manejar el casing de columnas (`propid`).
- [x] Implementación de componente `PropertyHistoryModal` para visualizar el historial, estadísticas y permitir el borrado de registros con actualización en tiempo real del gráfico de Línia de la propiedad.
- [x] Re-Arquitectura Responsive Desktop: Diseño Multi-Columna Grid (`main-layout`) - REPLACED por insatisfacción del usuario.
- [x] Rediseño de Layout: Dashboard con Barra Lateral (Sidebar) y visualización de pantalla única.
- [x] Optimización de Pantalla de Inicio: Distribución en dos paneles (KPIs/Gráfico a la izquierda, lista de propiedades a la derecha en Desktop).
- [x] Limpieza UI: Eliminación estética de barras de scroll en toda la aplicación para un acabado más premium.
- [x] Corrección de Bug: Restauración de imports de `AddRecord` y `Projections` en `App.jsx`.
- [x] Refinamiento de Modales y Notificaciones: Centrado absoluto de cuadros de diálogo, notificaciones (toasts) más grandes y centradas, e incorporación de spinners de carga para feedback visual fluido.
- [x] Optimización de Flujo: Las notificaciones de éxito ahora se disparan después de cerrar los cuadros.
- [x] Fix de Emergencia: Eliminación de token duplicado `);` en `PropertyModal.jsx`.
- [x] Estabilización de Modales: Implementación del patrón de "Capa Persistente" en `PropertyModal`.
- [x] Rediseño de Perfil (Mi Cuenta): Nuevo header con avatar de iniciales, badge de sincronización, formulario de edición de datos (Nombre/Apellido) e email bloqueado. Sincronizado con Supabase Auth Metadata.
- [x] Servidor de desarrollo iniciado en http://localhost:5173/.
- [x] Activación de sección "Proyecciones": Implementación de Calculadora de Aumento de Alquileres.
- [x] Integración de API ArgenStats: Reemplazo de ArgentinaDatos por ArgenStats para obtener la serie histórica de índices IPC en tiempo real.
- [x] Fórmula Oficial de Ajuste: Implementación de la lógica `Valor Inicial * (Indice_Final / Indice_Inicial)` para total precisión legal.
- [x] Seguridad de Credenciales: Configuración de `VITE_ARGENSTATS_KEY` en archivo `.env` para manejo seguro de la clave de API.
- [x] Visualización de Datos: Gráfico interactivo (Chart.js) de tendencia de inflación y cálculo compuesto automático.
- [x] Optimización de UX/Encuadre: Centrado global de `.main-content` y limitación de anchos máximos para visualización premium en Desktop.
- [x] UI Responsive: Re-arquitectura de "Proyecciones" a diseño de grilla (2 columnas) en pantallas grandes y formularios (Registrador) centrados y contenidos.
- [x] Rediseño de Calculadora: Implementación de selección de fecha de inicio (mes/año), frecuencia de ajuste y tipo de índice mediante dropdowns para un flujo más intuitivo.
- [x] Proyecciones Avanzadas: Implementación de tarjetas de resumen "HASTA/DESDE" y tabla de periodos múltiples con filas expandibles para desglose mensual detallado.
- [x] Reset de Estados: Limpieza de valores iniciales (renta vacía, fecha actual) para un inicio de uso desde cero sin datos de ejemplo.
- [x] Lógica de Indexación Compuesta: Cálculo directo por meses calendario exactos (se eliminó el desfase para mayor simplicidad).
- [x] Estabilidad de Fechas: Implementación de T12:00:00 en el manejo de fechas para evitar desfases por zona horaria.
- [x] Visualización de Datos: Gráfico de tendencia IPC restaurado y tabla con columna de Monto de Aumento en pesos ($).
- [x] Sistema de Estimación Inteligente: Alerta visual y lógica de repetición de índices cuando no hay datos oficiales (meses futuros o no publicados).
