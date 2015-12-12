
/* helper functions */

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

// helper that resolves a promise in the given miliseconds.
// We are going to use it for debugging, to force promises to take
// some time to resolve.
var wait = function(ms) {
    var promise = $.Deferred();
    setTimeout(function() { promise.resolve(); }, ms);
    return promise;
};


/* DOM handling functions */

// repaint the existing users list
function updateUsersList()
{
    var users = Users.getUsers();

    console.debug('DOM', 'redraw users list');

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

// repaint the existing movies list
function updateMoviesList()
{
    var movies = Movies.getMovies();

    console.debug('DOM', 'redraw movies list');

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

// repaint the current user panel
function updateCurrentUserPanel()
{
    var movies = Movies.getMovies();
    var user = Users.getCurrentUser();

    console.debug('DOM', 'redraw opened user list', '(' + (user && user.username || 'empty') + ')');

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

// repaint the subscriptions list inside the current user panel
function renderUserSubscriptionsTable(subscriptions, moviesById)
{
    console.debug('DOM', 'redraw opened user subscriptions table');

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

// open a modal with some data of a movie
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

        console.debug('DOM', 'show imdb modal');

        $dialog.modal('show');
    }).fail(function(error) {
        alert(error);
    });
}

// open a modal with a select of subscriptions statuses
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

    console.debug('DOM', 'show subscription status modal');

    $dialog.modal('show');
}


/* API call functions */


/* Users store. Holds the list of known users, the currently selected user and
 * API calls to interact with them.
 *
 * All API calls return a promise resolved when the ajax call succeeds.
 * See: https://api.jquery.com/category/deferred-object/
 */
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
        console.debug('AJAX', 'GET /users', response);

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

    var found = findInArr(user.peliculas, function(movie) {
        return movie.id_pelicula == movieId;
    });

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
        console.debug('AJAX', 'POST '+url, response);

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
        console.debug('AJAX', 'PUT '+url, response);

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
        console.debug('AJAX', 'DELETE '+url, response);

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


/* Movies store. Holds the list of known movies and API calls to interact with them.
 *
 * All API calls return a promise resolved when the ajax call succeeds.
 * See: https://api.jquery.com/category/deferred-object/
 */
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
        console.debug('AJAX', 'GET /movies', response);

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

    var url = "http://www.omdbapi.com/?i="+movie.imbd_id+"&r=json";

    $.get(url, function (response) {
        console.debug('AJAX', 'GET '+url, response);

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
        console.debug('AJAX', 'POST /movies', response);

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
        // add a promise that takes 1 second to be resolved. Just for testing, to force a wait period
        // before showing all the movies and users, since the api is in localhost and almost instantly.
        wait(1000),
        Movies.loadMovies(),
        Users.loadUsers()
    ).then(function() {
        updateMoviesList();
        updateUsersList();
        updateCurrentUserPanel();
    });

    // Install user events listeners

    /* Create a subscription to a movie for the current user.
     *
     * '#movieToSubscribe' is created and destroyed dynamically, so we can't attach an event to it
     * directly or it would stop working when repainted. We set the listened in 'body' instead,
     * and set it to filter by the selector '#movieToSubscribe' to trigger the event.
     *
     * See: http://api.jquery.com/on/
     */
    $('body').on('change', '#movieToSubscribe', function(evt) {
        var movieId = $(this).val();

        console.debug('EVENT', 'new subscription clicked');

        Users.createCurrentUserSubscription(movieId).then(function() {
            return Users.loadUsers();
        }).then(function() {
            updateUsersList();
            updateCurrentUserPanel();
        });
    });

    /* Open, edit status or delete a subscription from the current user.
     *
     * Same as before, the elements we want to listen to are created dynamically.
     */
    $('body').on('click', '[data-action]', function(evt) {
        var $this = $(this);
        var action = $this.data('action');
        var movieId = $this.closest('[data-subscription]').data('subscription');

        console.debug('EVENT', 'subscription action clicked');

        switch (action) {
            case 'open':
                openImdbModal(movieId);
                break;

            case 'edit':
                openSubscriptionStatusModal(movieId);
                break;

            case 'delete':
                /* Delete the subscription from the user, tell the Users store to
                 * reload its list form the server, and when its done repaint
                 * the users list and current user panel.
                 */
                Users.removeCurrentUserSubscription(movieId).then(function() {
                    return Users.loadUsers();
                }).then(function() {
                    updateUsersList();
                    updateCurrentUserPanel();
                });
                break;
        }
    });

    /* Select a user as 'current user' and open it in the main panel */
    $('body').on('click', '[data-user]', function(evt) {
        var userId = $(this).data('user');

        console.debug('EVENT', 'open user clicked');

        Users.setCurrentUserById(userId);

        updateCurrentUserPanel();
    });

    /* Open info of a movie in a modal dialog */
    $('body').on('click', '[data-movie]', function(evt) {
        var movieId = $(this).data('movie');

        evt.preventDefault();

        console.debug('EVENT', 'open imdb modal clicked');

        openImdbModal(movieId);
    });

    /* Change the status of a subscription */
    $('#saveSubscriptionStatus').on('click', function(evt) {
        var $select = $('#subscriptionStatusSelect');
        var movieId = $select.closest('[data-subscription]').data('subscription');

        console.debug('EVENT', 'save subscription status clicked');

        /* After changing the subscription status in the database, reload the loaded users
         * list to update that info in the Users store.
         *
         * Once it is loaded, repaint the current user panel and it will change to the updated
         * status.
         */
        Users.updateCurrentUserSubscriptionStatus(movieId, $select.val()).then(function() {
            return Users.loadUsers();
        }).then(function() {
            updateCurrentUserPanel();
        });
    });

    /* Add a new movie to the list */
    $('#saveNewMovie').on('click', function(evt) {
        console.debug('EVENT', 'new movie clicked');

        /* Create the movie in the database, wait for the Movies store to be loaded
         * with the updated movies list, and repaint the list. */
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
