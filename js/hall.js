import { sendRequest } from './sendRequest.js';

const requestURL = 'https://jscp-diplom.netoserver.ru/';

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('selectChairs');
});

const buyingSeanceTitle = document.querySelector('.buying__info-title');
const buyingSeanceStart = document.querySelector('.buying__info-start');
const buyingSeanceHall = document.querySelector('.buying__info-hall');
const confStepWrapper = document.querySelector('.conf-step__wrapper');
const priceStandart = document.querySelector('.price-standart');
const priceVip = document.querySelector('.price-vip');
const acceptinLink = document.querySelector('.acceptin-link');
const acceptinButton = document.querySelector('.acceptin-button');

const selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
const selectChairs = { chairs: [], price: 0 };

buyingSeanceTitle.textContent = selectedMovie.movieName;
buyingSeanceStart.textContent = `Начало сеанса: ${selectedMovie.seanceTime}`;
buyingSeanceHall.textContent = selectedMovie.hallName;
priceStandart.textContent = selectedMovie.priceStandart;
priceVip.textContent = selectedMovie.priceVip;

function updateLocal() {
  localStorage.setItem('selectChairs', JSON.stringify(selectChairs));
  localStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
}

const params = `event=get_hallConfig&timestamp=${selectedMovie.seanceStart}&hallId=${selectedMovie.hallId}&seanceId=${selectedMovie.seanceId}`;

sendRequest('POST', requestURL, params)
  .then((data) => {
    if (data) {
      confStepWrapper.innerHTML = data;
    } else {
      confStepWrapper.innerHTML = selectedMovie.hallConfig;
    }

    const confStepChairList = Array.from(
      document.querySelectorAll('.conf-step__chair')
    );
    const confStepRowList = Array.from(
      document.querySelectorAll('.conf-step__row')
    );

    confStepRowList.forEach((row, index) => {
      row.dataset.number = index + 1;
      const chairsInRow = Array.from(row.querySelectorAll('.conf-step__chair'));
      chairsInRow
        .filter((chair) => {
          return !chair.classList.contains('conf-step__chair_disabled');
        })
        .forEach((chair, index) => {
          chair.dataset.number = index + 1;
        });
    });

    confStepChairList.forEach((chair) => {
      chair.addEventListener('click', () => {
        chair.classList.toggle('conf-step__chair_selected');
        const selectChair = chair.dataset.number;
        const selectRow = chair.closest('.conf-step__row').dataset.number;
        const priceSelectChair = chair.classList.contains(
          'conf-step__chair_standart'
        )
          ? Number(selectedMovie.priceStandart)
          : Number(selectedMovie.priceVip);

        if (chair.classList.contains('conf-step__chair_selected')) {
          selectChairs.price = selectChairs.price + priceSelectChair;
          selectChairs.chairs.push(`${selectRow}/${selectChair}`);
          acceptinButton.disabled = false;
          updateLocal();
        } else {
          const index = selectChairs.chairs.indexOf(
            `${selectRow}/${selectChair}`
          );
          selectChairs.chairs.splice(index, 1);
          selectChairs.price = selectChairs.price - priceSelectChair;
          if (selectChairs.chairs.length === 0) {
            acceptinButton.disabled = true;
          }
          updateLocal();
        }
      });
    });
  })
  .catch((err) => console.log(err));

acceptinLink.addEventListener('click', () => {
  const confStepChairSelectedList = document.querySelectorAll(
    '.conf-step__chair_selected'
  );
  confStepChairSelectedList.forEach((chair) => {
    chair.classList.remove('conf-step__chair_selected');
    chair.classList.add('conf-step__chair_taken');
  });

  selectedMovie.hallConfig = confStepWrapper.innerHTML;
  updateLocal();
});
