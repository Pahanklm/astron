import * as flsFunctions from "./modules/functions.js";
import Swiper from 'swiper';
import mixitup from 'mixitup';
import Choices from 'choices.js';
import Accordion from 'accordion-js';

flsFunctions.isWebp();

document.addEventListener("DOMContentLoaded", function () {
  const swiper2 = new Swiper('.swiper', {
    slidesPerView: 3,
    loop: false,
  });


  // swiper-end

  new Accordion('.accordion-container', {
  });
  // accordion-end

  const containerEl = document.querySelector('.images__container');
  const filterButtons = document.querySelectorAll('.control'); // Получаем все кнопки фильтров

  let activeFilter = '.Круглі';
  let sameFilter = false;

  function doubleCLicked() {
    const filterValue = this.getAttribute('data-filter');

    if (filterValue !== activeFilter) {
      activeFilter = filterValue;
      sameFilter = true;
    } else {
      sameFilter = false;
    }
  }

  // Обработчик клика на кнопке фильтра
  filterButtons.forEach(button => {
    button.addEventListener('click', doubleCLicked);
  });

  const mixer = mixitup(containerEl, {
    animation: {
      enable: false // Отключение анимации
    },
    load: {
      filter: '.Круглі'
    },
    callbacks: {
      onMixEnd: (state) => {
        if (sameFilter) {
          currentPage = 1;
          const items = containerEl.querySelectorAll('.mix');
          items.forEach(item => item.classList.remove('current'));
          checkAndAddExtraItems();
          filteredItems();
          showItemsOnPage(currentPage);
          toggleButtons();
          enableFilterButtons();
        } else {
          enableFilterButtons()
          return;
        }
      },
      onMixStart: (state) => {
        disableFilterButtons()
      }
    }
  });


  function disableFilterButtons() {
    filterButtons.forEach(button => {
      button.disabled = true;
    });
  }

  function enableFilterButtons() {
    filterButtons.forEach(button => {
      button.disabled = false;
    });
  }





  // Настройки
  const itemsPerPage = 6; // Количество элементов на одной странице
  let currentPage = 1;    // Текущая страница

  // Элементы списка и кнопки
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');

  // добавляем для всех выбраных елементов класс current  

  function filteredItems() {
    const items = containerEl.querySelectorAll('.mix');
    const currentItems = [];

    items.forEach(item => {
      if (getComputedStyle(item).display !== 'none') {
        item.classList.add('current');
      }
    });
    items.forEach(item => {
      if (item.classList.contains('current')) {
        currentItems.push(item);
      }
    });

    return currentItems;
  }
  // Вызываем функцию для проверки и добавления дополнительных элементов
  checkAndAddExtraItems();


  // добавляем нумерацию страниц
  function updatePageNumbers() {
    const currentItems = filteredItems();
    const totalPages = Math.ceil(currentItems.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById('page-numbers');

    pageNumbersContainer.innerHTML = '';

    // Создаем кнопки для каждой страницы
    for (let i = 1; i <= totalPages; i++) {
      const pageNumberButton = document.createElement('button');
      pageNumberButton.textContent = i;
      pageNumberButton.addEventListener('click', (event) => {
        const clickedPage = parseInt(event.target.textContent, 10);
        currentPage = clickedPage; // Назначаем значение currentPage
        showItemsOnPage(currentPage);
        toggleButtons();
      });

      // Добавляем класс для анимации
      pageNumberButton.classList.add('button-animation');

      // Добавляем класс "active" для текущей страницы
      if (i === currentPage) {
        pageNumberButton.classList.add('active');
      }

      pageNumbersContainer.appendChild(pageNumberButton);
    }
  }


  // из всех current елементов выбираем первые itemsPerPage и даем им display flex 

  function showItemsOnPage(pageNumber) {
    const currentItems = filteredItems();
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Скрываем текущие элементы с анимацией
    const previousVisibleItems = document.querySelectorAll('.fade-in.show');
    previousVisibleItems.forEach(item => {
      item.classList.remove('show');
    });

    // Показываем новые элементы с анимацией
    for (let i = 0; i < currentItems.length; i++) {
      if (i >= startIndex && i < endIndex) {
        currentItems[i].style.display = 'flex';
        currentItems[i].classList.remove('hidden');
        // Добавляем класс, чтобы анимировать появление элемента
        currentItems[i].classList.add('fade-in');
        // Задержка для анимации каждого элемента (500 миллисекунд в данном случае)
        setTimeout(() => {
          currentItems[i].classList.add('show');
        }, 200 * (i - startIndex));
      } else {
        currentItems[i].style.display = 'none';
        currentItems[i].classList.add('hidden');
      }
    }
    updatePageNumbers(currentPage);
  }



  showItemsOnPage(currentPage);


  function toggleButtons() {
    const currentItems = filteredItems();

    // Проверяем, нужно ли отключить кнопку "Далее"
    if (currentPage * itemsPerPage >= currentItems.length) {
      nextButton.setAttribute('disabled', 'disabled');
    } else {
      nextButton.removeAttribute('disabled');
    }

    // Проверяем, нужно ли отключить кнопку "Назад"
    if (currentPage <= 1) {
      prevButton.setAttribute('disabled', 'disabled');
    } else {
      prevButton.removeAttribute('disabled');
    }
  }

  toggleButtons();

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      showItemsOnPage(currentPage);
      toggleButtons();
      updatePageNumbers(currentPage);
    }
  });

  // Обработчик события для кнопки "Далее"
  nextButton.addEventListener('click', () => {
    const currentItems = filteredItems();
    if (currentPage * itemsPerPage < currentItems.length) {
      currentPage++;
      showItemsOnPage(currentPage);
      toggleButtons();
      updatePageNumbers(currentPage);
    }
  });

  function findNextMultipleOfItemsPerPage(number) {
    const remainder = number % itemsPerPage;
    if (remainder === 0) {
      return number;
    } else {
      return number + (itemsPerPage - remainder);
    }
  }


  function checkAndAddExtraItems() {
    const currentItems = Array.from(filteredItems()); // Преобразуем NodeList в массив
    const totalCurrentItems = currentItems.length;
    const nextMultiple = findNextMultipleOfItemsPerPage(totalCurrentItems);

    // Если текущее количество элементов меньше, чем itemsPerPage
    if (currentItems.length < nextMultiple) {
      const numExtraItems = nextMultiple - currentItems.length;

      // Находим первый элемент с классом "current"
      const firstCurrentItem = document.querySelector('.current');

      if (firstCurrentItem) {
        const extraItemClass = firstCurrentItem.classList[1]; // Получаем второй класс первого элемента с классом "current"

        // Создаем и добавляем дополнительные элементы
        for (let i = 0; i < numExtraItems; i++) {
          const extraItem = document.createElement('div');
          extraItem.classList.add('mix');
          extraItem.classList.add(extraItemClass); // Добавляем класс из первого элемента с классом "current"
          extraItem.classList.add('filtr-item');
          // Здесь вы можете настроить содержимое дополнительных элементов, например, изображение
          extraItem.innerHTML = `
            <div class="image-border">
              <img src="img/mixer/error.png" alt="sample">
              <img src="@img/mixer/error.png" alt="sample">
              <img src="../img/mixer/error.png" alt="sample">
              <img src="../../img/mixer/error.png" alt="sample">
              <img src="/../img/mixer/error.png" alt="sample">
              <img src="@/img/mixer/error.png" alt="sample">
            </div>
          `;
          containerEl.appendChild(extraItem);

          // Добавляем новый элемент в массив currentItems
          currentItems.push(extraItem);
        }
      }
    }
  }









  // робота с аккордионом 
  const acElements = document.querySelectorAll('.ac');

  acElements.forEach((acElement) => {
    const triggerButton = acElement.querySelector('.ac-trigger');
    const acTitle = acElement.querySelector('.ac-title');

    triggerButton.addEventListener('click', function () {
      const isExpanded = triggerButton.getAttribute('aria-expanded') === 'false';

      // Изменяем атрибут aria-expanded
      triggerButton.setAttribute('aria-expanded', !isExpanded);

      // Добавляем/удаляем класс active в зависимости от состояния
      triggerButton.classList.toggle('active', !isExpanded);
      acTitle.classList.toggle('active', !isExpanded);
    });
  });
})



const nameInput = document.getElementById('nameInput');
const phoneInput = document.getElementById('phoneInput');
const submitButton = document.getElementById('submitButton');
const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');

function showErrorMessage(inputElement, errorMessage) {
  inputElement.classList.add('error');
  errorMessage.style.display = 'block';
}

function hideErrorMessage(inputElement, errorMessage) {
  inputElement.classList.remove('error');
  errorMessage.style.display = 'none';
}

function checkFields() {
  const nameValue = nameInput.value.trim();
  const phoneValue = phoneInput.value.trim();

  const nameValid = /^[а-яА-ЯёЁіІїЇґҐ\s'-]{3,15}$/u.test(nameValue);
  const phoneValid = /^(?:(?:\+?380)|(?:380)|(?:0))(?:(\d{9})|(?:9\d{8}))$/.test(phoneValue);

  if (!nameValue) {
    showErrorMessage(nameInput, nameError);
  }
  else if (!nameValid) {
    showErrorMessage(nameInput, nameError);
  }
  else {
    hideErrorMessage(nameInput, nameError);
  }

  if (!phoneValue) {
    hideErrorMessage(phoneInput, phoneError);
  } else if (!phoneValid) {
    showErrorMessage(phoneInput, phoneError);
  } else {
    hideErrorMessage(phoneInput, phoneError);
  }


  if (!nameValue || !phoneValue || !nameValid || !phoneValid) {
    submitButton.setAttribute('disabled', 'disabled');
  } else {
    submitButton.removeAttribute('disabled');
  }
}

nameInput.addEventListener('input', checkFields);
phoneInput.addEventListener('input', checkFields);




const selectElement = document.getElementById('Select');
const choices = new Choices(selectElement, {
  allowHTML: true,
  searchEnabled: false,
  itemSelectText: '',
});