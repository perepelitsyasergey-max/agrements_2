// ===========================================================================================
// ДІСТАЄМО з html КНОПКИ ВКЛАДОК
// ===========================================================================================

// Наказуємо працівнику: "Піди на сторінку (document), знайди там за унікальним номером (getElementById)
// кнопку з назвою 'tab_agreements' і поклади її в постійну робочу коробку з назвою tabAgreements".
const btnTabAgreements = document.getElementById("btn_tab_agreements");
// Робимо те саме для другої кнопки: знаходимо її та створюємо для неї іменну коробку.
const btnTabCounterparties = document.getElementById("btn_tab_counterparties");
// Робимо те саме для третьої кнопки: знаходимо її та створюємо для неї іменну коробку.
const btnTabContracts = document.getElementById("btn_tab_contracts");
// Робимо те саме для четвертої кнопки: знаходимо її та створюємо для неї іменну коробку.
const btnTabLogs = document.getElementById("btn_tab_logs");

// ===========================================================================================
// ДІСТАЄМО з html САМІ КОНТЕЙНЕРИ, ЯКІ МІСТЯТЬ НАПОВНЕННЯ ВКЛАДОК
// ===========================================================================================

// Знаходимо на сторінці великий HTML-блок (div) угод і запам'ятовуємо його (за замовчуванням відкритий).
const boxTabAgreements = document.getElementById("box_tab_agreements");
// Знаходимо HTML-блок контрагентів, який за замовчуванням зараз закритий на замок через стилі.
const boxTabCounterparties = document.getElementById("box_tab_counterparties");
// Знаходимо HTML-блок контрагентів, який за замовчуванням зараз закритий на замок через стилі.
const boxTabContracts = document.getElementById("box_tab_contracts");
// Знаходимо HTML-блок журналу дій, який за замовчуванням зараз закритий на замок через стилі.
const boxTabLogs = document.getElementById("box_tab_logs");
// Витягуємо з HTMLсаму форму додавання контрагента (потрібна для збору даних та очищення полів)
const formAddCounterparty = document.getElementById("form_add_counterparty");

// ===========================================================================================
// ДІСТАЄМО з html ОБ'ЄКТИ ІЗ ВКЛАДКИ "КОНТРАГЕНТИ"
// ===========================================================================================
// Шукаємо кнопку "+ Додати контрагента"
const btnAddCounterparty = document.getElementById("btn_add_counterparty");

// ===========================================================================================
// ДІСТАЄМО ОБ'ЄКТИ МОДАЛЬНОГО ВІКНА ДОДАТИ КОНТРАГЕНТА
// ===========================================================================================

// Знаходимо прозорий темний фон, який обгортає наше біле вікно додавання контрагентів
const backgroundForModalWindowCounterparty = document.getElementById("background_for_modal_window_counterparty");
// Шукаємо кнопку-хрестик для закриття вікна додавання КОНТРАГЕНТА
const btnCloseModalWindowCounterparty = document.getElementById("btn_close_modal_window_counterparty");

// ===========================================================================================
// ДІСТАЄМО З HTML ПОЛЯ ВВЕДЕННЯ (ІНПУТИ) МОДАЛЬНОГО ВІКНА "ДОДАТИ КОНТРАГЕНТА"
// ===========================================================================================
//витягує коробку ТІЛЬКИ для ОДНОГО, найпершого (основного) поля телефону
const phoneInput = document.getElementById("input_counterparty_phone");
// Кнопка «Додати ще контакт» у модальному вікні "ДОДАТИ КОНТРАГЕНТА"
const btnAddMoreContacts = document.getElementById("btn_add_more_contacts");
// Контейнер, де будуть відображатися поля введення введення основного Телефону + ім'я + посада/нотатки та всіх додатково доданих таких полів
const contactsContainer = document.getElementById("contacts_container");
// Кнопка «Додати ще емейл» у модальному вікні "ДОДАТИ КОНТРАГЕНТА"
const btnAddMoreEmails = document.getElementById("btn_add_more_emails");
// Контейнер, де будуть відображатися поля введення введення основного емейлу + коментарів та всіх додатково доданих таких полів
const emailsContainer = document.getElementById("emails_container");

// Головна глобальна коробка, де будуть зберігатися всі завантажені контрагенти
let globalCounterparties = [];

// ===========================================================================================
// ФУНКЦІЯ, ЯКА ПРИЙМАЄ ЯК АРГУМЕНТ ВКЛАДКУ І РОБИТЬ ЇЇ АКТИВНОЮ (ВИДИМОЮ)
// ===========================================================================================
function switchTab(activePane) {
  // Спочатку приховуємо всі вкладки за допомогою "none"
  boxTabAgreements.style.display = "none";
  boxTabCounterparties.style.display = "none";
  boxTabContracts.style.display = "none";
  boxTabLogs.style.display = "none";

  //   А тепер беремо САМЕ ТУ вкладку, яку передали як аргумент в activePane,
  // та робимо її видимою
  activePane.style.display = "block";
}

// ================================================================================================
// ОБРОБНИКИ КЛІКІВ ПО КНОПКАХ НАВІГАЦІЇ ВКЛАДОК "УГОДИ" "КОНТРАГЕНТИ" "ДОГОВОРИ" "ЖУРНАЛ ДІЙ"
// ================================================================================================

//   Як тільки кнопка btnTabAgreements ("УГОДИ") буде натиснута і відбудеться click
// виконується функція switchTab, яка бере за аргумент вкладку boxTabAgreements ("УГОДИ"), активує та відображає її
btnTabAgreements.addEventListener("click", function () {
  switchTab(boxTabAgreements);
});

//   Як тільки кнопка btnTabCounterparties ("КОНТРАГЕНТИ") буде натиснута і відбудеться click
// виконується функція switchTab, яка бере за аргумент вкладку boxTabCounterparties ("КОНТРАГЕНТИ"), активує та відображає її
//   Паралельно функція loadCounterparties формує та відображає таблицю з даними про КОНТРАГЕНТІВ
btnTabCounterparties.addEventListener("click", function () {
  // 1. Спочатку перемикаємо ширму (показуємо кімнату контрагентів)
  switchTab(boxTabCounterparties);
  // 2. Одразу викликаємо кухонний комбайн для завантаження даних із сервера
  loadCounterparties();
});

//   Як тільки кнопка btnTabContracts ("ДОГОВОРИ") буде натиснута і відбудеться click
// виконується функція switchTab, яка бере за аргумент вкладку boxTabContracts ("ДОГОВОРИ"), активує та відображає її
btnTabContracts.addEventListener("click", function () {
  switchTab(boxTabContracts);
});

//   Як тільки кнопка btnTabLogs ("ЖУРНАЛ ДІЙ") буде натиснута і відбудеться click
// виконується функція switchTab, яка бере за аргумент вкладку boxTabLogs ("ЖУРНАЛ ДІЙ"), активує та відображає її
btnTabLogs.addEventListener("click", function () {
  switchTab(boxTabLogs);
});

// ============================================================================================
// ОБРОБНИКИ КЛІКІВ ПО КНОПЦІ ДОДАТИ КОНТРАГЕНТА
// ============================================================================================

btnAddCounterparty.addEventListener("click", function () {
  // Перевіряємо, чи є взагалі головна форма на складі, і скидаємо її стандартний текст
  if (formAddCounterparty) {
    formAddCounterparty.reset();
  }

  // Змиваємо додаткові рядки телефонів: перший (.contact-row під номером 0) залишаємо, а всі інші — видаляємо
  const phoneRows = document.querySelectorAll("#contacts_container .contact-row");
  for (let i = 1; i < phoneRows.length; i++) {
    phoneRows[i].remove();
  }

  // Змиваємо додаткові рядки емейлів: перший (.email-row під номером 0) залишаємо, а всі інші — видаляємо
  const emailRows = document.querySelectorAll("#emails_container .email-row");
  for (let i = 1; i < emailRows.length; i++) {
    emailRows[i].remove();
  }

  // Знімаємо замок 'none' і ставимо 'block' (чисте вікно додати контрагента з'являється)
  backgroundForModalWindowCounterparty.style.display = "block";
});

// ============================================================================================
// ОБРОБНИКИ КЛІКІВ ПО ХРЕСТИКУ ЗАКРИТИ ВІКНО "ДОДАТИ КОНТРАГЕНТА"
// ============================================================================================
btnCloseModalWindowCounterparty.addEventListener("click", function () {
  backgroundForModalWindowCounterparty.style.display = "none";
});

// ===========================================================================================
// ЛОГІКА ВВЕДЕННЯ ТА СТИРАННЯ НОМЕРУ ТЕЛЕФОНУ
// ===========================================================================================

if (phoneInput) {
  // Якщо курсор стоїть у полі введення, відразу прописуємо +380
  phoneInput.addEventListener("focus", function (e) {
    if (!e.target.value) e.target.value = "+380 ";
  });
  // 1. НАДІЙНИЙ СТАРТИЙ СОРТУВАЛЬНИК (Твоя перша версія)
  phoneInput.addEventListener("input", function (e) {
    let inputStr = e.target.value;

    // Очищаємо рядок: залишаємо ТІЛЬКИ цифри
    let digits = inputStr.replace(/\D/g, "");

    // Зрізаємо префікси, щоб не дублювалися
    if (digits.startsWith("380")) {
      digits = digits.substring(3);
    } else if (digits.startsWith("0")) {
      digits = digits.substring(1);
    }

    // Обмежуємо довжину чистого номера до 9 цифр
    digits = digits.substring(0, 9);

    // Збираємо красиве лекало
    let formatted = "";
    if (digits.length > 0) {
      formatted = "+380 (" + digits.substring(0, 2);
      if (digits.length >= 2) {
        formatted += ") ";
      }
    }
    if (digits.length > 2) {
      formatted += digits.substring(2, 5);
    }
    if (digits.length > 5) {
      formatted += "-" + digits.substring(5, 7);
    }
    if (digits.length > 7) {
      formatted += "-" + digits.substring(7, 9);
    }

    // Повертаємо результат у поле
    e.target.value = formatted;
  });

  // 2. ВАЖІЛЬ ДЛЯ КНОПКИ BACKSPACE (Дозволяє все стерти строго до +380)
  phoneInput.addEventListener("keydown", function (e) {
    let val = e.target.value;

    if (e.key === "Backspace") {
      // Якщо на екрані залишилася конструкція "+380 (96)" (довжина 10) або "+380 (9)" (довжина 9)
      // і користувач хоче її стерти — ми допомагаємо йому зрізати дужку без заклинювання курсора
      if (val.length === 10 || val.length === 9) {
        e.preventDefault(); // Зупиняємо стандартний затик браузера

        let digits = val.replace(/\D/g, "");
        if (digits.startsWith("380")) digits = digits.substring(3);

        // Викидаємо одну цифру з кінця вручну
        digits = digits.substring(0, digits.length - 1);

        // Оновлюємо поле
        if (digits.length > 0) {
          e.target.value = "+380 (" + digits;
        } else {
          e.target.value = "+380 ";
        }
        return;
      }

      // Захист межі: якщо на екрані залишилося тільки "+380 " або "+380", забороняємо прати далі
      if (val.length <= 6) {
        e.preventDefault();
        e.target.value = "+380 "; // Насильно тримаємо цю базу
      }
    }
  });

  // 1. НАДІЙНИЙ СОРТУВАЛЬНИК (Тепер повністю захищений від нуля попереду)
  phoneInput.addEventListener("input", function (e) {
    let inputStr = e.target.value;

    // Очищаємо рядок: залишаємо ТІЛЬКИ цифри
    let digits = inputStr.replace(/\D/g, "");

    // Спочатку перевіряємо і зрізаємо міжнародний префікс "380"
    if (digits.startsWith("380")) {
      digits = digits.substring(3);
    }

    // МАГІЧНЕ ВИПРАВЛЕННЯ: якщо після зрізання 380 (або якщо користувач просто почав писати 096...)
    // першою цифрою йде нуль — ми ЙОГО НЕГАЙНО ВИКИДАЄМО! Тому що нуль уже закладений у нашому "+380"
    if (digits.startsWith("0")) {
      digits = digits.substring(1);
    }

    // Тепер у нас в пам'яті чисті 9 цифр коду та номера (наприклад: 966456329)
    digits = digits.substring(0, 9);

    // Збираємо красиве лекало
    let formatted = "+380 ";
    if (digits.length > 0) {
      formatted += "(" + digits.substring(0, 2);
    }
    if (digits.length >= 2) {
      formatted += ") ";
    }
    if (digits.length > 2) {
      formatted += digits.substring(2, 5);
    }
    if (digits.length > 5) {
      formatted += "-" + digits.substring(5, 7);
    }
    if (digits.length > 7) {
      formatted += "-" + digits.substring(7, 9);
    }

    // Повертаємо ідеальний результат у поле
    e.target.value = formatted;
  });
}

// ===========================================================================================
// ЛОГІКА ДИНАМІЧНОГО ДОДАВАННЯ + ВИДАЛЕННЯ ДОДАТКОВИХ РЯДКІВ З ПОЛЯМИ ТЕЛЕФОНІВ
// ЛОГІКА ВВЕДЕННЯ ТА СТИРАННЯ НОМЕРУ ТЕЛЕФОНУ В ДОДАТКОВО ДОДАНОМУ ПОЛІ
// ===========================================================================================

if (btnAddMoreContacts && contactsContainer) {
  btnAddMoreContacts.addEventListener("click", function () {
    // 1. Беремо найперший базовий рядок як зразок
    const firstRow = contactsContainer.querySelector(".contact-row");

    if (firstRow) {
      // 2. Робимо точний клон рядка
      const newRow = firstRow.cloneNode(true);

      // 3. Очищаємо всі поля введення в копії
      const newRowCleared = newRow.querySelectorAll("input");
      newRowCleared.forEach((input) => {
        input.value = "";
      });

      // 4. НАЛАШТОВУЄМО КНОПКУ ВИДАЛЕННЯ (ХРЕСТИК) ДЛЯ НОВОГО РЯДКА
      // Створюємо маленьку червону кнопку прямо з повітря
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML = "&times;"; // Красивий хрестик "×"

      // СУВОРІ ЛОКАЛЬНІ СТИЛІ КНОПКB ВИДАЛЕННЯ (ХРЕСТИК)
      deleteBtn.style.backgroundColor = "#dc3545"; // Червоний колір
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "4px"; // Робимо її акуратною квадратною
      deleteBtn.style.width = "38px"; // Висота точно під розмір наших інпутів
      deleteBtn.style.height = "38px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "20px";
      deleteBtn.style.display = "flex";
      deleteBtn.style.alignItems = "center";
      deleteBtn.style.justifyContent = "center";

      // Наші поля мають відступи знизу, тому підрівняємо кнопку, щоб вона стояла на одній лінії з коробками
      deleteBtn.style.marginTop = "22px";

      // Інструкція для кнопки: видалити строго свій рідний рядок, у якому вона сидить
      deleteBtn.addEventListener("click", function () {
        newRow.remove();
      });

      // Приклеюємо кнопку праворуч всередину нашого рядка-конвеєра
      newRow.appendChild(deleteBtn);

      // ===========================================================================================
      // Логіка введення та стирання номеру телефону на НОВОМУ полі
      // ===========================================================================================
      const newPhoneInput = newRow.querySelector(".input_contact_phone");
      //Якщо наявне поле введення
      if (newPhoneInput) {
        // Як тільки користувач ставить курсор в поле телефону відразу прописуємо: +380
        newPhoneInput.addEventListener("focus", function (e) {
          if (!e.target.value) e.target.value = "+380 ";
        });

        // ===========================================================================================
        // Логіка формату введення додаткових номерів телефонів
        // ===========================================================================================
        newPhoneInput.addEventListener("input", function (e) {
          let inputStr = e.target.value; // Беремо сировину (все, що ввів користувач)
          let digits = inputStr.replace(/\D/g, ""); // Очищення: викидаємо всі букви, пробіли, залишаємо ТІЛЬКИ чисті цифри
          if (digits.startsWith("380")) digits = digits.substring(3); // Якщо користувач випадково сам почав писати 380, ми відрізаємо цей шматок, щоб він не дублювався
          if (digits.startsWith("0")) digits = digits.substring(1); // Якщо користувач за звичкою почав писати з нуля (096...), ми цей нуль теж викидаємо, бо нуль уже є у нашому головному префіксі +380
          digits = digits.substring(0, 9); // Жорстко обрізаємо сировину! Дозволяємо залишити максимум 9 чистих цифр коду та номера (наприклад: 966456329)

          // Збираємо з чистих цифр красивий номер на екран, підставляючи дужки та дефіси на ходу:
          let formatted = "+380 ";
          if (digits.length > 0) formatted += "(" + digits.substring(0, 2);
          if (digits.length >= 2) formatted += ") ";
          if (digits.length > 2) formatted += digits.substring(2, 5);
          if (digits.length > 5) formatted += "-" + digits.substring(5, 7);
          if (digits.length > 7) formatted += "-" + digits.substring(7, 9);
          e.target.value = formatted; // Покзуємо цей гарний результат користувачеві на екрані
        });

        // ===========================================================================================
        // Логіка стирання номеру телефону
        // ===========================================================================================
        // Наказуємо працівнику: "Постійно стеж за клавіатурою. Як тільки користувач натисне будь-яку кнопку в цьому полі — читай інструкцію далі"
        newPhoneInput.addEventListener("keydown", function (e) {
          let val = e.target.value; // Працівник бере тимчасову коробку "val" і копіює туди весь текст, який зараз видно на екрані

          // Перевіряємо: якщо користувач натиснув саме кнопку стирання (Backspace)
          if (e.key === "Backspace") {
            // Якщо на екрані зараз рівно 9 або 10 символів (тобто користувач намагається стерти цифри коду оператора)
            if (val.length === 10 || val.length === 9) {
              e.preventDefault(); // Наказуємо працівнику: "Гальмуй! Заблокуй стандартне стиралка браузера, бо вона зламає нам дужки"

              let digits = val.replace(/\D/g, ""); // Беремо текст, кидаємо в очищувач і залишаємо ТІЛЬКИ чисті цифри (коробка "digits")

              // Якщо на початку стоїть код країни 380 — відрізаємо його, він недоторканний
              if (digits.startsWith("380")) digits = digits.substring(3);

              // Тепер працівник вручну забирає (викидає) одну останню цифру коду оператора
              digits = digits.substring(0, digits.length - 1);

              // Якщо в коробці ще залишилися якісь цифри коду — збираємо гарний рядок назад: "+380 (" + цифра
              if (digits.length > 0) e.target.value = "+380 (" + digits;
              // Якщо користувач вичистив усе під нуль — просто повертаємо на екран чисту порожню базу
              else e.target.value = "+380 ";

              return; // Наказ працівнику: "Завдання виконано, повертайся на пост, далі по коду йти не треба"
            }

            // Команда працівнику: «Якщо користувач стер майже все, і на екрані залишилося тільки +380 , заблокуй клавішу Backspace (e.preventDefault()), не дозволяй йому стерти код країни!
            if (val.length <= 6) {
              e.preventDefault();
              e.target.value = "+380 ";
            }
          }
        });
      }

      // Відправляємо готовий рядок з хрестиком на екран
      contactsContainer.appendChild(newRow);
    }
  });
}

// ===========================================================================================
// ЛОГІКА ДИНАМІЧНОГО ДОДАВАННЯ + ВИДАЛЕННЯ ДОДАТКОВИХ РЯДКІВ З ПОЛЯМИ ЕМЕЙЛІВ
// ===========================================================================================

if (btnAddMoreEmails && emailsContainer) {
  // Слухаємо клік по сірій кнопці-плюсу для емейлів
  btnAddMoreEmails.addEventListener("click", function () {
    // 1. Беремо найперший базовий рядок емейла як зразок
    const firstRow = emailsContainer.querySelector(".email-row");
    //Якщо найперший базовий рядок емейла наявний
    if (firstRow) {
      // 2. Робимо точний клон цього рядка разом із нутрощами
      const newRow = firstRow.cloneNode(true);

      // 3. Очищаємо всі поля введення в новому рядку, щоб вони були порожніми
      const inputs = newRow.querySelectorAll("input");
      inputs.forEach((input) => {
        input.value = "";
      });

      // 4. НАЛАШТОВУЄМО КНОПКУ ВИДАЛЕННЯ (ХРЕСТИК) ДЛЯ НОВОГО РЯДКА ЕМЕЙЛА
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML = "&times;"; // Малює хрестик "×"

      // Даємо кнопці такі ж суворі локальні стилі, як і для телефонів
      deleteBtn.style.backgroundColor = "#dc3545"; // Червоний колір
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "4px"; // Квадратна з м'якими кутами
      deleteBtn.style.width = "38px"; // Точно під висоту полів
      deleteBtn.style.height = "38px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.fontSize = "20px";
      deleteBtn.style.display = "flex";
      deleteBtn.style.alignItems = "center";
      deleteBtn.style.justifyContent = "center";
      deleteBtn.style.marginTop = "22px"; // Вирівнюємо по лінії з полями

      // Інструкція для хрестика: при кліку видалити саме цей рядок емейла
      deleteBtn.addEventListener("click", function () {
        newRow.remove();
      });

      // Приклеюємо червоний хрестик у самий кінець нашого нового рядка емейла
      newRow.appendChild(deleteBtn);

      // 5. Відправляємо готовий чистий рядок з хрестиком в депо-контейнер на екран
      emailsContainer.appendChild(newRow);
    }
  });
}

// ===========================================================================================
// ЛОГІКА ЗБОРУ ДАНИХ ФОРМИ "ДОДАТИ КОНТРАГЕНТА" ТА ВІДПРАВКА НА СЕРВЕР (FETCH)
// ===========================================================================================

if (formAddCounterparty) {
  // Слухаємо головну кнопку форми "Зберегти" (подія submit)
  formAddCounterparty.addEventListener("submit", function (e) {
    e.preventDefault(); // Забороняємо браузеру перезавантажувати сторінку по-старому

    // 1. Спочатку збираємо динамічні КОНТАКТИ (Телефони)
    const contactRows = document.querySelectorAll("#contacts_container .contact-row");
    //  # (решітка) означає, що ми шукаємо унікальний ID (id="contacts_container").
    //  Пробіл після решітки означає: «зайти всередину цього об'єкта».
    //  . (крапка) означає, що далі йде назва класу (class="contact-row").
    const contactsList = [];

    contactRows.forEach((row) => {
      const phoneVal = row.querySelector(".input_contact_phone").value.trim();
      const nameVal = row.querySelector(".input_contact_name").value.trim();
      const roleVal = row.querySelector(".input_contact_role").value.trim();

      // Записуємо в список тільки якщо працівник ввів хоча б телефон або ім'я
      if (phoneVal || nameVal) {
        contactsList.push({
          phone: phoneVal,
          name: nameVal,
          role: roleVal,
        });
      }
    });

    // 2. Тепер збираємо динамічні ЕМЕЙЛИ
    const emailRows = document.querySelectorAll("#emails_container .email-row");
    //  # (решітка) означає, що ми шукаємо унікальний ID (id="contacts_container").
    //  Пробіл після решітки означає: «зайти всередину цього об'єкта».
    //  . (крапка) означає, що далі йде назва класу (class="contact-row").
    const emailsList = [];

    emailRows.forEach((row) => {
      const emailVal = row.querySelector(".input_counterparty_email").value.trim();
      const commentVal = row.querySelector(".input_counterparty_email_comment").value.trim();

      // Записуємо в список тільки якщо поле емейла не порожнє
      if (emailVal) {
        emailsList.push({
          email: emailVal,
          comment: commentVal,
        });
      }
    });

    // 3. Пакуємо всю нашу велику валізу для відправки на сервер Flask
    const formData = {
      counterparty_name: document.getElementById("input_counterparty_name").value.trim(),
      counterparty_edrpou: document.getElementById("input_counterparty_edrpou").value.trim(),
      counterparty_tax_number: document.getElementById("input_counterparty_tax_number").value.trim(),
      counterparty_delivery_address: document.getElementById("input_counterparty_delivery_address").value.trim(),
      counterparty_notes: document.getElementById("input_counterparty_notes").value.trim(),

      // Сюди кладемо наші готові списки-коробки:
      contacts: contactsList,
      emails: emailsList,
    };

    // 2. Відправляємо нашого кур'єра (fetch) на сервер Flask за адресою /add_counterparty
    fetch("/add_counterparty", {
      method: "POST", // Метод доставки - посилка (POST)
      headers: {
        "Content-Type": "application/json", // Попереджаємо сервер, що всередині пакунка лежить JSON-формат
      },
      body: JSON.stringify(formData), // Перетворюємо наш об'єкт на текстовий рядок для транспортування
    })
      .then((response) => response.json()) // Чекаємо відповідь від сервера і розпаковуємо її
      .then((data) => {
        if (data.status === "success") {
          alert(data.message); // Показуємо працівнику віконце: "Контрагента успішно створено!"

          // Очищаємо всі поля форми, щоб вона стала знову порожньою
          formAddCounterparty.reset();

          // Ховаємо модальне вікно назад (повертаємо замок none)
          document.getElementById("background_for_modal_window_counterparty").style.display = "none";

          // Тут згодом ми додамо оновлення таблиці на екрані
          loadCounterparties();
        } else {
          alert("Помилка сервера: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Кур'єр загубився в дорозі:", error);
        alert("Не вдалося зв'язатися з сервером.");
      });
  });
}

// ===========================================================================================
// КУХОННИЙ КОМБАЙН: ЗАВАНТАЖЕННЯ СПИСКУ КОНТРАГЕНТІВ ІЗ СЕРВЕРА
// ===========================================================================================
function loadCounterparties() {
  // 1. Відправляємо кур'єра (fetch) на сервер за адресою /get_counterparties
  fetch("/get_counterparties", {
    method: "GET", // Просто просимо дати нам дані
  })
    .then((response) => response.json()) // Чекаємо відповідь і розпаковуємо текстовий JSON у звичайний об'єкт
    .then((data) => {
      globalCounterparties = data.counterparties;
      if (data.status === "success") {
        // Якщо сервер успішно віддав коробку з контрагентами —
        // передаємо цей список нашому майбутньому будівельнику таблиці
        renderCounterpartiesTable(data.counterparties);
      } else {
        console.error("Сервер повернув помилку при завантаженні:", data.message);
      }
    })
    .catch((error) => {
      console.error("Кур'єр не зміг забрати контрагентів з сервера:", error);
    });
}

// ===========================================================================================
// МАЙСТЕР-БУДІВЕЛЬНИК: МАЛЮЄМО ТАБЛИЦЮ КОНТРАГЕНТІВ З ГАЛОЧКАМИ ДЛЯ ВИДІЛЕННЯ
// ===========================================================================================
function renderCounterpartiesTable(counterparties) {
  // 1. Шукаємо порожнє депо (tbody) в нашій HTML-таблиці
  const tableBody = document.getElementById("counterparties_table_body");

  // Чистимо депо від старого мотлоху перед завантаженням нових рядків
  tableBody.innerHTML = "";

  // 2. Якщо склад порожній (фірм немає) — виводимо напис-підказку на всю ширину
  if (counterparties.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 15px;">
                    Контрагентів поки що немає. Натисніть кнопку вище, щоб додати першого!
                </td>
            </tr>
        `;
    return; // Зупиняємо конвеєр, бо будувати нічого
  }

  // 3. Конвеєром перебираємо кожну картку фірми з надісланої сервером коробки
  counterparties.forEach((cp) => {
    // --- КРОК A: ГОТУЄМО КОНТЕЙНЕР ДЛЯ ТЕЛЕФОНІВ ---
    let phonesHTML = "";
    if (cp.phones && cp.phones.length > 0) {
      const totalPhonesCount = cp.phones.length;

      // УВАГА: Обов'язково ставимо тут знак рівності "="
      phonesHTML = `
                <div class="clickable-contact-box" data-id="${cp.id}" data-type="phones" style="cursor: pointer; color: #0066cc; display: inline-flex; align-items: center; gap: 5px; font-weight: bold; background-color: #e6f2ff; padding: 4px 8px; border-radius: 4px;">
                    <span>📞</span>
                    <span style="text-decoration: underline;">${totalPhonesCount}</span>
                </div>
            `;
    } else {
      phonesHTML = '<span style="color: #999;">Немає контактів</span>';
    }

    // --- КРОК Б: ГОТУЄМО КОНТЕЙНЕР ДЛЯ ЕМЕЙЛІВ ---
    let emailsHTML = "";
    if (cp.emails && cp.emails.length > 0) {
      const firstEmail = cp.emails[0].email;
      const extraCount = cp.emails.length - 1;
      emailsHTML = `
                <div class="clickable-contact-box" data-id="${cp.id}" data-type="emails" style="cursor: pointer; color: #0066cc; text-decoration: underline;">
                    ${firstEmail} ${extraCount > 0 ? `(+${extraCount})` : ""}
                </div>
            `;
    } else {
      emailsHTML = "<span style='color: #999;'>Немає пошти</span>";
    }

    // --- КРОК В: ЗБИРАЄМО РЯДОК З ПЕРСОНАЛЬНОЮ ГАЛОЧКОЮ ---
    const row = document.createElement("tr");

    // Перша клітинка тепер тримає чекбокс. У його мітку value ми намертво зашиваємо ID контрагента!
    row.innerHTML = `
            <td style="padding: 10px; text-align: center;">
                <input type="checkbox" class="checkbox_select_counterparty" value="${cp.id}" style="transform: scale(1.2); cursor: pointer;">
            </td>
            <td style="padding: 10px;">${cp.name}</td>
            <td style="padding: 10px;">${cp.edrpou}</td>
            <td style="padding: 10px;">${cp.tax_number || "-"}</td>
            <td style="padding: 10px;">${phonesHTML}</td>
            <td style="padding: 10px;">${emailsHTML}</td>
            <td style="padding: 10px;">${cp.address || "-"}</td>
            <td style="padding: 10px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${cp.notes || "-"}</td>
        `;

    // --- КРОК Г: ВИСТАВЛЯЄМО РЯДОК НА СТЕНД-ТАБЛИЦЮ ---
    tableBody.appendChild(row);
  });
  setupCheckboxesLogic();
}

// ==========================================================================================================
// КОНТРОЛЕР ГАЛОЧОК: КЕРУВАННЯ ВИДІЛЕННЯМ ТА ОНОВЛЕННЯ КНОПКИ ВИДАЛЕННЯ в таблиці відображення КОНТРАГЕНТІВ
// ==========================================================================================================
function setupCheckboxesLogic() {
  const checkAll = document.getElementById("checkbox_select_all_counterparties");
  const btnDelete = document.getElementById("btn_delete_selected_counterparties");

  if (!checkAll || !btnDelete) return; // Якщо кнопок немає на складі — виходимо

  // ПІДРАХУНОК: Кухонний комбайн, який рахує галочки та перефарбовує кнопку видалення
  function updateDeleteButtonState() {
    // Злітаємося на склад і збираємо всі виділені галочки контрагентів
    const selectedCheckboxes = document.querySelectorAll(".checkbox_select_counterparty:checked");
    const count = selectedCheckboxes.length;

    // Оновлюємо текст на великій кнопці
    btnDelete.innerText = `Видалити виділені (${count})`;

    if (count > 0) {
      // Якщо виділено хоча б одного — запалюємо кнопку синім/червоним кольором і вмикаємо її
      btnDelete.disabled = false;
      btnDelete.style.backgroundColor = "#ff4d4d"; // Колір самої кнопки
      btnDelete.style.color = "white"; // Колір тексту на кнопці
      btnDelete.style.cursor = "pointer"; // Курсор змінює вигляд на "pointer" коли курсор неведено на кнопку btnDelete
    } else {
      // Якщо все порожньо — гасимо кнопку назад у сірий колір і блокуємо
      btnDelete.disabled = true;
      btnDelete.style.backgroundColor = "#cccccc"; // Колір самої кнопки
      btnDelete.style.color = "#666666"; // Колір тексту на кнопці
      btnDelete.style.cursor = "default";
    }
  }

  // ЛОГІКА ГОЛОВНОЇ ГАЛОЧКИ: При кліку в шапці виділяємо або гасимо ВСІ рядки
  checkAll.addEventListener("change", function () {
    const rowCheckboxes = document.querySelectorAll(".checkbox_select_counterparty");
    rowCheckboxes.forEach((cb) => {
      cb.checked = checkAll.checked; // Кожному рядку ставимо такий самий статус, як у головної галочки
    });
    updateDeleteButtonState(); // Перераховуємо касу
  });

  // ЛОГІКА ОКРЕМІХ ГАЛОЧОК: Ловимо кліки на рівні всього депо-таблиці (делегація подій)
  const tableBody = document.getElementById("counterparties_table_body");
  if (tableBody) {
    tableBody.addEventListener("change", function (e) {
      // Якщо клікнули саме по галочці всередині якогось рядка
      if (e.target.classList.contains("checkbox_select_counterparty")) {
        // --- ОЦЕ НАШЕ ОНОВЛЕННЯ: Рахуємо прапорці при кожному кліку ---
        const totalCount = document.querySelectorAll(".checkbox_select_counterparty").length;
        const checkedCount = document.querySelectorAll(".checkbox_select_counterparty:checked").length;

        // Команда для Головного прапорця: якщо кількість виділених дорівнює загальній кількості —
        // галочка автоматично стає увімкненою (true), інакше — вимикається (false)
        checkAll.checked = totalCount === checkedCount;

        updateDeleteButtonState(); // Перераховуємо касу
      }
    });
  }

  // ===========================================================================================
  // НАКАЗ НА ВИДАЛЕННЯ: Вішаємо датчик кліку на велику червону кнопку
  // ===========================================================================================
  btnDelete.addEventListener("click", function () {
    // 1. Збираємо всі галочки, які користувач виділив
    const selectedCheckboxes = document.querySelectorAll(".checkbox_select_counterparty:checked");

    // 2. Витягуємо з кожної галочки зашитий туди ID фірми й пакуємо в один чистий масив (коробку)
    const idsToDelete = Array.from(selectedCheckboxes).map((cb) => parseInt(cb.value));

    // 3. Питаємо у користувача підтвердження, щоб не видалити випадково
    if (!confirm(`Ви впевнені, що хочете видалити вибраних контрагентів (${idsToDelete.length} шт.)?`)) {
      return; // Якщо користувач натиснув "Скасувати" — зупиняємо процес
    }

    // 4. Відправляємо нашого кур'єра (fetch) на сервер Flask з валізою, де лежать ID
    fetch("/delete_counterparties", {
      method: "POST", // Метод доставки - посилка
      headers: {
        "Content-Type": "application/json", // Кажемо, що всередині JSON-текст
      },
      body: JSON.stringify({ ids: idsToDelete }), // Перетворюємо масив ID на текст
    })
      .then((response) => response.json()) // Розпаковуємо відповідь від сервера
      .then((data) => {
        if (data.status === "success") {
          alert(data.message); // Показуємо віконце: "Успішно видалено!"

          // Знімаємо прапорець з головної галочки в шапці
          checkAll.checked = false;

          // Перезавантажуємо таблицю, щоб стерті фірми зникли з екрана
          loadCounterparties();
        } else {
          alert("Помилка видалення: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Кур'єр з наказом на видалення загубився:", error);
        alert("Не вдалося зв'язатися з сервером для видалення.");
      });
  });
}

// ===========================================================================================
// ЛОГІКА ДЛЯ ВІДКРИТТЯ МІНІ-ВІКНА З ТЕЛЕФОНАМИ
// ===========================================================================================

// 1. НАГЛЯДАЧ ЗА КЛІКАМИ: Стежимо за кліками всередині таблиці контрагентів
document.getElementById("counterparties_table_body")?.addEventListener("click", function (event) {
  // Перевіряємо, чи користувач клікнув саме на нашу синю коробку-плашку з телефонами
  const targetBox = event.target.closest(".clickable-contact-box");
  if (!targetBox || targetBox.getAttribute("data-type") !== "phones") return;

  // Дістаємо з плашки унікальний ID фірми, на яку натиснули
  const cpId = parseInt(targetBox.getAttribute("data-id"));

  // Шукаємо цю фірму в загальній великій коробці globalCounterparties за її ID
  const currentCP = globalCounterparties.find((item) => item.id === cpId);
  if (!currentCP || !currentCP.phones) return;

  // Звертаємося до працівника-контейнера всередині нашого міні-вікна
  const modalContent = document.getElementById("modal_phones_list_content");

  // Очищаємо контейнер від старих записів перед тим, як засипати туди нові номери
  modalContent.innerHTML = "";

  // Конвеєр ПОВТОРЕННЯ: Беремо кожен телефон фірми й малюємо його окремим рядком
  currentCP.phones.forEach((p) => {
    const phoneRow = document.createElement("div");
    phoneRow.style.margin = "10px 0";
    phoneRow.style.fontSize = "16px";

    let contactText = "";

    if (p.name) {
      contactText += `${p.name}:  `;
    }

    if (contactText !== "") {
      contactText += `${p.phone} `;
    } else {
      contactText += `<strong>Тел:</strong> ${p.phone}`;
    }

    if (p.role) {
      contactText += ` (${p.role})`;
    }

    // 4. Заливаємо зібраний текст всередину нашого HTML-елемента
    phoneRow.innerHTML = contactText;

    // 5. Віддаємо готовий рядок працівнику-контейнеру
    modalContent.appendChild(phoneRow);
  });

  // ЗНІМАЄМО ЗАМОК: Знаходимо велику ширму вікна і міняємо display: none на block (показуємо вікно)
  document.getElementById("background_for_modal_window_phones").style.display = "block";
});

// 2. НАГЛЯДАЧ ЗА ХРЕСТИКОМ: Коли користувач тицяє на хрестик — вішаємо замок назад (ховаємо вікно)
document.getElementById("btn_close_modal_view_phones")?.addEventListener("click", function () {
  document.getElementById("background_for_modal_window_phones").style.display = "none";
});

// 3. НАГЛЯДАЧ ЗА ШИРМОЮ: Коли користувач клікає мимо вікна (на темне тло) — теж закриваємо вікно
window.addEventListener("click", function (event) {
  const modalBg = document.getElementById("background_for_modal_window_phones");
  if (event.target === modalBg) {
    modalBg.style.display = "none";
  }
});
