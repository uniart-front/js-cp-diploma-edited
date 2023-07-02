export function createElement(tagName, className, parent) {
    const element = document.createElement(tagName);
    element.className = className;
    parent.append(element);
    return element;
  }
  
  /**
   * Создает разметку для навигационных элементов с датами.
   *
   * @param {object} date экземпляр объекта Date.
   * @return {string} сформированную строку разметки.
   */
  export function createDateElementHTML(date) {
    const day = date.getDate();
    const weekday = date.toLocaleString('ru-Ru', {
      weekday: 'short',
    });
  
    return `
      <span class="page-nav__day-week">${weekday}</span>
      <span class="page-nav__day-number">${day}</span>
    `;
  }
  
  /**
   * Добавляем дата-атрибуты для навигационных элементов с датами.
   *
   * @param {object} elemnt элемент разметки, которому необходимо добавить атрибуты
   * @param {number} year год в числовом формате
   * @param {number} month месяц в числовом формате
   * @param {number} day месяц в числовом формате
   */
  export function createDateElementDataAttributes(elemnt, year, month, day) {
    elemnt.dataset.year = year;
    elemnt.dataset.month = month;
    elemnt.dataset.day = day;
  }