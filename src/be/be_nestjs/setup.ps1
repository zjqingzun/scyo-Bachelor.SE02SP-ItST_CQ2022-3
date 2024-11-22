docker run --name postgres_bookastay `
  -e POSTGRES_USER=bookastaydata `
  -e POSTGRES_PASSWORD=bookastaydata `
  -v ./pgdata:/var/lib/postgresql/data `
  -p 5432:5432 `
  -d postgres

Start-Sleep -Seconds 10

docker exec -it postgres_bookastay psql -U bookastaydata -c 'CREATE DATABASE "bookastay" WITH ENCODING = ''UTF8'' TEMPLATE = template0;'


docker run -d --name minio `
  -p 9000:9000 `
  -p 9001:9001 `
  -v ./minio:/data `
  -e "MINIO_ACCESS_KEY=bookastayimage" `
  -e "MINIO_SECRET_KEY=bookastayimage" `
  minio/minio server /data --console-address ":9001"
