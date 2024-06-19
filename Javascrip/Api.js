document.getElementById('fetchData').addEventListener('click', function() {
    const apiKey = '702NGD1BPY09S35K';
    const symbol = document.getElementById('stockSymbol').value;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data['Time Series (5min)'];
            if (!timeSeries) {
                document.getElementById('stockData').innerText = 'No se encontraron datos para el símbolo proporcionado.';
                return;
            }

            const times = Object.keys(timeSeries).reverse();
            const openPrices = times.map(time => parseFloat(timeSeries[time]['1. open']));
            const highPrices = times.map(time => parseFloat(timeSeries[time]['2. high']));
            const lowPrices = times.map(time => parseFloat(timeSeries[time]['3. low']));
            const closePrices = times.map(time => parseFloat(timeSeries[time]['4. close']));
            const volumes = times.map(time => parseInt(timeSeries[time]['5. volume'], 10));

            const stockDataDiv = document.getElementById('stockData');
            stockDataDiv.innerHTML = `
                <p>Símbolo: ${symbol}</p>
                <p>Último precio de apertura: ${openPrices[openPrices.length - 1]}</p>
                <p>Último precio alto: ${highPrices[highPrices.length - 1]}</p>
                <p>Último precio bajo: ${lowPrices[lowPrices.length - 1]}</p>
                <p>Último precio de cierre: ${closePrices[closePrices.length - 1]}</p>
                <p>Último volumen: ${volumes[volumes.length - 1]}</p>
                <p>Última actualización: ${times[times.length - 1]}</p>
            `;

            // Crear el gráfico con Chart.js
            const ctx = document.getElementById('stockChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: times,
                    datasets: [
                        {
                            label: 'Precio de Apertura',
                            data: openPrices,
                            borderColor: 'blue',
                            fill: false
                        },
                        {
                            label: 'Precio Alto',
                            data: highPrices,
                            borderColor: 'green',
                            fill: false
                        },
                        {
                            label: 'Precio Bajo',
                            data: lowPrices,
                            borderColor: 'red',
                            fill: false
                        },
                        {
                            label: 'Precio de Cierre',
                            data: closePrices,
                            borderColor: 'purple',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Tiempo'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Precio'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error al obtener los datos de la acción:', error);
            document.getElementById('stockData').innerText = 'Ocurrió un error al obtener los datos.';
        });
});
