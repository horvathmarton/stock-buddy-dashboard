# Stock Buddy

## dev notes

getting started:
- install resonable recent node version
- npm install 
- npm start
- npm run test # for testin
- npm run build # for building

to try out the build before submitting a PR run ` docker build --tag dev . && docker run --net host -v$(pwd)/src:/usr/src/app/src -it  dev npm start`
and it should change according your saves

