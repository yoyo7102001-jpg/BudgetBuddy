const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const category = document.getElementById("category");
const date = document.getElementById("date");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
);

let transactions =
    localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];

// Add Transactions
function addTransaction(e) {
    e.preventDefault();
    const datalist = document.getElementById("categoryList");

const exists = Array.from(datalist.options).some(
  option => option.value === category.value
);

if (!exists) {
  const option = document.createElement("option");
  option.value = category.value;
  datalist.appendChild(option);
}

        if (
        category.value.trim() === "" || amount.value.trim() === "" ||date.value.trim() === "") {
        alert("Please add a expense and amount");
    } else {
        const transaction = {
            id: generateId(),
            category: category.value,
            amount: +amount.value,
            date: date.value,
            };


        transactions.push(transaction);

        addTransactionToDOM(transaction);

        updateLocalStoarge();

        updateValues();

        category.value = "";
        date.value = "";
        amount.value = "";
    }
}

// Add Transactions To The DOM List
function addTransactionToDOM(transaction) {
    // Get the sign plus or minus
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    // Add classes based on the value
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        ${transaction.category} (${transaction.date}) <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onClick="removeTransaction(${
        transaction.id
    })">x</button>
    `;
    list.prepend(item);

}

// Update the balance, income and expenses
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `${total}`;
    money_plus.innerText = `¥${income}`;
    money_minus.innerText = `¥${expense}`;
}

// Delete The Transactions by ID
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);

    updateLocalStoarge();

    init();
}

// Update The Local Storage
function updateLocalStoarge() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize the App
function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

// Generate a Random ID
function generateId() {
    return Math.floor(Math.random() * 100000000);
}

form.addEventListener("submit", addTransaction);

// Export transactions as CSV
function exportCSV() {
    if (transactions.length === 0) {
        alert("No transactions to export!");
        return;
    }

    // CSV header
    let csv = "Category,Date,Amount\n";

    // Add each transaction
    transactions.forEach(t => {
        csv += `${t.category},${t.date},${t.amount}\n`;
    });

    // Create a download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BudgetBuddy_Transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function toggleMenu() {
  const menu = document.getElementById("historyMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Optional: close menu when clicking outside
window.addEventListener("click", function(e) {
  const menu = document.getElementById("historyMenu");
  const button = document.querySelector(".menu-btn");

  if (!button.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = "none";
  }
});

const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

exportBtn.addEventListener("click", exportCSV);
clearBtn.addEventListener("click", clearAllTransactions);

function exportCSV() {
    if (transactions.length === 0) {
        alert("No transactions to export!");
        return;
    }

    let csv = "Category,Date,Amount\n";

    transactions.forEach(t => {
        csv += `${t.category},${t.date},${t.amount}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "BudgetBuddy_Transactions.csv";
    a.click();

    URL.revokeObjectURL(url);
}

function clearAllTransactions() {
  if (confirm("Are you sure you want to delete all transactions?")) {
    localStorage.removeItem("transactions");
    location.reload();
  }
}


