export function modal() {
    document.addEventListener('DOMContentLoaded', ()=>{
        const openModal = document.getElementById('open-email');
        const modal = document.getElementById('consultationModal');

        openModal.addEventListener('click', ()=>{
            modal.style.display = 'flex';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        consultationForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(consultationForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            try {
                const response = await fetch('/api/consultation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (response.status === 201) {
                    alert(result.message);
                    conMod.style.display = 'none';
                } else {
                    alert(result.message);
                }
            } catch (error) {
                alert('Произошла ошибка при записи на консультацию');
            }
        });
    });
}