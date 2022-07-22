  function searchUser(word, arrUsers){
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
      resultSearch = arrUsers.filter((item) => (item['user name'].match(regex) || []).length > 0);

      timeSearch.filterMatch.end = Date.now();
      console.log(`Filter match alg. time: ${timeSearch.filterMatch.fullTime()} ms. (res: ${resultSearch.length} elem.)`);
    }
    return resultSearch;
  }

/* НАЧАЛО СКРИПТА */

let dataUserProfileArray;

/* \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
ФУНКЦИЯ, ГЕНЕРИРУЮЩАЯ МАССИВ ЮЗЕРОВ
  СИНТАКСИС:
    getDataUserArray(кол-во юзеров);
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */
function getDataUserArray(amountUsers){
  let dataUserProfileArray = [];
  if(amountUsers > 1000000 || amountUsers <= 0 || typeof amountUsers != 'number'){
    if(amountUsers > 1000000) throw new Error('значение не может быть больше 1 000 000');
    else if(amountUsers <= 0) throw new Error('значение не может быть меньше или равно нулю');
    else throw new Error('тип переданного значения не соотвествует допустимому (только number)');
  }
  for(let i = 0; i < amountUsers; i++){
    dataUserProfileArray.push(new UserProfileConstruction(dataUserProfileArray.length))
  }
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
  this.sex = Math.round(Math.random()); // Генерация пола юзера (0 - мужчина, 1 - женщина)

  /* Уникальные, зависит от пола юзера */
  this.userName = new GetRandomName(this.sex); // Генератор имени
  this.photoUrl = dataUsersPhoto[this.sex][Math.floor(Math.random() * dataUsersPhoto[this.sex].length)]; // Генерация фото юзера
}