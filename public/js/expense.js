document.getElementById("logout").addEventListener("click",()=>{
  localStorage.clear();
  window.location.href = "login.html"
})
document.getElementById("expense-form").addEventListener("click",(event)=>{
    addExpenseForm(event)
})
document.getElementById("buypremium").addEventListener("click",(event)=>{
  PremiumUser(event);
})

let LeaderBoardBtn = document.createElement("input");
LeaderBoardBtn.type ="button";
LeaderBoardBtn.value = "Show LeaderBoard"
LeaderBoardBtn.className = 'btn btn-warning'
LeaderBoardBtn.addEventListener("click",()=>{
  ShowLeaderBoard();
})

let DownloadBtn = document.createElement("input");
DownloadBtn.type = "button";
DownloadBtn.value = "Download Expenses";
DownloadBtn.className = "btn btn-success"
DownloadBtn.addEventListener("click",()=>{
  DownloadExpenses();
})
function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  
    return JSON.parse(jsonPayload);
  }

async function refreshPage()
{
    let page = 1;
    try {
        let token = localStorage.getItem("token");
        let parsedToken = parseJwt(token);
        let ispremium = parsedToken.ispremium;
        if(ispremium)
        {
            let premiumLi = document.createElement("li");
            premiumLi.textContent = `YoU ArE A PrEmIuM UsEr`;
            premiumLi.className = "list-group-item"
            document.getElementById("buypremium").replaceWith(premiumLi);
            document.getElementById("childd").appendChild(DownloadBtn);
            DownloadedFiles()
            document.getElementById("childd").appendChild(LeaderBoardBtn);
           
        }
        let expenses = await axios.get(`http://184.73.55.18:3000/expenses?page=${page}&item=${localStorage.getItem("item_perPage")}`,{headers:{"Authorization":token}});
        for(let i =0;i<expenses.data.expenses.length;i++)
        {
            AddExpenseOnScreen(expenses.data.expenses[i])
        }
        StartPagination(expenses.data)

    } catch (error) {
        alert("Problem While fetching Expenses");
    }
}
refreshPage();

function StartPagination({
currentPage,previousPage,nextPage,lastPage,hasNextPage,hasPreviousPage
})
{
  console.log(currentPage,previousPage,nextPage,lastPage,hasNextPage,hasPreviousPage)
  let pagination = document.getElementById("pagination");
  document.getElementById("tableid").appendChild(pagination);
  pagination.innerHTML = "";
  let select = document.createElement("select")
  select.id = "sher"
  select.className = "custom-select"
  let option1 = document.createElement("option")
  option1.value ="5";
  option1.textContent= "5"
  let option2 = document.createElement("option")
  option2.value = "10"
  option2.textContent = "10"
  let option3 = document.createElement("option")
  option3.value ="25";
  option3.textContent = "25"
  let option4 = document.createElement("option")
  option4.value = "50";
  option4.textContent ="50";
  select.appendChild(option1)
  select.appendChild(option2)
  select.appendChild(option3)
  select.appendChild(option4)
  pagination.appendChild(select);
  document.getElementById("sher").addEventListener("click",()=>{
    localStorage.setItem("item_perPage",document.getElementById("sher").value);
  })
  if(hasPreviousPage)
  {
    let PrevBtn = document.createElement("button");
    PrevBtn.innerHTML = previousPage;
    PrevBtn.className = "btn btn-dark";
    PrevBtn.addEventListener("click",()=>{
      getExpenses(previousPage);
    })
    pagination.appendChild(PrevBtn);
  }
  let currBtn = document.createElement("button");
  currBtn.innerHTML = currentPage;
  currBtn.className = "btn btn-outline-secondary"
  currBtn.addEventListener("click",()=>{
    getExpenses(currentPage)
  })
  pagination.appendChild(currBtn);
  if(hasNextPage)
  {
    let nextBtn = document.createElement("button");
    nextBtn.innerHTML =nextPage;
    nextBtn.className = "btn btn-dark"
    nextBtn.addEventListener("click",()=>{
      getExpenses(nextPage)
    })
    pagination.appendChild(nextBtn);
  }
}
async function getExpenses(page)
{
  console.log(page)
  try {
        let token = localStorage.getItem("token");
        let expenses = await axios.get(`http://184.73.55.18:3000/expenses?page=${page}&item=${localStorage.getItem("item_perPage")}`,{headers:{"Authorization":token}});
        clearExpenseTable()
        for(let i=0;i<expenses.data.expenses.length;i++)
        {
           AddExpenseOnScreen(expenses.data.expenses[i])
        }
        StartPagination(expenses.data);
  } catch (error) {
    alert("SomeThing went Wrong While Fething Expenses")
  }
}
function clearExpenseTable() {
  const expenseTable = document.querySelector(".my-expenses");
  const tbody = expenseTable.querySelector("tbody");
  const dataRows = Array.from(tbody.children).slice(1);
  dataRows.forEach((row) => {
    tbody.removeChild(row);
  });
}


function addExpenseForm(event)
{
    event.preventDefault();
    console.log("ExpenseJS Working");
    let amount = document.getElementById("amount").value;
    let description = document.getElementById("Description").value;
    let category = document.getElementById("Category").value;
    let date = document.getElementById("date").value;
    if(!date)
    {
        date = new Date()
        date  = date.toISOString().split('T')[0];
    }
    console.log(date)
    let obj ={
        amount,
        description,
        category,
        date
    }
    addExpenseToDatabase(obj)
}
async function addExpenseToDatabase(obj)
{
    try {
        const token = localStorage.getItem("token");
        let expense = await axios.post("http://184.73.55.18:3000/expenses",obj,{headers:{"Authorization":token}})
        AddExpenseOnScreen(expense.data.expense);

    } catch (error) {
        document.body.innerHTML += `<ul class= "list-group">
        <li class= "list-group-items" style="backgroundColor:yellow; color:red;" >
        ${error.response.data.error}
        </li>
        </ul>`
    }
}
function createTable() {
    const CreateexpenseTable = document.createElement("table");
    CreateexpenseTable.id = "tableid";
    CreateexpenseTable.className = "my-expenses";
    CreateexpenseTable.innerHTML =
      "<tr class='table-header' ><th>Category</th><th>Description</th><th>Amount</th><th>Date</th></tr>";
    console.log(CreateexpenseTable);
    document.getElementById("expense-data").appendChild(CreateexpenseTable);
  }
  createTable();

  function AddExpenseOnScreen(obj) {
    const expenseTable = document.querySelector(".my-expenses");
    const row = expenseTable.insertRow();
    row.className = "table-row";
    row.insertAdjacentHTML(
      "beforeend",
      `<td class='expense-name' >${obj.category}</td><td class='expense-name' >${obj.description}</td><td class='expense-Amount'>${obj.amount}</td> <td class='expense-date'>${obj.date}</td> <td style="display:none;">${obj.id}</tb> `
    );
    const deleteExpenseBtn = document.createElement("button");
    deleteExpenseBtn.appendChild(document.createTextNode("X"));
    deleteExpenseBtn.className = "delete-expense";
    row.appendChild(deleteExpenseBtn);
    console.log(row.textContent);
  
    deleteExpenseBtn.onclick = async () => {
      console.log(obj.id);
      const token = localStorage.getItem("token");
      await axios.delete("http://184.73.55.18:3000/expenses/" + obj.id, {
        headers: { Authorization: token },
      });
    };
  }
  const DeleteExpenseUI = document.getElementById("expense-data");
  DeleteExpenseUI.addEventListener("click", async (e) => {
    if (e.target.className === "delete-expense") {
      e.composedPath().forEach((ele) => {
        if (ele.className != "table-row") {
        } else {
          ele.style.display = "none";
        }
      });
    }
  });


  async function PremiumUser()
  {
    const token = localStorage.getItem("token");
    try {
        let res = await axios.get("http://184.73.55.18:3000/purchase/premium",{headers:{"Authorization":token}});
        var options ={
            key:res.data.key_id,
            orderid:res.data.order.id,
            handler:async function(res){
                const response = await axios.post("http://184.73.55.18:3000/purchase/update",{
                    orderid:options.orderid,
                    payment_id:res.razorpay_payment_id,
                },{headers:{"Authorization":token}})
                alert("YOu ArE PrEmIuM UsEr")
                let premiumLi = document.createElement("li");
                premiumLi.textContent = `YoU ArE A PrEmIuM UsEr`;
                premiumLi.className = "list-group-item"
                document.getElementById("buypremium").replaceWith(premiumLi);
                document.body.appendChild(LeaderBoardBtn);
                document.getElementById("childd").appendChild(DownloadBtn);
                localStorage.setItem("token",response.data.token)
            }

        }
        console.log(options)
        let rzp1 = new Razorpay(options)
        rzp1.open();
        event.preventDefault();
        rzp1.on("payment.failed",(response)=>{
            alert("Payment Failed Try Again!")
        })
    } catch (error) {
        console.log(error.response.data.error);
        alert("Something Went Wrong !");
    }
  }
  async function ShowLeaderBoard()
  {
    const token = localStorage.getItem("token");
    const userLeaderBoard = await axios.get(
      "http://184.73.55.18:3000/showLeaderBoard"
    );
    console.log(userLeaderBoard);

    createTb();

    var LeaderBoardele = document.getElementById("leaderboard");
    userLeaderBoard.data.forEach((element, i) => {
      const expenseTable = document.querySelector(".my-leaderboard");
      const row = expenseTable.insertRow();
      row.className = "table-row";
      row.insertAdjacentHTML(
        "beforeend",
        `<td class='expense-name' >${i + 1}</td><td class='expense-date' >${
          element.username
        }</td><td class='expense-Amount'>${element.totalExpense}</td>`
      );
    });
    function createTb() {
      const CreateexpenseTable = document.createElement("table");
      CreateexpenseTable.className = "my-leaderboard";
      CreateexpenseTable.innerHTML =
        "<tr class='table-header' ><th>Rank</th><th>Name</th><th>Total Expenses</th></tr>";
      console.log(CreateexpenseTable);
      LeaderBoardBtn.after(CreateexpenseTable);
    }
  }

  async function DownloadExpenses()
  {
    try {
      const token = localStorage.getItem("token");
      let res = await axios.get("http://184.73.55.18:3000/downloadexpenses",{headers:{"Authorization":token}});
      if(res.status == 201)
      {
        var a = document.createElement("a");
        a.href = res.data.fileUrl
        a.download = res.data.filename
        a.click();
      }
    } catch (error) {
      console.log("Something Went Wrong While Downloading !");
    }
  }
  async function DownloadedFiles()
  {
    let ul = document.createElement("ul");
    ul.className = "list-group"
    DownloadBtn.after(ul);
    try {
      let token = localStorage.getItem("token")
      let res = await axios.get("http://184.73.55.18:3000/downloadhistory",{headers:{"Authorization":token}})
      for(let i =0;i<res.data.files.length;i++)
      {
        let li = document.createElement("li");
        li.innerHTML = `<a href="${res.data.files[i].url}" type="button"> ${res.data.files[i].Date}</a>`
        li.className ="list-group-item";
        ul.appendChild(li);
      }
    } catch (error) {
      console.log(error.response.data.error);
      alert("Some Problem While fetching Downloaded Files");
    }

  }