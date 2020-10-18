// clock

const clockDisplay = document.querySelector(".clock-display");

const getLocalTime = () => {
    const data = new Date();
    const min = data.getMinutes();
    const hour = data.getHours();
    clockDisplay.innerText = `${hour < 10 ? `0${hour}`: hour}:${min < 10 ? `0${min}`:min}`
}

getLocalTime()
setInterval(getLocalTime, 1000);

// clock end
// 이름 입력받기
const nameForm = document.querySelector(".name-form");
const nameInput = nameForm.querySelector("input");
const nameDisplay = document.querySelector(".name-display h2");

const inputName = event => {
    event.preventDefault();
    const curName = nameInput.value;
    localStorage.setItem("username", curName);
    showName(curName);
}

const formHandler = () => {
    nameForm.classList.add("show");
    nameForm.addEventListener('submit', inputName);
}

const showName = text => {
    nameForm.classList.remove("show");
    nameDisplay.classList.add("show");
    nameDisplay.innerText = `Welcome ${text}`;
}

const getUserInfo = () => {
    const curUser = localStorage.getItem("username");
    if(curUser === null){
        formHandler();
    }else{
        showName(curUser);
    }
}

getUserInfo();
// 이름 입력받기 END
// todo 
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todo-list");

let todoData = [];

const createID = () => Math.ceil(Math.random() * 100000000);

const saveLocalStorage = (data) =>{
    localStorage.setItem("tododata", JSON.stringify(data));
}

const deleteTodo = (event) => {
    const {target: { parentNode: li }} = event;
    todoList.removeChild(li);
    const newTodoData = todoData.filter(todo => todo.id !== parseInt(li.id));
    todoData = newTodoData;
    saveLocalStorage(todoData);
}

const onFinished = (target) => {
    target.classList.add("finished");
    const newState = todoData.map(item => {
        if(item.id === parseInt(target.id)){
            item.success = true;
            
        }
        return item;
    });
    return newState;
}

const cancelFinished = target => {
    target.classList.remove("finished");
    const newState = todoData.map(item => {
        if(item.id === parseInt(target.id)){
            item.success = false;
            
        }
        return item;
    });
    return newState;
}

const setFinishState = event => {
    const {target: { parentNode: li }} = event;
    if(li.classList.contains("finished")){
        todoData = cancelFinished(li);
    } else {
        todoData = onFinished(li);
    }

    saveLocalStorage(todoData);
}

const showTodoList = text => {
    const li = document.createElement("li");
    const del = document.createElement("button");
    const fin = document.createElement("button");
    const span = document.createElement('span');
    const id = createID();
    //delete
    del.innerText = "X";
    del.addEventListener('click', deleteTodo);
    //finished
    fin.innerText = "O"
    fin.addEventListener('click', setFinishState);

    span.innerText = text;

    li.appendChild(span);
    li.appendChild(del);
    li.appendChild(fin);
    li.id = id;

    todoList.appendChild(li);

    const data = {
        text,
        id,
        success: false
    }

    todoData.push(data);
    saveLocalStorage(todoData);
}

const getTodoData = event => {
    event.preventDefault();
    const curTask = todoInput.value;
    showTodoList(curTask);
    todoInput.value = "";
}
 
const loadData = () => {
    const data = JSON.parse(localStorage.getItem('tododata'));
    if(data !== null){
        data.forEach(todo => {
            showTodoList(todo.text);
        })
    }
}
loadData();
todoForm.addEventListener('submit', getTodoData);
// todo end

// bg
const wrap = document.querySelector(".wrap");

const randomBG = () => {
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    wrap.style.backgroundImage = `url('img/${randomNumber}.jpg')`;
}

window.addEventListener('load', randomBG);

// weather


const weather = document.querySelector(".weater-wrap");
const API_KEY = "2bb4d7864e57694acbe21989fe494cba";
const successLocation = (pos) => {
 
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude
    const locationData = {
        lat,
        lon
    }
    localStorage.setItem('location', JSON.stringify(locationData));
}

const getWeather = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    .then(res => {
        return res.json();
    })
    .then(data => {
        const tem = data.main.temp;
        const location = data.name;
        weather.innerText = `${tem} ${location}`;
    })
    .catch(error => console.log(error));
}

const getLocation = () => {
    navigator.geolocation.getCurrentPosition(successLocation, (err) => console.log(err));
}

const loadWeather = () => {
    const locationData = JSON.parse(localStorage.getItem("location"));
    
    if(locationData === null){
        getLocation();
    } else {
        const {lat, lon} = locationData;
        getWeather(lat, lon);
    }
}

loadWeather();