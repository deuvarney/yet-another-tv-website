import './styles.scss'
import PlaceholderSVG from './backgroundShapes.svg'
import { useState, useEffect } from 'react';


interface BackgroundPageImagesProps {
    children: React.ReactNode;
    backdropPath: string;
}

export default function BackgroundPageImages(props: BackgroundPageImagesProps) {

  const [backgroundImage, setBackgroundImage] = useState(PlaceholderSVG);

    useEffect(() => {
        if(backgroundImage !== PlaceholderSVG){
            setBackgroundImage(PlaceholderSVG);
        }
        const img = new Image();
        const backgroundImageEndpoint = `https://image.tmdb.org/t/p/original${props.backdropPath}`
        img.src = backgroundImageEndpoint;
        img.onload = () => {
        const callbackFn = () => setBackgroundImage(backgroundImageEndpoint);
        if(window.requestIdleCallback){
            window.requestIdleCallback(function() {
                callbackFn()
              }, { timeout: 5000 });
        } else { 
            callbackFn();
        }
        
            
          setBackgroundImage(backgroundImageEndpoint);
        };
      }, [props.backdropPath]);

    return(
        <div className="BackgroundPageImages"
            style={{ 
                backgroundImage: `url(${backgroundImage})`
                }}>
                {props.children}
        </div>
    );
}