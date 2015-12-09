@extends ('mainTemplate')

@section ('contenido')

<style>

    .marg-top-10 {
        margin-top: 10px;
    }

    .marg-top-20 {
        margin-top: 20px;
    }

    .marg-bot-10 {
        margin-bottom: 10px;
    }

    [data-action] {
        cursor: pointer;
    }

    #movieModal #poster {
        width: 180px;
    }

</style>

<nav class="navbar navbar-default navbar-static-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" href="./">Movies Tracker Example App</a>
        </div>
    </div>
</nav>

<div class="container">

    <div class="row">
        <div class="col-lg-8">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong class="panel-title">User information</strong>
                    <span class="pull-right">
                        <i id="currentUserSpinner" class="fa fa-refresh fa-spin text-muted"></i>
                    </span>
                </div>
                <div class="userNotSelectedContainer panel-body">
                    <h4 class="text-center">To open a user, select it in the users list.</h4>
                </div>
                <div class="userSelectedContainer panel-body" style="display:none">
                    <div class="col-xs-12">
                        <div id="notSeenContainer" class="alert alert-warning marg-top-10" style="display:none">
                            <i class="fa fa-lg fa-warning"></i>
                            <strong>Movies available!</strong> There are <span id="numNotSeen">0</span> released movies in your watch list.
                        </div>
                    </div>

                    <div class="col-xs-12 marg-bot-10">
                        <small id="seenContainer" class="pull-right marg-top-10">
                            <span id="percentSeen">0</span>% movies seen
                            (<span id="numSeen">0</span> of <span id="numTotal">0</span>)
                        </small>

                        <h4>User <i id="userName"></i></h4>
                    </div>

                    <div class="col-xs-12">
                        <p>Movies you are subscribed to:</p>
                        <div id="userSubsContainer"></div>
                    </div>
                </div>
                <ul class="userSelectedContainer list-group" style="display:none">
                    <li class="list-group-item">
                        <p>Add another movie to your list:</p>
                        <div id="movieToSubscribeContainer"></div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong class="panel-title">Users List </strong><small><span id="totalNumUsers">0</span> created users</small>
                <span class="pull-right">
                    <i id="usersSpinner" class="fa fa-refresh fa-spin text-muted"></i>
                </span>
                </div>
                <ul id="usersContainer" class="list-group">
                    <li class="list-group-item text-muted">
                        Loading users list...
                    </li>
                </ul>
            </div>

            <div class="panel panel-default">
                <div class="panel-heading">
                    <strong class="panel-title">Movies </strong><small><span id="totalNumMovies">0</span> registered movies</small>
                    <span class="pull-right">
                        <i id="moviesSpinner" class="fa fa-refresh fa-spin text-muted"></i>
                    </span>
                </div>
                <ul id="moviesContainer" class="list-group">
                    <li class="list-group-item text-muted">
                        Loading movies list...
                    </li>
                </ul>
            </div>
        </div>
    </div>

</div>

<div id="newMovieModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Add movie</h4>
            </div>
            <div class="modal-body">
                <div class="form">
                    <div class="form-group">
                        <label for="newMovieName">Movie name</label>
                        <input type="text" id="newMovieName" class="form-control" placeholder="Movie name">
                    </div>
                    <div class="form-group">
                        <label for="newMovieImdbId">IMDB id</label>
                        <input type="text" id="newMovieImdbId" class="form-control" placeholder="IMDB id">
                    </div>
                </div>
            </div>
            <div class="modal-footer"> 
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" id="saveNewMovie" class="btn btn-primary" data-dismiss="modal">Add</button>
            </div>
        </div>
    </div>
</div>

<div id="movieModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Movie details</h4>
            </div>
            <div class="modal-body">
                <div class="media">
                    <div class="media-left">
                        <a href="#">
                            <img id="poster" class="media-object">
                        </a>
                    </div>
                    <div class="media-body">
                        <i class="pull-right">Rating: <span id="rating"></span></i>
                        <h4 id="title" class="media-heading"></h4>
                        <p><small id="genre"></small></p>
                        <p id="plot"></p>

                        <p><strong>Director: </strong><span id="director"></span></p>

                        <p><strong>Writer: </strong><span id="writer"></span></p>

                        <p><strong>Actors: </strong><span id="actors"></span></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div id="subscriptionStatusModal" class="modal fade" role="dialog" data-subscription="null">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Subscribed movie status</h4>
            </div>
            <div class="modal-body">
                <p>Select the status to change the movie to:</p>
                <select id="subscriptionStatusSelect" class="form-control"></select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" id="saveSubscriptionStatus" class="btn btn-primary" data-dismiss="modal">Save changes</button>
            </div>
        </div>
    </div>
</div>

@stop
