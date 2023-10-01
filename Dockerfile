# Use ubuntu:22.04 as the base image
FROM ubuntu:22.04

# Update the package list and install python3, curl, and make
RUN apt update && apt install -y python3 curl make

# Install bunjs runtime
RUN curl -fsSL https://bun.sh/install | bash

# Install fishshell
RUN curl -L https://get.fish | tar xzf - && \
    cd fish-3.6.1 && \
    cmake . && \
    make && \
    make install

# Start fishshell as the default shell
CMD ["fish"]

