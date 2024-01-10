document.getElementById("login-form").addEventListener("submit",(event)=>{
    LoginForm(event)
})

async function LoginForm(event)
{
    event.preventDefault();
    try {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let obj ={
            email,password
        }
        let res = await axios.post("http://184.73.55.18:3000/login",obj);
        if(res.status===201) {
            alert(res.data.message);
            localStorage.setItem("token",res.data.token);
            window.location.href = './expense.html'
        }

    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group">
        <li class= "list-group-item" style="color:red;">${error.response.data.error}</li>
        </ul>`
    }
}