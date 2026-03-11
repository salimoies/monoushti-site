const workers = {
  salim: {
    password: "1234",
    fullName: "سليم",
    role: "عامل",
    offDay: "الثلاثاء",
    schedule: {
      الاثنين: "12:00 - 20:00",
      الثلاثاء: "عطلة",
      الأربعاء: "14:00 - 22:00",
      الخميس: "12:00 - 20:00",
      الجمعة: "16:00 - 23:00",
      السبت: "14:00 - 22:00",
      الأحد: "عطلة"
    }
  },

  ahmad: {
    password: "5678",
    fullName: "أحمد",
    role: "كاشير",
    offDay: "الأحد",
    schedule: {
      الاثنين: "10:00 - 18:00",
      الثلاثاء: "10:00 - 18:00",
      الأربعاء: "10:00 - 18:00",
      الخميس: "عطلة",
      الجمعة: "12:00 - 20:00",
      السبت: "12:00 - 20:00",
      الأحد: "عطلة"
    }
  },

  ali: {
    password: "9999",
    fullName: "علي",
    role: "شيف",
    offDay: "الجمعة",
    schedule: {
      الاثنين: "09:00 - 17:00",
      الثلاثاء: "09:00 - 17:00",
      الأربعاء: "09:00 - 17:00",
      الخميس: "09:00 - 17:00",
      الجمعة: "عطلة",
      السبت: "11:00 - 19:00",
      الأحد: "11:00 - 19:00"
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

passwordInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    login();
  }
});

showStep(currentStep);
