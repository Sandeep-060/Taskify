const textArea = document.querySelector('.textarea')
const addBtn = document.querySelector('.addbtn')
const taskList = document.querySelector('.tasklist')
const List = document.querySelector('.list')
const totalTasks=document.querySelector('.total-tasks')
const completedTasks=document.querySelector('.completed-tasks')
const remainingTasks=document.querySelector('.remaining-tasks')
const toggleDarkBtn = document.querySelector(".toggle-dark");
let todovalue = null

const clearBtn = document.createElement('button')
clearBtn.textContent = "Clear All"
clearBtn.className = "clearbtn btn"
clearBtn.style.display = "none"
taskList.append(clearBtn)

function updateSummary(){
  let total=List.querySelectorAll('li').length
  let completed=0
  List.querySelectorAll('li').forEach(li=>{
    let check=li.querySelector(".task-checkbox")
    if(check.checked){
      completed++
    }
  })
  let remaining=total-completed
  totalTasks.innerHTML=`All(${total})`
  completedTasks.innerHTML=`Completed(${completed})`
  remainingTasks.innerHTML=`Pending(${remaining})`
}


function displayClearBtn() {
  if (List.children.length > 0) {
    clearBtn.style.display = 'block'
  } else {
    clearBtn.style.display = "none"
  }
  updateSummary()

}

function handleCheckbox(checkbox, p, li) {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      p.style.textDecoration = 'line-through'
      li.style.backgroundColor = "#dacccc"
    } else {
      p.style.textDecoration = 'none'
      li.style.backgroundColor = "white"
    }
    saveTodo()
  })
}


function addingTask(e) {
  let enteredTask = textArea.value.trim()
  if (enteredTask === "" || enteredTask.trim() === "") {
    alert("Please enter some task")
  } else {
    if (addBtn.value == "Edit") {
      todovalue.textContent = enteredTask
      addBtn.value = "Add"
      textArea.value = ""
      textArea.focus()
    } else {
      //create li->p,(buttongrpdiv->edit,removebtn)
      const li = document.createElement('li')

      const leftDiv = document.createElement('div')
      leftDiv.className = "left-part"
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'task-checkbox'
      const p = document.createElement('p')
      leftDiv.append(checkbox, p)

      const buttonGrpDiv = document.createElement('div')
      buttonGrpDiv.classList.add('btngrp')
      buttonGrpDiv.innerHTML = `
      <button class="btn editbtn"> Edit</button> 
      <button class="btn removebtn"> Remove</button>
      `
      handleCheckbox(checkbox, p, li)

      p.textContent = `${enteredTask.trim()}`
      li.append(leftDiv, buttonGrpDiv)
      List.append(li)
      textArea.value = ""
      textArea.focus()
    }
  }
  displayClearBtn()
  updateSummary()
  saveTodo()
}

function updateTodo(e) {
  if (e.target.classList.contains('removebtn')) {
    e.target.parentNode.parentNode.remove()
    displayClearBtn()

  } else if (e.target.classList.contains('editbtn')) {
    todovalue = e.target.parentNode.previousElementSibling.children[1]
    textArea.value = todovalue.textContent
    addBtn.value = "Edit"
    textArea.focus()
  }
  updateSummary()
  saveTodo()
}

function saveTodo() {
  const tasks = []
  List.querySelectorAll('li').forEach(li => {
    const p = li.querySelector('p')
    const checkbox = li.querySelector('.task-checkbox')
    tasks.push({
      text: p.textContent,
      checkedd: checkbox.checked
    })
  })
  localStorage.setItem("todo", JSON.stringify(tasks))
}

function displayOnReload() {
  const saved = JSON.parse(localStorage.getItem("todo")) || []
  saved.forEach(({ text, checkedd }) => {
    const li = document.createElement('li')

    const leftDiv = document.createElement('div')
    leftDiv.className = "left-part"

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.className = 'task-checkbox'
    checkbox.checked = checkedd


    const p = document.createElement('p')
    leftDiv.append(checkbox, p)

    p.textContent = text
    p.textContent = text
    p.style.textDecoration = checkedd ? 'line-through' : 'none'
    li.style.backgroundColor = checkedd ? "#dacccc" : "white"

    handleCheckbox(checkbox, p, li)

    const buttonGrpDiv = document.createElement('div')
    buttonGrpDiv.classList.add('btngrp')
    buttonGrpDiv.innerHTML = `
      <button class="btn editbtn"> Edit</button> 
      <button class="btn removebtn"> Remove</button>
      `

    li.append(leftDiv, buttonGrpDiv)
    List.append(li)
    textArea.value = ""
    textArea.focus()
  })
  displayClearBtn()
  updateSummary()
}

function clear() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    List.innerHTML = ""
    saveTodo()
    displayClearBtn()
  }
}

function filtertask(type){
  const alltasks=document.querySelectorAll(".list li")

  alltasks.forEach(task=>{
    const isCheck=task.querySelector(".task-checkbox").checked
    if (type==="all"){
      task.style.display = "flex"
    }else if(type==="completed"){
      task.style.display = isCheck ? "flex" : "none"
    }else if(type==="pending"){
      task.style.display = !isCheck? "flex" : "none"
    }
  })
}
addBtn.addEventListener('click', addingTask)
List.addEventListener('click', updateTodo)
clearBtn.addEventListener('click', clear)
window.addEventListener("DOMContentLoaded", displayOnReload)
totalTasks.addEventListener("click",()=>{filtertask("all")})
completedTasks.addEventListener("click",()=>{filtertask("completed")})
remainingTasks.addEventListener("click",()=>{filtertask("pending")})
textArea.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault()
    addBtn.click()
  }
})
toggleDarkBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark-mode")
  const isDark=document.body.classList.contains("dark-mode")
  localStorage.setItem("theme",isDark? "dark":"light")
})
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
});
