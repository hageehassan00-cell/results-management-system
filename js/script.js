class Student {
  #grades = [];
  #attendance = 0;

  constructor(name, g1, g2, g3, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("من فضلك اكتب اسم الطالب.");
    }
    this.name = name.trim();
    this.grades = [g1, g2, g3];
    this.attendance = attendance;
  }

  set grades(values) {
    for (let g of values) {
      if (g === "" || g === null || isNaN(g)) {
        throw new Error("من فضلك املأ كل الدرجات.");
      }
      if (g < 0 || g > 100) {
        throw new Error("الدرجة لازم تكون بين 0 و 100.");
      }
    }
    this.#grades = values.map(Number);
  }
  get grades() { return this.#grades; }

  set attendance(value) {
    if (value === "" || value === null || isNaN(value)) {
      throw new Error("من فضلك اكتب نسبة الحضور.");
    }
    if (value < 0 || value > 100) {
      throw new Error("نسبة الحضور لازم تكون بين 0 و 100.");
    }
    this.#attendance = Number(value);
  }
  get attendance() { return this.#attendance; }

  getAverage() {
    let sum = this.#grades.reduce((a, b) => a + b, 0);
    return sum / this.#grades.length;
  }
}

let studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("d-none");
}
function hideError() {
  errorBox.classList.add("d-none");
  errorBox.textContent = "";
}

addBtn.onclick = function () {
  try {
    hideError();
    let student = new Student(
      nameInput.value,
      grade1Input.value,
      grade2Input.value,
      grade3Input.value,
      attendanceInput.value
    );
    studentsList.push(student);
    if (studentsList.length === 1) studentsBox.innerHTML = "";
    studentsBox.innerHTML += `
      <div class="alert alert-success py-2">
        <b>${student.name}</b> - المتوسط: ${student.getAverage().toFixed(1)} - الحضور: ${student.attendance}%
      </div>
    `;
    nameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
  } catch (error) {
    showError(error.message);
  }
};

mercyBtn.onclick = function () {
  let struggling = studentsList.filter(s => {
    let avg = s.getAverage();
    return avg >= 40 && avg < 50;
  });
  let newAverages = struggling.map(s => s.getAverage() + 5);
  let generalAverage = 0;
  if (newAverages.length > 0) {
    let total = newAverages.reduce((a, b) => a + b, 0);
    generalAverage = total / newAverages.length;
  }
  let names = struggling.map(s => s.name).join(" - ");
  reportBox.innerHTML = `
    <p><b>عدد الطلاب المتعثرين:</b> ${struggling.length}</p>
    <p><b>أسمائهم:</b> ${struggling.length > 0 ? names : "لا يوجد طلاب متعثرون"}</p>
    <p><b>المتوسط العام بعد الرأفة:</b> ${struggling.length > 0 ? generalAverage.toFixed(2) : 0}</p>
  `;
};
