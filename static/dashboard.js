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
// Шукаємо кнопку "ДОДАТИ контрагента"
const btnAddCounterparty = document.getElementById("btn_add_counterparty");
// Шукаємо кнопку РЕДАГУВАТИ контрагента
const btnEdit = document.getElementById("btn_edit_counterparty");
// Шукаємо кнопку ВИДАЛИТИ контрагент
const btnDelete = document.getElementById("btn_delete_counterparty");

// ===========================================================================================
// ДІСТАЄМО ОБ'ЄКТИ МОДАЛЬНОГО ВІКНА ДОДАТИ КОНТРАГЕНТА
// ===========================================================================================

//Витягуємо ЗАГОЛОВОК Модального вікна
const modalCounterpartyTitle = document.getElementById("modal_counterparty_title");
// Знаходимо прозорий темний фон, який обгортає наше біле вікно додавання контрагентів
const backgroundForModalWindowCounterparty = document.getElementById("background_for_modal_window_counterparty");
// Шукаємо кнопку-хрестик для закриття вікна додавання КОНТРАГЕНТА
const btnCloseModalWindowCounterparty = document.getElementById("btn_close_modal_window_counterparty");
// Шукаємо кнопку ЗБЕРЕГТИ
const btnSubmitCounterparty = document.getElementById("btn_submit_counterparty");

// ===========================================================================================
// ДІСТАЄМО З HTML ПОЛЯ ВВЕДЕННЯ (ІНПУТИ) МОДАЛЬНОГО ВІКНА "ДОДАТИ КОНТРАГЕНТА"
// ===========================================================================================
//витягує коробку ТІЛЬКИ для ОДНОГО, найпершого (основного) поля телефону
const phoneInput = document.getElementById(".input_contact_phone");
// Кнопка «Додати ще контакт» у модальному вікні "ДОДАТИ КОНТРАГЕНТА"
const btnAddMoreContacts = document.getElementById("btn_add_more_contacts");
// Контейнер, де будуть відображатися поля введення введення основного Телефону + ім'я + посада/нотатки та всіх додатково доданих таких полів
const contactsContainer = document.getElementById("contacts_container");
// Кнопка «Додати ще емейл» у модальному вікні "ДОДАТИ КОНТРАГЕНТА"
const btnAddMoreEmails = document.getElementById("btn_add_more_emails");
// Контейнер, де будуть відображатися поля введення введення основного емейлу + коментарів та всіх додатково доданих таких полів
const emailsContainer = document.getElementById("emails_container");

// Створюємо на складі велику порожню спільну коробку (масив), де тимчасово
// зберігатимемо копії всіх завантажених із сервера контрагентів, щоб мати до них швидкий доступ

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
  // 2. ДОДАЙ ЦЕЙ РЯДОК: Наказуємо працівникові терміново увімкнути конвеєр завантаження!
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
  // КОМАНДА ПРАЦІВНИКУ: Обов'язково міняємо головну вивіску (заголовок) вікна назад
  modalCounterpartyTitle.innerText = "Додавання нового контрагента";
  // Очищаємо секретну кишеню форми від ID, щоб сервер знав, що ми створюємо новий запис, а не оновлюємо старий
  formAddCounterparty.removeAttribute("data-edit-id");

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
// УНІВЕРСАЛЬНА ФУНКЦІЯ МАСКИ ТЕЛЕФОНУ (ІДЕАЛЬНЕ СТИРАННЯ)
// ===========================================================================================
function initPhoneMask() {
  // 1. ПОДІЯ FOCUS: автоматично підставляємо префікс, якщо поле порожнє
  document.addEventListener("focusin", function (e) {
    if (e.target && e.target.classList.contains("input_contact_phone")) {
      if (!e.target.value) {
        e.target.value = "+380 ";
      }
    }
  });

  // 2. ПОДІЯ INPUT: форматуємо ТІЛЬКИ при додаванні цифр
  document.addEventListener("input", function (e) {
    if (e.target && e.target.classList.contains("input_contact_phone")) {
      // КРИТИЧНИЙ ЗАХИСТ: Якщо користувач стирає (натиснув Backspace або Delete) — повністю виходимо
      if (e.inputType && (e.inputType.startsWith("delete") || e.inputType === "deleteContentBackward")) {
        return;
      }

      let input = e.target;
      let val = input.value;

      // Очищаємо рядок від усього, крім цифр
      let digits = val.replace(/\D/g, "");

      // Якщо цифр замало, не заважаємо
      if (digits.length <= 3) {
        if (digits.length === 0) input.value = "";
        else input.value = "+" + digits;
        return;
      }

      // Нормалізуємо введення з нуля
      if (!digits.startsWith("380")) {
        if (digits.startsWith("0")) digits = "38" + digits;
        else digits = "380" + digits;
      }

      // Обмежуємо довжину (380 + 9 цифр номера)
      digits = digits.substring(0, 12);

      // Будуємо маску строго покроково
      let formatted = "+380";

      if (digits.length > 3) {
        let code = digits.substring(3, 5);
        formatted += " (" + code;
      }
      if (digits.length > 5) {
        let part1 = digits.substring(5, 8);
        formatted += ") " + part1;
      }
      if (digits.length > 8) {
        let part2 = digits.substring(8, 10);
        formatted += "-" + part2;
      }
      if (digits.length > 10) {
        let part3 = digits.substring(10, 12);
        formatted += "-" + part3;
      }

      input.value = formatted;
    }
  });

  // 3. ПОДІЯ BLUR: якщо вийшли з поля і там тільки префікс — очищаємо повністю
  document.addEventListener("focusout", function (e) {
    if (e.target && e.target.classList.contains("input_contact_phone")) {
      let val = e.target.value.trim();
      let digits = val.replace(/\D/g, "");
      if (digits.length <= 3) {
        e.target.value = "";
      }
    }
  });
}

// Запускаємо маску
initPhoneMask();

// ===========================================================================================
// ЛОГІКА ДИНАМІЧНОГО ДОДАВАННЯ + ВИДАЛЕННЯ ДОДАТКОВИХ РЯДКІВ З ПОЛЯМИ ТЕЛЕФОНІВ
// ===========================================================================================

if (btnAddMoreContacts && contactsContainer) {
  btnAddMoreContacts.addEventListener("click", function () {
    // 1. Беремо найперший базовий рядок як зразок
    const firstRow = contactsContainer.querySelector(".contact-row");

    if (firstRow) {
      // 2. Робимо точний клон рядка
      const newRow = firstRow.cloneNode(true);
      newRow.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));

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
// КОМАНДА ПРАЦІВНИКУ: РЕАГУВАТИ НА КНОПКУ "РЕДАГУВАТИ ВИДІЛЕНОГО"
// ===========================================================================================

// Тимчасово коментуємо, бо наче цей код дублюється

// document.getElementById("btn_edit_counterparty").addEventListener("click", function () {
//   // 1. Шукаємо всі активні галочки в нашій таблиці
//   const checkedBoxes = document.querySelectorAll(".counterparty-checkbox:checked");

//   // Безпека: якщо чомусь вибрано не один рядок, зупиняємо конвеєр
//   if (checkedBoxes.length !== 1) {
//     alert("Будь ласка, виберіть рівно одного контрагента для редагування!");
//     return;
//   }

//   // 2. Витягуємо ID контрагента з нашої коробки (зберігається в атрибуті data-id галочки)
//   const counterpartyId = checkedBoxes[0].getAttribute("data-id");

//   // 3. Міняємо заголовок у нашому модальному вікні на правильний напис
//   document.getElementById("modal_counterparty_title").innerText = "Редагування контрагента";

//   // 4. Записуємо ID в секретну кишеню форми, щоб вона знала, що ми саме РЕДАГУЄМО, а не створюємо
//   document.getElementById("form_add_counterparty").setAttribute("data-edit-id", counterpartyId);

//   // 5. Показуємо модальне вікно (піднімаємо завісу)
//   document.getElementById("background_for_modal_window_counterparty").style.display = "flex";

//   console.log("Працівник: Готуємося редагувати контрагента з ID:", counterpartyId);
// });

// ===========================================================================================
// ФУНКЦІЯ ЗАВАНТАЖЕННЯ КОНТРАГЕНТІВ ТА НАПОВНЕННЯ ТАБЛИЦІ
// ===========================================================================================
function loadCounterparties() {
  // Наказуємо кур'єру збігати на сервер за даними
  fetch("/get_counterparties")
    // ВАЖЛИВИЙ КРОК: Беремо доставлений конверт (res) і розпаковуємо з нього чистий JSON-вагон з даними
    .then((res) => res.json())
    // Коли дані успішно розпаковані, беремо цей чистий об'єкт (data) у руки
    .then((data) => {
      // ПЕРЕВІРКА СТАТУСУ ВІД СЕРВЕРА
      if (!data || data.status !== "success") {
        console.error("Сервер повернув помилку або статус не успішний:", data);
        alert(data.message || "Помилка завантаження даних");
        return;
      }
      // Звертаємося до масиву всередині об'єкта: data.counterparties
      if (!data || !data.counterparties) {
        console.error("Сервер повернув дані без масиву контрагентів:", data);
        return;
      }
      // *
      //   *
      //   * *
      //   * *
      //   * *
      //   * *
      //   * *
      //   * *
      //   * *
      //   * * Наступна змінна наче не використовується
      // Кладемо отриманий масив у велику спільну коробку для зберігання на складі
      globalCounterparties = data.counterparties;

      // Шукаємо на сторінці за ІСТИННИМ унікальним номером правильний контейнер таблиці
      const tbody = document.getElementById("counterparties_table_body");
      // Якщо працівник не знайшов такого контейнера на сторінці — негайно зупиняємо роботу
      if (!tbody) return;
      // Повністю протираємо контейнер від старого бруду й очищаємо його вміст
      tbody.innerHTML = "";

      // ЗАПУСКАЄМО КОНВЕЄР САМЕ НА МАСИВІ COUNTERPARTIES
      data.counterparties.forEach((cp) => {
        // На кожному колі конвеєра працівник створює з повітря один новий фізичний рядок таблиці (tr)
        const tr = document.createElement("tr");

        // 1. КОМІРКА ЧЕКБОКСА (Стовпчик 1)
        const tdCheck = document.createElement("td");
        tdCheck.style.textAlign = "center";
        const chk = document.createElement("input");
        chk.type = "checkbox";
        chk.className = "counterparty-checkbox";
        chk.value = cp.id;

        // ОНОВЛЕНИЙ ОБРОБНИК ПОДІЙ:
        chk.addEventListener("change", function () {
          const checkedBoxes = document.querySelectorAll(".counterparty-checkbox:checked");

          // Керування кнопкою видалення
          if (checkedBoxes.length > 0) {
            btnDelete.disabled = false;
            btnDelete.classList.remove("disabled-btn");
            btnDelete.classList.add("delete-active"); // Додаємо червоний клас
            // ТУТ МИ ОНОВЛЮЄМО ТЕКСТ КНОПКИ З КІЛЬКІСТЮ
            btnDelete.textContent = `Видалити (${checkedBoxes.length})`;
          } else {
            btnDelete.disabled = true;
            btnDelete.classList.add("disabled-btn");
            btnDelete.classList.remove("delete-active"); // Прибираємо червоний клас
            btnDelete.textContent = "Видалити";
          }

          // Керування кнопкою редагування
          if (checkedBoxes.length === 1) {
            btnEdit.disabled = false;
            btnEdit.classList.remove("disabled-btn");
            btnEdit.classList.add("edit-active"); // Додаємо активний клас
          } else {
            btnEdit.disabled = true;
            btnEdit.classList.add("disabled-btn");
            btnEdit.classList.remove("edit-active"); // Прибираємо активний клас
          }
        });

        tdCheck.appendChild(chk);
        tr.appendChild(tdCheck);

        // КОМІРКА ID (Новий стовпчик 2)
        const tdId = document.createElement("td");
        tdId.textContent = cp.id || "";
        tdId.style.textAlign = "center"; // Робимо ID по центру (за бажанням)
        tr.appendChild(tdId);

        // 2. КОМІРКА НАЗВИ (Стовпчик 2)
        const tdName = document.createElement("td");
        tdName.textContent = cp.name || cp.counterparty_name || "";
        tr.appendChild(tdName);

        // 3. КОМІРКА ЄДРПОУ / ІПН (Стовпчик 3)
        const tdEdrpou = document.createElement("td");
        tdEdrpou.textContent = cp.edrpou || cp.counterparty_edrpou || "";
        tr.appendChild(tdEdrpou);

        // 4. КОМІРКА ПОДАТКОВОГО НОМЕРА (Стовпчик 4)
        const tdTaxNumber = document.createElement("td");
        tdTaxNumber.textContent = cp.tax_number || cp.counterparty_tax_number || "";
        tr.appendChild(tdTaxNumber);

        // --- 5. ЗБІРКА КОМІРКИ ТЕЛЕФОНІВ (Стовпчик 5) ---
        const tdPhones = document.createElement("td");

        // ВАЖЛИВО: беремо список саме з коробки cp.phones, яку надсилає сервер
        const phonesArr = cp.phones || [];

        if (phonesArr.length > 0) {
          // 1. ПЕРШИЙ ТЕЛЕФОН (Показуємо завжди)
          const firstPhoneDiv = document.createElement("span");
          let firstText = phonesArr[0].phone || "";
          let firstDetails = [];

          // Складаємо дані в кошик
          if (phonesArr[0].name) firstDetails.push(phonesArr[0].name);

          // ВИПРАВЛЕННЯ ТУТ: додаємо дужки до ролі
          if (phonesArr[0].role) firstDetails.push(`(${phonesArr[0].role})`);

          // Якщо треба, додаємо коментар (якщо він є у першого телефону)
          if (phonesArr[0].comment) firstDetails.push(phonesArr[0].comment);

          // Якщо в кошику щось є – додаємо це до номера
          if (firstDetails.length > 0) {
            firstText += ` — ${firstDetails.join(", ")}`;
          }
          firstPhoneDiv.textContent = firstText;
          tdPhones.appendChild(firstPhoneDiv);

          // 2. ЯКЩО Є ДОДАТКОВІ ТЕЛЕФОНИ
          if (phonesArr.length > 1) {
            // Створюємо секретну коробку для решти телефонів і закриваємо її на замок
            const hiddenPhonesBox = document.createElement("div");
            hiddenPhonesBox.style.display = "none";
            hiddenPhonesBox.style.marginTop = "4px";

            // Конвеєр пакує всі інші телефони (починаючи з індексу 1) у секретну коробку
            for (let i = 1; i < phonesArr.length; i++) {
              const extraPhoneDiv = document.createElement("div");
              let extraText = phonesArr[i].phone || "";

              let extraDetails = [];
              if (phonesArr[i].name) extraDetails.push(phonesArr[i].name);

              // ОСЬ ТУТ МИ ДОДАЄМО ДУЖКИ:
              if (phonesArr[i].role) extraDetails.push(`(${phonesArr[i].role})`);

              if (phonesArr[i].comment) extraDetails.push(phonesArr[i].comment);

              if (extraDetails.length > 0) {
                extraText += ` — ${extraDetails.join(", ")}`;
              }

              extraPhoneDiv.textContent = extraText;
              extraPhoneDiv.style.marginBottom = "4px";
              hiddenPhonesBox.appendChild(extraPhoneDiv);
            }

            // Кладемо секретну коробку в клітинку таблиці
            tdPhones.appendChild(hiddenPhonesBox);

            // 3. СТВОРЮЄМО КНОПКУ-ПОСИЛАННЯ ДЛЯ РОЗГОРТАННЯ
            const togglePhonesLink = document.createElement("a");
            togglePhonesLink.href = "#";
            togglePhonesLink.textContent = `...ще (${phonesArr.length - 1})`;
            togglePhonesLink.style.color = "#007bff";
            togglePhonesLink.style.textDecoration = "underline";
            togglePhonesLink.style.cursor = "pointer";
            togglePhonesLink.style.fontSize = "12px";
            togglePhonesLink.style.display = "inline-block";
            togglePhonesLink.style.marginTop = "6px";

            // Наказуємо працівнику стежити за кліком по кнопці телефонів
            togglePhonesLink.addEventListener("click", function (e) {
              e.preventDefault(); // Забороняємо сторінці стрибати вгору

              if (hiddenPhonesBox.style.display === "none") {
                hiddenPhonesBox.style.display = "block"; // Змиваємо замок — показуємо все
                togglePhonesLink.textContent = "сховати";
              } else {
                hiddenPhonesBox.style.display = "none"; // Вішаємо замок назад
                togglePhonesLink.textContent = `...ще (${phonesArr.length - 1})`;
              }
            });

            // Кладемо кнопку поруच із першим телефоном
            tdPhones.appendChild(togglePhonesLink);
          }
        } else {
          // Якщо телефонів взагалі немає — малюємо прочерк
          tdPhones.textContent = "—";
        }
        tr.appendChild(tdPhones);

        // --- 6. ЗБІРКА КОМІРКИ ЕМЕЙЛІВ (Стовпчик 6) ---
        const tdEmails = document.createElement("td");
        const emailsArr = cp.emails || [];

        if (emailsArr.length > 0) {
          // 1. ПЕРШИЙ ЕМЕЙЛ (Показуємо завжди)
          const firstEmailDiv = document.createElement("span");
          let firstText = emailsArr[0].email || "";
          if (emailsArr[0].comment) firstText += ` (${emailsArr[0].comment})`;
          firstEmailDiv.textContent = firstText;
          tdEmails.appendChild(firstEmailDiv);

          // 2. ЯКЩО Є ДОДАТКОВІ ЕМЕЙЛИ
          if (emailsArr.length > 1) {
            // Створюємо секретну коробку для решти емейлів і закриваємо її на замок
            const hiddenBox = document.createElement("div");
            hiddenBox.style.display = "none";
            hiddenBox.style.marginTop = "4px";

            // Конвеєр пакує всі інші емейли (починаючи з індексу 1) у секретну коробку
            for (let i = 1; i < emailsArr.length; i++) {
              const extraEmailDiv = document.createElement("div");
              let extraText = emailsArr[i].email || "";

              // ВИПРАВЛЕННЯ: замість " — " додаємо коментар у дужках
              if (emailsArr[i].comment) {
                extraText += ` (${emailsArr[i].comment})`;
              }

              extraEmailDiv.textContent = extraText;
              extraEmailDiv.style.marginBottom = "4px";

              hiddenBox.appendChild(extraEmailDiv);
            }

            // Кладемо секретну коробку в клітинку таблиці
            tdEmails.appendChild(hiddenBox);

            // 3. СТВОРЮЄМО КНОПКУ-ПОСИЛАННЯ ДЛЯ РОЗГОРТАННЯ
            const toggleLink = document.createElement("a");
            toggleLink.href = "#";
            toggleLink.textContent = `...ще (${emailsArr.length - 1})`;
            toggleLink.style.color = "#007bff";
            toggleLink.style.textDecoration = "underline";
            toggleLink.style.cursor = "pointer";
            toggleLink.style.fontSize = "12px";
            toggleLink.style.display = "inline-block"; // Стає в один рядок із текстом
            toggleLink.style.marginLeft = "6px"; // Робить акуратний відступ зліва

            // Наказуємо працівнику: "Стеж за кліком по посиланню!"
            toggleLink.addEventListener("click", function (e) {
              e.preventDefault(); // Забороняємо сторінці стрибати вгору

              if (hiddenBox.style.display === "none") {
                hiddenBox.style.display = "block"; // Змиваємо замок — показуємо все
                toggleLink.textContent = "сховати";
              } else {
                hiddenBox.style.display = "none"; // Вішаємо замок назад
                toggleLink.textContent = `...ще (${emailsArr.length - 1})`;
              }
            });

            // Кладемо кнопку поруч із першим емейлом
            tdEmails.appendChild(toggleLink);
          }
        } else {
          // Якщо пошт взагалі немає — малюємо прочерк
          tdEmails.textContent = "—";
        }
        tr.appendChild(tdEmails);

        // 7. КОМІРКА АДРЕСИ ДОСТАВКИ (Стовпчик 7)
        const tdAddress = document.createElement("td");
        tdAddress.textContent = cp.address || cp.delivery_address || cp.counterparty_delivery_address || "";
        tr.appendChild(tdAddress);

        // 8. КОМІРКА НОТАТОК (Стовпчик 8)
        const tdNotes = document.createElement("td");
        tdNotes.textContent = cp.notes || cp.counterparty_notes || "";
        tr.appendChild(tdNotes);

        // ВИКЛАДКА НА ВІТРИНУ: відправляємо повністю зібраний рядок у таблицю
        tbody.appendChild(tr);
      });
    })
    // Якщо кур'єр дорогою спіткнувся або сервер зламався — переходимо до аварійного плану
    .catch((err) => {
      // Записуємо детальну інформацію про аварію в наш спеціальний журнал дій
      console.error("Помилка завантаження контрагентів:", err);
    });
}

// ===========================================================================================
// Логіка для "Виділити все"
// ===========================================================================================
document.getElementById("checkbox_select_all_counterparties").addEventListener("change", function () {
  const isChecked = this.checked;

  // Знаходимо всі чекбокси контрагентів у таблиці
  const allCounterpartyCheckboxes = document.querySelectorAll(".counterparty-checkbox");

  // Встановлюємо стан для кожного чекбокса
  allCounterpartyCheckboxes.forEach((cb) => {
    cb.checked = isChecked;
  });

  // Оновлюємо стан кнопок (Видалити/Редагувати)
  // Викликаємо подію 'change' для одного з чекбоксів, щоб спрацювала ваша логіка
  if (allCounterpartyCheckboxes.length > 0) {
    allCounterpartyCheckboxes[0].dispatchEvent(new Event("change"));
  }
});

// ===========================================================================================
// ЛОГІКА РОБОТИ КНОПКИ "РЕДАГУВАТИ ВИДІЛЕНОГО" КОНТРАГЕНТА
// ===========================================================================================
btnEdit.addEventListener("click", function () {
  // 1. Шукаємо активну галочку в нашій таблиці контрагентів
  const checkedBox = document.querySelector(".counterparty-checkbox:checked");

  if (!checkedBox) {
    alert("Будь ласка, виберіть контрагента для редагування!");
    return;
  }

  // 2. Витягуємо унікальний номер (ID) контрагента, який ТЕПЕР ТОЧНО ТАМ Є!
  const counterpartyId = checkedBox.value;

  // 3. Міняємо заголовок у нашому модальному вікні
  modalCounterpartyTitle.innerText = "Редагування контрагента";

  // 4. Записуємо ID в секретну кишеню форми (атрибут data-edit-id)
  formAddCounterparty.setAttribute("data-edit-id", counterpartyId);

  // 5. Відчиняємо модальне вікно (показуємо його на екрані)
  backgroundForModalWindowCounterparty.style.display = "flex";

  // СВІЖИЙ ХІРУРГІЧНИЙ fetch ПІД ТВОЇ ФАЙЛИ:
  fetch(`/get_counterparty/${counterpartyId}`)
    .then((response) => {
      if (!response.ok) throw new Error("Сервер відмовився видати дані");
      return response.json();
    })
    .then((result) => {
      console.log("Працівник: Отримав від сервера сейф:", result);

      // Перевіряємо, чи Python прислав статус успіху і чи є всередині контрагент
      if (result.status === "success" && result.counterparty) {
        // Шукаємо коробку за її точним id="add_counterparty_name" з HTML
        const nameInput = document.getElementById("input_counterparty_name");

        if (nameInput) {
          // Беремо назву з сейфа counterparty, який прислав Python
          nameInput.value = result.counterparty.name || "";
          console.log("Працівник: Назву контрагента успішно вписано в поле!");
        } else {
          console.error("Працівник: Не знайшов на формі елемент з id='add_counterparty_name'!");
        }

        // ТОЧКОВИЙ КРОК: Шукаємо коробку ЄДРПОУ за її ID з HTML
        const edrpouInput = document.getElementById("input_counterparty_edrpou");
        if (edrpouInput) {
          // Дістаємо код ЄДРПОУ з сейфа counterparty й кладемо його в коробку
          edrpouInput.value = result.counterparty.edrpou || "";
          console.log("Працівник: Код ЄДРПОУ успішно вписано в поле!");
        } else {
          console.error("Працівник: Не знайшел на формі елемент з id='input_counterparty_edrpou'!");
        }

        // --- РОЗКЛАДАЄМО ІПН ---
        const taxNumberInput = document.getElementById("input_counterparty_tax_number");
        if (taxNumberInput) {
          // Дістаємо податковий номер із сейфа й кладемо в коробку ІПН
          taxNumberInput.value = result.counterparty.tax_number || "";
          console.log("Працівник: Податковий номер (ІПН) успішно вписано в поле!");
        } else {
          console.error("Працівник: Не знайшов на формі елемент з id='input_counterparty_tax_number'!");
        }

        // --- РОЗКЛАДАЄМО ТЕЛЕФОНИ (ДИНАМІЧНИЙ СПИСОК) ---
        const phoneContainer = document.getElementById("contacts_container");
        if (phoneContainer) {
          // 1. Повністю вичищаємо контейнер від старих полів, які там були
          phoneContainer.innerHTML = "";

          // Беремо список телефонів із сейфа (якщо там порожньо — створюємо порожній масив)
          const phonesArr = result.counterparty.phones || [];

          if (phonesArr.length === 0) {
            // Якщо в базі взагалі немає телефонів, створюємо одне порожнє поле за замовчуванням
            phoneContainer.innerHTML = `<div class="phone-input-group"><input type="text" name="counterparty_phones[]" placeholder="+380..." required></div>`;
          } else {
            // 2. Повторенням (циклом) перебираємо кожен телефон з бази
            // Повторенням (циклом) перебираємо кожен контакт з бази
            phonesArr.forEach((p, idx) => {
              // 1. Створюємо головну коробку рядка і даємо їй магічні інструкції "Шеренги" (Flex)
              const group = document.createElement("div");
              group.className = "contact-row";
              group.style.display = "flex";
              group.style.gap = "15px";
              group.style.marginBottom = "15px";
              if (idx > 0) group.style.marginTop = "5px";

              // 2. БЛОК ТЕЛЕФОНУ
              const phoneBlock = document.createElement("div");
              phoneBlock.className = "block_counterparty_contact";
              phoneBlock.style.flex = "1";
              phoneBlock.innerHTML = `<label>Телефон</label>`;

              const inputPhone = document.createElement("input");
              inputPhone.type = "tel";
              inputPhone.className = "input_contact_phone";
              inputPhone.name = "counterparty_phones[]";
              inputPhone.placeholder = "+380...";
              inputPhone.maxLength = 19;
              inputPhone.value = p.phone || "";
              if (idx === 0) inputPhone.required = true;

              phoneBlock.appendChild(inputPhone);
              group.appendChild(phoneBlock);

              // 3. БЛОК ІМЕНІ
              const nameBlock = document.createElement("div");
              nameBlock.className = "block_counterparty_contact";
              nameBlock.style.flex = "1";
              nameBlock.innerHTML = `<label>Ім'я контактної особи</label>`;

              const inputName = document.createElement("input");
              inputName.type = "text";
              inputName.className = "input_contact_name";
              inputName.name = "counterparty_contact_names[]";
              inputName.placeholder = "Ім'я особи";
              inputName.value = p.name || "";

              nameBlock.appendChild(inputName);
              group.appendChild(nameBlock);

              // 4. БЛОК ПОСАДИ
              const roleBlock = document.createElement("div");
              roleBlock.className = "block_counterparty_contact";
              roleBlock.style.flex = "1";
              roleBlock.innerHTML = `<label>Посада / коментар</label>`;

              const inputRole = document.createElement("input");
              inputRole.type = "text";
              inputRole.className = "input_contact_role";
              inputRole.name = "counterparty_contact_roles[]";
              inputRole.placeholder = "Посада / Коментар";
              inputRole.value = p.role || "";

              roleBlock.appendChild(inputRole);
              group.appendChild(roleBlock);

              // Кнопка видалення "X" (чіпляємо її збоку, якщо це додатковий телефон)
              if (idx > 0) {
                const removeBtn = document.createElement("button");
                removeBtn.type = "button";
                removeBtn.className = "remove-phone-btn";
                removeBtn.style.alignSelf = "flex-end"; // Вирівнюємо по нижньому краю інпутів
                removeBtn.style.marginBottom = "5px";
                removeBtn.style.backgroundColor = "#ff6b6b";
                removeBtn.style.color = "white";
                removeBtn.style.border = "none";
                removeBtn.style.padding = "6px 10px";
                removeBtn.style.cursor = "pointer";
                removeBtn.style.borderRadius = "4px";
                removeBtn.textContent = "X";

                removeBtn.addEventListener("click", function () {
                  group.remove();
                });
                group.appendChild(removeBtn);
              }

              // Закидаємо правильно зібраний рядок у контейнер контактів
              phoneContainer.appendChild(group);
            });

            // --- РОЗКЛАДАЄМО ЕМЕЙЛИ (ДИНАМІЧНИЙ СПИСОК) ---
            const emailContainer = document.getElementById("emails_container");
            if (emailContainer) {
              // 1. Повністю вичищаємо контейнер від старих рядків
              emailContainer.innerHTML = "";

              // Беремо список емейлів із сейфа сервера
              const emailsArr = result.counterparty.emails || [];

              if (emailsArr.length === 0) {
                // Якщо в базі немає емейлів, створюємо один порожній за дефолтним HTML-кресленням
                emailContainer.innerHTML = `
              <div class="email-row" style="display: flex; gap: 15px; margin-bottom: 15px">
                <div class="block_counterparty_contact" style="flex: 1">
                  <label>Емейл</label>
                  <input type="email" class="input_counterparty_email" name="contact_emails[]" />
                </div>
                <div class="block_counterparty_contact" style="flex: 1">
                  <label>Призначення / коментар</label>
                  <input type="text" class="input_counterparty_email_comment" name="contact_email_comments[]" />
                </div>
              </div>`;
              } else {
                // 2. Повторенням (циклом) перебираємо кожен емейл з бази
                emailsArr.forEach((e, idx) => {
                  // Створюємо головну коробку-рядок зі стилями "Шеренги" (Flex)
                  const emailGroup = document.createElement("div");
                  emailGroup.className = "email-row";
                  emailGroup.style.display = "flex";
                  emailGroup.style.gap = "15px";
                  emailGroup.style.marginBottom = "15px";
                  if (idx > 0) emailGroup.style.marginTop = "5px";

                  // БЛОК ЕМЕЙЛУ
                  const emailBlock = document.createElement("div");
                  emailBlock.className = "block_counterparty_contact";
                  emailBlock.style.flex = "1";
                  emailBlock.innerHTML = `<label>Емейл</label>`;

                  const inputEmail = document.createElement("input");
                  inputEmail.type = "email";
                  inputEmail.className = "input_counterparty_email";
                  inputEmail.name = "contact_emails[]";
                  inputEmail.value = e.email || ""; // Вставляємо реальний емейл!

                  emailBlock.appendChild(inputEmail);
                  emailGroup.appendChild(emailBlock);

                  // БЛОК КОМЕНТАРЯ ДО ЕМЕЙЛУ
                  const commentBlock = document.createElement("div");
                  commentBlock.className = "block_counterparty_contact";
                  commentBlock.style.flex = "1";
                  commentBlock.innerHTML = `<label>Призначення / коментар</label>`;

                  const inputComment = document.createElement("input");
                  inputComment.type = "text";
                  inputComment.className = "input_counterparty_email_comment";
                  inputComment.name = "contact_email_comments[]";
                  inputComment.value = e.comment || ""; // Вставляємо реальний коментар!

                  commentBlock.appendChild(inputComment);
                  emailGroup.appendChild(commentBlock);

                  // Кнопка видалення "X" для другого і наступних емейлів
                  if (idx > 0) {
                    const removeEmailBtn = document.createElement("button");
                    removeEmailBtn.type = "button";
                    removeEmailBtn.className = "remove-phone-btn"; // Використовуємо твій готовий стиль кнопки
                    removeEmailBtn.style.alignSelf = "flex-end";
                    removeEmailBtn.style.marginBottom = "5px";
                    removeEmailBtn.style.backgroundColor = "#ff6b6b";
                    removeEmailBtn.style.color = "white";
                    removeEmailBtn.style.border = "none";
                    removeEmailBtn.style.padding = "6px 10px";
                    removeEmailBtn.style.cursor = "pointer";
                    removeEmailBtn.style.borderRadius = "4px";
                    removeEmailBtn.textContent = "X";

                    removeEmailBtn.addEventListener("click", function () {
                      emailGroup.remove();
                    });
                    emailGroup.appendChild(removeEmailBtn);
                  }

                  // Закидаємо зібраний рядок у великий контейнер емейлів
                  emailContainer.appendChild(emailGroup);
                });

                // --- РОЗКЛАДАЄМО АДРЕСУ ДОСТАВКИ ---
                const deliveryInput = document.getElementById("input_counterparty_delivery_address");
                if (deliveryInput) {
                  deliveryInput.value = result.counterparty.delivery || "";
                  console.log("Успіх: Адресу вписано в textarea!");
                } else {
                  console.warn("Помилка: Не знайдено textarea з ID 'input_counterparty_delivery_address'!");
                }

                const notesInput = document.getElementById("input_counterparty_notes");
                if (notesInput) {
                  notesInput.value = result.counterparty.notes || "";
                  console.log("Успіх: Нотатки вписано в поле!");
                } else {
                  console.warn("Помилка: Не знайдено поле нотаток!");
                }
                document.getElementById("hidden_counterparty_id").value = counterpartyId;
              }
              console.log(`Працівник: Успішно вивів емейли на екран. Кількість: ${emailsArr.length}`);
            } else {
              console.error("Працівник: Не знайшов на формі контейнер id='emails_container'!");
            }
          }
          console.log(`Працівник: Успішно вивів телефони на екран. Кількість: ${phonesArr.length}`);
        } else {
          console.error("Працівник: Не знайшов на формі жодного поля з класом .input_contact_phone!");
        }
      }
    })
    .catch((err) => {
      console.error("Помилка завантаження деталей:", err);
    });
});

// ===========================================================================================
// ЛОГІКА ДІЇ КНОПКИ "ЗБЕРЕГТИ" КОНТРАГЕНТА
// ===========================================================================================

btnSubmitCounterparty.addEventListener("click", function (event) {
  event.preventDefault(); // Це зупиняє стандартне оновлення сторінки
  console.log("Кнопку натиснуто, починаємо збір даних..."); // Це допоможе нам в консолі перевірити, чи працює взагалі кнопка

  // 1. Збираємо телефони
  const contactPhoneRows = document.querySelectorAll("#contacts_container .contact-row");
  const contactPhonetsList = [];
  contactPhoneRows.forEach((row) => {
    //Візьми список contactPhoneRows і для кожного рядка (row) в ньому виконай дії, описані далі
    contactPhonetsList.push({
      //Відкрий contactsList і додай у нього все що у фігурних

      contact_phone: row.querySelector(".input_contact_phone").value.trim(), // У поточному рядку (row) знайди поле з класом .input_contact_phone, візьми його значення (value) і прибери зайві пробіли по краях (trim)
      contact_name: row.querySelector(".input_contact_name").value.trim(),
      contact_role: row.querySelector(".input_contact_role").value.trim(),
    });
  }); // Закрили цикл контактів

  // 2. Збираємо емейли
  const contactEmailRows = document.querySelectorAll("#emails_container .email-row");
  const contactEmailsList = [];
  contactEmailRows.forEach((row) => {
    contactEmailsList.push({
      contact_email: row.querySelector(".input_counterparty_email").value.trim(),
      contact_email_comment: row.querySelector(".input_counterparty_email_comment").value.trim(),
    });
  }); // Закрили цикл емейлів

  const finalDataEditCounterpaty = {
    id: document.getElementById("hidden_counterparty_id").value,
    name: document.getElementById("input_counterparty_name").value,
    edrpou: document.getElementById("input_counterparty_edrpou").value,
    tax_number: document.getElementById("input_counterparty_tax_number").value,
    delivery: document.getElementById("input_counterparty_delivery_address").value,
    notes: document.getElementById("input_counterparty_notes").value,
    all_contacts_phone: contactPhonetsList,
    all_contacts_emails: contactEmailsList,
  };

  fetch("/update_counterparty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalDataEditCounterpaty),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        if (data.new_id) document.getElementById("hidden_counterparty_id").value = data.new_id;
        alert("Дані успішно збережено!");
      } else {
        // ЯКЩО СТАТУС "error" — ВИВОДИМО ТЕКСТ ПОМИЛКИ
        alert("Помилка: " + data.message);
      }
    })
    .catch((error) => {
      // Всі інші види помилок пов'язані з сервером
      console.error("Помилка:", error);
      alert("Щось пішло не так на сервері!");
    });
});

// ===========================================================================================
// ЛОГІКА ДІЇ КНОПКИ "ВИДАЛИТИ" КОНТРАГЕНТА
// ===========================================================================================

// Знаходимо кнопку за її ID (перевірте, чи у вас саме цей ID в HTML)
btnDelete.addEventListener("click", function () {
  const selected = [];
  // Збираємо всі вибрані чекбокси (переконайтеся, що вони мають клас 'checkbox')
  document.querySelectorAll(".counterparty-checkbox:checked").forEach((cb) => {
    selected.push(cb.value);
  });

  if (selected.length === 0) {
    alert("Виберіть хоча б одного контрагента для видалення!");
    return;
  }

  if (confirm("Ви впевнені, що хочете видалити вибраних контрагентів?")) {
    fetch("/delete_counterparties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert(data.message);
          location.reload(); // Перезавантажуємо сторінку для оновлення таблиці
        } else {
          alert("Помилка: " + data.message);
        }
      })
      .catch((error) => console.error("Помилка:", error));
  }
});
