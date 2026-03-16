interface AuraLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function AuraLogo({ size = 32, color = "#00D5C0", className }: AuraLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 115 114" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M114.5 29L115 85L85.5 114H29.5L0 85V29L29.5 0H85.5L114.5 29ZM5 57L56.9561 108.956L109.941 55.9707L57.9854 4.01465L5 57ZM83.9414 56.9707L57.9707 82.9414L32 56.9707L57.9707 31L83.9414 56.9707Z" 
        fill={color}
      />
    </svg>
  );
}
