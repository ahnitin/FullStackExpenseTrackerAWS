document.getElementById("signup-form").addEventListener("submit",(event)=>{
    SignupForm(event);
})

async function SignupForm(event)
{
    event.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let obj={
        username,
        email,
        password
    }
    try {
        let res = await axios.post("http://184.73.55.18:3000/signup",obj)
        if(res.status === 201)
        {
            alert(res.data.message)
            window.location.href = "./login.html"
        }
    } catch (error) {
        document.getElementById("peter").innerHTML += `<ul class= "list-group">
        <li class= "list-group-item" style="backgroundColor:yellow; color:red;" >
        ${error.response.data.error}
        </li>
        </ul>`
    }
}