export default function Wave() {
  return (
    <svg
      id="wave"
      style={{transform:'rotate(0deg)', transition:' 0.3s'}}
      viewBox="0 0 1440 170"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
          <stop stopColor="#121212" offset="0%"></stop>
          <stop stopColor="#121212" offset="100%"></stop>
        </linearGradient>
      </defs>
      <path
        style={{transform:"translate(0, 0px)", opacity:1}}
        fill="url(#sw-gradient-0)"
        d="M0,0L120,119L240,68L360,119L480,17L600,153L720,17L840,119L960,17L1080,153L1200,68L1320,0L1440,102L1560,85L1680,136L1800,153L1920,17L2040,34L2160,0L2280,153L2400,136L2520,136L2640,51L2760,85L2880,34L2880,170L2760,170L2640,170L2520,170L2400,170L2280,170L2160,170L2040,170L1920,170L1800,170L1680,170L1560,170L1440,170L1320,170L1200,170L1080,170L960,170L840,170L720,170L600,170L480,170L360,170L240,170L120,170L0,170Z"
      ></path>
    </svg>
  );
}
