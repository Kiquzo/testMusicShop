export function seedb() {
    const tableSelect = document.getElementById('table-select');
    const updateButton = document.getElementById('update');
    const deleteButton = document.getElementById('del');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const saveChangesButton = document.getElementById('saveChanges');
    let currentId = null;

    if (!tableSelect || !updateButton || !deleteButton || !editModal || !closeBtn || !saveChangesButton) {
        console.error('Не все элементы найдены');
        return;
    }

    tableSelect.addEventListener('change', function() {
        const tableName = this.value;
        fetch(`/api/tables/${tableName}`)
            .then(response => response.json())
            .then(data => {
                displayTable(data, tableName);
            });
    });

    function displayTable(data, tableName) {
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';

        if (data.length === 0) {
            tableContainer.innerHTML = 'Нет данных для отображения';
            return;
        }

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const columns = Object.keys(data[0]);

        const headerRow = document.createElement('tr');
        const selectTh = document.createElement('th');
        headerRow.appendChild(selectTh);
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        data.forEach(row => {
            const tr = document.createElement('tr');
            const selectTd = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('row-select');
            selectTd.appendChild(checkbox);
            tr.appendChild(selectTd);
            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col];
                td.dataset.column = col; // Добавляем информацию о колонке
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        tableContainer.appendChild(table);

        document.querySelectorAll('.row-select').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    this.closest('tr').classList.add('selected');
                } else {
                    this.closest('tr').classList.remove('selected');
                }
            });
        });

        updateButton.addEventListener('click', function() {
            const selectedRow = document.querySelector('.row-select:checked');
            if (selectedRow) {
                const row = selectedRow.closest('tr');
                const rowData = {};
                row.querySelectorAll('td').forEach((td, index) => {
                    rowData[td.dataset.column] = td.textContent;
                });
                openEditModal(rowData, tableName);
            } else {
                alert('Пожалуйста, выберите строку для редактирования.');
            }
        });

        deleteButton.addEventListener('click', function() {
            const selectedRows = document.querySelectorAll('.row-select:checked');
            const rowsToDelete = [];
            selectedRows.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const rowData = {};
                row.querySelectorAll('td').forEach((td, index) => {
                    if(typeof td.dataset.column !== 'undefined') {
                        rowData[td.dataset.column] = td.textContent;
                    }
                    
                });
                rowsToDelete.push(rowData);
                row.remove();
            });

            if (rowsToDelete.length > 0) {
                fetch('/api/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tableName, rows: rowsToDelete })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log('Строки успешно удалены');
                    } else {
                        console.error('Ошибка при удалении строк:', data.message);
                    }
                })
                .catch(error => console.error('Ошибка при выполнении запроса:', error));
            }
        });
    }

    function openEditModal(rowData, tableName) {
        const modal = document.getElementById('editModal');
        const form = document.getElementById('editForm');
        form.innerHTML = '';

        for (const [key, value] of Object.entries(rowData)) {
            if (key.toLowerCase().includes('id')) {
                currentId = value;
                continue;
            }
            if (key === 'undefined') continue; // Пропуск undefined ключей

            const label = document.createElement('label');
            label.textContent = key;
            const input = document.createElement('input');
            input.type = 'text';
            input.name = key;
            input.value = value;
            form.appendChild(label);
            form.appendChild(input);
        }

        modal.style.display = 'block';

        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        saveChangesButton.onclick = function() {
            const formData = new FormData(form);
            const updatedData = {};
            formData.forEach((value, key) => {
                updatedData[key] = value;
            });

            if (!currentId) {
                alert('Не найдено поле идентификатора');
                console.error('Updated data:', updatedData);
                return;
            }

            updatedData['id'] = currentId; // Добавляем идентификатор в данные

            console.log('Updated data:', updatedData); // Логирование данных перед отправкой

            fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tableName, rowData: updatedData })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Данные успешно обновлены');
                    modal.style.display = 'none';
                    document.getElementById('table-select').dispatchEvent(new Event('change'));
                } else {
                    console.error('Ошибка при обновлении данных:', data.message);
                }
            })
            .catch(error => console.error('Ошибка при выполнении запроса:', error));
        }
    }

document.getElementById('del').addEventListener('click', function() {
    const selectedRows = document.querySelectorAll('.row-select:checked');
    const rowsToDelete = [];
    selectedRows.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const rowData = {};
        row.querySelectorAll('td').forEach((td, index) => {
            if (index > 0) { // Пропуск первого столбца с чекбоксом
                rowData[columns[index - 1]] = td.textContent;
            }
        });
        rowsToDelete.push(rowData);
        row.remove(); // Удаление строки из таблицы
    });

    if (rowsToDelete.length > 0) {
        fetch('/api/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tableName, rows: rowsToDelete })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Строки успешно удалены');
            } else {
                console.error('Ошибка при удалении строк:', data.message);
            }
        })
        .catch(error => console.error('Ошибка при выполнении запроса:', error));
    }
});

const addButton = document.getElementById('adding');
const addModal = document.getElementById('addModal');
const closeAddModal = addModal.querySelector('.close');
const addRecordButton = document.getElementById('addRecord');
const addForm = document.getElementById('addForm');
let currentTable = tableSelect.value;

tableSelect.addEventListener('change', function() {
    currentTable = this.value;
});

addButton.addEventListener('click', function() {
    openAddModal(currentTable);
});

closeAddModal.onclick = function() {
    addModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == addModal) {
        addModal.style.display = 'none';
    }
};

function openAddModal(tableName) {
    addForm.innerHTML = '';
    fetch(`/api/tables/${tableName}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const columns = Object.keys(data[0]);
                columns.forEach(col => {
                    if (col.toLowerCase().includes('id')) return;
                    const label = document.createElement('label');
                    label.textContent = col;
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.name = col;
                    addForm.appendChild(label);
                    addForm.appendChild(input);
                });
                addModal.style.display = 'block';
            } else {
                alert('Нет данных для отображения');
            }
        });
}

addRecordButton.addEventListener('click', function() {
    const formData = new FormData(addForm);
    const newData = {};
    formData.forEach((value, key) => {
        newData[key] = value;
    });

    fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableName: currentTable, rowData: newData })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Данные успешно добавлены');
            addModal.style.display = 'none';
            tableSelect.dispatchEvent(new Event('change'));
        } else {
            console.error('Ошибка при добавлении данных:', data.message);
        }
    })
    .catch(error => console.error('Ошибка при выполнении запроса:', error));
});
}