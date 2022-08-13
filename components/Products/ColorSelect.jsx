import React from "react";

export default function ColorSelect(props) {
  // console.log(props.btnColor);
  return (
    <button
      onClick={() => {
        props.selectOption({ color: props.colorName });
      }}
      style={{ backgroundColor: props.colorBtn }}
      className={`${props.styles} h-8 w-8 rounded-full ring-1`}
    ></button>
  );
}
