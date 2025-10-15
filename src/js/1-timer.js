import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const calendar = document.querySelector('input[type="text"]');
const startBtn = document.querySelector("button[data-start]")
startBtn.disabled = true;

let userSelectedDate = Date.now();

const options = {
    enableTime: true,
    time_24hr: true,
    dateFormat: 'd-m-Y   H:i',
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < Date.now()) {
            startBtn.disabled = true;
            iziToast.show({
                title: 'Hey',
                message: 'Please choose a date in the future',
                position: `topRight`,
                messageColor: '#fffc3aff',
                backgroundColor: "#ec3939",
            });
        } else {
            userSelectedDate = selectedDates[0];
            startBtn.disabled = false;
        }
    },
};

flatpickr(calendar, options);


let deltaTime = 0;
class Timer {

    constructor({ onTick }) {
        
        this.onTick = onTick;
        this.isActive = false;
        this.intervalId = null;
        this.init();
    }

    init() {
        const time = this.getTimeComponent(0);
        this.onTick(time);
    }

    start() {
        if(this.isActive) {
            return;
        }

        this.isActive = true;
        const startTime = Date.now();
        calendar.disabled = true;
        startBtn.disabled = true;
        
        this.intervalId = setInterval(() => {
            const currentTime = Date.now();
            deltaTime = userSelectedDate - currentTime;
            if (deltaTime <= 0) {
                this.stop();
                iziToast.show({
                    title: "IT's TIME !!!",
                    position: "topLeft"
                });
                return;
            };
            const time = this.getTimeComponent(deltaTime);
            
            this.onTick(time);
        }, 1000)
    }

    stop() {
        clearInterval(this.intervalId);
        this.init();
        this.isActive = false;
        calendar.disabled = false;
    }

    getTimeComponent(time) {

  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
    const day = hour * 24;
    

  // Remaining days
  const days = this.addLeadingZero(Math.floor(time / day));
  // Remaining hours
  const hours = this.addLeadingZero(Math.floor((time % day) / hour));
  // Remaining minutes
  const minutes = this.addLeadingZero(Math.floor(((time % day) % hour) / minute));
  // Remaining seconds
  const seconds = this.addLeadingZero(Math.floor((((time % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
    }

    addLeadingZero(value) {
        return String(value).padStart(2, "0");
    }
}

const timer = new Timer({
    onTick: updateClockface
});


startBtn.addEventListener("click", timer.start.bind(timer));

function updateClockface({ days, hours, minutes, seconds }) {
    document.querySelector('.value[data-days]').textContent = days;
    document.querySelector('.value[data-hours]').textContent = hours;
    document.querySelector('.value[data-minutes]').textContent = minutes;
    document.querySelector('.value[data-seconds]').textContent = seconds;
}