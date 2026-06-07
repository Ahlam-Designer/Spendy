const form = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const addBtn = document.getElementById('add-btn');
const expenseList = document.getElementById('expense-list');
const totalEl = document.getElementById('total-amount');
const countEl = document.getElementById('expense-count');
const emptyState = document.getElementById('empty-state');

let expenses = [];

function formatCAD(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

function updateTotal() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = formatCAD(total);
}

function updateCount() {
  const len = expenses.length;
  countEl.textContent = len === 1 ? '1 item' : `${len} items`;
}

function toggleEmptyState() {
  emptyState.style.display = expenses.length === 0 ? 'flex' : 'none';
}

function renderExpenses() {
  const fragment = document.createDocumentFragment();

  expenses.forEach((expense, index) => {
    const li = document.createElement('li');
    li.className = 'expense-item';
    li.dataset.index = index;

    const dateStr = new Date(expense.date).toLocaleDateString('en-CA', {
      month: 'short',
      day: 'numeric',
    });

    li.innerHTML = `
      <div class="expense-info">
        <span class="expense-name">${escapeHtml(expense.name)}</span>
        <span class="expense-date">${dateStr}</span>
      </div>
      <div class="expense-right">
        <span class="expense-amount">${formatCAD(expense.amount)}</span>
        <button class="btn-delete" aria-label="Delete ${escapeHtml(expense.name)}" data-index="${index}">×</button>
      </div>
    `;

    const deleteBtn = li.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteExpense(index, li));

    fragment.appendChild(li);
  });

  expenseList.innerHTML = '';
  expenseList.appendChild(fragment);
  emptyState.remove();
  expenseList.appendChild(emptyState);

  toggleEmptyState();
  updateTotal();
  updateCount();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function deleteExpense(index, liEl) {
  liEl.classList.add('removing');
  setTimeout(() => {
    expenses.splice(index, 1);
    renderExpenses();
  }, 250);
}

function addExpense(name, amount) {
  expenses.push({
    name: name.trim(),
    amount,
    date: new Date(),
  });
  renderExpenses();
}

function validateInputs() {
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  let valid = true;

  if (!name) {
    nameInput.classList.add('error');
    valid = false;
  } else {
    nameInput.classList.remove('error');
  }

  if (!amount || amount <= 0) {
    amountInput.classList.add('error');
    valid = false;
  } else {
    amountInput.classList.remove('error');
  }

  return valid ? { name, amount } : null;
}

function clearForm() {
  nameInput.value = '';
  amountInput.value = '';
  nameInput.classList.remove('error');
  amountInput.classList.remove('error');
  nameInput.focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addBtn.disabled = true;

  const result = validateInputs();
  if (result) {
    addExpense(result.name, result.amount);
    clearForm();
  }

  addBtn.disabled = false;
});

nameInput.addEventListener('input', () => {
  nameInput.classList.remove('error');
});

amountInput.addEventListener('input', () => {
  amountInput.classList.remove('error');
});

renderExpenses();
