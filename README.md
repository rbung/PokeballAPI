# Let's make a Pokeball API

Slides :
<https://slides.com/rodolphebung/nodejs-academy-let-s-make-a-pokeball-api>

In this lab, we will make a Pokeball API : we want to be able to make CRUD
operations on pokeballs ! We also want to make some search on our pokeballs (and
maybe on pokemons too). On each exercice, you will find mandatory and optional
steps to do. As we don't have lot's of time, try to do the mandatory steps first
! 😏

## Project structure

Source code is located in the `src` folder. This is an
[Express](https://expressjs.com) application. The application is initialised in
`app.js` and what is related to pokeballs is in `pokeball` folder.

We will develop only in `src/pokeball/router.js` and to ensure our API behaves
as expected, we will run the tests which are in `src/app.spec.js`.

The app needs a [MongoDB](https://www.mongodb.com/) database to work. If you
have a MongoDB instance running locally on its standard port, you can run this
npm script to import some data :

```bash
npm run data
```

Or if you are on windows 🤦‍:

```bash
npm run data:win
```

The database part is already coded in `src/pokeball/Pokeball.js` with
[Mongoose](https://mongoosejs.com/). You can take a look at this file to know
the data structure we will use and the instance methods which are available. All
you need to do is using this module on the pokeball router 😀

## Exercice 1 : find all pokeballs

In `src/pokeball/router.js`, implement the `findAll` function. You have to use
the `Pokeball` model to retrieve all the stored pokeballs (take a look at the
[find](https://mongoosejs.com/docs/api.html#model_Model.find) method). Then,
return a status code `200` (with `res.status`) to the client with these
pokeballs as json in the body (with `res.json`). After that, the test `1.1`
should be passing in `src/app.spec.js`.

Optional : handle the server error case. Use a `try catch` block and handle the
error properly to make the test `1.2` pass.

## Exercice 2 : find a pokeball with its id

In `src/pokeball/router.js`, implement the `findById` function. The `id` of the
pokemon we want to retrieve is given by `route parameter` (see the
[documentation](http://expressjs.com/en/guide/routing.html)) and is available
with the `params` property of the `request`. Use it to retrieve the matching
stored pokeball with the
[findById](https://mongoosejs.com/docs/api.html#model_Model.findById) static
method of the `Pokeball` model. Then return a status code `200` with this
pokemon in the body (Test `2.1` should be working).

If the given `id` is unknown, the method `findById` from the model will return
`null`. Handle this case to return to the client a response with a `404` status
code and en emtpy json object (`{}`). After that, test `2.2` should be working.

Optional 1 : handle an invalid `id` error case. If the given `id` is not a
correct Mongo
[ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/), we will
have a `CastError` error. Use a `try catch` block and handle this error properly
(return a `bad request` response to the client) to make the test `2.3` pass.

Optional 2 : handle the server error case. Improve the previous `try catch`
block and handle the error properly to make the test `2.4` pass.

## Exercice 3 : create a pokeball

In `src/pokeball/router.js`, implement the `create` function. The request
payload is already handled by the
[body-parser](https://github.com/expressjs/body-parser) middleware and is
available via the `body` property of the request. Use the `Pokeball`
[create](https://mongoosejs.com/docs/api.html#model_Model.create) static method
to create a pokeball and return it as a json with a `201` status code (Test
`3.1` should be working).

Optional 1 : handle the duplicate name error case. In the `Pokeball` schema, we
defined `name` as `unique` : if we try to create a Pokeball with an existing
`name`, Mongoose will throw an error. The error has a `name` property set to
`MongoError` and a `code` set to `11000`. Handle this error properly to make the
test `3.2` pass.

Optional 2 : handle the server error case. Improve the previous `try catch`
block and handle the error properly to make the test `3.3` pass.

## Exerice 4 : delete a pokeball

In `src/pokeball/router.js`, implement the `remove` function. Use the `Pokeball`
[findByIdAndDelete](https://mongoosejs.com/docs/api.html#model_Model.findByIdAndDelete)
static method with the `id` route parameter. Then simply return a `204` status
code with an empty body (`res.send()`). Test `4.1` should be working.

Optional : handle the server error case. Use a `try catch` block and handle the
error properly to make the test `4.2` pass.

## Exercice 5 : increase/decrease a pokeball count

In `src/pokeball/router.js`, implement the `increase` and `decrease` functions.
They are very similar. You will have to retrieve the stored pokeball with the
`Pokeball.findById` method. With this pokeball, just invoke the
`increase/decrease` [instance](https://mongoosejs.com/docs/guide.html#methods)
method. Take a look at the `Pokeball` model to see how they are implemented.
These methods will update the database and the current instance. Just return the
updated pokeball with a `200` status code to make tests `5.1` pass.

To make tests `5.2` pass, you will have to handle the case where
`Pokeball.findById` will NOT return a pokeball (because it does not exist). In
that case, return a `404`status code with an emtpy object.

Optional : handle the server error case. Use a `try catch` block and handle the
error properly to make the tests `5.3` pass.

## Exerice 6 : find pokeballs with text search

In `src/pokeball/router.js`, implement the `search` function.

In the Pokeball schema, we defined a `text` index on the `name` property. This
allows to make [text search](https://docs.mongodb.com/manual/text-search/) on
this field ! 😎💪 The query param `q` is available in the `query` request
property. Use the Pokeball `find` static method with the appropriate query
(`$text: { $search: searchQuery }`) to execute a text search request to Mongo.
Then just return these pokeballs to the client.

To complete this function, use the `searchPokemon` function (required on top of
the file) to query the [pokemon API](https://pokeapi.co/) and see if the
requested term does match a pokemon name. You can take a look to the
`src/pokemon/search.js` module to see how this function is implemented. Once you
make this request, just return it too to the client.

Note : you can make this 2 operations sequentially but make them parallel would
be even better ! 😉 Test `6.1` should be working at this point.

Optional : handle the server error case. Use a `try catch` block and handle the
error properly to make the tests `6.2` pass.

## Going further

You made it, congratulations ! 🎉

But you probably noticed that there's some boilerplate with error handling. You
can define [error handler](http://expressjs.com/en/guide/error-handling.html)
with Express but this is still very minimalist. Take a look at this
[post](https://nemethgergely.com/error-handling-express-async-await/) : with a
library called [boom](https://github.com/hapijs/boom) and a custom async
middleware, you will be able to handle errors in a very efficient way !

Some other improvements we can also do :

- request validation with [joi](https://github.com/hapijs/joi)
- security http headers with [helmet](https://github.com/helmetjs/helmet)
- healthcheck and graceful shutdown :
  <https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html>
