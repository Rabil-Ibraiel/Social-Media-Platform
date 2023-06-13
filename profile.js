setupUi();

function profileClicked() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  let user_image = "";
  toggleLoader(true);
  axios
    .get(`${baseUrl}/users/${id}`)
    .then((res) => {
      toggleLoader(false);
      const data = res.data.data;
      setupUi();

      if (data.profile_image.length != null) {
        user_image = data.profile_image;
      } else {
        user_image = "./pics/profile.png";
      }

      console.log(data);
      let postCount = data.posts_count;
      let commentCount = data.comments_count;
      document.getElementById("username").innerHTML = `@${data.username}`;
      document.getElementById("name").innerHTML = data.name;
      document.getElementById("email").innerHTML = data.email;
      document.getElementById("postsCount").innerHTML = postCount;
      document.getElementById("commentsCount").innerHTML = commentCount;
      document.getElementById("header-image").src = user_image;
    })
    .catch((err) => {})
    .finally(() => {
      toggleLoader(false);
    });

  toggleLoader(true);
  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((res) => {
      toggleLoader(false);
      const posts = res.data.data.reverse();
      let content = "";
      setupUi();

      for (post of posts) {
        console.log(post);

        let user = getUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = "";
        if (isMyPost) {
          editBtnContent = `
                <button class="btn btn-danger ms-2" onclick="deletPost('${encodeURIComponent(
                  JSON.stringify(post)
                )}')" data-bs-toggle="modal" data-bs-target="#deleteModal" style="float: right; border-radius: 5px; border: none">Delete</button>
                
                <button class="btn btn-outline-secondary" onclick="editPost('${encodeURIComponent(
                  JSON.stringify(post)
                )}')" data-bs-toggle="modal" data-bs-target="#create-post-modal" style="float: right; border-radius: 5px; border: none">Edit</button>
                
                `;
        }

        content += `
        <h1 class="mb-4">@${post.author.username}'s posts</h1>
                <div class="card shadow" style="background-color: var(--dark-blue);">
                <div class="card-header d-flex justify-content-between">

                    <div onclick="profileClicked1(${post.author.id})" style="width: fit-content;">
                        <img class="rounded-circle border border-2" style="width: 40px; height: 40px" src="${user_image}" alt="profile logo">

                        <b style="color: var(--light-blue);">@${post.author.username}</b> 
                    </div>

                    <div>${editBtnContent}</div>
                </div>
                    <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer; color: var(--light)">
                    <p class="card-text">${post.body}</p>
                    <img style="border-radius: 5px;" class="w-100" src=${post.image}>

                    <h6 style="color: var(--light);" class="mt-1">${post.created_at}</h6>
        
                    <hr>
        
                    <div style='display: inline'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                        <span>(${post.comments_count}) comments</span>
                        <div style='display: inline'>
                           
                        </div>
                    </div>
                </div>
            </div>
          `;
      }
      document.getElementById("post").innerHTML = content;
    })
    .catch((err) => {})
    .finally(() => {
      toggleLoader(false);
    });
}

profileClicked();
