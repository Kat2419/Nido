"use client";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-coffee">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-rose-light px-4 py-2 text-sm font-medium text-terracotta-dark"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-terracotta-dark px-4 py-2 text-sm font-medium text-white"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
