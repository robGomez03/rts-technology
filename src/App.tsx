import { useState } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyUs from './components/WhyUs'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      {loaded && (
        <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
          <Navbar />
          <Hero />
          <Services />
          <WhyUs />
          <Testimonials />
          <Contact />
          <Footer />
        </div>
      )}
    </>
  )
}
