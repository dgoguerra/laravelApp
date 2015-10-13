#!/usr/bin/env bash

# Vagrant provisioning script.
#
# Based on:
#   https://www.digitalocean.com/community/tutorials/how-to-install-laravel-4-on-a-centos-6-vps
#   https://www.digitalocean.com/community/tutorials/how-to-install-laravel-with-an-nginx-web-server-on-ubuntu-14-04
#   http://laravel-recipes.com/recipes/23/provisioning-vagrant-with-a-shell-script
#   https://gist.github.com/fideloper/7074502
#   http://www.websightdesigns.com/posts/view/how-to-configure-an-ubuntu-web-server-vm-with-vagrant


# Update packages index
sudo apt-get update


echo ">>> Installing Nginx & PHP"

sudo apt-get -y install nginx php5-fpm php5-cli php5-mcrypt git

# Uncomment cgi.fix_pathinfo and set it to 0
sudo sed -i 's/;cgi.fix_pathinfo=1/cgi.fix_pathinfo=0/' /etc/php5/fpm/php.ini

# Install mcrypt extension & restart
sudo php5enmod mcrypt
sudo service php5-fpm restart

#sudo mkdir -p /home/vagrant/laravel/public

# Configure nginx. Running an embedded bash to write as root.
sudo bash -c "cat > /etc/nginx/sites-available/default" <<- 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    root /home/vagrant/laravel/public;
    index index.php index.html index.htm;

    server_name localhost;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        try_files $uri /index.php =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php5-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
EOF

# Change nginx user
sudo sed -i 's/user www-data;/user vagrant;/' /etc/nginx/nginx.conf

# Change php5-fpm user and the permissions for its socket
sudo sed -i 's/user = www-data/user = vagrant/' /etc/php5/fpm/pool.d/www.conf
sudo sed -i 's/group = www-data/group = vagrant/' /etc/php5/fpm/pool.d/www.conf
sudo sed -i 's/listen.owner = www-data/listen.owner = vagrant/' /etc/php5/fpm/pool.d/www.conf
sudo sed -i 's/listen.group = www-data/listen.group = vagrant/' /etc/php5/fpm/pool.d/www.conf

# Restart nginx and php5-fpm
sudo service nginx restart
sudo service php5-fpm restart


# Swap file (small server)
sudo fallocate -l 1G /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile


echo ">>> Installing MySQL"

# Avoid mysql root password prompt
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
sudo apt-get install -y mysql-server php5-mysql

# Setup the DB and credentials

mysql -u root -proot <<- EOF
	CREATE DATABASE IF NOT EXISTS laravel_db;
	GRANT ALL ON laravel_db.* TO 'laravel_app'@'localhost' IDENTIFIED BY 'secret';
	FLUSH PRIVILEGES;
EOF

# Save mysql default cli credentials to access as the new user
cat > "/home/vagrant/.my.cnf" <<- EOF
	[mysql]
	user = laravel_app
	password = secret

	[mysqldump]
	user = laravel_app
	password = secret
EOF

sudo service mysql restart


echo ">>> Installing Composer"

curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer


echo ">>> Laravel: Set Project .env"

# Insecure APP_KEY, regenerate one with:
#   php artisan key:generate

cat > "/home/vagrant/laravel/.env" <<- EOF
APP_ENV=local
APP_DEBUG=true
APP_KEY=Qduck03JIVl4g7KMete1cVxz8kb6rifk

DB_HOST=localhost
DB_DATABASE=laravel_db
DB_USERNAME=laravel_app
DB_PASSWORD=secret

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_DRIVER=sync

MAIL_DRIVER=smtp
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
EOF
