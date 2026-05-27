import os
from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv # Інструмент для читання твого "сейфа" .env
from datetime import datetime # Додай цей імпорт у самий верх файлу

# 1. Завантажуємо дані з файлу .env
load_dotenv()

app = Flask(__name__)

# 2. Беремо секрети із "сейфа"
app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)



#-------------------------------------------------------------------------------------------
# КРЕСЛЕННЯ "ШАФИ" СТАТУСІВ (РОЛЕЙ) 
# -------------------------------------------------------------------------------------------
class UserStatus(db.Model):
    __tablename__ = 'user_statuses'
    
    id = db.Column(db.Integer, primary_key=True)
    status_name = db.Column(db.String(50), unique=True, nullable=False) # Адмін, Юрист... 

    def __repr__(self):
        return f'<Status {self.status_name}>'



# -------------------------------------------------------------------------------------------
# КРЕСЛЕННЯ "ШАФИ" КОРИСТУВАЧІВ
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
# КРЕСЛЕННЯ "ШАФИ" ЛОГІВ / ЖУРНАЛУ
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
# КРЕСЛЕННЯ: "КОНТРАГЕНТ"
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
# КРЕСЛЕННЯ: "ТЕЛЕФОНИ КОНТРАГЕНТІВ" (ДЛЯ ДЕКІЛЬКОХ ТЕЛЕФОНІВ)
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
# КРЕСЛЕННЯ: "ЕМАЙЛИ КОНТРАГЕНТІВ" (ДЛЯ ДЕКІЛЬКОХ ПОШТОВИХ АДРЕС)
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
def log_action(user_id, action_type, entity_name, entity_id=None, changes=None):
    """
    user_id: Хто робив дію
    action_type: Створення, Редагування, Видалення, Вхід
    entity_name: Назва таблиці (наприклад, 'users' або 'agreements')
    entity_id: ID конкретного запису
    changes: Словник із даними, що саме змінилося (JSON)
    """
    new_log = ActionLog(
        user_id=user_id,
        action_type=action_type,
        entity_name=entity_name,
        entity_id=entity_id,
        changes=changes
    )
    db.session.add(new_log)
    db.session.commit()
    # Виводимо в термінал кожну дію
    print(f"--- LOG: {action_type} на {entity_name} (Користувач ID: {user_id}) ---")



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
        
        # 1. Шукаємо користувача в шафі "users" за емейлом
        user = User.query.filter_by(user_email=email).first()
        
        # 2. Якщо користувач наявний і пароль в БД (user.user_password) збігається із введеним (password)
        if user and user.user_password == password:
            # 3. Видаємо перепустку (записуємо ID користувача в сесію)
            session['user_id'] = user.id
            session['user_name'] = user.user_name
            
            # Логуємо успішний вхід
            log_action(user.id, 'Вхід', 'users', user.id)
            
            return redirect(url_for('dashboard'))
        else:
            return "Помилка: невірний емейл або пароль!"
            
    # Якщо просто відкрили сторінку - показуємо форму
    return render_template('login.html')


# НОВИЙ МАРШРУТ: ГОЛОВНИЙ КАБІНЕТ (DASHBOARD)
@app.route('/dashboard')
def dashboard():
    # Перевіряємо «перепустку»: якщо користувач не входив — повертаємо на прохідну
    if 'user_id' not in session:
        return redirect(url_for('login'))
        
    # Тепер дістаємо ім'я з кишені сесії
    current_username = session.get('user_name')
        
    # Передаємо це ім'я в коробку "name" для HTML сторінки
    return render_template('dashboard.html', name=current_username)


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
# МАРШРУТ: ПРИЙМАЛЬНИЙ ПУНКТ ДЛЯ СТВОРЕННЯ НОВОГО КОНТРАГЕНТА (З ДИНАМІЧНИМИ ДАНИМИ)
# -------------------------------------------------------------------------------------------
@app.route('/add_counterparty', methods=['POST'])
def add_counterparty():
    # Перевіряємо «перепустку» користувача
    if 'user_id' not in session:
        return {"status": "error", "message": "Помилка: доступ заборонено!"}, 403

    # Приймаємо валізу JSON від нашого JS-робота
    data = request.get_json()
    if not data:
        return {"status": "error", "message": "Помилка: дані не отримано!"}, 400

    # Дістаємо назву компанії (вона обов'язкова)
    name = data.get('counterparty_name', '').strip()
    if not name:
        return {"status": "error", "message": "Помилка: Назва контрагента є обов'язковою!"}, 400

    try:
        # 1. СТВОРЮЄМО ГОЛОВНОГО КОНТРАГЕНТА (Головна папка на полиці)
        new_counterparty = Counterparty(
            counterparty_name=name,
            counterparty_edrpou=data.get('counterparty_edrpou', '').strip(),
            counterparty_tax_number=data.get('counterparty_tax_number', '').strip(),
            counterparty_delivery_address=data.get('counterparty_delivery_address', '').strip(),
            counterparty_notes=data.get('counterparty_notes', '').strip()
        )
        
        # Кладемо головну папку в кошик сесії БД, щоб отримати її автоматичний ID
        db.session.add(new_counterparty)
        db.session.flush() # Магія: папка ще не збережена остаточно, але залізничний ID вже згенеровано!

        # 2. КОНВЕЄР: РОЗПАКОВУЄМО ТА ЗБЕРІГАЄМО СПИСКИ КОНТАКТІВ (ТЕЛЕФОНІВ)
        incoming_contacts = data.get('contacts', [])
        for contact_box in incoming_contacts:
            new_contact = CounterpartyContact(
                counterparty_id=new_counterparty.counterparty_id, # Прив'язуємо тросом до нашого контрагента
                contact_phone=contact_box.get('phone', '').strip(),
                contact_name=contact_box.get('name', '').strip(),
                contact_role=contact_box.get('role', '').strip()
            )
            db.session.add(new_contact)

        # 3. КОНВЕЄР: РОЗПАКОВУЄМО ТА ЗБЕРІГАЄМО СПИСКИ ЕМЕЙЛІВ
        incoming_emails = data.get('emails', [])
        for email_box in incoming_emails:
            new_email = CounterpartyEmail(
                counterparty_id=new_counterparty.counterparty_id, # Прив'язуємо тросом до нашого контрагента
                contact_email=email_box.get('email', '').strip(),
                email_comment=email_box.get('comment', '').strip()
            )
            db.session.add(new_email)

        # 4. ФІНАЛЬНИЙ СТУК МОЛОТКОМ: Зберігаємо все гуртом в реальну базу даних
        db.session.commit()

        # Логуємо дію нашого користувача в журнал дій
        log_action(session['user_id'], 'Створення', 'counterparties', new_counterparty.counterparty_id)

        return {"status": "success", "message": f"Контрагента '{name}' успішно створено разом з усіма контактами та емейлами!"}, 200

    except Exception as e:
        db.session.rollback() # Якщо конвеєр зламався — скасовуємо всі зміни, щоб не засмічувати базу
        print(f"Критична помилка при збереженні контрагента: {e}")
        return {"status": "error", "message": f"Внутрішня помилка сервера: {str(e)}"}, 500



# -------------------------------------------------------------------------------------------
# МАРШРУТ: ВИДАЧА СПИСКУ ВСІХ КОНТРАГЕНТІВ (РАЗОМ З ТЕЛЕФОНАМИ ТА ЕМЕЙЛАМИ)
# -------------------------------------------------------------------------------------------
@app.route('/get_counterparties', methods=['GET'])
def get_counterparties():
    # Перевіряємо «перепустку» користувача на прохідній системи
    if 'user_id' not in session:
        return {"status": "error", "message": "Помилка: доступ заборонено!"}, 403

    try:
        # Відкриваємо головну шафу і беремо абсолютно всіх живих контрагентів
        all_counterparties = Counterparty.query.all()
        
        # Створюємо велику порожню коробку-список для відправки на екран
        result_list = []
        
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
            # Створюємо фінальну картку контрагента, куди вкладаємо і його дані, і зібрані коробки контактів
            counterparty_data = {
                "id": cp.counterparty_id,                    # Ховаємо ID для майбутньої кнопки видалення
                "name": cp.counterparty_name,                # Назва фірми для клітинки таблиці
                "edrpou": cp.counterparty_edrpou,            # Код ЄДРПОУ компанії
                "tax_number": cp.counterparty_tax_number,      # Податковий номер
                "address": cp.counterparty_delivery_address, # Адреса Нової Пошти
                "notes": cp.counterparty_notes,              # Наші робочі нотатки
                "phones": phones_list,                        # Вкладаємо коробку з усіма телефонами
                "emails": emails_list                         # Вкладаємо коробку з усіма емейлами
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


if __name__ == '__main__':
    # Створюємо таблиці в базі даних автоматично при першому запуску
    with app.app_context():
        db.create_all()
    app.run(debug=True)