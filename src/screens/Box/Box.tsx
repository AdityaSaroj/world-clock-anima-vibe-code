import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";

interface TimeZoneInfo {
  city: string;
  country: string;
  offset: number;
  timezone: string;
}

export const Box = (): JSX.Element => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [localTime, setLocalTime] = useState(new Date());
  const [localTimeZone, setLocalTimeZone] = useState<TimeZoneInfo>({
    city: "Local City",
    country: "Local Country",
    offset: -new Date().getTimezoneOffset() / 60,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [selectedTimeZone, setSelectedTimeZone] = useState<TimeZoneInfo>({
    city: "London",
    country: "United Kingdom",
    offset: 0,
    timezone: "Europe/London"
  });

  const timeZones: TimeZoneInfo[] = [
    { city: "Pago Pago", country: "American Samoa", offset: -11, timezone: "Pacific/Pago_Pago" },
    { city: "Honolulu", country: "USA", offset: -10, timezone: "Pacific/Honolulu" },
    { city: "Anchorage", country: "USA", offset: -9, timezone: "America/Anchorage" },
    { city: "Los Angeles", country: "USA", offset: -8, timezone: "America/Los_Angeles" },
    { city: "Denver", country: "USA", offset: -7, timezone: "America/Denver" },
    { city: "Mexico City", country: "Mexico", offset: -6, timezone: "America/Mexico_City" },
    { city: "New York", country: "USA", offset: -5, timezone: "America/New_York" },
    { city: "Santiago", country: "Chile", offset: -4, timezone: "America/Santiago" },
    { city: "São Paulo", country: "Brazil", offset: -3, timezone: "America/Sao_Paulo" },
    { city: "South Georgia", country: "South Georgia", offset: -2, timezone: "Atlantic/South_Georgia" },
    { city: "Praia", country: "Cape Verde", offset: -1, timezone: "Atlantic/Cape_Verde" },
    { city: "London", country: "United Kingdom", offset: 0, timezone: "Europe/London" },
    { city: "Berlin", country: "Germany", offset: 1, timezone: "Europe/Berlin" },
    { city: "Cairo", country: "Egypt", offset: 2, timezone: "Africa/Cairo" },
    { city: "Moscow", country: "Russia", offset: 3, timezone: "Europe/Moscow" },
    { city: "Dubai", country: "UAE", offset: 4, timezone: "Asia/Dubai" },
    { city: "Karachi", country: "Pakistan", offset: 5, timezone: "Asia/Karachi" },
    { city: "New Delhi", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
    { city: "Dhaka", country: "Bangladesh", offset: 6, timezone: "Asia/Dhaka" },
    { city: "Jakarta", country: "Indonesia", offset: 7, timezone: "Asia/Jakarta" },
    { city: "Singapore", country: "Singapore", offset: 8, timezone: "Asia/Singapore" },
    { city: "Tokyo", country: "Japan", offset: 9, timezone: "Asia/Tokyo" },
    { city: "Sydney", country: "Australia", offset: 10, timezone: "Australia/Sydney" },
    { city: "Nouméa", country: "New Caledonia", offset: 11, timezone: "Pacific/Noumea" },
    { city: "Auckland", country: "New Zealand", offset: 12, timezone: "Pacific/Auckland" },
  ];

  const indianCities: TimeZoneInfo[] = [
    { city: "Kolkata", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
    { city: "Mumbai", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
    { city: "New Delhi", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
    { city: "Chennai", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
    { city: "Bangalore", country: "India", offset: 5.5, timezone: "Asia/Kolkata" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userOffsetMinutes = -new Date().getTimezoneOffset();
    const userOffset = userOffsetMinutes / 60;
    
    const matchedTimeZone = timeZones.find(tz => tz.timezone === userTimeZone) ||
      timeZones.reduce((prev, curr) => 
        Math.abs(curr.offset - userOffset) < Math.abs(prev.offset - userOffset) ? curr : prev
      );

    if (matchedTimeZone.country === "India") {
      const randomIndianCity = indianCities[Math.floor(Math.random() * indianCities.length)];
      setLocalTimeZone({
        ...randomIndianCity,
        offset: userOffset,
        timezone: userTimeZone
      });
    } else {
      setLocalTimeZone({
        ...matchedTimeZone,
        offset: userOffset,
        timezone: userTimeZone
      });
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, newPosition)));
      
      const index = Math.floor((newPosition / 100) * (timeZones.length - 1));
      setSelectedTimeZone(timeZones[Math.max(0, Math.min(timeZones.length - 1, index))]);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.classList.remove('cursor-ew-resize');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.classList.add('cursor-ew-resize');
  };

  const formatTime = (date: Date, offset: number): string => {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const newDate = new Date(utc + (3600000 * offset));
    return newDate.toLocaleTimeString('en-GB', { hour12: false });
  };

  const getTimezone = (offset: number): string => {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = Math.round((absOffset - hours) * 60);
    return `GMT${sign}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 p-6">
      <h1 className="text-white text-4xl font-bold mb-6">World Clock</h1>

      <Card className="w-full max-w-3xl overflow-hidden mb-4 bg-white">
        <CardContent className="p-4 relative">
          <div 
            ref={containerRef} 
            className="relative select-none"
            onMouseDown={handleMouseDown}
          >
            <img
              className="w-full h-auto object-contain pointer-events-none"
              alt="World Map"
              src="https://pngimg.com/d/world_map_PNG9.png"
              draggable="false"
            />
            <div 
              ref={sliderRef}
              className="absolute top-0 bottom-0 w-1 bg-red-500 cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 w-full max-w-3xl">
        <Card className="w-1/2 bg-sky-200 border-none">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{formatTime(localTime, localTimeZone.offset)}</span>
                <span className="ml-1 text-sm">{getTimezone(localTimeZone.offset)}</span>
              </div>
              <span className="text-sm">{`${localTimeZone.city}, ${localTimeZone.country}`}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-1/2 bg-pink-500 border-none">
          <CardContent className="p-4">
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{formatTime(localTime, selectedTimeZone.offset)}</span>
                <span className="ml-1 text-sm">{getTimezone(selectedTimeZone.offset)}</span>
              </div>
              <span className="text-sm">{`${selectedTimeZone.city}, ${selectedTimeZone.country}`}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
