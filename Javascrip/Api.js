 // Variables globales
 let stockChart = null;
 let comparisonChart = null;
 let currentPeriod = 'INTRADAY';
 
 // Elementos DOM

 const stockSymbolInput = document.getElementById('stockSymbol');
 const fetchDataButton = document.getElementById('fetchData');
 const stockDataElement = document.getElementById('stockData');
 const chartContainer = document.getElementById('chartContainer');
 const comparisonSection = document.getElementById('comparisonSection');
 const loader = document.getElementById('loader');
 const errorMessage = document.getElementById('errorMessage');
 const compareButton = document.getElementById('compareStocks');
 
       // Clave API fija
 const apiKey = 'MDI4UV4A485MVP88';
 
 // Botón principal de búsqueda
 fetchDataButton.addEventListener('click', function () {
     const symbol = stockSymbolInput.value.trim().toUpperCase();
 
     if (symbol) {
         // Obtener datos
         fetchStockData(symbol, apiKey);
     } else {
         showError('Por favor, ingresa el símbolo de la acción');
     }
 });
 
 // Presionar Enter en el campo de búsqueda
 stockSymbolInput.addEventListener('keypress', function (e) {
     if (e.key === 'Enter') {
         const symbol = this.value.trim().toUpperCase();
 
         if (symbol) {
             fetchStockData(symbol, apiKey);
         } else {
             showError('Por favor, ingresa el símbolo de la acción');
         }
     }
 });
 
 // Símbolos populares
 document.querySelectorAll('.symbol-tag').forEach(tag => {
     tag.addEventListener('click', function () {
         const symbol = this.getAttribute('data-symbol');
         stockSymbolInput.value = symbol;
 
         if (symbol) {
             fetchStockData(symbol, apiKey);
         } else {
             showError('Por favor, selecciona un símbolo válido');
         }
     });
 });
 
 // Botones de período de tiempo
 document.querySelectorAll('.period-button').forEach(button => {
     button.addEventListener('click', function () {
         document.querySelectorAll('.period-button').forEach(btn => {
             btn.classList.remove('active');
         });
         this.classList.add('active');
         currentPeriod = this.getAttribute('data-period');
 
         const symbol = stockSymbolInput.value.trim().toUpperCase();
 
         if (symbol) {
             fetchHistoricalData(symbol, currentPeriod, apiKey);
         }
     });
 });

 
 // Función para obtener datos de la acción en tiempo real
 async function fetchStockData(symbol, apiKey) {
     showLoader();
     hideError();
     
     try {
         // Obtener datos de cotización en tiempo real
         const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
         const quoteResponse = await fetch(quoteUrl);
         const quoteData = await quoteResponse.json();
         
         // Verificar si hay un error en la respuesta
         if (quoteData['Error Message'] || quoteData['Note']) {
             const errorMsg = quoteData['Error Message'] || quoteData['Note'];
             showError(errorMsg);
             return;
         }
         
         if (!quoteData['Global Quote'] || Object.keys(quoteData['Global Quote']).length === 0) {
             showError('No se encontraron datos para el símbolo proporcionado');
             return;
         }
         
         // Procesar datos de cotización
         const quote = quoteData['Global Quote'];
         
         // Obtener información de la empresa (nombre)
         const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
         const overviewResponse = await fetch(overviewUrl);
         const overviewData = await overviewResponse.json();
         
         // Actualizar los datos de la acción
         updateStockCard({
             symbol: symbol,
             companyName: overviewData.Name || symbol,
             price: parseFloat(quote['05. price']),
             open: parseFloat(quote['02. open']),
             high: parseFloat(quote['03. high']),
             low: parseFloat(quote['04. low']),
             prevClose: parseFloat(quote['08. previous close']),
             change: parseFloat(quote['09. change']),
             changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
             volume: parseInt(quote['06. volume']),
             lastUpdate: quote['07. latest trading day']
         });
         
         // Mostrar y actualizar el gráfico
         chartContainer.style.display = 'block';
         fetchHistoricalData(symbol, currentPeriod, apiKey);
         
         // Mostrar sección de comparación
         comparisonSection.style.display = 'block';
         
     } catch (error) {
         showError('Error al obtener datos: ' + error.message);
     } finally {
         hideLoader();
     }
 }





 
 // Función para obtener datos históricos para el gráfico
 async function fetchHistoricalData(symbol, period, apiKey) {
     showLoader();
     
     try {
         let function_name;
         let data_key;
         
         switch (period) {
             case 'INTRADAY':
                 function_name = 'TIME_SERIES_INTRADAY';
                 data_key = 'Time Series (5min)';
                 interval = '5min';
                 break;
             case 'DAILY':
                 function_name = 'TIME_SERIES_DAILY';
                 data_key = 'Time Series (Daily)';
                 break;
             case 'WEEKLY':
                 function_name = 'TIME_SERIES_WEEKLY';
                 data_key = 'Weekly Time Series';
                 break;
             case 'MONTHLY':
                 function_name = 'TIME_SERIES_MONTHLY';
                 data_key = 'Monthly Time Series';
                 break;
             default:
                 function_name = 'TIME_SERIES_DAILY';
                 data_key = 'Time Series (Daily)';
         }
         
         // Construir URL según el período
         let url = `https://www.alphavantage.co/query?function=${function_name}&symbol=${symbol}`;
         
         if (period === 'INTRADAY') {
             url += `&interval=${interval}&outputsize=compact`;
         }
         
         url += `&apikey=${apiKey}`;
         
         const response = await fetch(url);
         const data = await response.json();
         
         if (data['Error Message'] || data['Note']) {
             const errorMsg = data['Error Message'] || data['Note'];
             showError(errorMsg);
             return;
         }
         
         if (!data[data_key] || Object.keys(data[data_key]).length === 0) {
             showError('No se encontraron datos históricos para el símbolo proporcionado');
             return;
         }
         
         // Procesar datos para el gráfico
         const timeSeriesData = data[data_key];
         const dates = Object.keys(timeSeriesData).slice(0, 100).reverse(); // Limitar a 100 puntos y ordenar cronológicamente
         
         const prices = dates.map(date => {
             const entry = timeSeriesData[date];
             return parseFloat(entry['4. close']); // Usar precio de cierre
         });
         
         // Actualizar el gráfico
         updateChart(symbol, dates, prices);
         
     } catch (error) {
         showError('Error al obtener datos históricos: ' + error.message);
     } finally {
         hideLoader();
     }
 }
 
 // Función para actualizar la tarjeta de la acción
 function updateStockCard(data) {
     stockDataElement.style.display = 'block';
     
     // Actualizar la información básica
     stockDataElement.querySelector('.stock-name').textContent = data.companyName;
     stockDataElement.querySelector('.stock-symbol').textContent = data.symbol;
     stockDataElement.querySelector('.stock-price').textContent = `$${data.price.toFixed(2)}`;
     
     // Actualizar el cambio de precio
     const changeElement = stockDataElement.querySelector('.stock-change');
     const change = data.change;
     const changePercent = data.changePercent;
     
     if (change >= 0) {
         changeElement.className = 'stock-change positive';
         changeElement.textContent = `+${change.toFixed(2)} (+${changePercent.toFixed(2)}%)`;
     } else {
         changeElement.className = 'stock-change negative';
         changeElement.textContent = `${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
     }
     
     // Actualizar detalles
     document.getElementById('openPrice').textContent = `$${data.open.toFixed(2)}`;
     document.getElementById('highPrice').textContent = `$${data.high.toFixed(2)}`;
     document.getElementById('lowPrice').textContent = `$${data.low.toFixed(2)}`;
     document.getElementById('volume').textContent = formatNumber(data.volume);
     document.getElementById('prevClose').textContent = `$${data.prevClose.toFixed(2)}`;
     document.getElementById('lastUpdated').textContent = data.lastUpdate;
 }
 
         function updateChart(symbol, dates, prices) {
     const ctx = document.getElementById('stockChart').getContext('2d');
 
     if (stockChart) {
         stockChart.destroy();
     }
 
     stockChart = new Chart(ctx, {
         type: 'line',
         data: {
             labels: dates,
             datasets: [{
                 label: symbol,
                 data: prices,
                 backgroundColor: 'rgba(37, 99, 235, 0.1)',
                 borderColor: 'rgba(37, 99, 235, 1)',
                 borderWidth: 2,
                 pointRadius: prices.length > 50 ? 0 : 2,
                 tension: 0.4,
                 fill: true
             }]
         },
         options: {
             responsive: true,
             maintainAspectRatio: false,
             plugins: {
                 legend: {
                     display: true,
                     position: 'top',
                 },
             },
             scales: {
                 x: {
                     title: {
                         display: true,
                         text: 'Fecha',
                     },
                 },
                 y: {
                     title: {
                         display: true,
                         text: 'Precio (USD)',
                     },
                 },
             },
         },
     });
 }
         



                 // Función para mostrar el cargador
                 function showLoader() {
                     loader.style.display = 'block';
                 }
         
                 // Función para ocultar el cargador
                 function hideLoader() {
                     loader.style.display = 'none';
                 }
         
                 // Función para mostrar un mensaje de error
                 function showError(message) {
                     errorMessage.style.display = 'block';
                     errorMessage.textContent = message;
                 }
         
                 // Función para ocultar el mensaje de error
                 function hideError() {
                     errorMessage.style.display = 'none';
                 }
         
                 // Función para formatear números grandes
                 function formatNumber(num) {
                     return num.toLocaleString('en-US');
                 }