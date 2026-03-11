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

  const WORKERS_STORAGE_KEY = "chicki_workers";
  const REQUESTS_STORAGE_KEY = "chicki_replacement_requests";

  const defaultWorkers = {
    salim: {
      password: "1234",
      name: "سليم",
      role: "عامل مطبخ",
      schedule: {
        الاثنين: { off: false, start: "12:00", end: "20:00", note: "شغل جوا", crossesMidnight: false },
        الثلاثاء: { off: true, start: "", end: "", note: "", crossesMidnight: false },
        الأربعاء: { off: false, start: "14:00", end: "22:00", note: "تقطيع", crossesMidnight: false },
        الخميس: { off: false, start: "19:00", end: "02:00", note: "شغل جوا", crossesMidnight: true },
        الجمعة: { off: false, start: "16:00", end: "23:00", note: "شغل جوا", crossesMidnight: false },
        السبت: { off: false, start: "14:00", end: "22:00", note: "تقطيع", crossesMidnight: false },
        الأحد: { off: true, start: "", end: "", note: "", crossesMidnight: false }
      }
    },
    ahmad: {
      password: "5678",
      name: "أحمد",
      role: "شوفير",
      schedule: {
        الاثنين: { off: false, start: "10:00", end: "18:00", note: "توصيل", crossesMidnight: false },
        الثلاثاء: { off: false, start: "10:00", end: "18:00", note: "توصيل", crossesMidnight: false },
        الأربعاء: { off: false, start: "10:00", end: "18:00", note: "توصيل", crossesMidnight: false },
        الخميس: { off: true, start: "", end: "", note: "", crossesMidnight: false },
        الجمعة: { off: false, start: "12:00", end: "20:00", note: "توصيل", crossesMidnight: false },
        السبت: { off: false, start: "12:00", end: "20:00", note: "توصيل", crossesMidnight: false },
        الأحد: { off: true, start: "", end: "", note: "", crossesMidnight: false }
      }
    },
    khaled: {
      password: "9999",
      name: "خالد",
      role: "عامل مطبخ",
      schedule: {
        الاثنين: { off: false, start: "11:00", end: "19:00", note: "تطحين", crossesMidnight: false },
        الثلاثاء: { off: false, start: "11:00", end: "19:00", note: "تقطيع", crossesMidnight: false },
        الأربعاء: { off: true, start: "", end: "", note: "", crossesMidnight: false },
        الخميس: { off: false, start: "15:00", end: "23:00", note: "شغل جوا", crossesMidnight: false },
        الجمعة: { off: false, start: "15:00", end: "23:00", note: "تطحين", crossesMidnight: false },
        السبت: { off: true, start: "", end: "", note: "", crossesMidnight: false },
        الأحد: { off: false, start: "12:00", end: "20:00", note: "تقطيع", crossesMidnight: false }
      }
    }
  };

  let workers = {};
  let replacementRequests = [];

  const managerAccount = {
    username: "manager",
    password: "admin123"
  };

  let currentUser = null;
  let currentUserKey = null;
  let currentView = "login";

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
  const workerWeekText = document.getElementById("workerWeekText");

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

  const managerDaySelect = document.getElementById("managerDaySelect");
  const managerDayOverview = document.getElementById("managerDayOverview");
  const managerWeekText = document.getElementById("managerWeekText");

  const requestDaySelect = document.getElementById("requestDaySelect");
  const createReplacementRequestBtn = document.getElementById("createReplacementRequestBtn");
  const workerRequestsList = document.getElementById("workerRequestsList");
  const managerRequestsList = document.getElementById("managerRequestsList");

  let editingWorker = null;

  loadWorkers();
  loadRequests();

  buildDaysInputs();
  buildManagerDaySelect();

  loginBtn.addEventListener("click", function () {
    const user = username.value.trim().toLowerCase();
    const pass = password.value.trim();

    if (user === managerAccount.username && pass === managerAccount.password) {
      currentUser = {
        name: "المانجر",
        role: "مانجر"
      };
      currentUserKey = "manager";
      currentView = "manager";
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

    currentUser = worker;
    currentUserKey = user;
    currentView = "worker";
    openWorkerDashboard(worker, user);
  });

  addWorkerBtn.addEventListener("click", openAddForm);

  cancelWorkerBtn.addEventListener("click", function () {
    workerFormCard.classList.add("hidden");
    clearForm();
  });

  managerDaySelect.addEventListener("change", function () {
    renderManagerDayOverview(this.value);
  });

  createReplacementRequestBtn.addEventListener("click", function () {
    createReplacementRequest();
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
          note: "",
          crossesMidnight: false
        };
      } else {
        const startValue = startSelect.value;
        const endValue = endSelect.value;
        const noteValue = noteSelect.value;

        if (!startValue || !endValue || !noteValue) {
          alert(`كمّل بيانات يوم ${day}`);
          return;
        }

        if (startValue === endValue) {
          alert(`وقت البداية والنهاية لا يمكن يكونوا نفس الشي في يوم ${day}`);
          return;
        }

        const startMinutes = toMinutes(startValue);
        const endMinutes = toMinutes(endValue);
        const crossesMidnight = endMinutes < startMinutes;

        schedule[day] = {
          off: false,
          start: startValue,
          end: endValue,
          note: noteValue,
          crossesMidnight: crossesMidnight
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
      const oldRole = workers[editingWorker]?.role || roleValue;
      workers[editingWorker] = workerData;

      if (oldRole !== roleValue) {
        replacementRequests = replacementRequests.filter(req => {
          const createdByThisWorker = req.createdBy === editingWorker;
          const acceptedByThisWorker = req.acceptedBy === editingWorker;
          return !createdByThisWorker && !acceptedByThisWorker;
        });
      }
    } else {
      if (workers[usernameKey]) {
        alert("اسم المستخدم موجود من قبل.");
        return;
      }
      workers[usernameKey] = workerData;
    }

    saveWorkers();
    saveRequests();

    workerFormCard.classList.add("hidden");
    clearForm();
    renderWorkersList();
    renderManagerDayOverview(managerDaySelect.value);
    renderManagerRequests();

    if (currentView === "worker" && currentUserKey && workers[currentUserKey]) {
      currentUser = workers[currentUserKey];
      renderWorkerSchedule(currentUser);
      buildWorkerRequestDaySelect(currentUser);
      renderWorkerRequests(currentUserKey);
    }
  });

  logoutBtn.addEventListener("click", logout);
  managerLogoutBtn.addEventListener("click", logout);

  function openWorkerDashboard(worker, usernameKey) {
    loginCard.classList.add("hidden");
    managerCard.classList.add("hidden");
    workerFormCard.classList.add("hidden");
    dashboardCard.classList.remove("hidden");

    welcomeText.innerText = "أهلًا " + worker.name;
    workerName.innerText = worker.name;
    workerRole.innerText = worker.role;
    workerWeekText.innerText = getWeekRangeText();

    renderWorkerSchedule(worker);
    buildWorkerRequestDaySelect(worker);
    renderWorkerRequests(usernameKey);
  }

  function renderWorkerSchedule(worker) {
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

    managerWeekText.innerText = getWeekRangeText();
    renderWorkersList();
    renderManagerDayOverview(managerDaySelect.value);
    renderManagerRequests();
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
        <div class="action-buttons">
          <button type="button" data-user="${usernameKey}" class="edit-btn">تعديل</button>
          <button type="button" data-user="${usernameKey}" class="delete-btn">حذف</button>
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

  function renderManagerDayOverview(selectedDay) {
    managerDayOverview.innerHTML = "";

    const workingToday = [];
    const offToday = [];

    for (const usernameKey in workers) {
      const worker = workers[usernameKey];
      const dayData = worker.schedule[selectedDay];

      if (!dayData || dayData.off) {
        offToday.push(worker);
      } else {
        workingToday.push({
          name: worker.name,
          role: worker.role,
          start: dayData.start,
          end: dayData.end,
          note: dayData.note
        });
      }
    }

    const workingTitle = document.createElement("div");
    workingTitle.className = "overview-section-title";
    workingTitle.innerText = `شغالين في ${selectedDay}`;
    managerDayOverview.appendChild(workingTitle);

    if (workingToday.length === 0) {
      const empty = document.createElement("div");
      empty.className = "schedule-item";
      empty.innerHTML = `<div>مافي حدا شغال بهذا اليوم</div>`;
      managerDayOverview.appendChild(empty);
    } else {
      workingToday.forEach(worker => {
        const item = document.createElement("div");
        item.className = "schedule-item";
        item.innerHTML = `
          <div>
            <strong>${worker.name}</strong><br>
            <small>${worker.role} - ${worker.start} إلى ${worker.end}</small><br>
            <small>المهمة: ${worker.note}</small>
          </div>
        `;
        managerDayOverview.appendChild(item);
      });
    }

    const offTitle = document.createElement("div");
    offTitle.className = "overview-section-title";
    offTitle.style.marginTop = "10px";
    offTitle.innerText = `عطلة في ${selectedDay}`;
    managerDayOverview.appendChild(offTitle);

    if (offToday.length === 0) {
      const empty = document.createElement("div");
      empty.className = "schedule-item";
      empty.innerHTML = `<div>مافي حدا عطلة بهذا اليوم</div>`;
      managerDayOverview.appendChild(empty);
    } else {
      offToday.forEach(worker => {
        const item = document.createElement("div");
        item.className = "schedule-item";
        item.innerHTML = `
          <div>
            <strong>${worker.name}</strong><br>
            <small>${worker.role}</small>
          </div>
        `;
        managerDayOverview.appendChild(item);
      });
    }
  }

  function buildWorkerRequestDaySelect(worker) {
    requestDaySelect.innerHTML = "";

    const availableDays = days.filter(day => {
      const dayData = worker.schedule[day];
      return dayData && !dayData.off;
    });

    if (availableDays.length === 0) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "ما عندك أيام دوام";
      requestDaySelect.appendChild(option);
      requestDaySelect.disabled = true;
      createReplacementRequestBtn.disabled = true;
      return;
    }

    requestDaySelect.disabled = false;
    createReplacementRequestBtn.disabled = false;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "اختر يوم";
    requestDaySelect.appendChild(defaultOption);

    availableDays.forEach(day => {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      requestDaySelect.appendChild(option);
    });
  }

  function createReplacementRequest() {
    if (!currentUser || !currentUserKey || currentView !== "worker") return;

    const selectedDay = requestDaySelect.value;

    if (!selectedDay) {
      alert("اختر يوم أول.");
      return;
    }

    const existingOpenRequest = replacementRequests.find(req =>
      req.createdBy === currentUserKey &&
      req.day === selectedDay &&
      req.weekStart === getCurrentWeekStartString() &&
      req.status === "open"
    );

    if (existingOpenRequest) {
      alert("أنت بالفعل عامل طلب مفتوح لهذا اليوم.");
      return;
    }

    const dayData = currentUser.schedule[selectedDay];

    if (!dayData || dayData.off) {
      alert("هذا اليوم أصلاً مو دوام عندك.");
      return;
    }

    const request = {
      id: generateRequestId(),
      createdBy: currentUserKey,
      workerName: currentUser.name,
      role: currentUser.role,
      day: selectedDay,
      start: dayData.start,
      end: dayData.end,
      note: dayData.note,
      weekStart: getCurrentWeekStartString(),
      status: "open",
      acceptedBy: null,
      acceptedByName: null,
      createdAt: new Date().toISOString()
    };

    replacementRequests.push(request);
    saveRequests();

    alert("تم إرسال طلب البديل.");
    renderWorkerRequests(currentUserKey);

    if (currentView === "manager") {
      renderManagerRequests();
    }
  }

  function renderWorkerRequests(usernameKey) {
    workerRequestsList.innerHTML = "";

    const user = workers[usernameKey];
    if (!user) return;

    const visibleRequests = replacementRequests.filter(req => {
      const sameWeek = req.weekStart === getCurrentWeekStartString();
      if (!sameWeek) return false;

      const isOwnRequest = req.createdBy === usernameKey;
      const sameRole = req.role === user.role;
      const notOwnRequest = req.createdBy !== usernameKey;

      return isOwnRequest || (sameRole && notOwnRequest);
    });

    if (visibleRequests.length === 0) {
      const empty = document.createElement("div");
      empty.className = "schedule-item";
      empty.innerHTML = `<div>مافي طلبات حالياً</div>`;
      workerRequestsList.appendChild(empty);
      return;
    }

    visibleRequests.forEach(req => {
      const item = document.createElement("div");
      item.className = "schedule-item";

      let actionHtml = "";
      const isOwnRequest = req.createdBy === usernameKey;
      const canTake = req.status === "open" && !isOwnRequest && req.role === user.role;

      if (canTake) {
        actionHtml = `<button type="button" class="take-request-btn" data-id="${req.id}">أنا آخذ هذا اليوم</button>`;
      } else if (req.status === "accepted") {
        actionHtml = `<span class="status-badge accepted">تم أخذه</span>`;
      } else if (isOwnRequest) {
        actionHtml = `<span class="status-badge pending">طلبك</span>`;
      }

      item.innerHTML = `
        <div>
          <strong>${req.day}</strong><br>
          <small>صاحب الطلب: ${req.workerName}</small><br>
          <small>الرول: ${req.role}</small><br>
          <small>الوقت: ${req.start} - ${req.end}</small><br>
          <small>المهمة: ${req.note}</small><br>
          <small>الحالة: ${formatRequestStatus(req)}</small>
        </div>
        <div class="action-buttons">
          ${actionHtml}
        </div>
      `;

      workerRequestsList.appendChild(item);
    });

    attachTakeRequestEvents();
  }

  function renderManagerRequests() {
    managerRequestsList.innerHTML = "";

    const currentWeekRequests = replacementRequests.filter(
      req => req.weekStart === getCurrentWeekStartString()
    );

    if (currentWeekRequests.length === 0) {
      const empty = document.createElement("div");
      empty.className = "schedule-item";
      empty.innerHTML = `<div>مافي طلبات بديل هذا الأسبوع</div>`;
      managerRequestsList.appendChild(empty);
      return;
    }

    currentWeekRequests.forEach(req => {
      const item = document.createElement("div");
      item.className = "schedule-item";
      item.innerHTML = `
        <div>
          <strong>${req.day}</strong><br>
          <small>صاحب الطلب: ${req.workerName}</small><br>
          <small>الرول: ${req.role}</small><br>
          <small>الوقت: ${req.start} - ${req.end}</small><br>
          <small>المهمة: ${req.note}</small><br>
          <small>الحالة: ${formatRequestStatus(req)}</small>
        </div>
      `;
      managerRequestsList.appendChild(item);
    });
  }

  function attachTakeRequestEvents() {
    document.querySelectorAll(".take-request-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        takeReplacementRequest(this.dataset.id);
      });
    });
  }

  function takeReplacementRequest(requestId) {
    if (!currentUser || !currentUserKey || currentView !== "worker") return;

    const request = replacementRequests.find(req => req.id === requestId);
    if (!request) return;

    if (request.status !== "open") {
      alert("هذا الطلب لم يعد متاح.");
      return;
    }

    if (request.createdBy === currentUserKey) {
      alert("ما فيك تاخذ طلبك أنت.");
      return;
    }

    if (request.role !== currentUser.role) {
      alert("هذا الطلب مو من نفس رولك.");
      return;
    }

    request.status = "accepted";
    request.acceptedBy = currentUserKey;
    request.acceptedByName = currentUser.name;

    saveRequests();

    alert("تم أخذ هذا اليوم.");
    renderWorkerRequests(currentUserKey);
  }

  function formatRequestStatus(request) {
    if (request.status === "accepted") {
      return `تم أخذه بواسطة ${request.acceptedByName}`;
    }
    return "مفتوح";
  }

  function deleteWorker(usernameKey) {
    const ok = confirm("متأكد بدك تحذف هذا الموظف؟");
    if (!ok) return;

    delete workers[usernameKey];

    replacementRequests = replacementRequests.filter(req => {
      return req.createdBy !== usernameKey && req.acceptedBy !== usernameKey;
    });

    saveWorkers();
    saveRequests();

    renderWorkersList();
    renderManagerDayOverview(managerDaySelect.value);
    renderManagerRequests();

    if (currentView === "worker" && currentUserKey === usernameKey) {
      logout();
    }
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
      const dayData = worker.schedule[day] || {
        off: true,
        start: "",
        end: "",
        note: "",
        crossesMidnight: false
      };

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

    currentUser = null;
    currentUserKey = null;
    currentView = "login";
  }

  function buildDaysInputs() {
    daysContainer.innerHTML = "";

    for (const day of days) {
      const dayBox = document.createElement("div");
      dayBox.className = "day-box";

      dayBox.innerHTML = `
        <h4 style="margin-bottom:12px;">${day}</h4>

        <label style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <input type="checkbox" id="${day}-off" checked style="width:auto; margin:0;" />
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

  function buildManagerDaySelect() {
    managerDaySelect.innerHTML = "";

    days.forEach(day => {
      const option = document.createElement("option");
      option.value = day;
      option.textContent = day;
      managerDaySelect.appendChild(option);
    });

    managerDaySelect.value = getArabicDayName(new Date());
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
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function cssEscape(text) {
    return CSS.escape(text);
  }

  function getStartOfWeek(date) {
    const newDate = new Date(date);
    const day = newDate.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    newDate.setDate(newDate.getDate() + diff);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function getWeekRangeText() {
    const start = getStartOfWeek(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `الأسبوع الحالي: ${formatDate(start)} - ${formatDate(end)} (يتجدد كل يوم اثنين)`;
  }

  function getCurrentWeekStartString() {
    return formatDate(getStartOfWeek(new Date()));
  }

  function getArabicDayName(date) {
    const jsDay = date.getDay();
    const map = {
      0: "الأحد",
      1: "الاثنين",
      2: "الثلاثاء",
      3: "الأربعاء",
      4: "الخميس",
      5: "الجمعة",
      6: "السبت"
    };
    return map[jsDay];
  }

  function generateRequestId() {
    return "req_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
  }

  function saveWorkers() {
    localStorage.setItem(WORKERS_STORAGE_KEY, JSON.stringify(workers));
  }

  function loadWorkers() {
    const savedWorkers = localStorage.getItem(WORKERS_STORAGE_KEY);

    if (savedWorkers) {
      try {
        workers = JSON.parse(savedWorkers);
      } catch (error) {
        workers = JSON.parse(JSON.stringify(defaultWorkers));
        saveWorkers();
      }
    } else {
      workers = JSON.parse(JSON.stringify(defaultWorkers));
      saveWorkers();
    }
  }

  function saveRequests() {
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(replacementRequests));
  }

  function loadRequests() {
    const savedRequests = localStorage.getItem(REQUESTS_STORAGE_KEY);

    if (savedRequests) {
      try {
        replacementRequests = JSON.parse(savedRequests);
      } catch (error) {
        replacementRequests = [];
        saveRequests();
      }
    } else {
      replacementRequests = [];
      saveRequests();
    }
  }

  function resetAllData() {
    localStorage.removeItem(WORKERS_STORAGE_KEY);
    localStorage.removeItem(REQUESTS_STORAGE_KEY);
    location.reload();
  }

  window.resetAllData = resetAllData;
});
