export type TourRect = { x: number; y: number; width: number; height: number };

const nodes = new Map<string, any>();
const callbacks = new Map<string, (node: any) => void>();

/**
 * Ref callback estable para marcar un componente como objetivo de la guia:
 * `<View ref={tourRef("menu")} collapsable={false} />`. No cambia el layout.
 */
export function tourRef(id: string) {
  let cb = callbacks.get(id);
  if (!cb) {
    cb = (node: any) => {
      if (node) nodes.set(id, node);
      else nodes.delete(id);
    };
    callbacks.set(id, cb);
  }
  return cb;
}

/** Mide el objetivo en coordenadas de ventana (mismas que un View absoluto a pantalla completa). */
export function measureTarget(id: string): Promise<TourRect | null> {
  const node = nodes.get(id);
  if (!node || typeof node.measureInWindow !== "function") return Promise.resolve(null);
  return new Promise((resolve) => {
    node.measureInWindow((x: number, y: number, width: number, height: number) => {
      resolve(width > 0 && height > 0 ? { x, y, width, height } : null);
    });
  });
}
