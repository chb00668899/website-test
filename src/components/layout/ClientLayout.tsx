'use client';

import React from 'react';
import { Navbar } from './Navbar';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
