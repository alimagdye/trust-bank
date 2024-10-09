"use strict";

// Data
const account1 = {
  owner: "Ali Magdy",
  movements: [
    { value: 200, date: "2019-11-18T21:31:17.178Z" },
    { value: 450, date: "2019-12-23T07:42:02.383Z" },
    { value: -400, date: "2020-01-28T09:15:04.904Z" },
    { value: 3000, date: "2020-04-01T10:17:24.185Z" },
    { value: -650, date: "2021-05-08T14:11:59.604Z" },
    { value: -130, date: "2022-07-26T17:01:17.194Z" },
    { value: 70, date: "2023-07-28T23:36:17.929Z" },
    { value: 1300, date: "2024-09-11T10:51:36.790Z" },
  ],
  interestRate: 1.2, // %
  pin: 1111,
  local: "ar-EG",
  currency: "EGP",
};

const account2 = {
  owner: "Alexander James",
  movements: [
    { value: 5000, date: "2019-11-01T13:15:33.035Z" },
    { value: 3400, date: "2019-11-30T09:48:16.867Z" },
    { value: -150, date: "2019-12-25T06:04:23.907Z" },
    { value: -790, date: "2020-01-25T14:18:46.235Z" },
    { value: -3210, date: "2020-02-05T16:33:06.386Z" },
    { value: -1000, date: "2020-04-10T14:43:26.374Z" },
    { value: 8500, date: "2020-06-25T18:49:59.371Z" },
    { value: -30, date: "2020-07-26T12:01:20.894Z" },
  ],
  interestRate: 1.5,
  pin: 2222,
  locale: "en-US",
  currency: "USD",
};

const account3 = {
  owner: "Sophia Marie",
  movements: [
    { value: 200, date: "2019-11-01T13:15:33.035Z" },
    { value: -200, date: "2019-11-30T09:48:16.867Z" },
    { value: 340, date: "2019-12-25T06:04:23.907Z" },
    { value: -20, date: "2020-01-25T14:18:46.235Z" },
    { value: 50, date: "2020-02-05T16:33:06.386Z" },
    { value: 400, date: "2020-04-10T14:43:26.374Z" },
    { value: -460, date: "2020-06-25T18:49:59.371Z" },
    { value: -300, date: "2020-07-26T12:01:20.894Z" },
  ],
  interestRate: 0.7,
  pin: 3333,
  local: "en-GB",
  currency: "GBP",
};

const account4 = {
  owner: "Christopher Daniel",
  movements: [
    { value: 430, date: "2019-11-01T13:15:33.035Z" },
    { value: 1000, date: "2019-11-30T09:48:16.867Z" },
    { value: 700, date: "2020-01-25T14:18:46.235Z" },
    { value: 50, date: "2020-02-05T16:33:06.386Z" },
    { value: 90, date: "2020-04-10T14:43:26.374Z" },
  ],
  interestRate: 1,
  pin: 4444,
  locale: "pt-PT",
  currency: "EUR",
};

const account5 = {
  owner: "Empty account",
  movements: [],
  interestRate: 1,
  pin: 5555,
  local: "ko-KR",
  currency: "KRW",
};

const account6 = {
  owner: "Isabella Thomas",
  movements: [{ value: 5000000, date: "2024-02-05T16:33:06.386Z" }],
  interestRate: 1,
  pin: 6666,
  local: "de-DE",
  currency: "EUR",
};

const accounts = [account1, account2, account3, account4, account5, account6];

let sumOfAllMovements = accounts
  .flatMap((account) => account.movements)
  .reduce((sum, movement) => sum + movement, 0);

let sorted = 1;

let currentAccount;

const regex = /^(100(\.\d+)?|[1-9]\d{2,}(\.\d+)?)$/; // any number >= 100

let handleClose, timerId;

// elements
const helloElement = document.querySelector(".hello");
const movementContainer = document.querySelector(".movement");
const balanceElement = document.querySelector(".balance_value");
const sumOfDepositsElement = document.querySelector(".in span");
const sumOfWithdrawalElement = document.querySelector(".out span");
const totalInterestElement = document.querySelector(".interest span");
const loginBtn = document.querySelector(".login-btn");
const mainElement = document.querySelector("main");
const userElement = document.querySelector("input[name='username']");
const pinElement = document.querySelector("input[name='password']");
const transferToElement = document.querySelector("input[name='to']");
const transferAmountElement = document.querySelector("input[name='amount']");
const transferBtn = document.querySelector(".transfer-btn");
const loanAmount = document.querySelector("input[name='loan-amount']");
const loanBtn = document.querySelector(".loan-btn");
const confirmUser = document.querySelector('input[name="confirm-user"]');
const confirmPin = document.querySelector('input[name="confirm-pin"]');
const confirmBtn = document.querySelector(".confirm-btn");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const errorMessage = document.querySelector(".error-message");
const sortBtn = document.querySelector(".summary .sort-btn");
const loginDate = document.querySelector(".balance .date");
const timerElement = document.querySelector(".top-timer .timer #timer");
const logoutBtn = document.querySelector(".logout-btn");
const loginForm = document.querySelector('#login');


// functions

const displayHello = function (account) {
  helloElement.textContent =
    "Welcome back, " + account.owner.split(" ")[0] + "!";
};

const toDecimalFormat = function (num, locale, currency) {
  let [integerPart, decimalPart = "00"] = String(num).split(".");
  decimalPart = decimalPart.slice(0, 2).padEnd(2, "0"); // pad in case the decimal part is less than 2 digits
  return integerPart + "." + decimalPart;
};

const formatCurrency = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const calculateDate = function (date) {
  let currentDate = new Date();
  let daysPassed = Math.round(
    Math.abs((currentDate - date) / (1000 * 60 * 60 * 24))
  );

  if (daysPassed === 0) return "TODAY";
  if (daysPassed === 1) return "YESTERDAY";

  let day = `${date.getDate()}`.padStart(2, "0");
  let month = `${date.getMonth() + 1}`.padStart(2, "0");
  let year = date.getFullYear();

  return `${day}/${month}/${year}`;

  // return new Intl.DateTimeFormat(local).format(date);
};

// if we want to round but we don't want to do this in this project
// function to round the number to 2 decimal places
// let num = 222.223
// num *= 100
// num = Math.floor(num)
// num /= 100
// return num.toFixed(2); 222.22

const displayMovements = function (account, sort = 1) {
  movementContainer.innerHTML = ""; // first reset the container
  if (account.movements.length === 0) {
    movementContainer.insertAdjacentHTML(
      "afterbegin",
      `<div class="no-data">
            <div>No movement available</div>
            <div class="clock">
              <div class="hand1"></div>
              <div class="hand2"></div>
            </div>
          </div>`
    );
  } else {
    let movements;
    if (sort === 1) {
      movements = account.movements;
    } else if (sort === 2) {
      // I made slice to make a copy of the array
      movements = account.movements.slice().sort((a, b) => a.value - b.value);
    } else if (sort === 3) {
      movements = account.movements.slice().sort((a, b) => b.value - a.value);
    }
    movements.forEach((movement, index) => {
      // get the type of the movement
      let type = movement.value < 0 ? "WITHDRAWAL" : "DEPOSIT";

      let cellHtml = `<div class="cell">
            <div class="type ${type.toLowerCase()}">${
        index + 1
      }&nbsp;${type}</div>
            <div class="date">${calculateDate(new Date(movement.date))}</div>
            <div class="amount">${formatCurrency(
              toDecimalFormat(movement.value),
              account.local,
              account.currency
            )}</div>
          </div>`;
      movementContainer.insertAdjacentHTML("afterbegin", cellHtml);
    });
  }
};

const makeUser = function (accounts) {
  accounts.forEach((account) => {
    account.user = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};

makeUser(accounts);

const displayBalance = function (account) {
  balanceElement.textContent = "00.00 €"; // first reset the balance

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  loginDate.textContent = Intl.DateTimeFormat(account.local, options).format(
    new Date()
  );

  if (account.movements.length === 0) return;
  account.balance = Number(
    toDecimalFormat(
      // to prevent Floating-Point Precision Issue
      account.movements.reduce(
        (sum, movement) => sum + movement.value, // like sum= sum+ movement
        0
      )
    )
  );
  balanceElement.textContent = formatCurrency(
    account.balance,
    account.local,
    account.currency
  );
};

const displaySummary = function (account) {
  // first reset the summary
  totalInterestElement.textContent =
    sumOfDepositsElement.textContent =
    sumOfWithdrawalElement.textContent =
      formatCurrency(0, account.local, account.currency);
  if (account.movements.length === 0) return;
  const deposits = [];
  const withdrawals = [];
  account.movements.forEach((movement) => {
    if (movement.value > 0) {
      deposits.push(movement.value);
    } else if (movement.value < 0) {
      withdrawals.push(movement.value);
    }
  });

  // deposit
  if (deposits.length !== 0) {
    // check if there is any deposit
    const sumOfDeposits = toDecimalFormat(
      deposits.reduce((sum, deposit) => sum + deposit)
    );
    sumOfDepositsElement.textContent = formatCurrency(
      sumOfDeposits,
      account.local,
      account.currency
    );
    // interest
    const totalInterests = toDecimalFormat(
      deposits.reduce(
        (sum, deposit) => sum + (deposit * account.interestRate) / 100, // like sum= sum+ (deposit* interestRate)/100
        0
      )
    );
    totalInterestElement.textContent = formatCurrency(
      totalInterests,
      account.local,
      account.currency
    ); // round the number to 2 fractionals without appromixation
  }
  // withdrawal
  if (withdrawals.length !== 0) {
    // check if there is any withdrawal
    const sumOfWithdrawal = withdrawals.reduce(
      (sum, withdrawal) => sum + withdrawal
    );
    sumOfWithdrawalElement.textContent = formatCurrency(
      Math.abs(sumOfWithdrawal),
      account.local,
      account.currency
    ); // here we want the appromixation because it's a negative number. we calculate even 0.0001 because it's a negative number
  }
};

const displayError = function (
  message,
  element1 = userElement,
  element2 = pinElement
) {
  handleShow();
  errorMessage.textContent = message;
  element1.style.borderColor = element2.style.borderColor = "rgb(255, 0, 0)";
  handleClose = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    setTimeout(() => {
      element1.style.borderColor = element2.style.borderColor = "";
    }, 1000);
  };
};

function endSession() {
  mainElement.classList.add("hide");
  setTimeout(() => {
    mainElement.style.display = "none";
    logoutBtn.style.display = "none";
    loginForm.style.display = 'flex';
  }, 1000);
}

const timer = function () {
  let time = 120;
  console.log(time);
  timerElement.textContent = `02:00`;
  time--;
  const timer = setInterval(() => {
    let minutes = `${Math.trunc(time / 60)}`.padStart(2, 0);
    let seconds = `${time % 60}`.padStart(2, 0);
    timerElement.textContent = `${minutes}:${seconds}`;

    if (time === -1) {
      timerElement.textContent = `00:00`;

      clearInterval(timer);
      displayError("Session Expired: try to login again");
      endSession();
    }
    time--;
  }, 1000);
  return timer;
};

const updateUI = function (account) {
  displayHello(account);
  displayMovements(account);
  displayBalance(account);
  displaySummary(account);
  if(timerId) clearInterval(timerId);
  timerId = timer();
};

const login = function (e) {
  e.preventDefault();

  const user = userElement.value.trim();
  const pin = Number(pinElement.value);
  let logingAccount;
  // reset the input fields
  userElement.value = pinElement.value = "";
  if (!(logingAccount = accounts.find((acc) => acc.user === user))) {
    displayError("Account doesn't exist: wrong user");
  } else if (!(logingAccount.user === user && logingAccount.pin === pin)) {
    displayError("Wrong PIN");
  } else {
    // login success
    currentAccount = logingAccount;
    ////////////////////////
    // animation
    mainElement.classList.add("hide"); // incase there is account logged in and we change the account, then we hide the main element. we reset the opacity to 0
    mainElement.style.display = "none";

    setTimeout(() => {
      // then we first display the main element
      mainElement.style.display = "block";
    }, 400);

    setTimeout(() => {
      mainElement.classList.remove("hide"); // and then we change the opacity
      mainElement.classList.add("appear");
    }, 500); // I made two setTimeout functions one for display block and the other for opacity, so that we display the main element first then we change the opacity
    /////////////////////////
    logoutBtn.style.display = "block";
    loginForm.style.display = 'none';
    updateUI(currentAccount);
  }
};

const transferMoney = function (e) {
  e.preventDefault();
  const receiverUser = transferToElement.value;
  const amount = Number(toDecimalFormat(transferAmountElement.value));
  // reset the input fields
  transferAmountElement.value = transferToElement.value = "";
  let receiver;
  if (!regex.test(amount)) {
    displayError(
      "Invalid amount: must be a number greater than 100",
      transferAmountElement,
      transferAmountElement
    );
  } else if (currentAccount.balance < amount) {
    displayError(
      "invalid amount:insufficient funds",
      transferAmountElement,
      transferAmountElement
    );
  } else if (
    !(receiver = accounts.find((account) => account.user === receiverUser))
  ) {
    displayError(
      "Wrong receiver: account doesn't exist",
      transferToElement,
      transferToElement
    );
  } else if (receiverUser === currentAccount.user) {
    displayError(
      "Wrong receiver: you can't transfer to yourself",
      transferToElement,
      transferToElement
    );
  } else {
    // transfer
    currentAccount.movements.push({
      value: -amount,
      date: new Date().toISOString(),
    });
    receiver.movements.push({ value: amount, date: new Date().toISOString() });
    updateUI(currentAccount);
  }
};

const closeAccount = function (e) {
  e.preventDefault();
  const user = confirmUser.value;
  const pin = Number(confirmPin.value);
  // reset the input fields
  confirmUser.value = confirmPin.value = "";
  if (currentAccount.user === user && currentAccount.pin === pin) {
    const indexOfAccount = accounts.findIndex(
      (account) => account.user === user
    );
    accounts.splice(indexOfAccount, 1);
    endSession();
  } else {
    displayError("Wrong credentials", confirmUser, confirmPin);
  }
};

const requestLoan = function (e) {
  e.preventDefault();
  const amount = Number(toDecimalFormat(loanAmount.value));
  loanAmount.value = "";
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov.value >= amount * 0.1)
  ) {
    // check if the amount is greater than 0 and if the user has at least 10% of the amount
    setTimeout(() => {
      // after 1 second
      currentAccount.movements.push({
        value: amount,
        date: new Date().toISOString(),
      });
      updateUI(currentAccount);
    }, 1000);
  } else {
    displayError(
      "Invalid amount: you must have at least 10% of the amount",
      loanAmount,
      loanAmount
    );
  }
};

const handleShow = function () {
  modal.classList.remove("hidden"); // don't put dot
  overlay.classList.remove("hidden");
};

const sortMovements = function () {
  if (sorted !== 3) sorted++;
  else sorted = 1;
  displayMovements(currentAccount, sorted);
};

// event listeners
loginBtn.addEventListener("click", login);
transferBtn.addEventListener("click", transferMoney);
confirmBtn.addEventListener("click", closeAccount);
loanBtn.addEventListener("click", requestLoan);
sortBtn.addEventListener("click", sortMovements);
logoutBtn.addEventListener("click", endSession);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden"))
    handleClose();
});

document
  .querySelector(".close-modal")
  .addEventListener("click", () => handleClose());

overlay.addEventListener("click", () => handleClose());



// TODO: confirm button in modal to continue any operation or close the modal

// TODO: describtion for each movement
