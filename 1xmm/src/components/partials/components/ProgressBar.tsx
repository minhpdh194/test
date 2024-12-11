import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max }) => {
    const percentage = (value / max) * 100;

    return (
        <div className="progress w-100" style={{backgroundColor: `#D7DFE7` }}>
            <div
                className="progress-bar"
                role="progressbar"
                style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(142.18deg, #5155DA 21.85%, #2B2D74 78.15%)`,
                }}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            >
                
            </div>
        </div>
    );
};

export default ProgressBar;
