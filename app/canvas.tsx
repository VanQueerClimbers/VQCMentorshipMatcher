'use client';
import { React, useState } from 'react';

interface ChildProps {
  isLoading: boolean;
}

const Canvas: React.FC<ChildProps> = ( { isLoading } ) => {

  let children = (
      <p>Upload mentor and mentee CSVs and press Match.</p>
  );

  if (isLoading) {
    children = (
      <p>Loading...</p>
    );
  }

  return (
    <div className="h-screen v-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default Canvas;
