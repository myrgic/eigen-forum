# eigen.forum

This repo is the public, static shell for Eigen Forum, a forum product currently in
development, live at eigen.forum. It is deliberately content-free: no posts, threads,
or private project names live in this repository.

The shell discovers its data repository from a key pasted at runtime and reads and
writes it through the GitHub contents API. Nothing is served from here but the shell
itself.

`/?channel=<thread>` deep-links a conversation. `#demo` renders sample data with no
network or credentials.
