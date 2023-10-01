# Use ubuntu:22.04 as the base image
FROM ubuntu:22.04

# Set the Working Directory inside the container
WORKDIR /app

# Copy everything from the current directory to the Working Directory inside the container
COPY . /app

# Update the package list and install software-properties-common
RUN apt update && apt install -y software-properties-common

# Add fishshell PPA
RUN apt-add-repository ppa:fish-shell/release-3

# Update the package list again and install python3, curl, make, unzip, and fish
RUN apt update && apt install -y python3 curl make unzip fish python3-pip

# Set fish as the default shell
RUN chsh -s /usr/bin/fish

# Install Python packages
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Install bunjs runtime
RUN curl -fsSL https://bun.sh/install | bash

# Run bun install
RUN bun install

# Add ./root/.bun/bin to the PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Keep the container running indefinitely
CMD ["tail", "-f", "/dev/null"]
