import { useState, useEffect } from 'react';
import PersonSVG from '../PlaceholderPersonSVG';
import PlaceHolderPersonLoadingSVG from '../PlaceHolderPersonLoadingSVG';

// function LoadingSVG(props: React.SVGProps<SVGSVGElement>) {
//     return (
//         <svg width="40" height="40" viewBox="0 0 40 40" {...props}>
//             <circle cx="20" cy="20" r="18" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="100, 100" stroke-dashoffset="0" 
//             // animation="spin 1s linear infinite"
//             >
//                 <animateTransform attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="1s" repeatCount="indefinite" />
//             </circle>
//         </svg>
//     );
// }

interface ImageLoaderProps {
    src: string;
    alt: string;
    placeholderSVG?: React.ReactNode;
    className?: string;
    // Add other properties as needed
  }

const ImageLoader = (props: ImageLoaderProps) => {
    const {
        src,
        alt,
        placeholderSVG = null,
        ...rest
    } = props;
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const callbackFn = () => {
                setImageLoaded(true); 
                setIsLoading(false);
            }

            setTimeout(() => {
                if(window.requestIdleCallback){
                    window.requestIdleCallback(function() {
                        callbackFn()
                      }, { timeout: 5000 });
                } else {
                    // Fallback for Safari
                    callbackFn();
                }
            }, 1000);
        }
        img.onerror = () => {setImageLoaded(false); setIsLoading(false);} // Fallback if image fails to load
    }, [src]);

    // Default fallback if no SVG provided
    const DefaultPlaceholder = (
        <PersonSVG {...rest}/>
    );

    return (
        <div 
            style={{ 
                position: 'relative' 
            }}>
            {isLoading && <PlaceHolderPersonLoadingSVG {...rest}/>}
            {!isLoading && (imageLoaded ? (
                <img
                    src={src}
                    alt={alt}
                    style={{
                        top: 0,
                        left: 0,
                    }}
                    {...rest}
                />
            ) : DefaultPlaceholder)}
        </div>
    );
};

export default ImageLoader;
