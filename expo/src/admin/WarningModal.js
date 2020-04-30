import React from "react";

import "App.css";
import GenericConfirmationModal from "components/GenericConfirmationModal";

export default function WarningModal(props) {
  return (
    <GenericConfirmationModal
      id={props.modalId}
      modalTitle={"Delete All" + props.whatToDelete + "?"}
      bodyText={
        "Are you sure you want to delete all " +
        props.whatToDelete.toLowerCase() +
        "?"
      }
      completeAction={props.deleteAll}
    />
  );
}
