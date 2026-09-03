"use client";

import { useState } from "react";
import { deleteEventAndRedirect } from "./actions";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="text-sm text-coffee-light underline hover:text-red-600"
      >
        Eliminar
      </button>
      {confirmDelete && (
        <ConfirmDialog
          message="¿Eliminar este evento y todo su contenido? Esta acción no se puede deshacer."
          onConfirm={() => {
            setConfirmDelete(false);
            deleteEventAndRedirect(eventId);
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}
