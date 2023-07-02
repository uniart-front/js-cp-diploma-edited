/**
 * Делает HTTP-запрос к серверу для получения данных.
 *
 * @param {string} metod Метод запроса.
 * @param {string} url Адрес (URL)
 * @param {string} body Тело запроса.
 * @return {object} Promise, содержащий полученные данные.
 */
export function sendRequest(metod, url, body = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(metod, url);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onload = () => {
      if (xhr.status >= 400) {
        reject(xhr.response);
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject(xhr.response);
    };

    xhr.send(body);
  });
}
