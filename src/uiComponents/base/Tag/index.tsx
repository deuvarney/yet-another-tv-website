import React from 'react';
import './styles.scss';

interface TagProps {
  children: React.ReactNode;
  color?: string;
  closable?: boolean;
  onClose?: () => void;
}

export default function Tag({children, color, closable, onClose}: TagProps) {
    return (
        <div className={`tag ${color}`}>
            {children}
            {closable && (
                <div className="close-icon" onClick={onClose}>
          &times;
                </div>
            )}
        </div>
    );
};
