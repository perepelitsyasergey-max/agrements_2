import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv # Інструмент для читання твого "сейфа" .env
from datetime import datetime # Додай цей імпорт у самий верх файлу
from enum import Enum # команда, яка дістає з коробки Python інструмент для створення закритих списків або меню

# 1. Завантажуємо дані з файлу .env
load_dotenv()

app = Flask(__name__)

# 2. Беремо секрети із "сейфа"
app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# -------------------------------------------------------------------------------------------
# ЄДИНИЙ ДОВІДНИК ДІЙ (Для стандартизації логів) 
# -------------------------------------------------------------------------------------------
from enum import Enum

class ActionType(str, Enum):
    # Системні дії
    LOGIN = "Вхід"
    LOGOUT = "Вихід"
    
    # Операції над даними
    CREATE = "Створення"
    UPDATE = "Редагування"
    DELETE = "Видалення"


#-------------------------------------------------------------------------------------------
# Креслення таблиці "СТАТУСИ КОРИСТУВАЧІВ" 
# -------------------------------------------------------------------------------------------
class UserStatus(db.Model):
    __tablename__ = 'user_statuses'
    
    id = db.Column(db.Integer, primary_key=True)
    status_name = db.Column(db.String(50), unique=True, nullable=False) # Адмін, Юрист... 

    def __repr__(self):
        return f'<Status {self.status_name}>'



# -------------------------------------------------------------------------------------------
# Креслення таблиці "КОРИСТУВАЧІ"
# -------------------------------------------------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)                        # id
    user_email = db.Column(db.String(120), unique=True, nullable=False) # еммейл
    user_password = db.Column(db.Text, nullable=False)                  # пароль
    user_name = db.Column(db.String(100), nullable=False)               # ім'я    
    
    # Зв'язок зі статусом (пункт 4 на схемі) 
    status_id = db.Column(db.Integer, db.ForeignKey('user_statuses.id'), nullable=False)
    
    
    # Визначаємо що користувач у програмі буде відображатися саме через ім'я користувача
    def __repr__(self):
        return f'<User {self.user_name} (ID Статусу: {self.status_id})>'


# -------------------------------------------------------------------------------------------
# Креслення таблиці "ЛОГИ / ЖУРНАЛИ ДІЙ"
# -------------------------------------------------------------------------------------------
class ActionLog(db.Model):
    __tablename__ = 'action_logs'
    
    id = db.Column(db.Integer, primary_key=True)    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)                     # Коли це сталося (Timestamp)    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)      # Хто це зробив (зв'язок з User_ID)    
    action_type = db.Column(db.String(50), nullable=False)                          # Що саме зробили (Action_Type)    
    entity_name = db.Column(db.String(100), nullable=False)                         # Над чим чаклували (Entity_Name)    
    entity_id = db.Column(db.Integer)                                               # ID об'єкта, який змінили (Entity_ID)    
    changes = db.Column(db.JSON)                                                    # Самі зміни у форматі JSON (Changes_JSON)

    # інструкція для Python, як саме підписати кожну сторінку в нашому Журналі логів
    def __repr__(self):
        return f'<Log {self.action_type} on {self.entity_name} by {self.user_id}>'    

# -------------------------------------------------------------------------------------------
# Креслення таблиці "КОНТРАГЕНТ"
# -------------------------------------------------------------------------------------------
class Counterparty(db.Model):
    __tablename__ = 'counterparties'
    
    counterparty_id = db.Column(db.Integer, primary_key=True)
    counterparty_name = db.Column(db.String(255), nullable=False) # Назва / Ім'я
    counterparty_edrpou = db.Column(db.String(10), unique=True)   # ЄДРПОУ / ІПН
    counterparty_tax_number = db.Column(db.String(20))            # Податковий номер

    # Телефон та емейл описані в окремих таблицях "counterparty_contacts" та "counterparty_emails"
    counterparty_delivery_address = db.Column(db.Text)            # Нова пошта
    counterparty_notes = db.Column(db.Text)                       # Нотатки    
    
    def __repr__(self):
        return f'<Counterparty {self.counterparty_name}>'    

# -------------------------------------------------------------------------------------------
# Креслення таблиці "ТЕЛЕФОНИ КОНТРАГЕНТІВ" (підв'язуються до таблиці КОНТРАГЕНТИ)
# -------------------------------------------------------------------------------------------
class CounterpartyContact(db.Model):
    __tablename__ = 'counterparty_contacts'
    
    contact_id = db.Column(db.Integer, primary_key=True)
    
    # Головний трос-зв'язок: вказує, до якого саме контрагента прив'язана ця людина
    counterparty_id = db.Column(db.Integer, db.ForeignKey('counterparties.counterparty_id'), nullable=False)
    
    contact_phone = db.Column(db.String(50))                 # Телефон (+380...)
    contact_name = db.Column(db.String(255))                 # Ім'я контактної особи
    contact_role = db.Column(db.String(255))                 # Посада / коментар

    def __repr__(self):
        return f'<Contact {self.contact_name} ({self.contact_role}) для Контрагента ID: {self.counterparty_id}>'


# -------------------------------------------------------------------------------------------
# Креслення таблиці "ЕМАЙЛИ КОНТРАГЕНТІВ" (підв'язуються до таблиці КОНТРАГЕНТИ)
# -------------------------------------------------------------------------------------------
class CounterpartyEmail(db.Model):
    __tablename__ = 'counterparty_emails'
    
    email_id = db.Column(db.Integer, primary_key=True)
    
    # Головний трос-зв'язок: вказує, до якого саме контрагента прив'язана ця пошта
    counterparty_id = db.Column(db.Integer, db.ForeignKey('counterparties.counterparty_id'), nullable=False)
    
    contact_email = db.Column(db.String(255), nullable=False) # Сама адреса (example@company.com)
    email_comment = db.Column(db.String(255))                 # Призначення / коментар (Для рахунків тощо)

    def __repr__(self):
        return f'<Email {self.contact_email} ({self.email_comment}) для Контрагента ID: {self.counterparty_id}>'

# -------------------------------------------------------------------------------------------
# ФУНКЦІЯ "РЕЄСТРАТОР": Записує кожну дію в журнал
# -------------------------------------------------------------------------------------------
def log_action(user_id, action_type: ActionType, entity_name, entity_id=None, changes=None):
    """
    user_id: Хто робив дію
    action_type: Об'єкт з класу ActionType (наприклад, ActionType.CREATE)
    entity_name: Назва таблиці ('users', 'counterparties' тощо)
    entity_id: ID конкретного запису
    changes: Словник із даними, що саме змінилося (JSON)
    """
    new_log = ActionLog(
        user_id=user_id,
        action_type=action_type.value,  # Витягуємо чистий текст (наприклад, "Створення")
        entity_name=entity_name,
        entity_id=entity_id,
        changes=changes
    )
    db.session.add(new_log)
    db.session.commit()
    # Виводимо в термінал кожну дію
    print(f"--- LOG: {action_type.value} на {entity_name} (Користувач ID: {user_id}) ---")


# Головна сторінка
@app.route('/')
def index():
    # Перевіряємо: чи лежить у нашій віртуальній кишені 'user_id'?
    if 'user_id' in session:
        # Якщо так — людина вже увійшла! перенаправляємо на dashboard
        return redirect(url_for('dashboard'))
    
    # Якщо в кишені порожньо — даємо команду "Йди на прохідну!"
    return redirect(url_for('login'))


# -------------------------------------------------------------------------------------------
# МАРШРУТ "ПРОХІДНА" (ВХІД У СИСТЕМУ)
# -------------------------------------------------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('input_user_email')
        password = request.form.get('input_user_password')
        
        # 1. Порівнюємо введений емейл користувачем (email) з емейлом в базі даних (user_email). Результат зберігаємо у змінну user  
        user = User.query.filter_by(user_email=email).first()
        
        # 2. Якщо користувач з відповідним емейлом наявний і пароль в БД (user.user_password) збігається із введеним (password)
        if user and user.user_password == password:
            # 3. Записуємо в об'єкт (session) id та назву користувача (user.id, user.user_name), щоб сервер "впізнавав" їх на наступних сторінках
            session['user_id'] = user.id
            session['user_name'] = user.user_name
            
            # Логуємо успішний вхід
            log_action(user.id, ActionType.LOGIN, 'users', user.id)
                # user.id — передаємо в функцію відповідь на питання «Хто це зробив?». Це унікальний номер користувача, який щойно успішно увійшов у систему.
                # ActionType.LOGIN — передаємо наше значення з Enum (конкретне меню дій). Функція сама витягне звідти слово "Вхід", захищаючи нас від помилок ручного введення.
                # 'users' — назва таблиці, у якій відбулася дія (користувач взаємодіяв з таблицею користувачів).
                # user.id (останній параметр) — ID конкретного об'єкта, над яким виконали дію. У даному випадку користувач увійшов під своїм же ID.
                            
            return redirect(url_for('dashboard')) # Перенаправляємо на dashboard.html 
        else:
            return "Помилка: невірний емейл або пароль!"            
    
    return render_template('login.html') # Якщо просто відкрили сторінку - показуємо форму


# НОВИЙ МАРШРУТ: ГОЛОВНИЙ КАБІНЕТ (DASHBOARD)
@app.route('/dashboard')
def dashboard():
    # Перевіряємо «перепустку»: якщо користувач не входив — повертаємо на прохідну
    if 'user_id' not in session:
        return redirect(url_for('login')) # Перенаправляємо на сторінку входу
    current_username = session.get('user_name') # Тепер дістаємо ім'я з кишені сесії            
    return render_template('dashboard.html', name=current_username) # Передаємо це ім'я в коробку "name" для HTML сторінки


# -------------------------------------------------------------------------------------------
# МАРШРУТ ДЛЯ ВИХОДУ ІЗ СИСТЕМИ
# -------------------------------------------------------------------------------------------
@app.route('/logout')
def logout():
    # Наказуємо повністю очистити нашу кишеню сесії
    session.clear()
    
    # Відправляємо користувача назад на прохідну (форму входу)
    return redirect(url_for('login'))


# -------------------------------------------------------------------------------------------
# МАРШРУТ: ВИДАЧА СПИСКУ ВСІХ КОНТРАГЕНТІВ (РАЗОМ З ТЕЛЕФОНАМИ ТА ЕМЕЙЛАМИ)
# -------------------------------------------------------------------------------------------
@app.route('/get_counterparties', methods=['GET'])
def get_counterparties():
    # Перевіряємо «перепустку» користувача на прохідній системи
    if 'user_id' not in session:
        return {"status": "error", "message": "Помилка: доступ заборонено!"}, 403

    try:
        
        all_counterparties = Counterparty.query.all() # Відкриваємо головну шафу і беремо абсолютно всіх живих контрагентів        
        result_list = []    # Створюємо велику порожню коробку-список для відправки на екран
        
        # Конвеєром перебираємо кожного знайденого контрагента по черзі
        for cp in all_counterparties:
            
            # --- КРОК 1: ЗБИРАЄМО ТЕЛЕФОНИ ---
            # Заглядаємо в шафу контактів і фільтруємо телефони за номером паспорта (ID) контрагента
            phones_in_db = CounterpartyContact.query.filter_by(counterparty_id=cp.counterparty_id).all()
            
            # Готуємо маленьку коробку для списку телефонів цього конкретного контрагента
            phones_list = []
            for p in phones_in_db:
                # Пакуємо кожен телефон у легкий словничок і підписуємо ярлики
                phones_list.append({
                    "phone": p.contact_phone, # Номер телефону
                    "name": p.contact_name,   # Ім'я контактної особи
                    "role": p.contact_role     # Посада або роль (наприклад, "Директор")
                })

            # --- КРОК 2: ЗБИРАЄМО ЕМЕЙЛИ ---
            # Заглядаємо в шафу емейлів і теж витягуємо тільки ті, що пришиті до нашого контрагента
            emails_in_db = CounterpartyEmail.query.filter_by(counterparty_id=cp.counterparty_id).all()
            
            # Готуємо маленьку коробку для списку електронних пошт
            emails_list = []
            for e in emails_in_db:
                # Пакуємо кожну пошту у словничок з коментарем
                emails_list.append({
                    "email": e.contact_email,   # Адреса електронної пошти
                    "comment": e.email_comment   # Робоча замітка до цієї пошти
                })

            # --- КРОК 3: ПАКУЄМО ВСЕ В ОДИН ПАКЕТ ---
            # Створюємо фінальну картку контрагента, куди вкладаємо і його дані, і зібрані коробки телефонів та емейлів
            counterparty_data = {
                "id": cp.counterparty_id,                    # Ховаємо ID для майбутньої кнопки видалення
                "name": cp.counterparty_name,                # Назва фірми для клітинки таблиці
                "edrpou": cp.counterparty_edrpou,            # Код ЄДРПОУ компанії
                "tax_number": cp.counterparty_tax_number,    # Податковий номер
                "address": cp.counterparty_delivery_address, # Адреса Нової Пошти
                "notes": cp.counterparty_notes,              # Наші робочі нотатки
                "phones": phones_list,                       # Вкладаємо коробку з усіма телефонами
                "emails": emails_list                        # Вкладаємо коробку з усіма емейлами
            }
            
            # Кладемо цю готову велику картку у нашу загальну коробку-список
            result_list.append(counterparty_data)
            
        # Віддаємо всю велику коробку з контрагентами нашому JS-роботу в браузер
        return {"status": "success", "counterparties": result_list}, 200

    except Exception as e:
        # Якщо на якомусь етапі конвеєр заклинило — виводимо помилку в журнал
        print(f"Помилка при вивантаженні контрагентів: {e}")
        return {"status": "error", "message": f"Внутрішня помилка сервера: {str(e)}"}, 500



# -------------------------------------------------------------------------------------------
# МАРШРУТ: ВИДАЧА ДАНИХ ОДНОГО КОНТРАГЕНТА ДЛЯ РЕДАГУВАННЯ
# -------------------------------------------------------------------------------------------
@app.route('/get_counterparty/<int:cp_id>', methods=['GET'])
def get_counterparty(cp_id):
    # Перевіряємо «перепустку» користувача
    if 'user_id' not in session:
        return {"status": "error", "message": "Помилка: доступ заборонено!"}, 403

    try:
        # Шукаємо контрагента в головній шафі за його ID
        cp = Counterparty.query.get(cp_id)
        if not cp:
            return {"status": "error", "message": "Контрагента не знайдено."}, 404

        # Збираємо його телефони
        phones_in_db = CounterpartyContact.query.filter_by(counterparty_id=cp.counterparty_id).all()
        phones_list = []
        for p in phones_in_db:
            phones_list.append({
                "phone": p.contact_phone,
                "name": p.contact_name,
                "role": p.contact_role
            })

        # Збираємо його емейли
        emails_in_db = CounterpartyEmail.query.filter_by(counterparty_id=cp.counterparty_id).all()
        emails_list = []
        for e in emails_in_db:
            emails_list.append({
                "email": e.contact_email,
                "comment": e.email_comment
            })

        # Пакуємо все в один пакет для відправки роботові в браузер
        counterparty_data = {
            "id": cp.counterparty_id,
            "name": cp.counterparty_name,
            "edrpou": cp.counterparty_edrpou,
            "tax_number": cp.counterparty_tax_number,
            "delivery": cp.counterparty_delivery_address,
            "notes": cp.counterparty_notes,
            "phones": phones_list,
            "emails": emails_list
        }

        return {"status": "success", "counterparty": counterparty_data}, 200

    except Exception as e:
        print(f"Помилка при отриманні контрагента ID {cp_id}: {e}")
        return {"status": "error", "message": f"Внутрішня помилка сервера: {str(e)}"}, 500
    





# -------------------------------------------------------------------------------------------
# МАРШРУТ: МАСОВЕ ВИДАЛЕННЯ ОБРАНИХ КОНТРАГЕНТІВ ТА ЇХНІХ КОНТАКТІВ
# -------------------------------------------------------------------------------------------
@app.route('/delete_counterparties', methods=['POST'])
def delete_counterparties():
    # Перевіряємо «перепустку» користувача на прохідній системи
    if 'user_id' not in session:
        return {"status": "error", "message": "Помилка: доступ заборонено!"}, 403

    try:
        # Приймаємо від JS-кур'єра посилку і розпаковуємо JSON-текст у коробку з даними
        data = request.get_json()
        
        # Витягуємо з коробки наш масив (список) ідентифікаторів `ids`
        ids_to_delete = data.get('ids', [])

        # Якщо приїхала порожня коробка без ID — б'ємо на сполох
        if not ids_to_delete:
            return {"status": "error", "message": "Не вибрано жодного контрагента для видалення."}, 400

        # Конвеєром перебираємо кожен ID із надісланого списку
        for cp_id in ids_to_delete:
            
            # 1. Заглядаємо в шафу телефонів і видаляємо всі контакти цього контрагента
            CounterpartyContact.query.filter_by(counterparty_id=cp_id).delete()
            
            # 2. Заглядаємо в шафу емейлів і теж чистимо все, що прив'язане до цього ID
            CounterpartyEmail.query.filter_by(counterparty_id=cp_id).delete()
            
            # 3. Шукаємо самого контрагента в головній шафі за його ID
            counterparty = Counterparty.query.get(cp_id)
            if counterparty:
                # Наказуємо працівнику бази даних: «Викинь цю картку контрагента в кошик»
                db.session.delete(counterparty)

        # Даємо фінальну команду: «Зберегти та зафіксувати всі видалення в базі назавжди!»
        db.session.commit()

        # Повертаємо радісну відповідь нашому JS-роботу в браузер
        return {
            "status": "success", 
            "message": f"Успішно видалено контрагентів: {len(ids_to_delete)} шт. разом з їхніми контактами!"
        }, 200

    except Exception as e:
        # Якщо базу заклинило — скасовуємо всі незавершені видалення для безпеки
        db.session.rollback()
        print(f"Помилка при масовому видаленні контрагентів: {e}")
        return {"status": "error", "message": f"Внутрішня помилка сервера: {str(e)}"}, 500


# -------------------------------------------------------------------------------------------
# МАРШРУТ: Збереження форми редагування контрагента
# -------------------------------------------------------------------------------------------
@app.route('/update_counterparty', methods=['POST'])
def update_counterparty():
    data = request.get_json()
    cp_id = data.get('id')
    edrpou = data.get('edrpou')

    # 1. ПЕРЕВІРКА НА ДУБЛЬ
    if edrpou and str(edrpou).strip():
        # Шукаємо контрагента з таким ЄДРПОУ, який НЕ є поточним контрагентом
        existing = Counterparty.query.filter_by(counterparty_edrpou=edrpou).first()
        
        # Якщо знайшли когось з таким ЄДРПОУ, і це НЕ той ID, що ми редагуємо
        if existing and str(existing.counterparty_id) != str(cp_id):
            return {
                "status": "error", 
                "message": f"Контрагент з ЄДРПОУ {edrpou} вже існує ({existing.counterparty_name}). Відкрийте його картку для редагування."
            }, 409 # 409 Conflict — спеціальний код помилки для таких випадків
    
    # 1-3. Логіка пошуку та оновлення основних полів (залишається без змін)
    cp = None
    if cp_id and str(cp_id).strip():
        cp = Counterparty.query.get(cp_id)
    if not cp and edrpou:
        cp = Counterparty.query.filter_by(counterparty_edrpou=edrpou).first()
    if not cp:
        cp = Counterparty()
        db.session.add(cp)
    
    cp.counterparty_name = data.get('name')
    cp.counterparty_edrpou = edrpou
    cp.counterparty_tax_number = data.get('tax_number')
    cp.counterparty_delivery_address = data.get('delivery')
    cp.counterparty_notes = data.get('notes')
    
    db.session.flush() 
    
    # 4. Оновлюємо контакти (телефони/імена)
    CounterpartyContact.query.filter_by(counterparty_id=cp.counterparty_id).delete()
    for c in data.get("all_contacts_phone", []):
        db.session.add(CounterpartyContact(
            counterparty_id=cp.counterparty_id,
            contact_phone=c.get("contact_phone"),
            contact_name=c.get("contact_name"),
            contact_role=c.get("contact_role")
            # Емейли прибрали звідси
        ))

    # 5. НОВИЙ БЛОК: Оновлюємо емейли
    CounterpartyEmail.query.filter_by(counterparty_id=cp.counterparty_id).delete()
    for e in data.get("all_contacts_emails", []):
        db.session.add(CounterpartyEmail(
            counterparty_id=cp.counterparty_id,
            contact_email=e.get("contact_email"),
            email_comment=e.get("contact_email_comment")
        ))
        
    db.session.commit()
    return {"status": "success", "new_id": cp.counterparty_id}, 200
if __name__ == '__main__':
    # Створюємо таблиці в базі даних автоматично при першому запуску
    with app.app_context():
        db.create_all()
    app.run(debug=True)