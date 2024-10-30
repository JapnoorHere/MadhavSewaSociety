import React from 'react';
import VivekPic from '../assets/vivekpic.png';
import AboutVivek from '../assets/about-img.jpg';
import Pranab from '../assets/pranab.png';
import APJ from '../assets/apj.png';
import Mother from '../assets/mother.jpg';
import YT from '../assets/yt.png';
import IG from '../assets/ig.png';
import LD from '../assets/ld.png';
import FB from '../assets/fb.png';
import Madhav from '../assets/madhav.jpg';
import KickDrugs from '../assets/kickDrugs.jpg';
import Disable from '../assets/disable.jpg';

const Home = () => {
  return (
    <section className="home h-screen" id="home">
      <div className="home-container h-[85%] px-4 md:px-20 flex flex-col md:flex-row mx-auto items-center gap-8 justify-around">
        <div className="content-left text-center md:text-left">
          <h3 className="text-black text-xl md:text-2xl">Hello, I'm</h3>
          <h1 className="text-[#ffa85a] text-3xl md:text-6xl">
            National Awardee <br />
            Vivek Joshi
          </h1>
          <a
            href="https://drive.google.com/file/d/1TsoldDXlumESGaKr518V5jfBDK9BqzQs/view"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="border-none text-white bg-[#ffa85a] px-6 py-2 md:px-8 md:py-4 rounded-lg text-base mt-8 transition-all duration-200 ease-linear hover:text-[#ffa85a] hover:bg-white hover:border hover:border-[#ffa85a]">
              My CV
            </button>
          </a>
        </div>
        <div className="content-right">
          <div className="img-container h-[50vh]">
            <img
              src={VivekPic}
              alt="Vivek Joshi"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section className="about bg-[#fff8f1]" id="about">
      <div className="about-container max-w-[1280px] mx-auto flex flex-col md:flex-row justify-center p-4 md:p-8 gap-8 items-center">
        <div className="content-left">
          <div className="img-container overflow-hidden rounded-lg h-[300px]">
            <img
              src={AboutVivek}
              alt="About Vivek Joshi"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="content-right flex flex-col">
          <h1 className="text-[2rem] md:text-[2.5rem]">
            About <span className="text-[#ffa85a]">Me</span>
          </h1>
          <h3 className="text-xl">Adv. Vivek Joshi</h3>
          <ul className="list-none flex flex-col mt-4 gap-1">
            <li><b>National & State Awardee</b></li>
            <li><b>President - </b>Madhav Sewa Society</li>
            <li><b>President - </b>SAFI NORTH INDIA</li>
            <li><b>Member State Advisory Board - </b><br />Divyangjan, Disability Activist</li>
            <li><b>Member Kick Drugs (Aus)</b></li>
            <li><b>Motivational Speaker</b></li>
          </ul>
        </div>
      </div>
    </section>
  );
};

const Achievements = () => {
  return (
    <section className="achievements p-8" id="achievements">
      <div className="achievements-container max-w-[1400px] mx-auto flex flex-col gap-16">
        <div className="container-top text-center">
          <h1 className="text-[2.5rem]">
            My <span className="text-[#ffa85a]">Achievements</span>
          </h1>
        </div>
        <div className="container-bottom grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 pb-8">
          {[
            {
              imgSrc: Pranab,
              title: "NATIONAL AWARD",
              description: "National award for the empowerment of persons with disabilities (Divyangjan) on 03-Dec-2016 by Shri Pranab Mukherjee (President of India).",
            },
            {
              imgSrc: APJ,
              title: "LAFZ LAFZ MASOOM",
              description: "My first book entitled LAFZ LAFZ MASOOM was released by Dr. Abdul Kalam at the 1st International Conference of IACP, Hyderabad.",
            },
            {
              imgSrc: Mother,
              title: "ICONIC MOTHER AWARD",
              description: "My mother was awarded the ICONIC MOTHER National Award for senior citizen Vayoshreshtha Samman on 9-Oct-2017 by Shri Ramnath Kovind.",
            },
          ].map(({ imgSrc, title, description }, index) => (
            <div key={index} className="achievements-card p-3 bg-[#fff8f1] border-2 border-[#ffa85a] overflow-hidden rounded-lg transition-all duration-300">
              <div className="img-container h-[320px]">
                <img src={imgSrc} alt={title} className="h-full w-full rounded-t-lg object-cover" />
              </div>
              <h1 className="text-xl text-center font-semibold">{title}</h1>
              <p className="text-sm text-center mt-2">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialLinks = () => {
  return (
    <section className="social-links py-8 bg-orange-400 p-4" id="social-links">
      <div className="social-links-container flex flex-col md:flex-row justify-around gap-4 md:gap-8">
        {[
          { href: "https://www.youtube.com/@vivek708", imgSrc: YT, label: "YOUTUBE" },
          { href: "https://www.instagram.com/vivekjoshimasoom/", imgSrc: IG, label: "INSTAGRAM" },
          { href: "https://www.linkedin.com/in/vivek-joshi-a4780b9a/", imgSrc: LD, label: "LINKEDIN" },
          { href: "https://www.facebook.com/vivek.joshi1980", imgSrc: FB, label: "FACEBOOK" },
        ].map(({ href, imgSrc, label }, index) => (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="social flex items-center gap-2 p-4 bg-white rounded-md shadow-md hover:bg-opacity-75 transition-colors"
          >
            <img src={imgSrc} alt={label} className="h-8 w-8" />
            <h2 className="text-lg font-semibold">{label}</h2>
          </a>
        ))}
      </div>
    </section>
  );
};

const SocialContributions = () => {
  return (
    <section className="social-contributions p-8" id="social-contributions">
      <div className="social-container max-w-[1400px] mx-auto flex flex-col">
        <div className="container-top text-center mb-8">
          <h1 className="text-3xl font-bold">
            Social Contributions <span className="text-blue-500">and Activities towards Society</span>
          </h1>
        </div>
        <div className="container-bottom grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {[
            { href: "https://www.linkedin.com/company/madhav-sewa-society/", imgSrc: Madhav, label: "MADHAV SEWA SOCIETY" },
            { href: "https://www.instagram.com/kickdrugs/", imgSrc: KickDrugs, label: "KICK DRUGS (AUS)" },
            { href: "https://safinorthindia.org/", imgSrc: Disable, label: "Disability Activist" },
          ].map(({ href, imgSrc, label }, index) => (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-contribution-card bg-[#fff8f1] border border-[#ffa85a] rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <div className="img-container h-[200px]">
                <img src={imgSrc} alt={label} className="h-full w-full object-cover rounded-t-lg" />
              </div>
              <h1 className="text-xl text-center mt-2">{label}</h1>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
  
  

const AboutVivekJoshi = () => {
  return (
    <div>
      <Home />
      <About />
      <Achievements />
      <SocialLinks />
      <SocialContributions />
    </div>
  );
};

export default AboutVivekJoshi;
