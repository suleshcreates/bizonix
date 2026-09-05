/**
 * One connector: a 1px dotted line from the core edge toward a module's
 * settled position. Endpoints are computed by the shared geometry helper so
 * the orbit loop can move the same line seamlessly.
 */
export function ModuleConnector({
  index,
  endpoints,
}: {
  index: number;
  endpoints: { x1: number; y1: number; x2: number; y2: number };
}) {
  if (Math.hypot(endpoints.x2 - endpoints.x1, endpoints.y2 - endpoints.y1) < 24) {
    return null;
  }
  return (
    <line
      data-ms-line={index}
      x1={endpoints.x1}
      y1={endpoints.y1}
      x2={endpoints.x2}
      y2={endpoints.y2}
      strokeWidth={1}
      strokeDasharray="2 6"
      strokeLinecap="round"
    />
  );
}
