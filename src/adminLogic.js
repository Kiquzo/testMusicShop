function onClick(event) {
    event.preventDefault();

    const email = document.getElementById('avemail').value;
    const password = document.getElementById('avpassword').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.role === 'admin') {
                    window.location.href = '/admin';
                } else {
                    alert('У вас нет прав администратора');
                }
            } else {
                alert(data.error || 'Ошибка авторизации');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при авторизации');
        });
}