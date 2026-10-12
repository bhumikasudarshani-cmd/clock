const timeElement = document.querySelector('#time');
const periodElement = document.querySelector('#period');
const dateElement = document.querySelector('#date');
const timezoneElement = document.querySelector('#timezone');
const offsetElement = document.querySelector('#offset');
const dayProgressElement = document.querySelector('#day-progress');
const weekNumberElement = document.querySelector('#week-number');
const secondsProgressElement = document.querySelector('#seconds-progress');
const formatToggle = document.querySelector('#format-toggle');

let isTwentyFourHour = false;

function pad(value) {
  return String(value).padStart(2, '0');
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

function getWeekNumber(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - firstDay) / 86400000) + firstDay.getDay() + 1) / 7);
}

function getUtcOffset(date) {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  return `UTC ${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const displayHours = isTwentyFourHour ? hours : (hours % 12 || 12);
  const timeString = `${isTwentyFourHour ? pad(displayHours) : displayHours}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  timeElement.textContent = timeString;
  timeElement.dateTime = now.toISOString();
  periodElement.textContent = hours >= 12 ? 'PM' : 'AM';
  periodElement.hidden = isTwentyFourHour;
  dateElement.textContent = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(now);
  timezoneElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll('_', ' ');
  offsetElement.textContent = getUtcOffset(now);
  dayProgressElement.textContent = `Day ${getDayOfYear(now)} of ${new Date(now.getFullYear(), 11, 31).getDate() === 31 ? (new Date(now.getFullYear(), 1, 29).getDate() === 29 ? 366 : 365) : 365}`;
  weekNumberElement.textContent = `Week ${pad(getWeekNumber(now))}`;
  secondsProgressElement.style.width = `${(now.getSeconds() / 59) * 100}%`;
}

formatToggle.addEventListener('click', () => {
  isTwentyFourHour = !isTwentyFourHour;
  formatToggle.setAttribute('aria-pressed', String(isTwentyFourHour));
  formatToggle.firstChild.textContent = isTwentyFourHour ? '12 hour ' : '24 hour ';
  updateClock();
});

updateClock();
setInterval(updateClock, 1000);