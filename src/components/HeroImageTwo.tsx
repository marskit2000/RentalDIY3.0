import TenancyHeroImage from '../assets/images/Tenancy_Agreement_Template_hero_page.jpg'
import './HeroImageTwo.css'

const HeroImageTwo = () => {
  return (
    <div className="hero-image-container">
          <img className="hero-image" src={TenancyHeroImage} alt="Tenancy Agreement Template" />
    </div>
  )
}

export default HeroImageTwo