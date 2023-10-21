import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import { Tooltip } from '@mui/material';

export default function MultipartProgressBar({
  label,
  backgroundColor = '#e5e5e5',
  visualParts = [
    {
      percentage: '0%',
      color: 'white',
      name: 'default',
    },
  ],
}) {
  const [widths, setWidths] = useState(visualParts.map(() => 0));

  useEffect(() => {
    requestAnimationFrame(() => {
      setWidths(visualParts.map(item => item.percentage));
    });
  }, [visualParts]);
  return (
    <>
      <div className="progressLabel">{label}</div>
      <div
        className="progressVisualFull"
        style={{
          backgroundColor,
        }}
      >
        {visualParts.length ? (
          visualParts.map((item, index) => {
            const width = widths[index];

            return (
              <Tooltip arrow title={`${item.count} ${item.name}`} key={index}>
                <div
                  style={{
                    width: `${widths[index] < 20 ? 20 : widths[index]}%`,
                    backgroundColor: item.color,
                    borderTopLeftRadius: index === 0 && '99px',
                    borderBottomLeftRadius: index === 0 && '99px',
                    borderTopRightRadius:
                      index === visualParts.length - 1 && '99px',
                    borderBottomRightRadius:
                      index === visualParts.length - 1 && '99px',
                  }}
                  className="progressVisualPart"
                >
                  {width > 0 && <span className="text">{item.count}</span>}
                </div>
              </Tooltip>
            );
          })
        ) : (
          <div
            style={{
              width: `100%`,
              borderRadius: '99px',
            }}
            className="progressVisualPart"
          >
            <span style={{ color: 'grey' }} className="text">
              0
            </span>
          </div>
        )}
      </div>
    </>
  );
}

MultipartProgressBar.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  visualParts: PropTypes.array,
};
