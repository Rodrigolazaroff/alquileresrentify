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
