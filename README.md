# One Source Backend

This is the Backend repository for a school project to learn how to go from development to production with different environments and ci/cd pipeline. There is also a One Source Frontend repository which is connected to this one.

## TTFHW - Instructions

### Backend developer

```bash
cd <your-workspace>
git clone https://github.com/nillali/heroku-test.git
cd heroku-test
touch .env
npm install
npm start
```

Add this code to your .env file:

```
dbURI=<your MongoDB connection string>
```

### Tester

```bash
npm test # Unit test
npm componenttest # Component test
npm integrationtest # Integration test
```

### Docker

```bash
docker build -t <image-name> .
docker run --name <container-name> <image-name>
```
