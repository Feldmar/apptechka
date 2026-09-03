export const StoneIcon = () => (
  <svg
    width="21"
    height="16"
    viewBox="0 0 21 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="stoneGradient" x1="4" y1="2" x2="17" y2="15">
        <stop offset="0" stopColor="#C4C4C4" />
        <stop offset="0.35" stopColor="#A0A0A0" />
        <stop offset="0.7" stopColor="#777777" />
        <stop offset="1" stopColor="#555555" />
      </linearGradient>

      <linearGradient id="highlight" x1="5" y1="3" x2="13" y2="9">
        <stop offset="0" stopColor="#E0E0E0" stopOpacity="0.75" />
        <stop offset="1" stopColor="#B0B0B0" stopOpacity="0" />
      </linearGradient>

      <filter id="stoneShadow" x="-20%" y="-30%" width="140%" height="170%">
        <feDropShadow
          dx="0"
          dy="1"
          stdDeviation="0.8"
          floodColor="#000"
          floodOpacity="0.35"
        />
      </filter>
    </defs>

    <path
      d="
        M2.4 9.8
        C2.7 7.5 4.2 5.8 6.5 4.1
        C8.1 2.9 10.7 1.8 13.1 2.1
        C15.5 2.3 17.9 3.8 18.5 5.7
        C19.1 7.5 18.2 10.4 16.5 11.9
        C14.7 13.5 11.8 14.1 8.7 13.8
        C5.7 13.6 2.1 12.5 2.4 9.8
        Z
      "
      fill="url(#stoneGradient)"
      filter="url(#stoneShadow)"
    />

    <path
      d="
        M4.1 8.1
        C4.8 6.2 6.4 5 8.2 3.9
        C10.1 2.8 12.5 2.6 14.1 3.2
        C15.3 3.6 16.3 4.5 16.7 5.5
        C14.8 5 13.2 5.1 11.3 5.7
        C8.5 6.5 6.7 7.8 4.1 8.1
        Z
      "
      fill="url(#highlight)"
    />

    <path
      d="M6 9.4C8.2 8.8 10.2 8.9 12.1 9.2"
      stroke="#6A6A6A"
      strokeWidth="0.5"
      strokeLinecap="round"
      opacity="0.45"
    />

    <path
      d="M13.5 11.3C14.6 11 15.4 10.5 16.1 9.8"
      stroke="#4F4F4F"
      strokeWidth="0.55"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);
