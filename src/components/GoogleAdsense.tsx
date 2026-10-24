import React, { useEffect, useRef } from 'react';
import AdSense from 'react-adsense';

interface GoogleAdsenseProps {
  client: string;
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({
  client,
  slot,
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  
  useEffect(() => {
    // Only load script once per component instance
    if (isInitialized.current) return;
    
    // Function to initialize ads
    const initAds = () => {
      if (!(window as any).adsbygoogle) {
        (window as any).adsbygoogle = [];
      }
      
      try {
        // Push the ad initialization
        (window as any).adsbygoogle.push({});
        console.log('AdSense initialization pushed');
      } catch (error) {
        console.error('AdSense initialization error:', error);
      }
    };
    
    // Load the AdSense script
    const scriptId = 'google-adsense-script';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!existingScript) {
      const adScript = document.createElement('script');
      adScript.id = scriptId;
      adScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      adScript.async = true;
      adScript.crossOrigin = 'anonymous';
      
      // Initialize ads after script loads
      adScript.onload = () => {
        console.log('AdSense script loaded');
        // Add a small delay to ensure DOM is ready
        setTimeout(initAds, 200);
      };
      
      document.head.appendChild(adScript);
    } else {
      // If script already exists, initialize with a delay
      setTimeout(initAds, 200);
    }
    
    isInitialized.current = true;
    
    // Cleanup function
    return () => {
      isInitialized.current = false;
    };
  }, [client]); // Only re-run if client changes

  // For testing/development, you can use a placeholder to see where the ad would appear
  const AdComponent = process.env.NODE_ENV === 'development' ? (
    <div 
      style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '20px', 
        textAlign: 'center',
        border: '1px dashed #ccc',
        minHeight: '90px',
        ...style
      }}
    >
      <span style={{ color: '#666' }}>Ad Space - {slot}</span>
    </div>
  ) : (
    <AdSense.Google
      client={client}
      slot={slot}
      style={{ display: 'block', ...style }}
      format={format}
      responsive={responsive}
    />
  );

  return (
    <div className={`google-adsense ${className}`} ref={adContainerRef}>
      {AdComponent}
    </div>
  );
};

export default GoogleAdsense;
