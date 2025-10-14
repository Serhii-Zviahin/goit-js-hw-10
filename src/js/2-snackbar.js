import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const delayUserSelected = form.querySelector('.delay');
const radioBtns = form.querySelectorAll('input[name="state"]');

let radioValue;

radioBtns.forEach(radio => {
    radio.addEventListener('change', handlerRadio)
});

function handlerRadio(event) {
    radioValue = event.target.value;
}

form.addEventListener('submit', amountDelay);

function amountDelay(event) {
    event.preventDefault();
    const delay = parseInt(delayUserSelected.value, 10);
    executePromise(delay, radioValue);
}

function executePromise(delay, radioValue) {

    const prom = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (radioValue === "fulfilled") {
                resolve(`✅ Fulfilled promise in ${delay}ms`);
            } else {
                reject(`❌ Rejected promise in ${delay}ms`);
            }
        }, delay);
    });

    prom
        .then(res => iziToast.show({
                    message: `${res}`,
                    position: `topRight`,
                    messageColor: '#fff',
                    backgroundColor: "#59A10D",
                    messageSize: '16px',
                }))
            // alert(res))
        .catch(error => iziToast.show({
                    message: `${error}`,
                    position: `topRight`,
                    messageColor: '#fff',
                    backgroundColor: "#B51B1B",
                    messageSize: '16px',
                }))

}