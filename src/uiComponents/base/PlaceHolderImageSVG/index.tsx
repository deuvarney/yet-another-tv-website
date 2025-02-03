export default function PictureNightSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="#4C4C4C" width="320" height="180" viewBox="0 0 16 9" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="16" height="9" fill="#D3D3D3" />
      <g transform="translate(4, 0) scale(0.28125)">
        <path d="M27.733 19.635l-1.316 4.914-0.037 0.01-1.438 5.367-9.296-2.49-0.111 0.029-9.788-2.622-0.017-0.064-2.605-0.699 0.493-1.841 0.032 0.009 4.829-18.022-0.032-0.009 0.509-1.897 17.105 4.584 0.016-0.056 4.711 1.262-3.072 11.46 0.017 0.065zM28.382 9.498l-18.023-4.829-3.558 13.28 18.021 4.828 3.56-13.279zM12.234 13.392l1.194 2.045 3.107-2.925 1.583 2.766 4.185-3.689 1.047 8.559-13.822-3.706 2.706-3.050zM13.127 11.38c-0.785-0.211-1.252-1.019-1.041-1.804s1.018-1.253 1.804-1.042c0.785 0.211 1.252 1.019 1.041 1.804s-1.018 1.253-1.804 1.042zM21.64 4.479l-0.414 0.111-3.795-1.017 5.598-1.5 0.866 3.231-2.19-0.587-0.065-0.238zM3.617 9.309l1.242 4.635-1.017 3.794-2.63-9.818 5.668-1.519-0.587 2.19-2.676 0.718zM7.058 29.736l-1.018-3.798 7.597 2.036-6.579 1.762z" />
      </g>
    </svg>

  );

};

export function PlaceholderPosterImageSVG(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="70" height="112" {...props}>
      {/* <!--Dark background--> */}
      <rect width="10" height="16" fill="#2c3e50" />
      {/* <!--Circle near top left--> */}
      <circle cx="3" cy="3" r="1.5" fill="#3498db" opacity="0.8" />
      {/* <!--2 lines to the right of the circle--> */}
      <line x1="5.5" y1="2.5" x2="8.5" y2="2.5" stroke="#ecf0f1" stroke-width="0.3" opacity="0.7" />
      <line x1="5.5" y1="3.5" x2="8.5" y2="3.5" stroke="#ecf0f1" stroke-width="0.3" opacity="0.7" />
      {/* <!--3 lines under the circle, now with more height--> */}
      <line x1="2" y1="7.5" x2="8" y2="7.5" stroke="#ecf0f1" stroke-width="0.6" opacity="0.7" />
      <line x1="2" y1="9.5" x2="8" y2="9.5" stroke="#ecf0f1" stroke-width="0.6" opacity="0.7" />
      <line x1="2" y1="11.5" x2="8" y2="11.5" stroke="#ecf0f1" stroke-width="0.6" opacity="0.7" />
    </svg>
  )
}