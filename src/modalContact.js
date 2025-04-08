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
    });
}