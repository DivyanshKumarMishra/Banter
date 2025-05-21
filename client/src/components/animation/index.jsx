import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Animation = ({ className = '' , src = "/animations/welcome.lottie"}) => {
  return (
    <div className={`${className} mx-auto`}>
      <DotLottieReact src={src} loop autoplay />
    </div>
  );
};

export default Animation;
