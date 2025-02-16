import { useState, useEffect } from 'react';
import PersonSVG from '../PlaceholderPersonSVG';
import PlaceHolderPersonLoadingSVG from '../PlaceHolderPersonLoadingSVG';

interface ImageLoaderProps {
    src: string;
    alt: string;
    fallbackComp?: React.ReactNode;
    placeholderComp?: React.ReactNode;
    className?: string;
    aspectRatio?: string;
    // Add other properties as needed
  }

    /**
     * A component that loads an image with a placeholder and a fallback image in case of loading failure.
     * 
     * @param {Object} props
     * @param {string} props.src The URL of the image to load.
     * @param {string} props.alt The alt text of the image.
     * @param {ReactNode} [props.placeholderComp] A React component to render as a placeholder while the image is loading.
     * @param {ReactNode} [props.fallbackComp] A React component to render if the image fails to load.
     * @param {Object} [props.rest] Any additional props to pass to the img element.
     * 
     * @example
     * import ImageLoader from '../ImageLoader';
     * 
     * const MyComponent = () => {
     *     return (
     *         <ImageLoader
     *             src="https://example.com/image.jpg"
     *             alt="An example image"
     *         />
     *     );
     * };
     */
const ImageLoader = (props: ImageLoaderProps) => {
    const {
        src,
        alt,
        placeholderComp = null,
        fallbackComp = null,
        aspectRatio = '',
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
        img.onerror = () => {
            // Fallback if image fails to load
            setImageLoaded(false); 
            setIsLoading(false);
        } 
    }, [src]);

    // Default fallback if no SVG provided
    const DefaultPlaceholder = (
        fallbackComp ||
        <PersonSVG {...rest}/>
    );

    return (
        <div 
            style={{ 
                position: 'relative',
                ...(aspectRatio && {aspectRatio})
            }}>
            {isLoading && (placeholderComp || <PlaceHolderPersonLoadingSVG {...rest}/>)}
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
