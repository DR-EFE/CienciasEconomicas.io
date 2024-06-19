window.onload = function () {
    document.getElementById('precio1Input').addEventListener('change', function () {
        var valor = this.value;
        document.getElementById('bajoInput1').placeholder = 'Ingrese el consumo BAJO  ' + valor;
        document.getElementById('medioInput1').placeholder = 'Ingrese el consumo MEDIO  ' + valor;
        document.getElementById('altoInput1').placeholder = 'Ingrese el consumo ALTO  ' + valor;
        document.getElementById('precio1Header').textContent = valor;
    });

    document.getElementById('precio2Input').addEventListener('change', function () {
        var valor = this.value;
        document.getElementById('bajoInput2').placeholder = 'Ingrese el consumo BAJO  ' + valor;
        document.getElementById('medioInput2').placeholder = 'Ingrese el consumo MEDIO  ' + valor;
        document.getElementById('altoInput2').placeholder = 'Ingrese el consumo ALTO ' + valor;
        document.getElementById('precio2Header').textContent = valor;
    });
};
// Definir las variables fuera de la función para que estén disponibles globalmente
let constanteBajo, constanteMedio, constanteAlto, pendienteBajo, pendienteMedio, pendienteAlto;
let precio1, precio2, bajo1, bajo2, medio1, medio2, alto1, alto2;

function calcularEcuacion() {
    // Obtener los valores ingresados por el usuario
    const precio1 = parseFloat(document.getElementById('precio1Input').value);
    const precio2 = parseFloat(document.getElementById('precio2Input').value);
    const bajo1 = parseFloat(document.getElementById('bajoInput1').value);
    const bajo2 = parseFloat(document.getElementById('bajoInput2').value);
    const medio1 = parseFloat(document.getElementById('medioInput1').value);
    const medio2 = parseFloat(document.getElementById('medioInput2').value);
    const alto1 = parseFloat(document.getElementById('altoInput1').value);
    const alto2 = parseFloat(document.getElementById('altoInput2').value);

    // Calcular las pendientes y constantes de las ecuaciones
    pendienteBajo = (bajo2 - bajo1) / (precio2 - precio1);
    constanteBajo = bajo1 - pendienteBajo * precio1;

    pendienteMedio = (medio2 - medio1) / (precio2 - precio1);
    constanteMedio = medio1 - pendienteMedio * precio1;

    pendienteAlto = (alto2 - alto1) / (precio2 - precio1);
    constanteAlto = alto1 - pendienteAlto * precio1;

    // Mostrar los resultados en la página
    document.getElementById('resultadoBajo').innerText = `Ecuación BAJO: Qd = ${constanteBajo.toFixed(2)} - ${pendienteBajo.toFixed(2)}P`;
    document.getElementById('resultadoMedio').innerText = `Ecuación MEDIO: Qd = ${constanteMedio.toFixed(2)} - ${pendienteMedio.toFixed(2)}P`;
    document.getElementById('resultadoAlto').innerText = `Ecuación ALTO: Qd = ${constanteAlto.toFixed(2)} - ${pendienteAlto.toFixed(2)}P`;

    // Calcular las ecuaciones de los estratos
    familiasBajo = parseFloat(document.getElementById('familiasBajo').value);
    familiasMedio = parseFloat(document.getElementById('familiasMedio').value);
    familiasAlto = parseFloat(document.getElementById('familiasAlto').value);

    const ecuacionEstratoBajo = `QDx1=${(constanteBajo * familiasBajo).toFixed(3)}-${(pendienteBajo * familiasBajo).toFixed(3)}Px`;
    const ecuacionEstratoMedio = `QDx2=${(constanteMedio * familiasMedio).toFixed(3)}-${(pendienteMedio * familiasMedio).toFixed(3)}Px`;
    const ecuacionEstratoAlto = `QDx3=${(constanteAlto * familiasAlto).toFixed(3)}-${(pendienteAlto * familiasAlto).toFixed(3)}Px`;
    const ecuacionGeneral = `QDx3=${((constanteBajo * familiasBajo) + (constanteMedio * familiasMedio) + (constanteAlto * familiasAlto)).toFixed(3)}-
    ${(((pendienteBajo * familiasBajo) + (pendienteMedio * familiasMedio) + (pendienteAlto * familiasAlto)).toFixed(3))}Px`;
    // Mostrar los resultados de las ecuaciones de los estratos
    document.getElementById('resultadosEstrato').innerHTML = `<h2>Ecuaciones del Estrato:</h2>
    <p>${ecuacionEstratoBajo}</p>
    <p>${ecuacionEstratoMedio}</p>
    <p>${ecuacionEstratoAlto}</p>
    <h2>Ecuación General:</h2>

    <p>${ecuacionGeneral}</p>`;
}


function limpiarTablas() {
    // Obtén todas las tablas en la página
    var tablas = document.getElementsByTagName('table');

    // Recorre todas las tablas
    for (var i = 0; i < tablas.length; i++) {
        var tabla = tablas[i];

        // Recorre todas las filas de la tabla, empezando por la última
        for (var j = tabla.rows.length - 1; j > 0; j--) {
            // Elimina la fila
            tabla.deleteRow(j);
        }
    }

    // Obtén la instancia de tu gráfico
    var chart = Chart.getChart('grafico-equilibrio');

    // Borra los datos del gráfico
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
    });

    // Actualiza el gráfico
    chart.update();
}



    // Declarar variables fuera de la función generarTabla
    let demandaBajo;
    let demandaMedio;
    let demandaAlto;
    let demandaTotal;

    // Declarar arreglos para almacenar los datos
    let precios = [];
    let demandaBajoArray = [];
    let demandaMedioArray = [];
    let demandaAltoArray = [];
    let demandaTotalArray = [];

    function limpiarTabla(idTabla) {
        const tabla = document.getElementById(idTabla);
        while (tabla.rows.length > 1) {
            tabla.deleteRow(1);
        }
    }


    function generarTabla() {
        // Llamar a la función para limpiar la tabla antes de agregar nuevas filas
       // Llamar a la función para limpiar todas las tablas antes de agregar nuevas filas
    //   limpiarTabla('tablaResultados');
//  limpiarTablas(['tablaResultados', 'tablaMultiplicada', 'tablaEcuaciones', 'tablaPorcentual', 'tablaPorcentualMultiplicada']);

        calcularEcuacion();
        // Recoger los valores del rango de precios y el incremento
        const precioInicio = parseFloat(document.getElementById('precioInicio').value);
        const precioFin = parseFloat(document.getElementById('precioFin').value);
        const incremento = parseFloat(document.getElementById('incremento').value);

        // Calcular la demanda para cada precio en el rango
        for (let precio = precioInicio; precio <= precioFin; precio += incremento) {
            demandaBajo = (constanteBajo * familiasBajo) + (pendienteBajo * familiasBajo) * precio;
            demandaMedio = (constanteMedio * familiasMedio) + (pendienteMedio * familiasMedio) * precio;
            demandaAlto = (constanteAlto * familiasAlto) + (pendienteAlto * familiasAlto) * precio;
            demandaTotal = demandaBajo + demandaMedio + demandaAlto;
            // Almacenar los datos en los arreglos
            precios.push(precio.toFixed(2));
            demandaBajoArray.push(demandaBajo.toFixed(2));
            demandaMedioArray.push(demandaMedio.toFixed(2));
            demandaAltoArray.push(demandaAlto.toFixed(2));
            demandaTotalArray.push(demandaTotal.toFixed(2));


            // Mostrar los valores de constanteBajo y pendienteBajo
            //   document.getElementById('valorConstanteBajo').innerText = constanteBajo.toFixed(2);
            //document.getElementById('valorPendienteBajo').innerText = pendienteBajo.toFixed(2);
            // Agregar una fila a la tabla para cada precio
            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${precio.toFixed(2)}</td><td>${demandaBajo.toFixed(2)}</td><td>${demandaMedio.toFixed(2)}</td><td>${demandaAlto.toFixed(2)}</td><td>${demandaTotal.toFixed(2)}</td>`;
            document.getElementById('tablaResultados').appendChild(fila);
        }
        // Llamar a la función para dibujar el gráfico con los datos

        dibujarGrafico(precios, demandaBajoArray, demandaMedioArray, demandaAltoArray, demandaTotalArray);
    }

    function generarTablaPorcentual() {
        limpiarTabla('tablaPorcentual');
       // Recoger los valores del rango de precios y el incremento
       const precioInicio = parseFloat(document.getElementById('precioInicio').value);
       const precioFin = parseFloat(document.getElementById('precioFin').value);
       const incremento = parseFloat(document.getElementById('incremento').value);
    
       // Calcular los valores en porcentaje para cada precio en el rango
       for (let precio = precioInicio; precio <= precioFin; precio += incremento) {
           const ecuacionBajo = constanteBajo + pendienteBajo * precio;
           const ecuacionMedio = constanteMedio + pendienteMedio * precio;
           const ecuacionAlto = constanteAlto + pendienteAlto * precio;
           const ecuaciontotal = ecuacionBajo + ecuacionMedio + ecuacionAlto;

           const porcentajeBajo = (ecuacionBajo / ecuaciontotal) * 100;
           const porcentajeMedio = (ecuacionMedio / ecuaciontotal) * 100;
           const porcentajeAlto = (ecuacionAlto / ecuaciontotal) * 100;
          
           // Agregar una fila a la tabla para cada precio
           const fila = document.createElement('tr');
           fila.innerHTML = `<td>${precio.toFixed(2)}</td><td>${porcentajeBajo.toFixed(2)}%</td><td>${porcentajeMedio.toFixed(2)}%</td><td>${porcentajeAlto.toFixed(2)}%</td><td>100%</td>`;
           document.getElementById('tablaPorcentual').appendChild(fila);
         
       }
      
   }

   
   function generarTablaPorcentualMultiplicada() {
       
       limpiarTabla('tablaPorcentualMultiplicada');
       const tablaMultiplicada = document.getElementById('tablaMultiplicada');
       for (let i = 1; i < tablaMultiplicada.rows.length; i++) {
           const celdas = tablaMultiplicada.rows[i].cells;

           const precio = parseFloat(celdas[0].innerText);
           const productoBajo = parseFloat(celdas[1].innerText);
           const productoMedio = parseFloat(celdas[2].innerText);
           const productoAlto = parseFloat(celdas[3].innerText);
           const productoTotal = parseFloat(celdas[4].innerText);

           const porcentajeBajo = (productoBajo / productoTotal) * 100;
           const porcentajeMedio = (productoMedio / productoTotal) * 100;
           const porcentajeAlto = (productoAlto / productoTotal) * 100;
        
           const fila = document.createElement('tr');
           fila.innerHTML = `<td>${precio.toFixed(2)}</td><td>${porcentajeBajo.toFixed(2)}%</td><td>${porcentajeMedio.toFixed(2)}%</td><td>${porcentajeAlto.toFixed(2)}%</td><td>100%</td>`;
           document.getElementById('tablaPorcentualMultiplicada').appendChild(fila);
        
       }
     
   }





    function generarTablaMultiplicada() {
        limpiarTabla('tablaMultiplicada');
        

        const tablaResultados = document.getElementById('tablaResultados');
        for (let i = 1; i < tablaResultados.rows.length; i++) {
            const celdas = tablaResultados.rows[i].cells;

            const precio = parseFloat(celdas[0].innerText);
            const demandaBajo = parseFloat(celdas[1].innerText);
            const demandaMedio = parseFloat(celdas[2].innerText);
            const demandaAlto = parseFloat(celdas[3].innerText);
            const demandaTotal = parseFloat(celdas[4].innerText);

            const productoBajo = precio * demandaBajo;
            const productoMedio = precio * demandaMedio;
            const productoAlto = precio * demandaAlto;
            const productoTotal = precio * demandaTotal;

            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${precio.toFixed(2)}</td><td>${productoBajo.toFixed(2)}</td><td>${productoMedio.toFixed(2)}</td><td>${productoAlto.toFixed(2)}</td><td>${productoTotal.toFixed(2)}</td>`;
            document.getElementById('tablaMultiplicada').appendChild(fila);
        }
    }

    function generarTablaEcuaciones() {
        // Llamar a la función para limpiar la tabla antes de agregar nuevas filas
        limpiarTabla('tablaEcuaciones');
        // Recoger los valores del rango de precios y el incremento
        const precioInicio = parseFloat(document.getElementById('precioInicio').value);
        const precioFin = parseFloat(document.getElementById('precioFin').value);
        const incremento = parseFloat(document.getElementById('incremento').value);

        // Calcular los valores de las ecuaciones para cada precio en el rango
        for (let precio = precioInicio; precio <= precioFin; precio += incremento) {
            const ecuacionBajo = constanteBajo + pendienteBajo * precio;
            const ecuacionMedio = constanteMedio + pendienteMedio * precio;
            const ecuacionAlto = constanteAlto + pendienteAlto * precio;
            const ecuaciontotal = ecuacionBajo + ecuacionMedio + ecuacionAlto;

            // Agregar una fila a la tabla para cada precio
            const fila = document.createElement('tr');
            fila.innerHTML = `<td>${precio.toFixed(2)}</td><td>${ecuacionBajo.toFixed(2)}</td><td>${ecuacionMedio.toFixed(2)}</td><td>${ecuacionAlto.toFixed(2)}</td><td>${ecuaciontotal.toFixed(2)}</td>`;
            document.getElementById('tablaEcuaciones').appendChild(fila);
        }
    }


 

  
