document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const formCalculadora = document.getElementById('form-calculadora');
    const resultadoCalculadora = document.getElementById('resultado-calculadora');
    const ctxOferta = document.getElementById('grafico-oferta').getContext('2d');
    const ctxDemanda = document.getElementById('grafico-demanda').getContext('2d');
    const ctxEquilibrio = document.getElementById('grafico-equilibrio').getContext('2d');
    const ctxEjemplos = document.getElementById('grafico-ejemplos').getContext('2d');

    new Chart(ctxOferta, {
        type: 'line',
        data: {
            labels: [0, 10, 20, 30, 40, 50], // Cantidad
            datasets: [{
                label: 'Curva de Oferta',
                data: [0, 5, 10, 15, 20, 25], // Precio
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                pointRadius: 10, // Eliminar puntos
                pointHoverRadius: 10, // Eliminar puntos en hover
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        usePointStyle: true,
                    }
                },
                annotation: {
                    annotations: {
                        arrow: {
                            type: 'line',
                            xMin: 10,
                            xMax: 30,
                            yMin: 5,
                            yMax: 15,
                            borderColor: 'rgba(255, 99, 132, 0.8)',
                            borderWidth: 2,
                            label: {
                                content: 'Dirección de la oferta',
                                enabled: true,
                                position: 'start',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 0.8)',
                                borderWidth: 1
                            },
                            arrowHeads: {
                                start: {
                                    enabled: false
                                },
                                end: {
                                    enabled: true,
                                    size: 100 // Tamaño de la flecha
                                }
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cantidad',
                        color: '#000',
                        font: {
                            size: 14,
                            weight: 'bold',
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Precio',
                        color: '#000',
                        font: {
                            size: 14,
                            weight: 'bold',
                        }
                    }
                }
            }
        }
    });



    // Inicializar el gráfico de demanda
    new Chart(ctxDemanda, {
        type: 'line',
        data: {
            labels: [0, 10, 20, 30, 40, 50],
            datasets: [{
                label: 'Demanda',
                data: [25, 20, 15, 10, 5, 0],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Precio'
                    }
                }
            }
        }
    });

    // Inicializar el gráfico de ejemplos
    new Chart(ctxEjemplos, {
        type: 'line',
        data: {
            labels: ['Punto 1', 'Punto 2', 'Punto 3', 'Punto 4', 'Punto 5', 'Punto 6', 'Punto 7', 'Punto 8', 'Punto 9', 'Punto 10'],
            datasets: [
                {
                    label: 'Oferta (Ejemplo 1)',
                    data: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // Oferta constante
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false
                },
                {
                    label: 'Demanda (Ejemplo 1)',
                    data: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280], // Demanda aumenta
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false
                },
                {
                    label: 'Oferta (Ejemplo 2)',
                    data: [200, 180, 160, 140, 120, 100, 80, 60, 40, 20], // Oferta disminuye
                    borderColor: 'rgb(54, 162, 235)',
                    fill: false,
                    borderDash: [5, 5] // Línea punteada para distinguir
                },
                {
                    label: 'Demanda (Ejemplo 2)',
                    data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150], // Demanda constante
                    borderColor: 'rgb(255, 159, 64)',
                    fill: false
                },
                {
                    label: 'Oferta (Ejemplo 3)',
                    data: [100, 120, 140, 160, 180, 200, 220, 240, 260, 280], // Oferta aumenta
                    borderColor: 'rgb(153, 102, 255)',
                    fill: false
                },
                {
                    label: 'Demanda (Ejemplo 3)',
                    data: [150, 150, 150, 150, 150, 150, 150, 150, 150, 150], // Demanda constante
                    borderColor: 'rgb(255, 205, 86)',
                    fill: false,
                    borderDash: [5, 5] // Línea punteada para distinguir
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Puntos de Datos'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                }
            }
        }
    });

    // Inicializar el gráfico de equilibrio
    const chartEquilibrio = new Chart(ctxEquilibrio, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Oferta',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }, {
                label: 'Demanda',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Precio'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cantidad'
                    }
                }
            }
        }
    });

    // Manejador del formulario
    formCalculadora.addEventListener('submit', function(event) {
        event.preventDefault();
        const precio = parseFloat(document.getElementById('precio').value);
        const cantidad = parseFloat(document.getElementById('cantidad').value);
        const elasticidadOferta = parseFloat(document.getElementById('elasticidad-oferta').value);
        const elasticidadDemanda = parseFloat(document.getElementById('elasticidad-demanda').value);

        if (isNaN(precio) || isNaN(cantidad) || isNaN(elasticidadOferta) || isNaN(elasticidadDemanda)) {
            resultadoCalculadora.innerText = 'Por favor, introduce valores válidos.';
            return;
        }

        // Calcular el equilibrio usando la elasticidad
        const nuevoPrecio = precio * (1 + elasticidadDemanda - elasticidadOferta);
        const nuevaCantidad = cantidad * (1 + elasticidadOferta - elasticidadDemanda);

        resultadoCalculadora.innerText = `Para un precio inicial de ${precio.toFixed(2)} y cantidad de ${cantidad}, el nuevo precio de equilibrio es ${nuevoPrecio.toFixed(2)} y la cantidad de equilibrio es ${nuevaCantidad.toFixed(2)}.`;

        // Actualizar el gráfico
        chartEquilibrio.data.labels.push(nuevoPrecio.toFixed(2));
        chartEquilibrio.data.datasets[0].data.push(nuevaCantidad);
        chartEquilibrio.data.datasets[1].data.push(nuevaCantidad); // Cambia esto según la lógica realista
        chartEquilibrio.update();
    });
});



document.getElementById('reset').addEventListener('click', function() {
    // Obtén la instancia de tu gráfico
    var chart = Chart.getChart('grafico-equilibrio');

    // Borra los datos del gráfico
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    // Actualiza el gráfico
    chart.update();
});