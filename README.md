# Stock Buddy

## dev notes

getting started:
- install resonable recent node version
- npm install 
- npm start
- npm run test # for testin
- npm run build # for building

to try out the build before submitting a PR run `docker build . --tag dev && docker run dev`

## deployment notes
to run it in prod the easy way is:
- docker run --name stockbuddy-frontend -p 443:443 -p 80:80 -v /path/to/nginx/config:/etc/nginx/conf.d/:ro <image>:prod
- create certbot service to configure certificate for letsencrypt
- profit $$$
