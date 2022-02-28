const START_SELECTOR = "span.checkin";
const END_SELECTOR = "span.checkout";
const LOCAL_STORAGE_KEY = "__meckano__script_globals";
const CLEAR_TIMES = false;

let globals = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {
  times: {
    start: {
      min: "09:00",
      max: "09:30",
    },
    end: {
      min: "18:00",
      max: "18:30",
    },
    interval: 10,
  },
};
localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(globals));

async function fillAllHours() {
  const { start, end, interval } = globals.times;
  //open times tab
  const timesTab = document.querySelector("#li-monthly-employee-report");
  if (!timesTab) return "no times tab";
  timesTab.click();
  const shouldChangeCount = await getInputsThatNeedChange();
  if (shouldChangeCount === 0) return "Success!";

  // edit all starting times
  await populateHourItems(START_SELECTOR, start, interval);

  // edit all ending times
  await populateHourItems(END_SELECTOR, end, interval);

  return fillAllHours();
}

async function getInputsThatNeedChange() {
  let rows = await forRowsToAppear();
  const pairs = getPairs(rows, START_SELECTOR).concat(
    getPairs(rows, END_SELECTOR)
  );
  return pairs.filter((pair) => getShouldChange(new Time(pair[0].textContent)))
    .length;
}

function getPairs(rows, selector) {
  return rows
    .filter(withoutWeekends)
    .map((row) => [
      row.querySelector(selector),
      row.querySelector(`${selector} + input`),
    ]);
}

async function populateHourItems(selector, minMaxTime, interval) {
  let rows = await forRowsToAppear();

  const length = getPairs(rows, selector).length;

  for (let i = 0; i < length; i++) {
    rows = await forRowsToAppear();
    const pairs = rows
      .filter(withoutWeekends)
      .map((row) => [
        row.querySelector(selector),
        row.querySelector(`${selector} + input`),
      ]);

    await populateOne(pairs[i], getRandomTime(minMaxTime, interval).getTime());
  }
}

async function populateOne(pair, time) {
  const [span, input] = pair;
  let shouldChangeValue = getShouldChange(new Time(span.textContent));
  if (!shouldChangeValue) return;

  span.click();
  input.value = CLEAR_TIMES ? "__:__" : time;
  input.dispatchEvent(new Event("blur"));
  await delay(500);
}

class Time {
  hours;
  minutes;
  constructor(timeStr) {
    const [hours = 0, minutes = 0] = timeStr.split(":");
    this.hours = +hours;
    this.minutes = +minutes;
  }

  addTime(time) {
    const [hours, minutes] = time.split(":");
    let newMinutes = parseInt(this.minutes) + parseInt(minutes);
    let newHours = parseInt(this.hours) + parseInt(hours);
    if (newMinutes > 59) {
      newMinutes -= 60;
      newHours++;
    }
    this.minutes = newMinutes;
    this.hours = newHours;
  }

  compareTime(time) {
    const { hours, minutes } = time;
    if (this.hours === hours) {
      if (this.minutes === minutes) {
        return 0;
      }
      return this.minutes > minutes ? 1 : -1;
    }
    return this.hours > hours ? 1 : -1;
  }

  getTime() {
    const [hours, minutes] = [
      this.hours.toString(),
      this.minutes.toString(),
    ].map((t) => t.padStart(2, "0"));
    return `${hours}:${minutes}`;
  }

  static isEmptyTime(time) {
    if (!time) return true;
    const emptyTime = "00:00";
    if (time.getTime() === emptyTime) return true;
    return false;
  }
}

function getRandomTime(minMaxTime, interval = 10) {
  const minTime = new Time(minMaxTime.min);
  const maxTime = new Time(minMaxTime.max);

  const times = [];
  while (minTime.compareTime(maxTime) <= 0) {
    times.push(new Time(minTime.getTime()));
    minTime.addTime(`00:${interval}`);
  }
  return times[getRandomInt(0, times.length)];
}

async function forRowsToAppear(count = 1) {
  const rows = document.querySelectorAll("[data-report_data_id]");
  if (!rows || !rows.length) {
    await delay(1000);
    return forRowsToAppear(count + 1);
  }
  return Array.from(rows);
}

//helper
function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//helper
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
// array.filter fn
function withoutWeekends(row) {
  if (CLEAR_TIMES) return true;
  return !(row.textContent.includes("ו") || row.textContent.includes("ש"));
}

function getShouldChange(time) {
  const isEmptyTime = Time.isEmptyTime(time);
  const res = CLEAR_TIMES !== isEmptyTime;
  return res;
}

function changeGlobals() {
  copyToClipboard(JSON.stringify(globals));
  alert(
    "Copied to clipboard! \n Feel free to edit it and paste it in the next alert"
  );
  const newGlobals = prompt("Paste the new globals here");
  try {
    const newGlobalsObj = JSON.parse(newGlobals);
    globals = newGlobalsObj;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(globals));
  } catch (err) {
    alert("Invalid JSON! (Retrying)");
    return changeGlobals();
  }
}
function copyToClipboard(text) {
  const elem = document.createElement("textarea");
  elem.value = text;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand("copy");
  document.body.removeChild(elem);
}

async function run() {
  alert("Meckano-me script");
  const skipAll = confirm("Skip all, and start?");
  if (!skipAll) {
    alert(`here's your config: \n${JSON.stringify(globals, null, 2)}`);

    const wantsToChange = confirm("wanna change any of that?");
    if (wantsToChange) changeGlobals();

    const wantsToStart = confirm(
      `${wantsToChange ? "Saved, " : " "}would you like to start?`
    );
    if (!wantsToStart) return alert("Ok, see you soon");
  }
  alert(
    "ok, let's go (Please let the browser work until you see another message like this)"
  );

  // var statusMsg = await fillAllHours();
  // alert(statusMsg);
}

run();
