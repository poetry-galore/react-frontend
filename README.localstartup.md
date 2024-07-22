# Starting a development build of poetry galore using the db runningon the local host

## the following steps redatil how to set up the mongodb server to run a reprica set

Edit the mongodb configuration file (path='/etc/mongod.conf') and add

```js

replication:
    replSetName: "rs0"
```

restart mongodb with the command

```cli

sudo systemctl restart mongod
```

initiate the replica set using

```cli
sudo mongod --replSet "rs0" --port 27017 --dbpath /data/db1 --bind_ip localhost
```

check mongodb status

```cli
 sudo systemctl status mongod
```

update prisma config

```js
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

```js
DATABASE_URL="mongodb://localhost:27017/yourDatabase?replicaSet=rs0"
```
