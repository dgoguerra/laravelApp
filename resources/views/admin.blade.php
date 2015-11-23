@extends ('mainTemplate')

@section ('contenido')

<div id="wrapper" class="container-fluid">
    <!--Menú del API -->
    <header id="navegacion">
        <hr>
        <ul class="row">
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="usersIndex">Listar usuarios</button>
            </li>
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="moviesIndex">Listar películas</button>
            </li>
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="newMovie">Añadir película</button>
            </li>
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="newSubscription"> Añadir suscripción</button>
            </li>
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="updateSubscription">Modificar suscripción</button>
            </li>
            <li class="col-lg-2 col-sm-4 col-sm-6">
                <button type="button" class="btn btn-success" id="deleteSubscription">Eliminar suscripción</button>
            </li>
        </ul>
        <hr>
    </header>
    <main>
        <!-- Resultados de las peticoines ajax -->
        <div id="resultados" class="row">
            
        </div>
    </main>
    
</div>

@stop
