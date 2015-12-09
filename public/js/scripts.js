
function arrayToObjIndexedBy(arr, property)
{
    var obj = {};

    $.each(arr, function(i, elem) {
        obj[elem[property]] = elem;
    });

    return obj;
}

var findInArr = function(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
        if (callback(arr[i]) === true)
            return arr[i];
    }
    return null;
};

// helper que resuelve una promesa en los milisegundos dados.
// lo vamos a usar para fingir que hay latencia de red
var wait = function(ms) {
    var promise = $.Deferred();
    setTimeout(function() { promise.resolve(); }, ms);
    return promise;
};


/* DOM handling functions */

function updateUsersList()
{
    var users = Users.getUsers();

    if (Users.isLoading()) {
        $('#usersSpinner').show();
    }
    else {
        $('#usersSpinner').hide();
    }

    $('#totalNumUsers').text(users.length);

    $('#usersContainer').empty().html(
        users.map(function(user, i) {
            return '<li class="list-group-item">' +
                '<a href="#" data-user="' + user.id + '">' + user.username + '</a>' +
                '<i class="pull-right">' + (user.peliculas.length || 'no') + ' subscriptions</i>' +
            '</li>';
        }).join('') +
        '<li class="list-group-item">' +
            '<div class="text-center">' +
            '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#newUserModal" disabled="true">Create new user</button>' +
            '</div>' +
        '</li>'
    );
}

function updateMoviesList()
{
    var movies = Movies.getMovies();

    if (Movies.isLoading()) {
        $('#moviesSpinner').show();
    }
    else {
        $('#moviesSpinner').hide();
    }

    $('#totalNumMovies').text(movies.length);

    $('#moviesContainer').empty().html(
        movies.map(function(movie, i) {
            return '<li class="list-group-item">' +
                '<a href="#" data-movie="' + movie.id + '">' + movie.name + '</a>' +
                '</li>';
        }).join('') +
        '<li class="list-group-item">' +
        '<div class="text-center">' +
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#newMovieModal">Add movie</button>' +
        '</div>' +
        '</li>'
    );
}

function updateCurrentUserPanel()
{
    var movies = Movies.getMovies();
    var user = Users.getCurrentUser();

    if (Users.isLoading()) {
        $('#currentUserSpinner').show();
    }
    else {
        $('#currentUserSpinner').hide();
    }

    if (user === null) {
        $('.userNotSelectedContainer').show();
        $('.userSelectedContainer').hide();
        return;
    }

    $('.userNotSelectedContainer').hide();
    $('.userSelectedContainer').show();

    console.log('user', user);

    $('#userName').html(user.username);

    var numSeen = 0, numNotSeen = 0, numPending = 0;

    $.each(user.peliculas, function(i, sub) {
        if (sub.status == 's') {
            numSeen++;
        }
        else if (sub.status == 'n') {
            numNotSeen++;
        }
        else if (sub.status == 'p') {
            numPending++;
        }
    });

    var numTotal = numSeen + numNotSeen + numPending;

    $('#numSeen').html(numSeen);
    $('#numTotal').html(numTotal);
    $('#numNotSeen').html(numNotSeen);
    $('#percentSeen').html((numTotal ? numSeen * 100 / numTotal : 0).toFixed(0));

    (numNotSeen !== 0) && $('#notSeenContainer').fadeIn() || $('#notSeenContainer').fadeOut();

    var moviesIndexedById = arrayToObjIndexedBy(movies, 'id');

    var tableHtml = renderUserSubscriptionsTable(user.peliculas, moviesIndexedById);

    $('#userSubsContainer').html(tableHtml);

    var selectHtml = '<select id="movieToSubscribe" class="form-control">';

    selectHtml += '<option value="" disabled selected="true">Select a movie to subscribe to</option>';

    $.each(movies, function(i, movie) {
        var movieFoundInUser = findInArr(user.peliculas, function(mov) { return mov.id_pelicula === movie.id; });

        if (movieFoundInUser !== null)
            return;

        selectHtml += '<option value="' + movie.id + '">' + movie.name + '</option>';
    });

    selectHtml += '</select>';

    $('#movieToSubscribeContainer').html(selectHtml);
}

function renderUserSubscriptionsTable(subscriptions, moviesById)
{
    var statusNamesByCode = {
        s: 'Seen',
        n: 'Not seen',
        p: 'Pending release'
    };

    var html = '';

    if (subscriptions.length) {
        html += '<table class="table table-condensed table-hover">' +
            '<thead><tr><th>Title</th><th>Status</th><th></th></tr></thead>' +
            '<tbody>';

        $.each(subscriptions, function(i, subscription) {
            var movie = moviesById[subscription.id_pelicula];

            html += '<tr data-subscription="' + subscription.id_pelicula + '">' +
                '<td>' + movie.name + '</td>' +
                '<td>' + statusNamesByCode[subscription.status] + '</td>' +
                '<td><div class="text-right">' +
                    '<i data-action="open" class="fa fa-lg fa-fw fa-eye"></i>' +
                    '<i data-action="edit" class="fa fa-lg fa-fw fa-pencil"></i>' +
                    '<i data-action="delete" class="fa fa-lg fa-fw fa-trash"></i>' +
            '</div></td>' +
            '</tr>';
        });

        html += '</tbody></table>';
    }
    else {
        html += '<h4 class="text-center">There are no subscriptions yet.</h4>';
    }

    return html;
}

function openImdbModal(movieId)
{
    Movies.getMovieImdbData(movieId).then(function(imdb) {
        var $dialog = $('#movieModal');

        $dialog.find('#title').text(imdb.Title);
        $dialog.find('#poster').prop('src', imdb.Poster);
        $dialog.find('#plot').text(imdb.Plot);
        $dialog.find('#rating').text(imdb.imdbRating);
        $dialog.find('#genre').text(imdb.Genre);
        $dialog.find('#director').text(imdb.Director);
        $dialog.find('#writer').text(imdb.Writer);
        $dialog.find('#actors').text(imdb.Actors);

        $dialog.modal('show');
    }).fail(function(error) {
        alert(error);
    });
}

function openSubscriptionStatusModal(movieId)
{
    var movie = Users.getCurrentUserSubscription(movieId);
    var $dialog = $('#subscriptionStatusModal');
    var $statusSelect = $dialog.find('#subscriptionStatusSelect');

    var statusNamesByCode = {
        s: 'Seen',
        n: 'Not seen',
        p: 'Pending release'
    };

    $dialog.data('subscription', movieId);

    $statusSelect.html(
        $.map(statusNamesByCode, function(status, code) {
            return '<option value="'+code+'">'+status+'</option>';
        }).join('')
    ).val(movie.status);

    $dialog.modal('show');
}


/* API call functions */

function Users() {
    this.loading = false;
    this.users = [];
    this.currentUserId = null;
}

Users.isLoading = function() {
    return this.loading;
};

Users.getUsers = function() {
    return this.users;
};

Users.loadUsers = function() {
    var _this = this;
    var promise = $.Deferred();

    _this.loading = true;

    $.ajax({ method: 'get', url: '/users' }).done(function(response) {
        _this.loading = false;

        if (response.success !== true) {
            promise.reject("There was an error obtaining the users list.");
            return;
        }

        _this.users = response.users;

        promise.resolve(Users.getUsers());
    }).fail(function() {
        _this.loading = false;
        promise.reject("There was an error obtaining the users list.");
    });

    return promise;
};

Users.getCurrentUserSubscription = function(movieId) {
    var user = this.getCurrentUser();

    console.log('user.peliculas', user.peliculas);

    var found = findInArr(user.peliculas, function(movie) { return movie.id_pelicula == movieId; });

    console.log('found', found);

    return found;
};

Users.createCurrentUserSubscription = function(movieId) {
    var _this = this;
    var promise = $.Deferred();

    if (! _this.currentUserId) {
        return;
    }

    var url = '/users/'+_this.currentUserId+'/movies';

    $.ajax({ method: 'post', url: url, data: { movieid: movieId } }).done(function(response) {
        if (response.success !== true) {
            promise.reject("There was an error creating the user's subscription.");
            return;
        }
        promise.resolve();
    }).fail(function() {
        promise.reject("There was an error creating the user's subscription.");
    });

    return promise;
};

Users.updateCurrentUserSubscriptionStatus = function(movieId, statusCode) {
    var _this = this;
    var promise = $.Deferred();

    if (! _this.currentUserId) {
        return;
    }

    var url = '/users/'+_this.currentUserId+'/movies/'+movieId;

    $.ajax({ method: 'put', url: url, data: { newStatus: statusCode } }).done(function(response) {
        if (response.success !== true) {
            promise.reject("There was an error updating the user's subscription.");
            return;
        }
        promise.resolve();
    }).fail(function() {
        promise.reject("There was an error updating the user's subscription.");
    });

    return promise;
};

Users.removeCurrentUserSubscription = function(movieId) {
    var _this = this;
    var promise = $.Deferred();

    if (! _this.currentUserId) {
        return;
    }

    var url = '/users/'+_this.currentUserId+'/movies/'+movieId;

    $.ajax({ method: 'delete', url: url }).done(function(response) {
        if (response.success !== true) {
            promise.reject("There was an error removing the user's subscription.");
            return;
        }
        promise.resolve();
    }).fail(function() {
        promise.reject("There was an error removing the user's subscription.");
    });

    return promise;
};

Users.setCurrentUserById = function(userId) {
    this.currentUserId = userId;
};

Users.getCurrentUser = function() {
    var _this = this;
    var currentUser = null;

    $.each(_this.users, function(i, user) {
        if (user.id == _this.currentUserId) {
            currentUser = user;
            return;
        }
    });

    return currentUser;
};


function Movies() {
    this.loading = false;
    this.movies = [];
}

Movies.isLoading = function() {
    return this.loading;
};

Movies.getMovies = function() {
    return this.movies;
};

Movies.getMovieById = function(movieId) {
    var found = null;

    $.each(this.movies, function(i, movie) {
        if (movie.id == movieId) {
            found = movie;
            return false;
        }
    });

    return found;
};

Movies.loadMovies = function() {
    var _this = this;
    var promise = $.Deferred();

    _this.loading = true;

    $.get('/movies').done(function(response) {
        _this.loading = false;

        if (response.success !== true) {
            promise.reject("There was an error obtaining the movies list.");
            return;
        }

        _this.movies = response.peliculas;

        promise.resolve(
            Movies.getMovies()
        );
    }).fail(function() {
        _this.loading = false;
        promise.reject("There was an error obtaining the movies list.");
    });

    return promise;
};

Movies.getMovieImdbData = function(movieId) {
    var promise = $.Deferred();
    var movie = this.getMovieById(movieId);

    $.get("http://www.omdbapi.com/?i="+movie.imbd_id+"&r=json", function (response) {
        if (response.Response === 'True') {
            promise.resolve(response);
        }
        else {
            promise.reject(response.Error);
        }
    });

    return promise;
};

Movies.addMovie = function(name, imdb_id) {
    var promise = $.Deferred();

    var params = { imbdid: imdb_id, nombre: name };

    $.ajax({ method: 'post', url: '/movies', data: params }).done(function(response) {
        if (response.success !== true) {
            promise.reject("There was an error adding a new movie.");
            return;
        }
        promise.resolve();
    }).fail(function() {
        promise.reject("There was an error adding a new movie.");
    });

    return promise;
};


/* init data and listeners */

$(function() {
    $.when(
        wait(1000),
        Movies.loadMovies(),
        Users.loadUsers()
    ).then(function() {
        updateMoviesList();

        updateUsersList();

        updateCurrentUserPanel();
    });

    // user events listeners

    $('body').on('change', '#movieToSubscribe', function(evt) {
        var movieId = $(this).val();
        Users.createCurrentUserSubscription(movieId).then(function() {
            return Users.loadUsers();
        }).then(function() {
            updateUsersList();
            updateCurrentUserPanel();
        });
    });

    $('body').on('click', '[data-action]', function(evt) {
        var $this = $(this);
        var action = $this.data('action');
        var movieId = $this.closest('[data-subscription]').data('subscription');

        switch (action) {
            case 'open':
                openImdbModal(movieId);
                break;

            case 'edit':
                openSubscriptionStatusModal(movieId);
                break;

            case 'delete':
                Users.removeCurrentUserSubscription(movieId).then(function() {
                    return Users.loadUsers();
                }).then(function() {
                    updateUsersList();
                    updateCurrentUserPanel();
                });
                break;
        }
    });

    $('body').on('click', '[data-user]', function(evt) {
        var userId = $(this).data('user');
        console.log('open user', userId);

        Users.setCurrentUserById(userId);

        updateCurrentUserPanel();
    });

    $('body').on('click', '[data-movie]', function(evt) {
        evt.preventDefault();
        var movieId = $(this).data('movie');
        openImdbModal(movieId);
    });

    $('#saveSubscriptionStatus').on('click', function(evt) {
        var $select = $('#subscriptionStatusSelect');
        var movieId = $select.closest('[data-subscription]').data('subscription');

        Users.updateCurrentUserSubscriptionStatus(movieId, $select.val()).then(function() {
            return Users.loadUsers();
        }).then(function() {
            updateCurrentUserPanel();
        });
    });

    $('#saveNewMovie').on('click', function(evt) {
        Movies.addMovie(
            $('#newMovieName').val(),
            $('#newMovieImdbId').val()
        ).then(function() {
            return Movies.loadMovies();
        }).then(function() {
            updateMoviesList();
        });
    });
});
