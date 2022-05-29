var displayList = [];
var isEditMode = false;
var toggleModal = false;
var toggleEditModal = false;
var isDisplayAfterCheck = false;
var editButtonId = -1;

var today = new Date().toISOString().split("T")[0];
document.getElementById("dateInput").setAttribute("min", today);

getDataFromLocalStorage();
displayListOnScreen();

class ListItem {
  text;
  checked = false;
  fromTime;
  toTime;
  date;
  constructor(text, checked, fromTime, toTime, date) {
    this.text = text;
    this.checked = checked;
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.date = date;
  }
}

function getDataFromLocalStorage() {
  var taskList = localStorage.getItem("taskList");
  if (taskList) {
    displayList = JSON.parse(taskList);
  }
}

function updateLocalStorage() {
  localStorage.setItem("taskList", JSON.stringify(displayList));
}

function checkAndDisplayEmptyListWarning() {
  if (displayList.length === 0) {
    document.getElementById("warning-text").style.display = "flex";
  } else {
    document.getElementById("warning-text").style.display = "none";
  }
}

function addOrEditList() {
  if (document.getElementById("item-info").value) {
    if (
      (document.getElementById("fromTime").value &&
        document.getElementById("toTime").value) ||
      (!document.getElementById("fromTime").value &&
        !document.getElementById("toTime").value)
    ) {
      var item = document.getElementById("item-info").value;
      var fromTime = document.getElementById("fromTime").value;
      var toTime = document.getElementById("toTime").value;
      var date = document.getElementById("dateInput").value;
      if (isEditMode) {
        isEditMode = false;
        displayList[editButtonId].text = item;
        displayList[editButtonId].fromTime = fromTime;
        displayList[editButtonId].toTime = toTime;
        displayList[editButtonId].date = date;
      } else {
        var listItem = new ListItem(item, false, fromTime, toTime, date);
        displayList.unshift(listItem);
      }
      updateLocalStorage();

      errorElement = document.getElementById("input-empty-error-message");
      if (errorElement.innerHTML !== "") {
        errorElement.innerHTML = "";
      }
      toggleModal = true;
      displayListOnScreen();
    } else {
      errorElement = document.getElementById("input-empty-error-message");
      errorElement.innerHTML = "Please enter your duration!";
    }
  } else {
    errorElement = document.getElementById("input-empty-error-message");
    errorElement.innerHTML = "Please enter your task!";
  }
}

function addTask() {
  document.getElementById("itemModalLabel").innerHTML =
    "What would you like to do?";
  document.getElementById("modal-btn").innerHTML = "Add";
  $("#itemModal").modal("toggle");
}

function clearList() {
  displayList = [];
  updateLocalStorage();
  displayListOnScreen();
}

function deleteItem(event) {
  displayList.splice(event.id, 1);
  updateLocalStorage();
  displayListOnScreen();
}

function editItem(event) {
  isEditMode = true;
  editButtonId = event.id;
  var itemText = displayList[event.id].text;
  var fromTime = displayList[event.id].fromTime;
  var toTime = displayList[event.id].toTime;
  var dateInput = displayList[event.id].date;
  document.getElementById("item-info").value = itemText;
  document.getElementById("fromTime").value = fromTime;
  document.getElementById("toTime").value = toTime;
  document.getElementById("dateInput").value = dateInput;
  document.getElementById("itemModalLabel").innerHTML = "Edit your task";
  document.getElementById("modal-btn").innerHTML = "Save";
  $("#itemModal").modal("toggle");
}

function checkItem(event) {
  displayList[event.id].checked = true;
  //push finished task to end
  var checkedItem = displayList[event.id];
  displayList.splice(event.id, 1);
  displayList.push(checkedItem);

  updateLocalStorage();
  isDisplayAfterCheck = true;
  displayListOnScreen();
}

function displayListOnScreen() {
  checkAndDisplayEmptyListWarning();
  // clear on screen list
  document.querySelector("ul").innerHTML = "";

  displayList.forEach((item, itemCount) => {
    var ul = document.getElementById("todo-list");
    var li = document.createElement("LI");
    li.setAttribute("class", "li-container");
    var firstLineDiv = document.createElement("div");
    firstLineDiv.setAttribute("class", "li-firstline-container");
    var timeAndDateDiv = document.createElement("div");
    timeAndDateDiv.setAttribute("class", "time-date-container text-muted");
    var checkbox = document.createElement("button");
    var divAroundH4 = document.createElement("div");
    divAroundH4.setAttribute("class", "todo-text-container");
    var h4 = document.createElement("h4");
    var divAroundButtons = document.createElement("div");
    divAroundButtons.setAttribute("class", "delete-edit-btn-container");
    var deleteButton = document.createElement("button");
    var editButton = document.createElement("button");

    checkbox.setAttribute("id", itemCount);
    checkbox.setAttribute("class", "btn checkbox-btn");
    checkbox.setAttribute("onclick", "checkItem(this)");
    checkbox.innerHTML =
      '<span id="checkbox-icon" class="material-icons">task_alt</span>';

    deleteButton.setAttribute("id", itemCount);
    deleteButton.setAttribute("class", "btn delete-btn");
    deleteButton.setAttribute("onclick", "deleteItem(this)");
    deleteButton.innerHTML =
      '<span id="delete-icon" class="material-icons">delete</span>';

    editButton.setAttribute("id", itemCount);
    editButton.setAttribute("class", "btn edit-btn");
    editButton.setAttribute("onclick", "editItem(this)");
    editButton.innerHTML =
      '<span id="edit-icon" class="material-icons">edit</span>';

    h4.innerHTML = item.text;
    divAroundH4.appendChild(checkbox);
    divAroundH4.appendChild(h4);
    divAroundButtons.appendChild(deleteButton);
    divAroundButtons.appendChild(editButton);

    var liDiv = document.createElement("div");
    liDiv.setAttribute("class", "li-contents-container");
    firstLineDiv.appendChild(divAroundH4);
    firstLineDiv.appendChild(divAroundButtons);
    liDiv.appendChild(firstLineDiv);
    liDiv.appendChild(timeAndDateDiv);

    if (item.fromTime !== "") {
      timeAndDateDiv.innerHTML =
        '<span class="material-icons">schedule</span>' +
        item.fromTime +
        "&nbsp;-&nbsp;" +
        item.toTime +
        "&nbsp;&nbsp;";
    }

    if (item.date !== "") {
      timeAndDateDiv.innerHTML +=
        '<span class="material-icons">event</span>' + item.date;
    }

    if (item.checked) {
      liDiv.style.border = "2px solid #03c04a";
      liDiv.style.backgroundColor = "#a0fac3";
      checkbox.style.color = "#03c04a";
      //add checkbox animation
      if (isDisplayAfterCheck && itemCount === displayList.length - 1) {
        isDisplayAfterCheck = false;
        checkbox.setAttribute(
          "class",
          checkbox.getAttribute("class") + " checkbox-btn-animation"
        );
      }

      //disable edit button
      editButton.setAttribute("disabled", "true");
      editButton.setAttribute(
        "class",
        editButton.getAttribute("class") + " edit-btn-disabled"
      );

      //disable checkbox
      checkbox.setAttribute("disabled", "true");
      checkbox.setAttribute(
        "class",
        checkbox.getAttribute("class") + " checkbox-btn-disabled"
      );
    } else {
      liDiv.style.border = "2px solid #4a4a4a";
      liDiv.style.backgroundColor = "#e0dfdb";
      checkbox.style.color = "#9a9a9a";
    }

    li.appendChild(liDiv);
    ul.appendChild(li);
  });

  if (toggleModal) {
    document.getElementById("item-info").value = "";
    document.getElementById("fromTime").value = "";
    document.getElementById("toTime").value = "";
    document.getElementById("dateInput").value = "";
    $("#itemModal").modal("toggle");
    toggleModal = false;
  }
}
