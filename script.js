"use strict";

// Dummy account
const account1 = {
  owner: "Surekha Chavan",
  username: "sc",
  pin: "1111",
  movements: [200, -100, 340, -300, 1200],
};

const account2 = {
  owner: "Amit Kumar",
  username: "ak",
  pin: "2222",
  movements: [500, -150, 300, -50, 1000],
};

const accounts = [account1, account2];

// Elements
const inputUsername = document.getElementById("input-username");
const inputPin = document.getElementById("input-pin");
const btnLogin = document.getElementById("btn-login");

const app = document.querySelector(".app");
const userNameDisplay = document.getElementById("user-name");
const balanceDisplay = document.getElementById("balance");
const movementsContainer = document.getElementById("movements");

const inputTransferTo = document.getElementById("transfer-to");
const inputTransferAmount = document.getElementById("transfer-amount");
const btnTransfer = document.getElementById("btn-transfer");

const inputLoanAmount = document.getElementById("loan-amount");
const btnLoan = document.getElementById("btn-loan");

const inputCloseUsername = document.getElementById("close-username");
const inputClosePin = document.getElementById("close-pin");
const btnClose = document.getElementById("btn-close");

const timerDisplay = document.getElementById("timer");

let currentAccount;
let logoutTimer;

// Functions
function displayMovements(movements) {
  movementsContainer.innerHTML = "";
  movements.forEach((mov, i) => {
    const type = mov > 0 ? "Deposit" : "Withdrawal";
    const html = `<div class="movement">${i + 1}. ${type}: ₹ ${mov}</div>`;
    movementsContainer.insertAdjacentHTML("beforeend", html);
  });
}

function displayBalance(movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  balanceDisplay.textContent = balance;
}

function updateUI(account) {
  displayMovements(account.movements);
  displayBalance(account.movements);
}

// Timer function
function startLogoutTimer() {
  let time = 120;
  clearInterval(logoutTimer);

  logoutTimer = setInterval(() => {
    timerDisplay.textContent = `Session Time: ${time}s`;
    if (time === 0) {
      clearInterval(logoutTimer);
      alert("Session expired!");
      app.classList.add("hidden");
      document.querySelector(".login").classList.remove("hidden");
    }
    time--;
  }, 1000);
}

// Login
btnLogin.addEventListener("click", function () {
  const username = inputUsername.value;
  const pin = inputPin.value;

  currentAccount = accounts.find(
    (acc) => acc.username === username && acc.pin === pin
  );

  if (currentAccount) {
    document.querySelector(".login").classList.add("hidden");
    app.classList.remove("hidden");
    userNameDisplay.textContent = currentAccount.owner.split(" ")[0];
    updateUI(currentAccount);
    startLogoutTimer();
  } else {
    alert("Wrong credentials!");
  }

  inputUsername.value = inputPin.value = "";
});

// Transfer
btnTransfer.addEventListener("click", function () {
  const receiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  if (
    receiver &&
    amount > 0 &&
    currentAccount.movements.reduce((acc, mov) => acc + mov, 0) >= amount
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
  } else {
    alert("Transfer failed.");
  }

  inputTransferTo.value = inputTransferAmount.value = "";
});

// Request Loan
btnLoan.addEventListener("click", function () {
  const amount = +inputLoanAmount.value;
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  } else {
    alert("Loan not approved.");
  }
  inputLoanAmount.value = "";
});

// Close Account
btnClose.addEventListener("click", function () {
  if (
    inputCloseUsername.value === currentAccount.username &&
    inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    app.classList.add("hidden");
    document.querySelector(".login").classList.remove("hidden");
    alert("Account closed.");
  } else {
    alert("Incorrect username or pin.");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});
