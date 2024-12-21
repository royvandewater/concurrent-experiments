import { html } from "htm/preact";

export const CustomSlider = ({ min, max, value, onChange }) => {
  return html`
    <input
      type="range"
      min=${min}
      max=${max}
      value=${value}
      onInput=${(event) => onChange(event.target.value)}
    />
  `;
};
