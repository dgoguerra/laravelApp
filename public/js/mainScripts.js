/*
 * Asigno el método correspondiente para cada botón (index para los de visualizar el contenido y alterDb para los de modificar la BD)
 * y le paso como parámetros la dirección de destino (target), el botón pulsado (button), los campos de formulario, los campos de los input
 * del formulario (inputFields), los campos de parámetros en la URL (routeFields), y el método HTTP necesario (method).
 */


$("#usersIndex").on("click",
        {
            button: "usersIndex",
            target: "http://localhost:8080/users",
            type: "usuario"
        },
Index);



$("#moviesIndex").on("click",
        {
            button: "moviesIndex",
            target: "http://localhost:8080/movies",
            type: "Película"
        },
Index);



$("#newMovie").on("click",
        {
            button: "newMovie",
            target: "http://localhost:8080/movies",
            inputFields: ["imbdid", "nombre"],
            method: ["POST"]
        },
alterDb);



$("#newSubscription").on("click",
        {
            button: "newSubscription",
            target: "http://localhost:8080/users/userid/movies",
            inputFields: ["movieid"],
            routeFields: ["userid"],
            method: ["POST"]
        },
alterDb);



$("#updateSubscription").on("click",
        {
            button: "updateSubscription",
            target: "http://localhost:8080/users/userid/movies/movieid",
            inputFields: ["newStatus"],
            routeFields: ["userid", "movieid"],
            method: ["PUT"]
        },
alterDb);



$("#deleteSubscription").on("click",
        {
            button: "deleteSubscription",
            target: "http://localhost:8080/users/userid/movies/movieid",
            inputFields: [],
            routeFields: ["userid", "movieid"],
            method: ["DELETE"]
        },
alterDb);



//seccionActiva es una variable global que controla qué seccion está activa en cada momento.
seccionActiva = "";


/*
 * La función index recibe como argumento el evento que se activa al hacer click en los botones destinados
 * a la visualización de datos. Su función es visualizar los datos correspondientes al botón pulsado: 
 * los usuarios registrados y sus películas subscrictas, o las películas registradas.
 */


function Index(event) {

    /*
     * En primer lugar si la sección solicitada ya se estaba mostrando, se oculta y se deselecciona como
     * sección activa.
     */

    if (seccionActiva == event.data.button) {
        seccionActiva = "";
        $("#resultados").find("*").remove();
    }


    /*
     * En caso contrario, elimino lo que se estuviera visualizando, establezo la sección solicitada
     * como la seccióna activa, y solicito al servidor los datos requeridos según el botón
     * pulsado (elimino el elemento con índice "success" pues no quiero visualizarlo)
     * y una vez recibido lo visualizo.
     */

    else {

        //Elimino la tabla que se esté visualizando.
        $("#resultados").find("*").remove();

        //Asigno la sección actuál como sección activa.
        seccionActiva = event.data.button;

        // Solicito el JSON con los la información solicitada y una vez recibido lo guardo y lo visualizado.
        $.getJSON(event.data.target, function (jsonResponse) {

            // Declaro un array para guardar cada elemento de la información
            var data = [];

            // Recurro el objeto JSON recibido
            $.each(jsonResponse, function (jsonKey, jsonVal) {
                // Me salto el elemento con clave "success" y guardo en el array data cada elemento.
                if (jsonKey !== "success") {
                    $.each(jsonVal, function (key, val) {
                        data.push(val);
                    });
                }
            });

            //Recorro el array con los datos generando una tabla usando las claves y valores de cada elemento.
            // Antes creo una variable contadorPelicula que generará dinámicamente un ID distinto para cada celda que contendrá
            //La imagen y el argumento de cada película. De este modo podemos cargar asincrónicamente la imagen y el argumento
            //modificando la propiedad .innerHTML de un elemento ya creado e indentificado en el DOM. 
             var contadorPelicula = 0;
        $.each(data, function (key, val) {
               
                var tableData = "<table class='table-striped'>";
                tableData += "<tr  class='headerTd'> <th colspan='2'>" + event.data.type + " " + (key + 1) + " </th> </tr>";
                $.each(val, function (propertyKey, propertyVal) {
                    //Si alguno de los elemento es un array (como el elemento que guarda las películas de cada usuario) lo recorro y guardo la información en  nuevas filas.
                    if ($.isArray(propertyVal)) {
                        $.each(propertyVal, function (level2Key, level2Val) {
                            tableData += "<tr> <th colspan='2'> Película " + (level2Key + 1) + " </th> </tr>";
                            // Preparo una variable para guardar el IMBD_ID que va a necesitar el método consultarIMBD
                            var imbdID = "";
                            $.each(level2Val, function (propertyKey, propertyVal) {
                                (propertyKey == "imbd_id")?imbdID=propertyVal:"";
                                tableData += "<tr><td class='key'>" + propertyKey + "</td><td>" + propertyVal + "</td></tr>";
                                
                            });
                        //Después de haber insertado todos los campos que recibí del controlador, creo una nueva fila para el poster y otra para el argumento
                        // Sus id se generan dinámicamente y son únicos para cada película de cada usuario. El valor de la celda es el resultado de la función consultarIMBD
                        tableData+= "<tr> <td class='key'> Imagen </td> <td ID='imagen"+contadorPelicula+"'>"+ consultarIMBD("imagen",imbdID, contadorPelicula)+"</td>";
                        tableData+= "<tr> <td class='key'> Argumento </td> <td ID='argumento"+contadorPelicula+"'>"+consultarIMBD("argumento",imbdID, contadorPelicula)+"</td>";
                        contadorPelicula++;
                        });

                    }
                    // Si el elemento no es un array, registro su valor en una fila.
                    else {
                        tableData += "<tr><td class='key'>" + propertyKey + "</td><td>" + propertyVal + "</td></tr>";
                    }
                });
                tableData += "</table>";
                // Agrego la tabla al DOM
                $("#resultados").append(tableData);
            });
        });
    }
}
/**
 * ConsultarIMBD() recibe como primer argumento sobre qué celda se está trabajando (la del poster o la del argumento),
 * como segundo argumento el id de la película en IMBDID, y como tercer argumento el ID de la celda sobre la que se trabaja. 
 */
function consultarIMBD(opcion, imbdID, contadorPelicula) {

    if (opcion == "imagen") {
        $.get("http://www.omdbapi.com/?i="+imbdID+"&plot=short&r=json", function (jsonResponse) {
          var poster =  jsonResponse.Poster;
         //La cuestión es cómo lo visualizamos si es asíncrono y no podemos hacer un return...:
          document.getElementById("imagen"+contadorPelicula).innerHTML = "<img src='"+poster+"'/>";


        });
    }
    if (opcion == "argumento") {
        $.get("http://www.omdbapi.com/?i="+imbdID+"&plot=short&r=json", function (jsonResponse) {
          var argumento =  jsonResponse.Plot;
         //La cuestión es cómo lo visualizamos si es asíncrono y no podemos hacer un return...:
          document.getElementById("argumento"+contadorPelicula).innerHTML = argumento;
        });
    }
}




/*
 * La función alterDb recibe como argumento el evento que se activa al hacer un click en los botones
 * destinados a modificar la base de datos. Su función es desplegar el formulario correspondiente
 * a cada tipo de modificación, y llamar a la función de validación para que haga la solicitud
 * al servidor.
 */

function alterDb(event) {

    /*
     * En primer lugar si la sección solicitada ya se estaba mostrando, se oculta y se deselecciona como
     * sección activa.
     */

    if (seccionActiva == event.data.button) {
        seccionActiva = "";
        $("#resultados").find("*").remove();
    }


    /*
     * En caso contrario, elimino lo que se estuviera visualizando, establezo la sección solicitada
     * como la seccióna activa, y creo el formuarlio correspondiente.
     */

    else {
        //Elimino la tabla que se esté visualizando.
        $("#resultados").find("*").remove();

        //Asigno la sección actuál como sección activa.
        seccionActiva = event.data.button;


        /*
         * Creo el formulario correspondiente al botón pulsado. En el onsubmit llamo a la función process, que 
         * recibe como argumento el destino de la solicitud (el atributo target del evento onclick del botón).
         */


        var formulario = "<form method='POST' action='#' onsubmit='return process(\"" + event.data.target + "\");'>";

        /* 
         * Algunas funciones de la API requieren pasar parámetros a través de la URL, éstos son enviados
         * a alterDb a través del atributo 'routeFields' del evento onclick. Compruebo si ese
         * atributo existe, y creo los campos del formulario en los que se introducirán
         * dichos parámetros. Les asigno un nombre dinámico a través de un contador
         * para poder referirme a ellos más adelante, cuando deba modificar
         * la url de destino de la solicitud ajax.
         */

        if (event.data.routeFields) {
            var contador = 0;
            $.each(event.data.routeFields, function (key, val) {
                formulario += "<label for='" + val + "'>" + val + "</label>";
                formulario += "<input type='text' id='routeField" + contador + "' name='" + val + "'/>";
                contador++;
            });
        }


        /*
         * A continuación genero los campos del formulario, aquellos que se enviarán a través de $_POST
         * al servidor en la solicitud ajax. Estos campos los recibe alterDb como parámetros
         * a través del atributo inputFields del evento onclick del botón pulsado.
         */

        $.each(event.data.inputFields, function (key, val) {
            formulario += "<label for='" + val + "'>" + val + "</label>";
            formulario += "<input type='text' name='" + val + "' required/>";
        });

        /*
         * Este es el campo oculto de nombre '_method' que contiene el método HTML que se va a 
         * usar en la petición al servidor. 
         */

        formulario += "<input type='hidden' name='_method' value='" + event.data.method[0] + "'/>";
        formulario += "<input type='submit' name='enviar' value='Añadir' class='btn btn-success '/>";
        formulario += "</form>";

        // Añado el formulario al DOM 
        $("#resultados").append(formulario);
    }
}



/*
 * La funcion process se encarga de realizar la petición ajax al servidor. Para ello primero modifica
 * la ruta si es necesario , que recibe como parámetro, y luego hace la petición ajax.
 */


function process(target) {

    /*
     * Si se ha creado alguno de los campos cuyos valores son los atributos que se envían al servidor
     * a través de la URL, modifico la posición correspondiente del target con su valor.
     */

    if ($("input#routeField0").length != 0) {
        target = target.replace(/userid/, $("#routeField0").val());
    }

    if ($("input#routeField1").length != 0) {
        target = target.replace(/movieid/, $("#routeField1").val());
    }

    // En la variable entradas guardo todos los objetos de tipo input/text e input/hidden del formulario
    var entradas = $("input[type=text], input[type=hidden]");

    // En la variable data guardaré el valor de los campos input recogidos en entradas.
    var data = {};

    // Relleno el objeto
    $.each(entradas, function (key, value) {
        data[value.name] = value.value;
    });

    // console.log (data);

    //Envío el objeto al servidor, y compruebo si la solicitud se ha podido procesar o no. 
    $.post(target, data, function (ajaxResponse) {
       
        (ajaxResponse["success"] == false)?
            alert("La solicitud no se ha podido procesar"):
            alert ("La solicitud se procesó con éxito");
    });

    // Impido que se envíe el formulario vía HTTP.
    return false;
}