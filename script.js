const baseUrl = "https://tarmeezacademy.com/api/v1";
let name = "";
let currentPage = 1;
let lastPage = 1;

function postClicked(e) {
  window.location = `postDetails.html?id=${e}`;
}

function successAlert(name, msj, type) {
  const alertPlaceholder = document.getElementById(`${name}-alert`);

  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  alert(msj, type);
}

function loginBtnClicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const params = {
    username: username,
    password: password,
  };
  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, params)
    .then((res) => {
      toggleLoader(false);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      successAlert("login", "Nice, you logged in successfully!", "success");
      setupUi();
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    })
    .catch((err) => {
      successAlert("login", err.response.data.message, "danger");
    })
    .finally(() => {
      toggleLoader(false)
    });
}

function registerBtnClicked() {
  let pic = document.getElementById("register-pic-input").files[0];
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;

  if (!pic) {
    pic = "./pics/profile.png";
  }

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", pic);
  formData.append("name", name);

  toggleLoader(true)
  axios
    .post(`${baseUrl}/register`, formData)
    .then((res) => {
      toggleLoader(false)
      successAlert(
        "register",
        "Welcome, you registered successfully!",
        "success"
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      setupUi();
    })
    .catch((err) => {
      const msj = err.response.data.message;
      successAlert("register", msj, "danger");
    }).finally(()=>{
      toggleLoader(false)
    })
}

function setupUi() {
  const token = localStorage.getItem("token");

  const loggedIn = document.getElementById("logedIn");
  const logedIn_profile = document.getElementById("logedIn_profile");
  const addBtn = document.getElementById("addBtn");
  const notLoggedIn = document.getElementById("notLoggedIn");

  if (token != null) {
    logedIn_profile.innerHTML = "";
    loggedIn.classList.remove("d-none");
    logedIn_profile.innerHTML += `
    <img class="rounded-circle border border-2" style="width: 25px; height: 25px;" src="${image()}">
    <span class="me-1" style="font-size: 20px">@${name}</span>
    <button onclick="logout()" type="button" id="logout-navbar" class="btn btn-outline-danger ms-4">Log out</button>
    `;
    notLoggedIn.classList.add("d-none");
    document.getElementById("addBtn").classList.remove("d-none");
  } else {
    loggedIn.classList.add("d-none");
    notLoggedIn.classList.remove("d-none");
    document.getElementById("addBtn").classList.add("d-none");
  }
}

setupUi();

function logout() {
  toggleLoader(true)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toggleLoader(false)
  successAlert("logout", "You logged out", "success");
  setupUi();
}

function createNewPostClicked() {
  let post_id = document.getElementById("post-id-input").value;
  let isCreated = post_id == null || post_id == "";
  let url = "";

  const body = document.getElementById("body-input").value;
  const image = document.getElementById("image-input").files[0];

  let formData = new FormData();
  formData.append("body", body);
  formData.append("image", image);

  const token = localStorage.getItem("token");
  const headers = {
    authorization: `Bearer ${token}`,
  };

  if (isCreated) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${post_id}`;
  }
  toggleLoader(true)
  axios
    .post(`${url}`, formData, {
      headers: headers,
    })
    .then((res) => {
      toggleLoader(false)
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      successAlert("create", "New post was uploaded", "success");
      getPosts();
      profileClicked();
    })
    .catch((err) => {
      const msj = err.response.data.message;
      successAlert("create", msj, "danger");
    }).finally(() => {
      toggleLoader(false)
    })
}

function image() {
  let img = "";
  if (localStorage.getItem("user") != null) {
    const pic = JSON.parse(localStorage.getItem("user"));
    name = pic.username;
    if (pic.profile_image.length != null) {
      img = pic.profile_image;
    } else {
      img = "./pics/profile.png";
    }
  } else {
    img = "./pics/profile.png";
  }
  return img;
}

function getUser() {
  let user;
  if (localStorage.getItem("user") != null) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  return user;
}

function myProfileClicked() {
  const user = getUser().id;
  window.location = `profile.html?id=${user}`;
}

function deletPost(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  const token = localStorage.getItem("token");
  console.log(localStorage.getItem("user"));
  document.getElementById("yesDleteBtn").addEventListener("click", function () {
    let url = `${baseUrl}/posts/${post.id}`;
    toggleLoader(true)
    axios
      .delete(url, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toggleLoader(false)
        if (window.location.pathname[1] != "p") {
          getPosts();
        }
        const modal = document.getElementById("deleteModal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
      }).catch((err)=>{}).finally(()=>{toggleLoader(false)})
  });
}

function editPost(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit the post";
  document.getElementById("createPostAlertBtn").innerHTML = "Update";
  document.getElementById("body-input").value = post.body;
}

function toggleLoader(show = true) {
  if (show) {
    document.getElementById("lodar").style.visibility = "visible";
  } else {
    document.getElementById("lodar").style.visibility = "hidden";
  }
}
