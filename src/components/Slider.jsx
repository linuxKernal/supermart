import fruit1 from '../assets/bingWallpaper.jpg'
import fruit2 from '../assets/natureimage.jpg'
import fruit3 from '../assets/nature.jpg'
import fruit4 from '../assets/naturesuper.jpg'
import { useState , useEffect} from 'react'



function Slider() {
    const [index, setIndex] = useState(0)
    const images = [fruit1,fruit2,fruit3,fruit4]
    const nextImage = ()=>{
        setIndex(i => i==3?0:i+1)
    }
    const prevImage = ()=>{
        setIndex(i => i==0?0:i-1)
    }


    return (
        <>
       
        <div className="max-w-full mx-auto h-[60vh] relative">
            <div className="w-full h-full absolute top-0 flex items-center justify-center">
                <img className="w-full h-full object-fill" src={images[index]} alt="" />
            </div>
            <button className="absolute top-1/2 right-2 text-4xl text-white" onClick={nextImage}>&rarr;</button>
            <button className="absolute top-1/2 left-2  text-4xl text-white" onClick={prevImage}>&larr;</button>
        </div>
        </>
    )
}

export default Slider