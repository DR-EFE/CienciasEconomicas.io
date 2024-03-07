// Chart.js
window.onload = function () {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: precios, // Aquí debes poner los precios
            datasets: [{
                label: 'Estrato Bajo',
                data: datosBajo, // Aquí debes poner los datos de la ecuación del estrato bajo
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }, {
                label: 'Estrato Medio',
                data: datosMedio, // Aquí debes poner los datos de la ecuación del estrato medio
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }, {
                label: 'Estrato Alto',
                data: datosAlto, // Aquí debes poner los datos de la ecuación del estrato alto
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2
            }, {
                label: 'Ecuación de Mercado',
                data: datosMercado, // Aquí debes poner los datos de la ecuación de mercado
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
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
}