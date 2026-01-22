
import React from 'react';

const DotPattern: React.FC = () => {
    return (
        <div className="dot-pattern-container">
            <svg 
                className="dot-pattern" 
                width="100%" 
                height="100%" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <pattern 
                    id="dotPattern" 
                    x="0" 
                    y="0" 
                    width="30" 
                    height="30" 
                    patternUnits="userSpaceOnUse"
                >
                    <circle 
                        cx="2" 
                        cy="2" 
                        r="1" 
                        fill="rgba(187, 134, 252, 0.3)" 
                    />
                </pattern>
                <rect 
                    x="0" 
                    y="0" 
                    width="100%" 
                    height="100%" 
                    fill="url(#dotPattern)" 
                />
            </svg>
        </div>
    );
};

export default DotPattern;