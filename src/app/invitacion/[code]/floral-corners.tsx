const IMAGE_URL = "url(/petals/borde-floral.png)";

// La imagen fuente trae las rosas concentradas en dos esquinas (arriba a la
// derecha y abajo a la izquierda). Recortamos esas mismas zonas con
// background-position para las 4 esquinas de la pantalla.
const CORNERS = [
  { pos: "top-0 left-0", bgPos: "0% 100%" },
  { pos: "top-0 right-0", bgPos: "100% 0%" },
  { pos: "bottom-0 left-0", bgPos: "0% 100%" },
  { pos: "bottom-0 right-0", bgPos: "100% 0%" },
] as const;

export function FloralCorners() {
  return (
    <>
      {CORNERS.map((corner) => (
        <div
          key={corner.pos}
          aria-hidden="true"
          className={`pointer-events-none fixed h-28 w-28 opacity-90 sm:h-40 sm:w-40 lg:h-48 lg:w-48 ${corner.pos}`}
          style={{
            backgroundImage: IMAGE_URL,
            backgroundSize: "260% 260%",
            backgroundPosition: corner.bgPos,
            backgroundRepeat: "no-repeat",
          }}
        />
      ))}
    </>
  );
}
