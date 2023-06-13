console.log('start')
getPosts()
window.addEventListener("scroll", function () {
    const endOfPage =
    window.innerHeight + window.pageYOffset >=
    document.body.scrollHeight - 500

    if (endOfPage && currentPage < lastPage) {
    getPosts(false, (currentPage += 1));
    }
});
let content = "";
    function getPosts(reload = true, page = 1) {
    console.log('before')
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=4&page=${page}`).then((res) => {
        console.log('after')
    toggleLoader(false)

    let response = res.data.data;
    lastPage = res.data.meta.last_page;
    if (reload) {
        content = "";
    }
    response.forEach((item) => {
        let tagg = "";
        if (item.tags.length > 0) {
        item.tags.forEach((tag) => {
            tagg += `
                        <span class="rounded-5 px-2 py-1" style="background-color: grey; color: white;">${tag.name}</span>
                    `;
        });
        }

        let users_image = "";
        if (item.author.profile_image.length != null) {
        users_image = item.author.profile_image;
        } else {
        users_image = "./pics/profile.png";
        }


        let user = getUser();
        let isMyPost = user != null && item.author.id == user.id
        let editBtnContent = '';
        if (isMyPost) {
        editBtnContent = `
        <button class="btn btn-danger ms-2" onclick="deletPost('${encodeURIComponent(JSON.stringify(item))}')" data-bs-toggle="modal" data-bs-target="#deleteModal" style="float: right; border-radius: 5px; border: none">Delete</button>
        
        <button class="btn btn-outline-secondary" onclick="editPost('${encodeURIComponent(JSON.stringify(item))}')" data-bs-toggle="modal" data-bs-target="#create-post-modal" style="background-color: var(--blue); :hoverfloat: right; border-radius: 5px; border: none">Edit</button>
        
        `
        }

        content += `
        <div class="card shadow" style="background-color: var(--dark-blue)">
            <div class="card-header d-flex justify-content-between">

            <div style="cursor: pointer" onclick="profileClicked1(${item.author.id})" style="width: fit-content;">
                <img class="rounded-circle border border-2" style="width: 40px; height: 40px" src="${users_image}" alt="profile logo">

                <b style="color: var(--light-blue)">@${item.author.username}</b>  
            </div>

            <div>${editBtnContent}</div>

            </div>
                <div class="card-body" onclick="postClicked(${item.id})" style="cursor: pointer;">
                <p class="card-text" style="color: var(--light)">${item.body}</p>
                <img style="border-radius: 5px;" class="w-100" src=${item.image}>

                <h6 style="color: var(--light)" class="mt-1">${item.created_at}</h6>
    
                <hr>
    
                <div style='display: inline'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                    <span style="color: var(--light)">(${item.comments_count}) comments</span>
                    <div style='display: inline'>
                        ${tagg}
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.getElementById("posts").innerHTML = content;
    })
}

function postClicked(id){
    window.location = `postDetails.html?id=${id}`
}

function profileClicked1(id) {
    window.location = `profile.html?id=${id}`
}



function addBtnClicked(){
    document.getElementById('post-id-input').value = '';
    document.getElementById('post-modal-title').innerHTML = 'Create a new post';
    document.getElementById('createPostAlertBtn').innerHTML = 'Create'
    document.getElementById('body-input').value = ''
}

console.log('start')


