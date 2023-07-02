import { createElement } from './create-elements.js';
import { createDateElementHTML } from './create-elements.js';
import { createDateElementDataAttributes } from './create-elements.js';
import { sendRequest } from './sendRequest.js';

document.addEventListener('DOMContentLoaded', () => {
  localStorage.removeItem('selectedMovie');
});

const requestURL = 'https://jscp-diplom.netoserver.ru/';

const pageNav = document.querySelector('.page-nav');
const main = document.querySelector('.main');

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();
const currentWeekday = currentDate.toLocaleString('ru-Ru', {
  weekday: 'short',
});

let selectedYear = currentDate.getFullYear();
let selectedMonth = currentDate.getMonth();
let selectedDay = currentDate.getDate();

let infoAboutSelectedMovie = {
  movieName: '',
  hallName: '',
  hallId: '',
  hallConfig: '',
  priceStandart: '',
  priceVip: '',
  seanceId: '',
  seanceTime: '',
  seanceStart: '',
  seanceDay: '',
};

const pageNavDayToday = createElement(
  'a',
  'page-nav__day page-nav__day_today page-nav__day_chosen',
  pageNav
);

pageNavDayToday.href = '#';
pageNavDayToday.innerHTML = createDateElementHTML(new Date());
createDateElementDataAttributes(
  pageNavDayToday,
  currentYear,
  currentMonth,
  currentDay
);

for (let i = 1; i <= 6; i++) {
  const pageNavDay = createElement('a', 'page-nav__day', pageNav);

  pageNavDay.href = '#';
  pageNavDay.innerHTML = createDateElementHTML(
    new Date(currentYear, currentMonth, currentDay + i)
  );
  createDateElementDataAttributes(
    pageNavDay,
    currentYear,
    currentMonth,
    currentDay + i
  );
}

const pageNavDayList = Array.from(document.querySelectorAll('.page-nav__day'));

pageNavDayList.forEach((pageNavDay) => {
  pageNavDay.addEventListener('click', (event) => {
    event.preventDefault();
    pageNavDayList.forEach((element) => {
      element.classList.remove('page-nav__day_chosen');
    });

    pageNavDay.classList.add('page-nav__day_chosen');
    selectedYear = pageNavDay.dataset.year;
    selectedMonth = pageNavDay.dataset.month;
    selectedDay = pageNavDay.dataset.day;

    const movieSeancesTimeButtonArr = document.querySelectorAll(
      '.movie-seances__time-button'
    );

    movieSeancesTimeButtonArr.forEach((button) => {
      const movieSeancesTime = button.querySelector('.movie-seances__time');
      const seanceTimeArr = movieSeancesTime.textContent.split(':');
      const seanceTime = new Date(
        currentYear,
        currentMonth,
        currentDay,
        seanceTimeArr[0],
        seanceTimeArr[1]
      );

      button.disabled =
        currentDate.getTime() > seanceTime.getTime() &&
        Number(selectedDay) === currentDay
          ? true
          : false;
      // if (Number(selectedDay) !== currentDay) {
      //   button.disabled = false;
      // } else if (
      //   currentDate.getTime() > seanceTime.getTime() &&
      //   selectedDay == currentDay
      // ) {
      //   button.disabled = true;
      // }
    });
  });
});

const params = 'event=update';

sendRequest('POST', requestURL, params)
  .then((data) => {
    console.log(data);
    const filmsArr = data.films.result;
    const seancesArr = data.seances.result;
    const hallsArr = data.halls.result;

    filmsArr.forEach((film) => {
      const filmElement = createElement('section', 'movie', main);
      filmElement.dataset.id = film.film_id;

      const movieInfo = createElement('div', 'movie__info', filmElement);
      movieInfo.innerHTML = `
          <div class="movie__poster">
            <img
              class="movie__poster-image"
              alt="${film.film_name} постер"
              src="${film.film_poster}"
            />
          </div>
          <div class="movie__description">
            <h2 class="movie__title">
              ${film.film_name}
            </h2>
            <p class="movie__synopsis">
              ${film.film_description}
            </p>
            <p class="movie__data">
              <span class="movie__data-duration">${film.film_duration} минуты</span>
              <span class="movie__data-origin">${film.film_origin}</span>
            </p>
          </div>
        `;

      const seancesFilmArr = seancesArr.filter((seance) => {
        return seance.seance_filmid === film.film_id;
      });

      hallsArr.forEach((hall) => {
        if (hall.hall_open === '1') {
          const seancesFilmInHallArr = seancesFilmArr.filter((seance) => {
            return seance.seance_hallid === hall.hall_id;
          });

          if (seancesFilmInHallArr.length > 0) {
            const movieSeancesHall = createElement(
              'div',
              'movie-seances__hall',
              filmElement
            );
            movieSeancesHall.innerHTML = `<h3 class="movie-seances__hall-title" data-id=${
              hall.hall_id
            }>Зал ${hall.hall_name.slice(3)}</h3>`;

            const movieSeancesList = createElement(
              'ul',
              'movie-seances__list',
              movieSeancesHall
            );

            seancesFilmInHallArr.forEach((seance) => {
              const seanceTimeArr = seance.seance_time.split(':');
              const seanceTime = new Date(
                currentYear,
                currentMonth,
                currentDay,
                seanceTimeArr[0],
                seanceTimeArr[1]
              );
              const movieSeancesTimeBlock = createElement(
                'li',
                'movie-seances__time-block',
                movieSeancesList
              );

              const movieSeancesTimeButton = createElement(
                'button',
                'movie-seances__time-button',
                movieSeancesTimeBlock
              );

              movieSeancesTimeButton.disabled =
                currentDate.getTime() > seanceTime.getTime() ? true : false;
              movieSeancesTimeButton.innerHTML = `<a class="movie-seances__time" href="hall.html" data-seance-start=${seance.seance_start} data-seance-id=${seance.seance_id} disabled>${seance.seance_time}</a>`;
            });
          }
        }
      });
    });

    const movieSeancesLinksList = Array.from(
      document.querySelectorAll('.movie-seances__time')
    );

    movieSeancesLinksList.forEach((movieSeancesLink) => {
      movieSeancesLink.addEventListener('click', (event) => {
        const movie = event.target.closest('.movie');
        const movieTitle = movie.querySelector('.movie__title');
        const hall = event.target.closest('.movie-seances__hall');
        const hallTitle = hall.querySelector('.movie-seances__hall-title');

        const seanceStartHours = Math.trunc(
          Number(event.target.dataset.seanceStart) / 60
        );
        const seanceStartMinutes =
          Number(event.target.dataset.seanceStart) % 60;
        const seanceStartDate = new Date(
          selectedYear,
          selectedMonth,
          selectedDay,
          seanceStartHours,
          seanceStartMinutes
        );

        let hallConfig = '';
        let priceStandart = '';
        let priceVip = '';

        hallsArr.forEach((hall) => {
          if (hall.hall_id === hallTitle.dataset.id) {
            hallConfig = hall.hall_config;
            priceStandart = hall.hall_price_standart;
            priceVip = hall.hall_price_vip;
          }
        });

        infoAboutSelectedMovie.movieName = movieTitle.textContent.trim();
        infoAboutSelectedMovie.hallName = hallTitle.textContent.trim();
        infoAboutSelectedMovie.hallId = hallTitle.dataset.id;
        infoAboutSelectedMovie.hallConfig = hallConfig;
        infoAboutSelectedMovie.priceStandart = priceStandart;
        infoAboutSelectedMovie.priceVip = priceVip;
        infoAboutSelectedMovie.seanceId = event.target.dataset.seanceId;
        infoAboutSelectedMovie.seanceTime = event.target.textContent.trim();
        infoAboutSelectedMovie.seanceStart = String(
          seanceStartDate.getTime() / 1000
        );
        infoAboutSelectedMovie.seanceDay = seanceStartDate.toLocaleString('ru-Ru', {
          dateStyle: 'short',
        })

        localStorage.setItem(
          'selectedMovie',
          JSON.stringify(infoAboutSelectedMovie)
        );
      });
    });
  })
  .catch((err) => console.log(err));
