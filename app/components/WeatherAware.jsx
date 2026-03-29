'use client';

import { useState, useEffect } from 'react';

const GOLD = '#DAA520';

// Greek weather by month (average)
function getGreekTemp() {
  const month = new Date().getMonth();
  const temps = [12, 13, 15, 19, 24, 28, 32, 33, 28, 23, 18, 14];
  return temps[month];
}

function getGreekCondition() {
  const month = new Date().getMonth();
  if (month >= 5 && month <= 8) return 'sunny';
  if (month >= 3 && month <= 4 || month === 9) return 'warm';
  return 'mild';
}

export default function WeatherAware() {
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Try to get user's weather via free API
    const fetchWeather = async () => {
      try {
        // Get user's approximate location from timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const city = tz.split('/').pop().replace(/_/g, ' ');

        // Use wttr.in (free, no API key needed)
        const res = await fetch(`https://wttr.in/${city}?format=j1`, {
          signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) throw new Error('Weather API failed');

        const weather = await res.json();
        const currentTemp = parseInt(weather.current_condition?.[0]?.temp_C || '0');
        const condition = weather.current_condition?.[0]?.weatherDesc?.[0]?.value || 'cloudy';
        const windSpeed = parseInt(weather.current_condition?.[0]?.windspeedKmph || '0');
        const windDir = weather.current_condition?.[0]?.winddir16Point || '';
        const greekTemp = getGreekTemp();

        // Only show if user's weather is significantly colder or worse
        if (currentTemp < greekTemp - 5 || condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('cloud') || condition.toLowerCase().includes('snow') || condition.toLowerCase().includes('overcast')) {
          setData({
            userCity: city,
            userTemp: currentTemp,
            userCondition: condition,
            userWind: windSpeed,
            userWindDir: windDir,
            greekTemp,
            diff: greekTemp - currentTemp,
          });

          // Delay showing for effect
          setTimeout(() => setVisible(true), 4000);

          // Auto-hide after 12 seconds
          setTimeout(() => {
            setClosing(true);
            setTimeout(() => setVisible(false), 500);
          }, 16000);
        }
      } catch (e) {
        // Silently fail — don't show weather widget
      }
    };

    fetchWeather();
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible || !data) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'fixed',
        top: 80,
        left: '50%',
        transform: `translateX(-50%) translateY(${closing ? '-20px' : '0'})`,
        zIndex: 55,
        opacity: closing ? 0 : 1,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        maxWidth: 480,
        width: '92%',
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${GOLD}15`,
        borderRadius: 16,
        padding: '20px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Weather comparison */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            {/* User's weather */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>
                {data.userCondition.toLowerCase().includes('rain') ? '🌧️' :
                 data.userCondition.toLowerCase().includes('snow') ? '❄️' :
                 data.userCondition.toLowerCase().includes('cloud') || data.userCondition.toLowerCase().includes('overcast') ? '☁️' : '🌤️'}
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, color: '#fff', fontWeight: 300 }}>
                {data.userTemp}°C
              </div>
              {data.userWind > 0 && (
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 7, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                  💨 {data.userWind} km/h {data.userWindDir}
                </div>
              )}
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                {data.userCity}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>
              →
            </div>

            {/* Greek weather */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24 }}>☀️</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, color: GOLD, fontWeight: 300 }}>
                {data.greekTemp}°C
              </div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 8, color: `${GOLD}60`, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                Greek Islands
              </div>
            </div>
          </div>

          {/* Message */}
          <div style={{ flex: 1.5 }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#fff', margin: '0 0 4px', fontWeight: 300, lineHeight: 1.4 }}>
              {data.diff > 15
                ? `It's ${data.userTemp}°C where you are. In Greece, it's ${data.greekTemp}°C and sunny.`
                : `Escape the grey. The Aegean is ${data.greekTemp}°C and waiting.`
              }
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: `${GOLD}70`, margin: 0, fontStyle: 'italic' }}>
              {data.diff > 20 ? 'You deserve warmth.' : 'Life is better on the water.'}
            </p>
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 6, right: 10,
          fontFamily: "'Montserrat', sans-serif", fontSize: 7,
          color: 'rgba(255,255,255,0.12)', letterSpacing: '0.1em',
        }}>
          ✕
        </div>
      </div>
    </div>
  );
}
