declare module 'react-adsense' {
  import React from 'react';

  interface AdSenseProps {
    client: string;
    slot: string;
    format?: string;
    responsive?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }

  const AdSense: {
    Google: React.FC<AdSenseProps>;
  };

  export default AdSense;
}
