import React, { useState } from "react";

export default function Checkbox(props) {
  const [checked, setChecked] = useState(props.check);

  let id = `defaultChecked${props.id}${props.project_id}`;
  let label = `defaultChecked${props.id}${props.project_id}label`;
  return (
    <div
      className="custom-control custom-checkbox"
      onChange={e => {
        setChecked(!checked);
        props.handleChange(checked, id, e);
      }}
    >
      <input
        type="checkbox"
        className="custom-control-input"
        id={id}
        value={checked}
      />
      <label className="custom-control-label" htmlFor={id} id={label}>
        {props.value}
      </label>
    </div>
  );
}
