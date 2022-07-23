let dataUserProfileArray = [];
getDataUserArray(100000);

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

  console.log(`${Date.now() - startTimeFunction} ms.`);
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

/* function searchUser(word, arrUsers){
  let resultSearch = [];
  let timeSearch = {
    filterMatch: {
      start: 0,
      end: 0,
      fullTime: function() {return this.end - this.start},
    }
  };

  {
    timeSearch.filterMatch.start = Date.now();

    let regex = new RegExp(word, 'gi');
    resultSearch = arrUsers.filter((item) => ((`${item.userName.name} ${item.userName.lastName} ${item.userName.patronymic}`).match(regex) || []).length > 0);

    timeSearch.filterMatch.end = Date.now();
    console.log(`Filter match alg. time: ${timeSearch.filterMatch.fullTime()} ms. (res: ${resultSearch.length} elem.)`);
  }
  return resultSearch;
} */

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ-ПОИСКОВИК, ПО БАЗЕ ЮЗЕРОВ
  СИНТАКСИС:
    searchUserBase(ключевое значение поиска, [параметры поиска], массив с базой данных);
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

  console.log(`${Date.now() - startTimeFunction} ms.`);
  console.log(resultSearch);
  return resultSearch;
}

searchUserBase({day: 18, month: 2},
              ['registerDate', 'birthDate'],
              dataUserProfileArray);

// [city, userName.lastName, userName.name, userName.patronymic],