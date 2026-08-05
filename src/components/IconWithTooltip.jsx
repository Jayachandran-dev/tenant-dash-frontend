import React from "react";
import Tooltip from "@mui/material/Tooltip";

/**
 * Reusable IconWithTooltip component
 * @param {React.ElementType} icon - The icon component to render
 * @param {string} tooltip - The tooltip text
 * @param {object} props - Additional props (like style, sx, etc.)
 */
const IconWithTooltip = ({ icon: Icon, tooltip, ...props }) => {
  return (
    <Tooltip title={tooltip} arrow>
      <span>
        <Icon {...props} />
      </span>
    </Tooltip>
  );
};

export default IconWithTooltip;
