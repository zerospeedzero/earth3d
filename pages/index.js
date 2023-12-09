import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {Canvas as Energy} from '@react-three/fiber'
import Universe from '@/components/Universe'

const Index = () => {
  const [showFrontText, setShowFrontText] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState({})
  const popup = (city) => { 
    setShowPopup(true)
    setCity(city)
  }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  },[])
  return (
    <>
      <div className='h-screen w-screen flex flex-col justify-center items-center bg-[#050d2e] relative'>
        {!loading && (
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{delay: 0, duration: 2}}
            className='w-screen h-screen bg-black text-white'
            >
            <Energy camera={{ fov: 45, position: [0, 0, 10] }}>
              <Universe popup={popup}/>
            </Energy>
          </motion.div>
        )}
        {showFrontText && (
          <div className='absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50'></div> 
        )}
        {showFrontText && (
            <motion.div
              className='flex flex-col justify-center items-center absolute  w-full h-full bg-[transparent] text-white'
            >
              <motion.div
                className='w-full max-w-[90%] md:max-w-[40%] mx-auto text-center'
                initial={{ opacity: 0.6, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{delay: 0, duration: 2 }}
              >
                <motion.h2 class="text-4xl font-bold mb-4 text-[#F8C854]"
                  initial={{ y: -1000 }}
                  animate={{ y: 0 }}
                  transition={{delay: 0, duration: 2}}
                >
                  Welcome to George&apos;s Travel Map
                </motion.h2>
                <motion.p class="text-base mb-8 max-w-[60%] mx-auto"
                  initial={{ x: -1500 }}
                  animate={{ x: 0 }}
                  transition={{delay: 0, duration: 2}}
                >
                  This captivating 3D animation of Earth, created using Three.js and React-three-fiber, showcases all the remarkable cities I&apos;ve had the privilege to explore. 
                  Use the interactive controls to navigate this immersive map.
                </motion.p>
                <motion.button 
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3, duration: 2}}
                  class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-full mr-4" onClick={()=>{setShowFrontText(false)}}
                >
                  Explore
                </motion.button>
              </motion.div>
            </motion.div>
        )}
        {showPopup && (
          <motion.div
            className='absolute top-0 left-0 right-0 bottom-0 bg-grey/90 flex  flex-col justify-center items-center text-black p-4 bg-gray-100/30'
          >
            <motion.div
              className='flex flex-col space-y-2  w-[20rem] bg-black/80 text-white p-8 rounded-md'
              initial={{ opacity: 0.6, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{delay: 0, duration: 1, type: 'spring', stiffness: 100, damping: 10 }}
            >
              <h3 className='text-2xl font-bold mb-2 text-[#F8C854]'>Destination</h3>
              <span><strong>City :</strong> {city.city}</span>
              <span><strong>Country :</strong> {city.country}</span>
              {/* <span><strong>Population :</strong> {city.population.toLocaleString()}</span> */}
              <span><strong>Latitude :</strong> {city.lat}</span>
              <span><strong>Longitude :</strong> {city.lng}</span>
              <span className='mb-8'><strong>Country Code:</strong> {city.countryCode}</span>
              <div className='w-full flex flex-row justify-center items-center'>
                <button
                className='bg-yellow-500 w-[5rem] text-white font-semibold  py-2 px-4 rounded-lg mr-4 my-2'
                onClick={() => {setShowPopup(false)}}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  )
}

export default Index