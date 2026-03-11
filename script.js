const workers = {
  salim: {
    password: "1234",
    name: "سليم",
    role: "عامل",
    off: "الثلاثاء",
    schedule: {
      الاثنين: "12:00 - 20:00",
      الثلاثاء: "عطلة",
      الأربعاء: "14:00 - 22:00"
    }
  }
};

const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const password = document.getElementById("password");

loginBtn.addEventListener("click", function () {

  const user = username.value.toLowerCase();
  const pass = password.value;

  const worker = workers[user];

  if (!worker) {
    alert("الاسم غير موجود");
    return;
  }

  if (worker.password !== pass) {
    alert("كلمة المرور غلط");
    return;
  }

  alert("اهلا " + worker.name);

});
