const fs = require('fs')

let directory = undefined;

const storeData = () => {
  try {
    fs.writeFileSync('/var/docker-express/docker-express-state.json', JSON.stringify({directory: directory}))
  } catch (err) {
    console.error(err)
  }
}

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync('/var/docker-express/docker-express-state.json', 'utf8')).directory
  } catch (err) {
    console.error(err)
    return []
  }
}
directory = loadData()

const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Running!')
})

app.get('/status/', (_req, res) => {
  res.json({result: 'pong'})
})

app.get('/directories/', (_req, res) => {
  res.json({
    count: directory.length,
    next: directory.length > (10) ? "/directories/page/1": null,
    previous: null,
    results: directory.slice(0, 10)
 })
})

app.get('/directories/page/:page', (req, res) => {
  const currPage = req.params.page;
  const prev = currPage > 1 ? `/directories/page/${currPage - 1}`: (currPage == 1 ? '/directories/': null );
  const next = directory.length > ((currPage + 1) * 10) ? `/directories/page/${currPage + 1}`: null;
  res.json({
    count: directory.length,
    next: next,
    previous: prev,
    results: directory.slice(currPage * 10, (currPage * 10) + 10)
 })
})

app.post('/directories/', (req, res) => {
  let newObject = req.body;
  if (directory.length == 0) {
    newObject.id = 0;
  } else {
    newObject.id = directory.at(-1).id + 1;
  }
  directory.push(newObject);
  storeData();
  res.json({result: 'success'})
})

app.get('/directories/:id', (req, res) => {
  for (let obj of directory) {
    if (obj.id == req.params.id) {
      res.json(obj);
      return
    }
  }
  res.status(404).json({result: 'not found'})
})

app.put('/directories/:id', (req, res) => {
  const objId = req.params.id;
  for (i = 0; i < directory.length; i++) {
    const obj = directory[i];
    if (obj.id == objId) {
      let newObject = req.body;
      newObject.id = objId;
      directory[i] = newObject;
      storeData();
      res.json({result: 'success'});
      return
    }
  }
  res.status(404).json({result: 'not found'})
})

app.patch('/directories/:id', (req, res) => {
    const objId = req.params.id;
    for (i = 0; i < directory.length; i++) {
      if (directory[i].id == objId) {
        let newModObject = req.body;
        if (newModObject.name !== undefined && newModObject.name !== null) {
          console.log(`obj ${objId} change name '${directory[i].name}' => ${newModObject.name}`);
          directory[i].name = newModObject.name
        }
        if (newModObject.emails !== undefined && newModObject.emails !== null) {
          console.log(`obj ${objId} change emails ['${directory[i].emails.toString()}'] => [${newModObject.emails.toString()}]`);
          directory[i].emails = newModObject.emails
        }
        storeData();
        res.json({result: 'success'});
        return
      }
    }
    res.status(404).json({result: 'not found'})
})

app.delete('/directories/:id', (req, res) => {
    const objId = req.params.id;
    for (i = 0; i < directory.length; i++) {
      if (directory[i].id == objId) {
        directory.splice(i, 1);
        storeData();
        res.json({result: 'success'});
        return
      }
    }
    res.status(404).json({result: 'not found'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
