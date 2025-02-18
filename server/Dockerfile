# Go base image
FROM golang:1.24

# SET WORKING DIRECTORY
WORKDIR /usr/src/app

# COPY GO MODULES AND INSTALL DEPENDENCIES
COPY go.mod go.sum ./
RUN go mod download


# COPY SOURCE CODE
COPY . .

# BUILD BINARY

RUN go build -v -o /usr/local/bin/ ./...

# START THE APP
CMD ["app"]


