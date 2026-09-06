
import HomeHero from '@/components/home/Banner';
import FeaturesSection from '@/components/home/Featured';
import SecuritySection from '@/components/home/SecuritySection';
import SiteNavbar from "@/components/home/Navbar";
import SiteFooter from '@/components/home/Footer';
import React from 'react';

const HomePage = () => {
  return (
    <div>
       <SiteNavbar/>
      <HomeHero/>
      <FeaturesSection/>
      <SecuritySection/>
      <SiteFooter/> 
    </div>
  );
};

export default HomePage;