    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    let content = "";

    function getPost() {
        toggleLoader(true)
        axios.get(`${baseUrl}/posts/${id}`).then((res) => {
            toggleLoader(false)
            let response = res.data.data;
            console.log(response)
            document.getElementById('post').innerHTML = ""
            console.log(document.getElementById('post'))
            let users_image = "";
            if (response.author.profile_image.length != null) {
                users_image = response.author.profile_image;
            } else {
                users_image = "./pics/profile.png";
            }
            
            

            content = `
            <h1 class="my-3">${response.author.username}'s post</h1>
            <div class="card shadow">
                    <div class="card-header">
                        <img class="rounded-circle border border-2" style="width: 40px; height: 40px;" src="${users_image}" alt="profile logo">

                        <b>@${response.author.username}</b>
                    </div>
                    <div class="card-body" >
                    <p class="card-text">${response.body}</p>
                    <img class="w-100" src="${response.image}">

                    <h6 style="color: rgba(59, 57, 57, 0.7);" class="mt-1">${response.created_at}</h6>

                    <hr>

                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                        <span>(${response.comments_count}) comments</span>
                    </div>

                    </div>
                    <div id="comments" class="px-1">

                    </div>
                    <div class="mt-2 my-2  px-1" id="add_comment">
                        <div style="display: flex; justify-content: space-between;" >
                                    <input id="addComent-input" type="text" placeholder="add your comment.." class="form-control" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">

                                    <button style="border-radius: 5px; height: 100%;" type="submit" class="btn btn-primary ms-2" onclick="commentAdd()">Submit</button>
                                
                        </div>
                    </div>
                </div>
            `
        document.getElementById('post').innerHTML = content;
        getComments()
        }).catch((err)=>{}).finally(()=>{toggleLoader(false)})

    }

    function getComments(){
        let commentsContent = "";

        axios.get(`${baseUrl}/posts/${id}`).then((res) => {
            let response = res.data.data;
            let comments = response.comments


            if (comments.length > 0) {
                comments.forEach(item => {
                    let comment_image = "";
                    if (item.author.profile_image.length != null) {
                        comment_image = item.author.profile_image;
                    } else {
                        comment_image = "./pics/profile.png";
                    }
                    commentsContent += `
                    <div class="p-3 rounded my-2" style="background-color: rgb(187, 187, 187)">
                                <!-- Profile pic + username -->
                                <div>
                                    <img class="rounded-circle border border-2" style="width: 40px; height: 40px;" src="${comment_image}" alt="profile logo">
                                    <b>@${item.author.username}</b>
                                </div>
                                <!-- // Profile pic + username // -->


                                <!-- Comment body-->
                                <div>
                                    <span>${item.body}</span>
                                </div>
                                <!-- // Comment body // -->

                                
                            </div>
                    `
            })

            document.getElementById('comments') .innerHTML = commentsContent

        }
        
    })
}
    
    getPost()
    function commentAdd(){
        const comment = document.getElementById('addComent-input').value
        const params = {
            body: comment
        }

        const token = localStorage.getItem('token')

        toggleLoader(true)
        axios.post(`${baseUrl}/posts/${id}/comments`, params, {
            headers: {
                "authorization": `Bearer ${token}`
            }
        })
        .then((res) => {
            toggleLoader(false)
            getPost()
            successAlert("addComment", "You add comment successfuly", "success")
        }).catch((err) => {
            const errMsj = `${err.response.data.message.slice(0, 15)}, Please login to comment`;
            successAlert("addComment", errMsj, "danger")
        }).finally(()=>{toggleLoader(false)})
    }
