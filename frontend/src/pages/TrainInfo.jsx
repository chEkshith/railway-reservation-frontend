import React, { useState } from 'react';
import { Mail, Phone, HeartHandshake, CheckCircle2, HelpCircle, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function TrainInfo() {
  const [activeFaq, setActiveFaq] = useState(0);

  const stats = [
    { val: "13,000+", label: "Passenger Trains Daily" },
    { val: "23 Million+", label: "Commuters Carried Daily" },
    { val: "7,000+", label: "Stations Nationwide" }
  ];

  const cities = [
    {
      name: "New Delhi Junction",
      desc: "Handles 500+ daily trains and 500k+ passengers with 16 platforms.",
      img: "/old-static-html/assets/images/delhi.jfif"
    },
    {
      name: "Mumbai CSMT",
      desc: "UNESCO Heritage site serving 600,000+ daily commuters.",
      img: "/old-static-html/assets/images/mumbai.jfif"
    },
    {
      name: "Howrah Junction (Kolkata)",
      desc: "Historic hub featuring 23 active platforms serving 1M+ daily passengers.",
      img: "/old-static-html/assets/images/kolkata.jfif"
    },
    {
      name: "Chennai Central",
      desc: "Crucial southern junction managing over 200 daily long distance trains.",
      img: "/old-static-html/assets/images/chennai.jfif"
    },
    {
      name: "KSR Bengaluru",
      desc: "Silicon Valley's central portal accommodating growing high-speed transit lines.",
      img: "/old-static-html/assets/images/bengaluru.webp"
    },
    {
      name: "Secunderabad Junction",
      desc: "Key South Central command hub connecting diverse cross-country corridors.",
      img: "/old-static-html/assets/images/secunderabad.jpg"
    },
    {
      name: "Ahmedabad Junction",
      desc: "Western India's ultra-busy station linking vital commercial pathways.",
      img: "/old-static-html/assets/images/ahmedabad.jfif"
    }
  ];

  const officials = [
    {
      initials: "RA",
      name: "Mr. Rajesh Agrawal",
      role: "Member (Infrastructure)",
      portfolio: "Network Development, High-Speed Tracks, Bridge Upgrades.",
      credentials: "30+ years in Railway Civil Engineering and Strategic Operations.",
      email: "rajesh.agrawal@indianrail.gov.in"
    },
    {
      initials: "NB",
      name: "Ms. Neetu Bhargava",
      role: "Member (Finance)",
      portfolio: "Capital Allocation, Project Auditing, Fare Frameworks.",
      credentials: "25 years in Central Budget Planning and Corporate Finance Management.",
      email: "neetu.bhargava@indianrail.gov.in"
    },
    {
      initials: "AK",
      name: "Dr. Anil Kumar",
      role: "General Manager (SR)",
      portfolio: "Zonal Operations, Passenger Services, Local Safety Auditing.",
      credentials: "28 years leading technical systems integration and station modernization.",
      email: "anil.kumar@indianrail.gov.in"
    }
  ];

  const faqs = [
    {
      q: "How do I reserve seats using the RailPass coach map?",
      a: "Search for your departure and arrival stations on the home page. When trains populate, click 'Book Now' on your desired service. An interactive coach layout will overlay, allowing you to select up to 6 custom seats in real-time, fill passenger names, and immediately generate your boarding pass."
    },
    {
      q: "Can I cancel or refund my ticket online?",
      a: "Yes, tickets booked on RailPass can be managed via the customer portal. Cancellations processed at least 24 hours prior to train departure are eligible for full refunds to the original payment channel, minus a minimal processing commission fee of ₹120."
    },
    {
      q: "What is a PNR and how do I download my ticket?",
      a: "A Passenger Name Record (PNR) is a unique 10-digit number generated upon booking confirmation. Once confirmed, you can print the electronic ticket directly from the booking summary modal or save it as a digital image, equipped with a secure QR code readable at train platforms."
    },
    {
      q: "How is the price calculated based on Travel Class?",
      a: "Base prices are calculated proportionally based on the distance between the source and destination stations. Class modifiers are applied automatically: AC First Class (2.4x), AC 2 Tier (1.6x), AC 3 Tier (1.25x), and Sleeper (0.6x base fare)."
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-14 flex-1">
      {/* Background Image Overlay */}
      <div 
        className="bg-overlay-img" 
        style={{ backgroundImage: "url('/old-static-html/assets/images/rail1.jpg')" }} 
      />

      {/* Hero Section */}
      <section className="bg-cardBg border border-borderGlass p-8 sm:p-10 rounded-2xl backdrop-blur-md glow-indigo">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white to-accentCyan bg-clip-text text-transparent font-headings">
          About Indian Railway Networks
        </h1>
        <p className="text-textSecondary text-sm sm:text-base leading-relaxed max-w-4xl">
          Indian Railways operates one of the largest and most complex rail systems in the world. As the backbone of national logistics and passenger transport, it manages thousands of express, mail, high-speed, and suburban services daily, connecting metropolitan hubs to remote rural villages.
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-cardBg border border-borderGlass p-6 rounded-xl text-center backdrop-blur-sm">
            <div className="text-3xl font-extrabold text-accentCyan font-headings">{stat.val}</div>
            <div className="text-xs font-bold text-textSecondary uppercase tracking-wider mt-2">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Railway Cities Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-headings text-white">Top Railway Cities in India</h2>
          <p className="text-textSecondary text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Explore major transit stations representing the busiest hubs across the national rail corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city, idx) => (
            <div key={idx} className="group h-64 rounded-xl border border-borderGlass overflow-hidden relative shadow-lg bg-cover bg-center transition-all duration-300 hover:border-accentCyan/40 hover:scale-[1.01]" style={{ backgroundImage: `url(${city.img})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/50 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 p-5 w-full">
                <h3 className="text-base font-bold text-white font-headings mb-1">{city.name}</h3>
                <p className="text-[11px] text-textSecondary leading-normal line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity">
                  {city.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Administrative Board of Officials */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-headings text-white">Administrative Railway Officials</h2>
          <p className="text-textSecondary text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Our central leadership committee driving network expansion and infrastructure safety initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {officials.map((ofc, idx) => (
            <div key={idx} className="bg-cardBg border border-borderGlass p-6 rounded-xl flex flex-col justify-between gap-5 backdrop-blur-sm shadow-md hover:border-accentCyan/30 transition-all">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500 to-accentCyan flex items-center justify-center font-bold text-white shadow-sm font-headings">
                    {ofc.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight">{ofc.name}</h3>
                    <span className="text-[10px] text-accentCyan font-bold uppercase tracking-wider">{ofc.role}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 text-xs text-textSecondary border-t border-white/5 pt-4">
                  <p>
                    <strong className="text-white">Portfolio: </strong>
                    {ofc.portfolio}
                  </p>
                  <p>
                    <strong className="text-white">Credentials: </strong>
                    {ofc.credentials}
                  </p>
                </div>
              </div>

              <a 
                href={`mailto:${ofc.email}`} 
                className="w-full text-center border border-borderGlass bg-white/5 text-xs font-bold text-white py-2.5 rounded-lg hover:bg-white/10 hover:border-accentCyan/30 transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <Mail size={13} />
                <span>Contact {ofc.initials === "RA" ? "Infrastructure" : ofc.initials === "NB" ? "Finance Board" : "General Manager"}</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Grid */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-headings text-white">Frequently Asked Questions</h2>
          <p className="text-textSecondary text-xs sm:text-sm max-w-lg mx-auto mt-2 leading-relaxed">
            Find quick answers regarding our advanced digital booking services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-xl transition-all duration-300 ${
                  isOpen 
                    ? 'bg-cardBg border-accentCyan/40 shadow-[0_0_15px_rgba(6,182,212,0.08)]' 
                    : 'bg-cardBg border-borderGlass hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-4.5 text-left text-sm sm:text-base font-bold font-headings text-white"
                >
                  <span>{faq.q}</span>
                  <span className="text-textSecondary">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-textSecondary leading-relaxed border-t border-white/5 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Helplines care */}
      <section className="bg-cardBg border border-borderGlass p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center backdrop-blur-md">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-accentCyan">
            <HeartHandshake size={20} />
            <h2 className="text-lg font-bold font-headings uppercase tracking-wider text-white">Customer Care & Helplines</h2>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed max-w-md">
            Our support teams are online 24/7 to answer emergency tracking requests, platform changes, and security reports.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#121B31]/30 border border-borderGlass p-4 rounded-xl flex flex-col justify-center">
            <span className="text-[9px] font-bold text-textMuted uppercase tracking-wider mb-1">Unified National Helpline</span>
            <span className="text-2xl font-extrabold text-accentCyan font-headings tracking-wide flex items-center gap-1.5">
              <Phone size={18} />
              <span>Dial 139</span>
            </span>
            <span className="text-[10px] text-textSecondary mt-1 leading-normal">
              Single unified hotline for medical, security and tracking services.
            </span>
          </div>

          <div className="bg-[#121B31]/30 border border-borderGlass p-4 rounded-xl flex flex-col gap-1.5 text-xs text-textSecondary justify-center">
            <div>
              <strong className="text-white">Email: </strong>
              <span>support@railpass.gov.in</span>
            </div>
            <div>
              <strong className="text-white">WhatsApp: </strong>
              <span>+91 81300 13900</span>
            </div>
            <div>
              <strong className="text-white">HQ: </strong>
              <span>Rail Bhawan, New Delhi</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
