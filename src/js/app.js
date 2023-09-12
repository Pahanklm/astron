import * as flsFunctions from "./modules/functions.js";
import mixitup from 'mixitup';
import Choices from 'choices.js';
import Accordion from 'accordion-js';



flsFunctions.isWebp();

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    loop: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });


  // swiper-end

  iziToast.settings({
    title: 'Дякуємо!',
    message: "Невдовзі наш менеджер з вами зв'яжеться",
    color: 'green', // Цвет фона уведомления
    position: 'bottomRight', // Позиция на экране
    timeout: 5000, // Время показа (в миллисекундах)
    pprogressBarColor: 'rgb(173, 216, 230)', // Цвет полосы загрузки
    // Другие опции и настройки
  });

  // izi-toast-end


  const selectElement = document.getElementById('Select');
  const choices = new Choices(selectElement, {
    allowHTML: true,
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
  });

  const selectElementModal = document.getElementById('Select-modal');
  let choicesModal = new Choices(selectElementModal, {
    allowHTML: true,
    searchEnabled: false,
    itemSelectText: '',
    shouldSort: false,
  });
  // choices-end

  new Accordion('.accordion-container', {
  });
  // accordion-end

  const containerEl = document.querySelector('.images__container');
  const filterButtons = document.querySelectorAll('.control'); // Получаем все кнопки фильтров

  let activeFilter = '.зLogo';
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
      filter: '.зLogo'
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
    const emptyItems = document.querySelectorAll('.empty');
    emptyItems.forEach((emptyItem) => {
      emptyItem.remove();
    });
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
          extraItem.classList.add('empty');
          // Здесь вы можете настроить содержимое дополнительных элементов, например, изображение
          extraItem.innerHTML = `
            <div class="image-border">
              <img src="img/mixer/error.png" alt="sample">
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



  const forms = document.querySelectorAll('.send__message-form'); // Выбираем обе формы

  forms.forEach((form) => {
    const nameInput = form.querySelector('.name-input');
    const phoneInput = form.querySelector('.phone-input');
    const textarea = form.querySelector('.send__message-textarea');
    const radioButtons = form.querySelectorAll('input[name="image-radio"]');
    const submitButton = form.querySelector('.send__message-btn');
    const nameError = form.querySelector('.send__message-error#nameError');
    const nameErrorlength = form.querySelector('.send__message-error#nameErrorlength');
    const nameErrorEmpty = form.querySelector('.send__message-error#nameErrorEmpty');
    const phoneError = form.querySelector('.send__message-error#phoneError');
    const phoneErrorEmpty = form.querySelector('.send__message-error#phoneErrorEmpty');
    let selectedRadio = form.querySelector('input[name="image-radio"]:checked');



    function showErrorMessage(inputElement, errorMessage) {
      inputElement.classList.add('error');
      errorMessage.style.display = 'block';
    }

    function hideErrorMessage(inputElement, errorMessage) {
      inputElement.classList.remove('error');
      errorMessage.style.display = 'none';
    }

    phoneInput.addEventListener('mousedown', function (event) {
      // Предотвращаем начало выделения текста при клике
      event.preventDefault();
    });

    phoneInput.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
      }
    });

    phoneInput.addEventListener('click', function () {
      placeCursorAtEnd(phoneInput);
    });

    function placeCursorAtEnd(input) {
      input.focus(); // Устанавливаем фокус на поле ввода
      const length = input.value.length; // Получаем длину значения в поле
      input.setSelectionRange(length, length); // Устанавливаем курсор в конец строки
    }

    let lastValue = ''; // Сохраняем последнее введенное значение

    function addPrefix() {
      if (!phoneInput.value.startsWith('+38 (')) {
        phoneInput.value = '+38 (';
        phoneInput.setSelectionRange(6, 6); // Помещаем курсор после открывающей скобки
      }
    }

    function formatePhone(event) {
      const phoneLength = phoneInput.value.length;
      let phoneValue = phoneInput.value;

      phoneValue = phoneValue.replace(/[^0-9+ ()]/g, '');

      if (phoneLength === 9 && event.key !== ' ') {
        phoneValue = phoneValue.slice(0, 9) + ' ' + phoneValue.slice(9);
      }

      if (event.key === 'Backspace' && phoneLength === 10) {
        phoneValue = phoneValue.slice(0, -2);
      }
      if (event.key === 'Backspace' && (phoneLength === 14 || phoneLength === 17)) {
        phoneValue = phoneValue.slice(0, -1);
      }
      if (phoneLength === 5) {
        if (event.key !== '0') {
          event.preventDefault();
        }
      }
      if (phoneLength === 8) {
        phoneValue += ') ';
      }
      if (phoneLength === 13) {
        phoneValue += ' ';
      }
      if (phoneLength === 16) {
        phoneValue += ' ';
      }

      if (phoneLength > 19) {
        phoneValue = phoneValue.slice(0, 19);
      }

      phoneInput.value = phoneValue;
    }

    function preventRemovalOfPrefix(event) {
      const phoneValue = phoneInput.value;
      const prefix = '+38 (';

      if (!phoneValue.startsWith(prefix)) {
        phoneInput.value = prefix;
      }
    }

    phoneInput.addEventListener('input', preventRemovalOfPrefix);

    phoneInput.addEventListener('keydown', formatePhone);

    phoneInput.addEventListener('input', function (event) {
      formatePhone(event); // Передаем объект события event
      if (phoneInput.value.length < lastValue.length) {
        // Пользователь удалил символ, не обновляем форматирование
        lastValue = phoneInput.value;
        return;
      }

      checkFields();
    });

    phoneInput.addEventListener('focus', addPrefix);

    function checkFields() {
      const nameValue = nameInput.value.trim();
      const phoneValue = phoneInput.value.trim();
      const noEnglish = /^[а-яА-ЯёЁіІїЇґҐ\s'-]+$/u.test(nameValue);
      const nameLength = /^.{3,15}$/.test(nameValue);
      const phoneValid = /^\+38 \(\d{3}\) \d{3} \d{2} \d{2}$/.test(phoneValue);

      if (!nameValue) {
        showErrorMessage(nameInput, nameErrorEmpty);
      } else {
        hideErrorMessage(nameInput, nameErrorEmpty);
      }

      if (!noEnglish && nameValue) {
        showErrorMessage(nameInput, nameError);
      } else {
        hideErrorMessage(nameInput, nameError);
      }
      if (!nameLength && nameValue && noEnglish) {
        showErrorMessage(nameInput, nameErrorlength);
      } else {
        hideErrorMessage(nameInput, nameErrorlength);
      }

      if (!phoneValue) {
        showErrorMessage(phoneInput, phoneErrorEmpty);
      } else {
        hideErrorMessage(phoneInput, phoneErrorEmpty);
      }
      if (!phoneValid && phoneValue) {
        showErrorMessage(phoneInput, phoneError);
      } else {
        hideErrorMessage(phoneInput, phoneError);
      }

      if (!nameValue || !phoneValue || !noEnglish || !nameLength || !phoneValid) {
        submitButton.setAttribute('disabled', 'disabled');
      } else {
        submitButton.removeAttribute('disabled');
      }
    }

    nameInput.addEventListener('input', checkFields);


    radioButtons.forEach((radioButton) => {
      radioButton.addEventListener('click', function () {
        radioButtons.forEach((rb) => {
          rb.checked = false;
        });
        this.checked = true;
        selectedRadio = this; // Обновляем значение selectedRadio при клике
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      let selectedElement;
      if (form.id === 'form1') {
        selectedElement = choices.itemList.element.innerText
      } else if (form.id === 'form2') {
        selectedElement = choicesModal.itemList.element.innerText;
      }



      const botToken = '6405324996:AAHLBZFVoohzrqeSfC43aSFGdakbo2bkJQA';
      const chatId = '1386471978'; // Замените на свой chat_id
      const message = `
      Нове замовлення

      Ім'я: ${nameInput.value}
      Телефон: ${phoneInput.value} 
      Послуга: ${selectedElement}
      Зв'язатися по: ${selectedRadio.value}
      Коментар : ${textarea.value}`;

      axios
        .post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          chat_id: chatId,
          text: message,
        })
        .then((response) => {
          nameInput.value = '';
          phoneInput.value = '';
          textarea.value = '';

          modal.style.opacity = "0";
          modal.classList.remove("modal-open");
          modal.classList.add("modal-closed");
          submitButton.setAttribute('disabled', 'disabled');
          document.body.style.overflow = 'auto';
          iziToast.show()

        })
        .catch((error) => {
          modal.style.opacity = "0";
          modal.classList.remove("modal-open");
          modal.classList.add("modal-closed");
          document.body.style.overflow = 'auto';
          iziToast.error({
            title: 'Ошибка',
            message: 'Ошибка при отправке сообщения',
            position: 'topCenter',
            icon: 'fa fa-times',
            timeout: 3000,
            color: 'red',
          })
        });
    });
  });

  const form2 = document.querySelector('#form2'); // Добавьте эту строку, чтобы получить доступ к форме с id="form2"
  const modalButtons = document.querySelectorAll('.open-modal-button');
  const modalButtonsWithContent = document.querySelectorAll('.open-modal-button-with-content');
  const textarea = form2.querySelector('.send__message-textarea'); // Используйте form2 для получения textarea
  const modal = document.getElementById("myModal");
  modal.style.opacity = "0"; // Устанавливаем начальную прозрачность на 0

  modalButtons.forEach(function (button) {
    button.onclick = function () {
      modal.style.opacity = "1"; // Устанавливаем прозрачность на 1, чтобы сделать его видимым
      modal.classList.add("modal-open");
      modal.classList.remove("modal-closed");
      textarea.value = '';
      document.body.style.overflow = 'hidden';
    };
  });

  modalButtonsWithContent.forEach(function (button) {
    button.onclick = function () {
      modal.style.opacity = "1";
      modal.classList.add("modal-open");
      modal.classList.remove("modal-closed");
      const textContent = this.firstElementChild.innerHTML.replace(/<br>/g, '').replace(/\s+/g, ' ').trim();
      textarea.value = textContent;
      const choicesDropdown = choices.dropdown.element;

      const choicesItems = Array.from(choicesDropdown.children[0].children)
        .map((item) => item.textContent);
      console.log(choicesItems);

      const controlItem = document.querySelector('.mixitup-control-active');
      const controlItemText = controlItem.textContent.replace(/<br>/g, '').replace(/\s+/g, ' ').trim()
      console.log(controlItemText);
      if (choicesItems.includes(controlItemText)) {
        choicesModal.itemList.element.innerText = controlItemText.trim();
      } else {
        console.log('Элемент не найден в списке choicesItems');
      }
      document.body.style.overflow = 'hidden';
    };
  });


  document.querySelector(".close").onclick = function () {
    modal.style.opacity = "0";
    modal.classList.remove("modal-open");
    modal.classList.add("modal-closed");
    document.body.style.overflow = 'auto';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.opacity = "0"; // Устанавливаем прозрачность на 0, чтобы спрятать его
      modal.classList.remove("modal-open");
      modal.classList.add("modal-closed");
      document.body.style.overflow = 'auto';
    }
  };
})



