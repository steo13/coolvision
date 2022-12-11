FROM httpd:alpine

ARG BIN_FOLDER=bin

RUN sed -i \
        -e 's/^#\(LoadModule .*mod_rewrite.so\)/\1/' \
        conf/httpd.conf

RUN echo $' \n\
        <Directory "/usr/local/apache2/htdocs"> \n\
        order allow,deny \n\
        allow from all \n\
        RewriteEngine on \n\
        RewriteCond %{REQUEST_FILENAME} -s [OR] \n\
        RewriteCond %{REQUEST_FILENAME} -l [OR] \n\
        RewriteCond %{REQUEST_FILENAME} -d \n\
        RewriteRule ^.*$ - [NC,L] \n\
        RewriteRule ^(.*) /index.html [NC,L] \n\
        </Directory>' >> conf/httpd.conf

COPY $BIN_FOLDER/ /usr/local/apache2/htdocs/
