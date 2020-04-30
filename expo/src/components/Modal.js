import React from "react";

export default function Modal(props) {
  return (
    <div className="modal fade" id={props.id}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">{props.children}</div>
      </div>
    </div>
  );
}
