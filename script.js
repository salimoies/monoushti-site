let workers = {
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
  },
  ahmad: {
    password: "5678",
    name: "أحمد",
    role: "كاشير",
    off: "الأحد",
    schedule: {
      الاثنين: "10:00 - 18:00",
      الثلاثاء: "10:00 - 18:00",
      الأربعاء: "10:00 - 18:00",
      الخميس: "عطلة",
      الجمعة: "12:00 - 20:00",
      السبت: "12:00 - 20:00",
      الأحد: "عطلة"
    }
  }
};

const managerAccount = {
  username: "manager",
  password: "admin123"
};

const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

const loginCard = document.getElementById("loginCard");
const dashboardCard = document.getElementById("dashboardCard");
const managerCard = document.getElementById("managerCard");

const workerName = document.getElementById("workerName");
const workerRole = document.getElementById("workerRole");
const workerOffDay = document.getElementById("workerOffDay");
const welcomeText = document.getElementById("welcomeText");
const scheduleList = document.getElementById("scheduleList");

const logoutBtn = document.getElementById("logoutBtn");
const managerLogoutBtn = document.getElementById("managerLogoutBtn");
const workersList = document.getElementById("workersList");

loginBtn.addEventListener("click", function () {
  const user = username.value.trim().toLowerCase();
  const pass = password.value.trim();

  if (user === managerAccount.username && pass === managerAccount.password) {
    openManagerPanel();
    return;
  }

  const worker = workers[user];

  if (!worker) {
    alert("الاسم غير موجود");
    return;
  }

  if (worker.password !== pass) {
    alert("كلمة المرور غلط");
    return;
  }

  openWorkerDashboard(worker);
});

function openWorkerDashboard(worker) {
  loginCard.classList.add("hidden");
  managerCard.classList.add("hidden");
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
}

function openManagerPanel() {
  loginCard.classList.add("hidden");
  dashboardCard.classList.add("hidden");
  managerCard.classList.remove("hidden");
  renderWorkersList();
}

function renderWorkersList() {
  workersList.innerHTML = "";

  for (const usernameKey in workers) {
    const worker = workers[usernameKey];

    const item = document.createElement("div");
    item.className = "schedule-item";

    item.innerHTML = `
      <div>
        <strong>${worker.name}</strong><br>
        <small>${worker.role} - عطلته: ${worker.off}</small>
      </div>
      <div>
        <button type="button" data-user="${usernameKey}" class="delete-btn" style="background:#c62828; width:auto; padding:10px 14px;">حذف</button>
      </div>
    `;

    workersList.appendChild(item);
  }

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const usernameKey = this.dataset.user;
      deleteWorker(usernameKey);
    });
  });
}

function deleteWorker(usernameKey) {
  const ok = confirm("متأكد بدك تحذف هذا الموظف؟");
  if (!ok) return;

  delete workers[usernameKey];
  renderWorkersList();
}

logoutBtn.addEventListener("click", logout);
managerLogoutBtn.addEventListener("click", logout);

function logout() {
  dashboardCard.classList.add("hidden");
  managerCard.classList.add("hidden");
  loginCard.classList.remove("hidden");

  username.value = "";
  password.value = "";
  scheduleList.innerHTML = "";
}
