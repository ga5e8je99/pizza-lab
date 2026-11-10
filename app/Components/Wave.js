export default function Wave({ color = "#121212", className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto block ${className}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0,40 C320,100 480,10 720,50 C960,90 1120,20 1440,45 L1440,120 L0,120 Z"
        fill={color}
      />
    </svg>
  );
}
