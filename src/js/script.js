let dataUserProfileArray = [];

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ, ГЕНЕРИРУЮЩАЯ МАССИВ ЮЗЕРОВ
  СИНТАКСИС:
    getDataUserArray(кол-во юзеров);
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
function getDataUserArray(amountUsers){
  const startTimeFunction = Date.now();

  dataUserProfileArray = [];
  if(amountUsers > 100000 || amountUsers <= 0 || typeof amountUsers != 'number'){
    if(amountUsers > 100000) throw new Error('значение не может быть больше 100 000');
    else if(amountUsers <= 0) throw new Error('значение не может быть меньше или равно нулю');
    else throw new Error('тип переданного значения не соотвествует допустимому (только number)');
  }
  for(let i = 0; i < amountUsers; i++){
    dataUserProfileArray.push(new UserProfileConstruction(dataUserProfileArray.length))
  }

  console.log(`%cБаза сгенерированна за: %c${Date.now() - startTimeFunction} ms.%c (%c${dataUserProfileArray.length}%c элементов)`, '', 'color: #e9c46a;', '', 'color: #2a9d8f;', '');
  dataUserProfileArray = dataUserProfileArray
  return dataUserProfileArray;
}

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ-КОНСТРУКТОР, ГЕНЕРИРУЮЩАЯ ПРОФИЛЬ-ОБЪЕКТ
  СИНТАКСИС:
    UserProfileConstruction(ид юзера);
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
function UserProfileConstruction(id){
  this.id = id;
  this.phoneNumber = getRandomPhoneNumber(); // Генератор номера телефона
  this.birthDate = getRandomDate(new Date(1960, 0, 1), new Date(2005, 0, 1)); // Генератор даты рождения
  this.registerDate = getRandomDate(new Date(2015, 0, 1)); // Генератор даты регистрации
  this.city = dataCity[Math.floor(Math.random() * dataCity.length)]; // Генератор города проживания
  this.chat = Math.random() < 0.7 ? getChatGenerator(this.registerDate, 'chat') : null; // Генератор чата с юзером
  this.notesAdmin = Math.random() < 0.4 ? getChatGenerator(this.registerDate, 'notes') : null;; // Генерация админ-заметок
  this.gender = Math.round(Math.random()); // Генерация пола юзера (0 - мужчина, 1 - женщина)

  /* Уникальные, зависит от пола юзера */
  this.userName = new GetRandomName(this.gender); // Генератор имени
  this.photoUrl = dataUsersPhoto[this.gender][Math.floor(Math.random() * dataUsersPhoto[this.gender].length)]; // Генерация фото юзера
}

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ-ПОИСКОВИК, ПО БАЗЕ ЮЗЕРОВ
  СИНТАКСИС:
    searchUserBase(ключевое значение поиска (для поиска по датам: {day: 1, month: 0, year: 2000}),
                    [параметры поиска: id, phoneNumber, birthDate, registerDate, city,
                                      userName.name, userName.lastName, userName.patronymic],
                    массив с базой данных);
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
function searchUserBase(valueSearch, arrRangeSearch, arrUsersBase) {
  const startTimeFunction = Date.now();

  let resultSearch = [];
  let regexValue = new RegExp(valueSearch, 'gi');

  homeLoop: for(let item of arrUsersBase){
    rangeLoop: for(let rangeSearch of arrRangeSearch){
      if(rangeSearch === 'id'){
        if(valueSearch == item.id){
          resultSearch.push(item);
          break homeLoop;
        }
        continue rangeLoop;
      }

      if(rangeSearch === 'birthDate' || rangeSearch === 'registerDate'){
        if('day' in valueSearch){
          if(item[rangeSearch].getDate() != valueSearch.day){continue rangeLoop;};
        };
        if('month' in valueSearch){
          if(item[rangeSearch].getMonth() != valueSearch.month){continue rangeLoop;};
        };
        if('year' in valueSearch){
          if(item[rangeSearch].getFullYear() != valueSearch.year){continue rangeLoop;};
        };

        resultSearch.push(item);
        continue homeLoop;
      }

      rangeSearch = rangeSearch.split('.');
      let itemSearch = item;
      for(let rangeSearchKey of rangeSearch){
        itemSearch = itemSearch[rangeSearchKey];
      }
      if((itemSearch.match(regexValue) || []).length > 0){
        resultSearch.push(item);
        continue homeLoop;
      }
    };
  };

  console.log(`%cПоиск завершен за: %c${Date.now() - startTimeFunction} ms.%c (найдено %c${resultSearch.length}%c элементов)`, '', 'color: #e9c46a;', '', 'color: #2a9d8f;', '');
  return resultSearch;
}

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ-КАЛЬКУЛЯТОР, КОТОРАЯ СЧИТАЕТ СКОЛЬКО ДНЕЙ ДО ДНЯ РОЖДЕНИЯ ОСТАЛОСЬ
  СИНТАКСИС:
    calcLeftUntilBirthday(дата дня рождения юзера);
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
function calcLeftUntilBirthday(birthDate){
  let todayDate = new Date(); todayDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  let birthThisYers = new Date(todayDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if((birthThisYers.getMonth() == todayDate.getMonth()) &&
    (birthThisYers.getDate() == todayDate.getDate())){
    return objectLeftUntilBirthDay('today', 0)
  }
  else if(birthThisYers < todayDate){
    const days = calcMillisecondsToDay(todayDate - birthThisYers);
    if(days <= 10){
      return objectLeftUntilBirthDay('ago', days);
    };
    birthThisYers = new Date((birthThisYers.getFullYear() + 1), birthDate.getMonth(), birthDate.getDate());
  };
  const days = calcMillisecondsToDay(birthThisYers - todayDate);
  return objectLeftUntilBirthDay('after', days);

  function objectLeftUntilBirthDay(typeVal, valueDay) {
    return {
      type: typeVal,
      value: valueDay
    };
  }
  function calcMillisecondsToDay(ms){
    return ms / 86400000;
  }
}