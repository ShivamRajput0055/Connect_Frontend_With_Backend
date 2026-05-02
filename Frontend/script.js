const apiUrl = "http://localhost:6500/api/student";
let currentSearch = "";
let currentPage = 1;
const fetchStudents = async (search = "", page = 1) => {
  try {
    currentSearch = search;
    currentPage = page;
    const response = await fetch(
      `${apiUrl}?search=${encodeURIComponent(search)}&page=${page}&limit=3`,
    );
    const studentRecord = await response.json();
    const tableInnerGetData = document.querySelector("#studentTableBody");
    tableInnerGetData.innerHTML = "";
    studentRecord.data.forEach((item) => {
      tableInnerGetData.innerHTML += `
        <tr>
            <td class="text-center"><img src="http://localhost:6500/uploads/${item.profile_pic}" width="50" height="50" class="rounded-circle border border-2"></td>
            <td class="text-center">${item.first_name}</td>
            <td class="text-center">${item.last_name}</td>
            <td class="text-center">${item.email}</td>
            <td class="text-center">${item.phone}</td>
            <td class="text-center">${item.gender}</td>
            <td class="text-center">
                <button class="btn btn-info btn-sm" onclick="viewStudent('${item._id}')">View</button>
                <button class="btn btn-warning btn-sm" onclick="editStudent('${item._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${item._id}')">Delete</button>
            </td>
        </tr>
    `;
    });
    renderPagination(studentRecord.totalPage);
  } catch (error) {
    console.log(error, "Error Found in FetchStudent");
  }
};
const renderPagination = (totalPages) => {
  const container = document.querySelector("#pagination");
  container.innerHTML = "";
  const prevli = document.createElement("li");
  prevli.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  console.log(prevli.className);
  prevli.innerHTML = `<a class="page-link" href="#">Previous</a>`;
  prevli.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) fetchStudents(currentSearch, currentPage - 1);
  });
  container.appendChild(prevli);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = "page-item" + (i === currentPage ? " active" : "");
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      fetchStudents(currentSearch, i);
    });
    container.appendChild(li);
  }
  const nextli = document.createElement("li");
  nextli.className =
    "page-item" + (currentPage === totalPages ? " disabled" : "");
  nextli.innerHTML = `<a class="page-link" href="#">Next</a>`;
  nextli.addEventListener("click", (e) => {
    e.preventDefault();
    if (totalPages > currentPage) fetchStudents(currentSearch, currentPage + 1);
  });
  container.appendChild(nextli);
};
const viewStudent = async (id) => {
  try {
    console.log("Enter");
    const response = await fetch(`${apiUrl}/${id}`);
    const singleStudent = await response.json();
    console.log(singleStudent);
    //to open modal
    document.querySelector("#viewProfilePic").src =
      `http://localhost:6500/uploads/${singleStudent.data.profile_pic}`;
    document.querySelector("#viewName").textContent =
      singleStudent.data.first_name + " " + singleStudent.data.last_name;
    document.querySelector("#viewEmail").textContent = singleStudent.data.email;
    document.querySelector("#viewPhone").textContent = singleStudent.data.phone;
    document.querySelector("#viewGender").textContent =
      singleStudent.data.gender;
    const viewStudentModal = document.querySelector("#viewStudentModal");
    new bootstrap.Modal(viewStudentModal).show();
  } catch (error) {
    console.log(error, "Error Found in viewStudent");
  }
};
document.querySelector("#searchInput").addEventListener("input", () => {
  currentPage = 1;
  fetchStudents(document.querySelector("#searchInput").value, currentPage);
});
document
  .querySelector("#addStudentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const res = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      this.reset();
      bootstrap.Modal.getInstance(
        document.querySelector("#addStudentModal"),
      ).hide();
      fetchStudents();
    } else {
      alert("Error Creating Student.");
    }
  });
const deleteStudent = async (id) => {
  try {
    if (confirm("Are you sure want to delete this record? ")) {
      await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      fetchStudents();
    }
  } catch (error) {
    console.log(error);
    alert("Error for Deleting Student.");
  }
};
document
  .querySelector("#editStudentForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.querySelector("#editStudentId").value;
    try {
      const formData = new FormData(this);
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        bootstrap.Modal.getInstance(
          document.querySelector("#editStudentModal"),
        ).hide();
        fetchStudents();
      } else {
        alert("Error updating student.");
      }
    } catch (error) {
      alert("Error for operating updating student.");
    }
  });
const editStudent = async (id) => {
  try {
    const res = await fetch(`${apiUrl}/${id}`);
    const student = await res.json();
    document.querySelector("#editStudentId").value = student.data._id;
    document.querySelector("#editFirstName").value = student.data.first_name;
    document.querySelector("#editLastName").value = student.data.last_name;
    document.querySelector("#editEmail").value = student.data.email;
    document.querySelector("#editPhone").value = student.data.phone;
    document.querySelector("#editGender").value = student.data.gender;
    new bootstrap.Modal(document.querySelector("#editStudentModal")).show();
  } catch (error) {
    alert("Error for opening updating student.");
  }
};
function onLoad() {
  fetchStudents();
}
onLoad();
