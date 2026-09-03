export const BowlIcon = () => (
  <svg
    width="75"
    height="50"
    viewBox="0 0 75 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Тень / внутренняя поверхность */}
    <ellipse
      cx="37.5"
      cy="18.5"
      rx="29"
      ry="11.5"
      fill="#173F2A"
      fillOpacity="0.35"
    />

    {/* Основная чаша */}
    <path
      d="M8.5 18.5C9.4 31.25 20.25 41 37.5 41C54.75 41 65.6 31.25 66.5 18.5"
      fill="#164A30"
    />

    {/* Верхний край */}
    <ellipse cx="37.5" cy="18.5" rx="29" ry="11.5" fill="#1C5939" />

    {/* Внутренность чаши */}
    <ellipse
      cx="37.5"
      cy="18.5"
      rx="23"
      ry="8"
      fill="#0D3020"
      fillOpacity="0.65"
    />

    {/* Блик / объём */}
    <path
      d="M12.5 22.5C14.5 32 23.5 37 37.5 37C51.5 37 60.5 32 62.5 22.5"
      stroke="#0A2F1E"
      strokeOpacity="0.35"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Лёгкий блик на краю */}
    <path
      d="M17 17.5C21 14.5 27 13 33 12.8"
      stroke="#4D8063"
      strokeOpacity="0.45"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);
