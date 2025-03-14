"use client";

import React from "react";

interface RedLineProps {
  position: "top" | "bottom";
}

const RedLine: React.FC<RedLineProps> = ({ position }) => {
  const svgContent =
    position === "bottom"
      ? '<svg id="26:10" width="345" height="14" viewBox="0 0 345 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="red-line bottom" style="width: 344px; height: 2px; background: #D96556"> <path d="M-1.17783e-07 7.54248L10.0257 13.2712L9.97405 1.72427L-1.17783e-07 7.54248ZM344.496 6.00008L334.47 0.271406L334.522 11.8183L344.496 6.00008ZM167 6.79483L167.004 7.79482L167 6.79483ZM9.00439 8.50218L167.004 7.79482L166.995 5.79484L8.99543 6.5022L9.00439 8.50218ZM167.004 7.79482L335.5 7.04036L335.491 5.04038L166.995 5.79484L167.004 7.79482Z" fill="#D96556"></path> </svg>'
      : '<svg id="26:13" width="342" height="14" viewBox="0 0 342 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="red-line top" style="width: 344px; height: 2px; background: #D96556"> <path d="M4.47753e-07 7.53147L10.0258 13.2601L9.97405 1.71325L4.47753e-07 7.53147ZM342.003 6.00013L331.977 0.271454L332.029 11.8183L342.003 6.00013ZM164.507 6.79478L164.502 5.79479L164.507 6.79478ZM9.00439 8.49116L164.511 7.79477L164.502 5.79479L8.99543 6.49118L9.00439 8.49116ZM164.511 7.79477L333.007 7.04041L332.998 5.04043L164.502 5.79479L164.511 7.79477Z" fill="#D96556"></path> </svg>';

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
};

export default RedLine;
