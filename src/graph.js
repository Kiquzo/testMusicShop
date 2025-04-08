export function seegraph() {
    document.getElementById('graph').addEventListener('click', function () {
        fetch('/api/consultations/stats')
          .then(response => response.json())
          .then(data => {
            const labels = data.map(item => item.date);
            const values = data.map(item => item.count);
      
            const ctx = document.createElement('canvas');
            document.getElementById('table-container').appendChild(ctx);
      
            new Chart(ctx, {
              type: 'bar',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Количество записей на консультации',
                  data: values,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          })
          .catch(error => console.error('Ошибка при загрузке данных:', error));
      });          
}