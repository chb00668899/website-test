'use client';

import React, { ReactNode, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, className }, ref) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm" onClick={onClose}>
        <div
          ref={ref}
          className={cn(
            'relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <div>{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export { Modal };
