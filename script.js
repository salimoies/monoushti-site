document.addEventListener("DOMContentLoaded", function () {
  const days = [
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
    "الأحد"
  ];

  const roleOptions = ["مانجر", "شوفير", "عامل مطبخ"];
  const noteOptions = ["توصيل", "تطحين", "تقطيع", "شغل جوا"];
  const timeOptions = generateTimeOptions("00:00", "23:30", 30);

  let workers = {
    salim: {
      password: "1234",
      name: "سليم",
      role: "عامل مطبخ",
      schedule: {
        الاثنين: { off: false, start: "12:00", end: "20:00", note: "شغل جوا" },
        الثلاثاء: { off: true, start: "", end: "", note: "" },
        الأربعاء: { off: false, start: "14:00", end: "22:00", note: "تقطيع" },
        الخميس: { off: false, start: "12:00", end: "20:00", note: "تطحين" },
        الجمعة: { off: false, start: "16:00", end: "23:00", note: "شغل جوا" },
        السبت: { off: false, start: "14:00", end: "22:00", note: "تقطيع" },
        الأحد: { off: true, start: "", end: "", note: "" }
      }
    },
    ahmad: {
      password: "5678",
      name: "أحمد",
      role: "شوفير",
      schedule: {
        الاثنين: { off: false, start: "10:00", end: "18:00", note: "توصيل" },
        الثلاثاء: { off: false, start: "10:00", end: "18:00", note: "توصيل" },
        الأربعاء: { off: false, start: "10:00", end: "18:00", note: "توصيل" },
        الخميس: { off: true, start: "", end: "", note: "" },
        الجمعة: { off: false, start: "12:00", end: "20:00", note: "توصيل" },
        السبت: { off: false, start: "12:00", end: "20:00", note: "توصيل" },
        الأحد: { off: true, start: "", end: "", note: "" }
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
  const welcomeText = document.getElementById("welcomeText");
  const scheduleList = document.getElementById("scheduleList");

  const logoutBtn = document.getElementById("logoutBtn");
  const managerLogoutBtn = document.getElementById("managerLogoutBtn");
  const workersList = document.getElementById("workersList");

  const addWorkerBtn = document.getElementById("addWorkerBtn");
  const workerFormCard = document.getElementById("workerFormCard");
  const formTitle = document.getElementById("formTitle");

  const formName = document.getElementById("formName");
  const formUsername = document.getElementById("formUsername");
  const formPassword = document.getElementById("formPassword");
  const formRole = document.getElementById("formRole");

  const daysContainer = document.getElementById("daysContainer");

  const saveWorkerBtn = document.getElementById("saveWorkerBtn");
  const cancelWorkerBtn = document.getElementById("cancelWorkerBtn");

  let editingWorker = null;

  buildDaysInputs();

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

  addWorkerBtn.addEventListener("click", openAddForm);

  cancelWorkerBtn.addEventListener("click", function () {
    workerFormCard.classList.add("hidden");
    clearForm();
  });

  saveWorkerBtn.addEventListener("click", function () {
    const usernameKey = formUsername.value.trim().toLowerCase();
    const passwordValue = formPassword.value.trim();
    const nameValue = formName.value.trim();
    const roleValue = formRole.value;

    if (!usernameKey || !passwordValue || !nameValue) {
      alert("عبي اسم العامل واسم المستخدم وكلمة السر.");
      return;
    }

    const schedule = {};

    for (const day of days) {
      const offCheckbox = document.getElementById(`${day}-off`);
      const startSelect = document.getElementById(`${day}-start`);
      const endSelect = document.getElementById(`${day}-end`);
      const noteSelect = document.getElementById(`${day}-note`);

      if (offCheckbox.checked) {
        schedule[day] = {
          off: true,
          start: "",
          end: "",
          note: ""
        };
      } else {
        const startValue = startSelect.value;
        const endValue = endSelect.value;
        const noteValue = noteSelect.value;

        if (!startValue || !endValue || !noteValue) {
          alert(`كمّل بيانات يوم ${day}`);
          return;
        }

        if (startValue >= endValue) {
          alert(`وقت البداية لازم يكون قبل وقت النهاية في يوم ${day}`);
          return;
        }

        schedule[day] = {
          off: false,
          start: startValue,
          end: endValue,
          note: noteValue
        };
      }
    }

    const workerData = {
      password: passwordValue,
      name: nameValue,
      role: roleValue,
      schedule: schedule
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

  function openWorkerDashboard(worker) {
    loginCard.classList.add("hidden");
    managerCard.classList.add("hidden");
    workerFormCard.classList.add("hidden");
    dashboardCard.classList.remove("hidden");

    welcomeText.innerText = "أهلًا " + worker.name;
    workerName.innerText = worker.name;
    workerRole.innerText = worker.role;

    scheduleList.innerHTML = "";

    for (const day of days) {
      const dayData = worker.schedule[day];
      const item = document.createElement("div");
      item.className = "schedule-item";

      if (!dayData || dayData.off) {
        item.innerHTML = `
          <div>
            <div><strong>${day}</strong></div>
            <div>عطلة</div>
          </div>
        `;
      } else {
        item.innerHTML = `
          <div>
            <div><strong>${day}</strong>: ${dayData.start} - ${dayData.end}</div>
            <small>ملاحظة: ${dayData.note}</small>
          </div>
        `;
      }

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
          <small>${worker.role}</small>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
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

    formName.value = worker.name;
    formUsername.value = usernameKey;
    formPassword.value = worker.password;
    formRole.value = roleOptions.includes(worker.role) ? worker.role : "عامل مطبخ";

    formUsername.disabled = true;

    for (const day of days) {
      const dayData = worker.schedule[day] || { off: true, start: "", end: "", note: "" };

      const offCheckbox = document.getElementById(`${day}-off`);
      const startSelect = document.getElementById(`${day}-start`);
      const endSelect = document.getElementById(`${day}-end`);
      const noteSelect = document.getElementById(`${day}-note`);

      offCheckbox.checked = dayData.off;
      startSelect.value = dayData.start || "";
      endSelect.value = dayData.end || "";
      noteSelect.value = dayData.note || "";

      updateDayInputs(day);
    }

    workerFormCard.classList.remove("hidden");
  }

  function clearForm() {
    formName.value = "";
    formUsername.value = "";
    formPassword.value = "";
    formRole.value = "مانجر";
    formUsername.disabled = false;

    for (const day of days) {
      const offCheckbox = document.getElementById(`${day}-off`);
      const startSelect = document.getElementById(`${day}-start`);
      const endSelect = document.getElementById(`${day}-end`);
      const noteSelect = document.getElementById(`${day}-note`);

      offCheckbox.checked = true;
      startSelect.value = "";
      endSelect.value = "";
      noteSelect.value = "";

      updateDayInputs(day);
    }
  }

  function logout() {
    dashboardCard.classList.add("hidden");
    managerCard.classList.add("hidden");
    workerFormCard.classList.add("hidden");
    loginCard.classList.remove("hidden");

    username.value = "";
    password.value = "";
    scheduleList.innerHTML = "";
  }

  function buildDaysInputs() {
    daysContainer.innerHTML = "";

    for (const day of days) {
      const dayBox = document.createElement("div");
      dayBox.className = "day-box";
      dayBox.style.marginBottom = "20px";
      dayBox.style.padding = "15px";
      dayBox.style.border = "1px solid #333";
      dayBox.style.borderRadius = "12px";

      dayBox.innerHTML = `
        <h4 style="margin-bottom:12px;">${day}</h4>

        <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <input type="checkbox" id="${day}-off" checked />
          عطلة
        </label>

        <label>وقت البداية</label>
        <select id="${day}-start">
          ${buildOptions(timeOptions)}
        </select>

        <label>وقت النهاية</label>
        <select id="${day}-end">
          ${buildOptions(timeOptions)}
        </select>

        <label>ملاحظة</label>
        <select id="${day}-note">
          ${buildOptions(noteOptions)}
        </select>
      `;

      daysContainer.appendChild(dayBox);

      const offCheckbox = dayBox.querySelector(`#${cssEscape(day)}-off`);
      offCheckbox.addEventListener("change", function () {
        updateDayInputs(day);
      });

      updateDayInputs(day);
    }
  }

  function updateDayInputs(day) {
    const offCheckbox = document.getElementById(`${day}-off`);
    const startSelect = document.getElementById(`${day}-start`);
    const endSelect = document.getElementById(`${day}-end`);
    const noteSelect = document.getElementById(`${day}-note`);

    const disabled = offCheckbox.checked;

    startSelect.disabled = disabled;
    endSelect.disabled = disabled;
    noteSelect.disabled = disabled;

    if (disabled) {
      startSelect.value = "";
      endSelect.value = "";
      noteSelect.value = "";
    }
  }

  function buildOptions(optionsArray) {
    let html = `<option value="">اختر</option>`;
    for (const option of optionsArray) {
      html += `<option value="${option}">${option}</option>`;
    }
    return html;
  }

  function generateTimeOptions(startTime, endTime, intervalMinutes) {
    const result = [];
    let current = toMinutes(startTime);
    const end = toMinutes(endTime);

    while (current <= end) {
      result.push(toTimeString(current));
      current += intervalMinutes;
    }

    return result;
  }

  function toMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  function toTimeString(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function cssEscape(text) {
    return CSS.escape(text);
  }
});
