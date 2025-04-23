// components/Loader.tsx
import React from 'react';
import { HashLoader } from 'react-spinners';

const Loader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <HashLoader color="#D39D55" />
  </div>
);

export default Loader;
