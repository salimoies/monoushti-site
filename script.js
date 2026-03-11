const workers = {
  salim: {
    password: "1234",
    name: "سليم",
    role: "عامل",
    off: "الثلاثاء",
    schedule: {
      الاثنين: "12:00 - 20:00",
      الثلاثاء: "عطلة",
      الأربعاء: "14:00 - 22:00",
      الخميس: "12:00 - 20:00",
      الجمعة: "16:00 - 23:00",
      السبت: "14:00 - 22:00",
      الأحد: "عطلة"
    }
  }
};

const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

const loginCard = document.getElementById("loginCard");
const dashboardCard = document.getElementById("dashboardCard");

const workerName = document.getElementById("workerName");
const workerRole = document.getElementById("workerRole");
const workerOffDay = document.getElementById("workerOffDay");
const welcomeText = document.getElementById("welcomeText");
const scheduleList = document.getElementById("scheduleList");
const logoutBtn = document.getElementById("logoutBtn");

loginBtn.addEventListener("click", function () {
  const user = username.value.trim().toLowerCase();
  const pass = password.value.trim();

  const worker = workers[user];

  if (!worker) {
    alert("الاسم غير موجود");
    return;
  }

  if (worker.password !== pass) {
    alert("كلمة المرور غلط");
    return;
  }

  loginCard.classList.add("hidden");
  dashboardCard.classList.remove("hidden");

  welcomeText.innerText = "أهلًا " + worker.name;
  workerName.innerText = worker.name;
  workerRole.innerText = worker.role;
  workerOffDay.innerText = worker.off;

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
});

logoutBtn.addEventListener("click", function () {
  dashboardCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  username.value = "";
  password.value = "";
  scheduleList.innerHTML = "";
});
