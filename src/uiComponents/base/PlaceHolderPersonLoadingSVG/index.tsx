export default function PlaceHolderPersonLoadingSVG(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 16" width="90" height="160" {...props}>
            <rect width="9" height="16" fill="#f0f0f0" />
            <g transform="translate(4.5 5)">
                <circle cx="0" cy="0" r="2.5" fill="#b0b0b0" />
                <circle cx="0" cy="0" r="2" fill="none" stroke="#f0f0f0" stroke-width="0.2" stroke-dasharray="0.5 0.5">
                    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="3s" repeatCount="indefinite" />
                    <animate
                        attributeName="opacity"
                        values="1;0;1"
                        dur="2s"
                        repeatCount="indefinite" />
                </circle>
            </g>
            <path d="M2 8.5 C2 7 7 7 7 8.5 L7 16 L2 16 Z" fill="#b0b0b0" />
        </svg>
    );
}