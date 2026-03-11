const workers = {
  salim: {
    password: "1234",
    fullName: "سليم",
    role: "عامل",
    offDay: "الثلاثاء",
    schedule: {
      الاثنين: "12:00 - 20:00",
      الثلاثاء: "عطلة",
      الأربعاء: "14:00 - 22:00"
    }
  }
};

const loginCard = document.getElementById("loginCard");
const dashboardCard = document.getElementById("dashboardCard");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const errorMessage = document.getElementById("errorMessage");

const welcomeText = document.getElementById("welcomeText");
const workerName = document.getElementById("workerName");
const workerRole = document.getElementById("workerRole");
const workerOffDay = document.getElementById("workerOffDay");
const scheduleList = document.getElementById("scheduleList");

function login() {
  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  errorMessage.textContent = "";

  if (!username || !password) {
    errorMessage.textContent = "عبّي الاسم وكلمة المرور.";
    return;
  }

  const worker = workers[username];

  if (!worker) {
    errorMessage.textContent = "الاسم غير موجود.";
    return;
  }

  if (worker.password !== password) {
    errorMessage.textContent = "كلمة المرور غلط.";
    return;
  }

  showDashboard(worker);
}

function showDashboard(worker) {
  loginCard.classList.add("hidden");
  dashboardCard.classList.remove("hidden");

  welcomeText.textContent = أهلًا ${worker.fullName};
  workerName.textContent = worker.fullName;
  workerRole.textContent = worker.role;
  workerOffDay.textContent = worker.offDay;

  scheduleList.innerHTML = "";

  for (const day in worker.schedule) {
    const item = document.createElement("div");
    item.className = "schedule-item";
    item.innerHTML = `
      <span class="day">${day}</span>
      <span class="time">${worker.schedule[day]}</span>
    `;
    scheduleList.appendChild(item);
  }
}

function logout() {
  dashboardCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
  errorMessage.textContent = "";
}

loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
