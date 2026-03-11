document.addEventListener("DOMContentLoaded", function () {
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

  const addWorkerBtn = document.getElementById("addWorkerBtn");
  const workerFormCard = document.getElementById("workerFormCard");
  const formTitle = document.getElementById("formTitle");

  const formUsername = document.getElementById("formUsername");
  const formPassword = document.getElementById("formPassword");
  const formName = document.getElementById("formName");
  const formRole = document.getElementById("formRole");
  const formOff = document.getElementById("formOff");

  const monInput = document.getElementById("monInput");
  const tueInput = document.getElementById("tueInput");
  const wedInput = document.getElementById("wedInput");
  const thuInput = document.getElementById("thuInput");
  const friInput = document.getElementById("friInput");
  const satInput = document.getElementById("satInput");
  const sunInput = document.getElementById("sunInput");

  const saveWorkerBtn = document.getElementById("saveWorkerBtn");
  const cancelWorkerBtn = document.getElementById("cancelWorkerBtn");

  let editingWorker = null;

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
    workerFormCard.classList.add("hidden");
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
    workerFormCard.classList.add("hidden");
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
        <div style="display:flex; gap:8px;">
          <button type="button" data-user="${usernameKey}" class="edit-btn" style="width:auto; padding:10px 14px;">تعديل</button>
          <button type="button" data-user="${usernameKey}" class="delete-btn" style="background:#c62828; width:auto; padding:10px 14px;">حذف</button>
        </div>
      `;

      workersList.appendChild(item);
    }

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        deleteWorker(this.dataset.user);
      });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        openEditForm(this.dataset.user);
      });
    });
  }

  function deleteWorker(usernameKey) {
    const ok = confirm("متأكد بدك تحذف هذا الموظف؟");
    if (!ok) return;
    delete workers[usernameKey];
    renderWorkersList();
  }

  function clearForm() {
    formUsername.value = "";
    formPassword.value = "";
    formName.value = "";
    formRole.value = "";
    formOff.value = "";
    monInput.value = "";
    tueInput.value = "";
    wedInput.value = "";
    thuInput.value = "";
    friInput.value = "";
    satInput.value = "";
    sunInput.value = "";
  }

  function openAddForm() {
    editingWorker = null;
    formTitle.innerText = "إضافة عامل";
    clearForm();
    formUsername.disabled = false;
    workerFormCard.classList.remove("hidden");
  }

  function openEditForm(usernameKey) {
    const worker = workers[usernameKey];
    if (!worker) return;

    editingWorker = usernameKey;
    formTitle.innerText = "تعديل عامل";

    formUsername.value = usernameKey;
    formPassword.value = worker.password;
    formName.value = worker.name;
    formRole.value = worker.role;
    formOff.value = worker.off;

    monInput.value = worker.schedule["الاثنين"] || "";
    tueInput.value = worker.schedule["الثلاثاء"] || "";
    wedInput.value = worker.schedule["الأربعاء"] || "";
    thuInput.value = worker.schedule["الخميس"] || "";
    friInput.value = worker.schedule["الجمعة"] || "";
    satInput.value = worker.schedule["السبت"] || "";
    sunInput.value = worker.schedule["الأحد"] || "";

    formUsername.disabled = true;
    workerFormCard.classList.remove("hidden");
  }

  addWorkerBtn.addEventListener("click", openAddForm);

  cancelWorkerBtn.addEventListener("click", function () {
    workerFormCard.classList.add("hidden");
    clearForm();
  });

  saveWorkerBtn.addEventListener("click", function () {
    const usernameKey = formUsername.value.trim().toLowerCase();
    const passwordValue = formPassword.value.trim();
    const nameValue = formName.value.trim();
    const roleValue = formRole.value.trim();
    const offValue = formOff.value.trim();

    if (!usernameKey || !passwordValue || !nameValue) {
      alert("عبي اسم المستخدم وكلمة المرور والاسم.");
      return;
    }

    const workerData = {
      password: passwordValue,
      name: nameValue,
      role: roleValue,
      off: offValue,
      schedule: {
        الاثنين: monInput.value.trim(),
        الثلاثاء: tueInput.value.trim(),
        الأربعاء: wedInput.value.trim(),
        الخميس: thuInput.value.trim(),
        الجمعة: friInput.value.trim(),
        السبت: satInput.value.trim(),
        الأحد: sunInput.value.trim()
      }
    };

    if (editingWorker) {
      workers[editingWorker] = workerData;
    } else {
      if (workers[usernameKey]) {
        alert("اسم المستخدم موجود من قبل.");
        return;
      }
      workers[usernameKey] = workerData;
    }

    workerFormCard.classList.add("hidden");
    clearForm();
    renderWorkersList();
  });

  logoutBtn.addEventListener("click", logout);
  managerLogoutBtn.addEventListener("click", logout);

  function logout() {
    dashboardCard.classList.add("hidden");
    managerCard.classList.add("hidden");
    workerFormCard.classList.add("hidden");
    loginCard.classList.remove("hidden");
    username.value = "";
    password.value = "";
    scheduleList.innerHTML = "";
  }
});
