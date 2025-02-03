export default function PersonSVG(props: React.SVGProps<SVGSVGElement>) {
    const { className = '', ...rest } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 9 16"
            width={90}
            height={160}
            className={className}
            {...rest}
        >
            <rect width={9} height={16} fill="#e0e0e0" />
            <circle cx={4.5} cy={4.5} r={2} fill="#a0a0a0" />
            <path d="M2 8.5 C2 7 7 7 7 8.5 L7 16 L2 16 Z" fill="#a0a0a0" />
            <circle cx={3.8} cy={4.3} r={0.4} fill="white" />
            <circle cx={3.8} cy={4.3} r={0.2} fill="black">
                <animate
                    attributeName="cx"
                    values="3.7;3.9;3.7"
                    dur="3s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="cy"
                    values="4.2;4.4;4.2"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
            <circle cx={5.2} cy={4.3} r={0.4} fill="white" />
            <circle cx={5.2} cy={4.3} r={0.2} fill="black">
                <animate
                    attributeName="cx"
                    values="5.1;5.3;5.1"
                    dur="3s"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="cy"
                    values="4.2;4.4;4.2"
                    dur="3s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
    );
};
