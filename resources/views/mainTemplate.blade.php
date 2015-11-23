<!DOCTYPE html>
<html>
    
    <head>
        
        <meta charset="UTF-8">

        <!-- Bootstrap -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        
        <!-- Hoja de estilos propia -->
        <link  href="{{ URL::asset('/stylesheet/mainCss.css') }}" rel="stylesheet"> 

        <!-- Jquery -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        
    </head>
    
    <body>
        
        <!--Aquí irá el contenido que se agregue desde las páginas que referencien a esta plantilla -->
        @yield('contenido')

        <!-- Funciones JS propias  -->
        <script src="{{ URL::asset('/js/mainScripts.js') }}"></script>

    </body>
           
</html>
