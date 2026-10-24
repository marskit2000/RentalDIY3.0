import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations';
import GoogleAdsense from './GoogleAdsense';
import './GoogleAdsense.css';

/**
 * AdSenseSection Props Interface
 * 
 * @property {string} client - Google AdSense Publisher ID (default: your publisher ID)
 * @property {string} slot - Ad slot ID for specific ad unit (default: your default ad slot)
 * @property {string} format - Ad format ('auto', 'horizontal', 'vertical', 'rectangle', etc.)
 * @property {boolean} responsive - Whether the ad should be responsive
 * @property {React.CSSProperties} style - Custom CSS styles for the ad
 * @property {string} className - Additional CSS class names
 * @property {boolean} showLabel - Whether to show the "Advertisement" label
 * @property {string} position - Position of the ad ('top', 'middle', 'bottom', 'sidebar')
 * @property {string} adType - Type of ad ('display', 'in-article', 'in-feed', etc.)
 * @property {string} labelPosition - Position of the label ('above', 'below')
 */
interface AdSenseSectionProps {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  showLabel?: boolean;
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  adType?: 'display' | 'in-article' | 'in-feed' | 'matched-content';
  labelPosition?: 'above' | 'below';
}

/**
 * AdSenseSection Component
 * 
 * A reusable component for displaying Google AdSense advertisements throughout the application.
 * Provides sensible defaults while allowing customization for different ad placements.
 * 
 * Usage examples:
 * 
 * Basic usage: <AdSenseSection />
 * Custom slot: <AdSenseSection slot="1234567890" />
 * In-article ad: <AdSenseSection adType="in-article" position="middle" />
 * Custom styling: <AdSenseSection style={{ marginTop: '30px' }} />
 */
const AdSenseSection: React.FC<AdSenseSectionProps> = ({
  client = 'ca-pub-6348470051332056',
  slot = '7094024363',
  format = 'auto',
  responsive = true,
  style = {},
  className = '',
  showLabel = true,
  position = 'middle',
  adType = 'display',
  labelPosition = 'above',
}) => {
  const { language } = useLanguage();
  
  // Add position-specific classes
  const positionClass = position ? `ad-position-${position}` : '';
  const adTypeClass = adType ? `ad-type-${adType}` : '';
  const combinedClassName = `ad-container ${positionClass} ${adTypeClass} ${className}`.trim();
  
  // Apply ad type specific styling
  const adTypeStyle = {};
  if (adType === 'in-article') {
    Object.assign(adTypeStyle, { margin: '30px 0' });
  } else if (adType === 'in-feed') {
    Object.assign(adTypeStyle, { margin: '15px 0' });
  }

  return (
    <section className={combinedClassName}>
      {showLabel && labelPosition === 'above' && (
        <div className="ad-label">{t(language, 'advertisementLabel') || 'Advertisement'}</div>
      )}
      <GoogleAdsense 
        client={client}
        slot={slot}
        format={format}
        responsive={responsive}
        style={{ display: 'block', width: '100%', ...adTypeStyle, ...style }}
      />
      {showLabel && labelPosition === 'below' && (
        <div className="ad-label ad-label-below">{t(language, 'advertisementLabel') || 'Advertisement'}</div>
      )}
    </section>
  );
};

export default AdSenseSection;
