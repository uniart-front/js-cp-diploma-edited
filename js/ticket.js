let selectedMovie = JSON.parse(localStorage.getItem('selectedMovie'));
let selectChairs = JSON.parse(localStorage.getItem('selectChairs'));

const ticketTitle = document.querySelector('.ticket__title');
ticketTitle.textContent = selectedMovie.movieName;

const ticketChairs = document.querySelector('.ticket__chairs');
ticketChairs.textContent = selectChairs.chairs;

const ticketHall = document.querySelector('.ticket__hall');
ticketHall.textContent = selectedMovie.hallName.slice(4);

const ticketStart = document.querySelector('.ticket__start');
ticketStart.textContent = selectedMovie.seanceTime;

const ticketInfoQr = document.querySelector('.ticket__info-qr');
const stringQR = `Фильм: ${selectedMovie.movieName} Зал: ${selectedMovie.hallName} Места: ${selectChairs.chairs} Сеанс: ${selectedMovie.seanceId} Дата: ${selectedMovie.seanceDay}`;

const qrcode = QRCreator(stringQR, {
  mode: 4,
  eccl: 0,
  version: 8,
  mask: 2,
  image: 'png',
  modsize: 4,
  margin: 0,
});

const content = (qrcode) => {
  return qrcode.error
    ? `недопустимые исходные данные ${qrcode.error}`
    : qrcode.result;
};

ticketInfoQr.append(content(qrcode));