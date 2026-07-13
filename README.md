# Lilact PHP Demo

### Example of implementing a JSX/Redux website with a PHP/MySQL data store using the Lilact library

---

If you find Lilact useful, please consider sponsoring. Your support funds ongoing maintenance, 
performance improvements, and new features. [Sponsor me on GitHub](https://github.com/sponsors/arashkazemi)

---

`Lilact` is an extremely lightweight implementation of the React API that is
designed to work in the browser. `Lilact` works in the browser, so it doesn't rely on any JS/node
back-end and can essentially work with any kind of web server. You can find it on its own repo:

[Lilact repo on GitHub](https://github.com/arashkazemi/lilact) 

---

This repo contains a complete example, a simple blog, written in JSX/PHP using `Lilact`. 
It supports

- Simple User management (Register/Login/Change Password/Logout)
- Simple posting of blog items by users (Create/Edit/Delete)

And it uses redux for blog item operations. To test it, you should have a PHP server with 
MySQL/MariaDB. 

---

To run, first create a database and initialize the tables. You can find the complete SQL script 
for creating the db, tables and inserting some initial demo data in `init-db.sql`. Many servers 
do not allow creating databases by SQL instructions directly, so you may need to create it by 
hand. Then you should configure `store/config.php` and update the db name and user credentials 
so the store can connect.

The demo data is not necessary and you can only create the tables. 

Then open `index.html` from your browser, using its path on the server, i.e. 
`http://localhost/lilact-php-demo`.

I have put a simple sleep instruction in the `users.php` to simulate the lags on a local
server, you can simply comment or remove it to speed things up. Two users are defined 
in the demo data, namely `test-user-1` and `test-user-2`. Password for both is `12345678`. 
Notice that each user can only edit/delete its own posts.

This repo contains a snapshot of `Lilact` (`lilact.production.min.js`). You can remove it and use
CDN instead:

        <script src="https://unpkg.com/lilact/dist/lilact.production.min.js"></script>

It doesn't need any other scripts or libraries, `Lilact` contains everything necessary.

The components and JSX files are in the `client` directory. The PHP back-end files are in the 
`store` directory.

--------

Copyright (C) 2024-2026 Arash Kazemi <contact.arash.kazemi@gmail.com>. All rights reserved.

Lilact project is subject to the terms of BSD-2-Clause License. See the `LICENSE.TXT` file for more details.
