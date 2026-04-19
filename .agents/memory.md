# Project Memory

**Última Actualización:** 16 Abril 2026

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
