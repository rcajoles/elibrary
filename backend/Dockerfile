FROM        node:14

WORKDIR     /backend
COPY        package.json package-lock.json ./
RUN         npm install

COPY        . ./
EXPOSE      $PORT

CMD  ["npm", "start"]
