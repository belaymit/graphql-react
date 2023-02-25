const graphql = require('graphql');
const { 
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
 } = graphql;
const _ = require('lodash')

const books = [
  {name: 'Name of the books', genre: 'Fantasy', id:'1', authorId: '1'},
  {name: 'The Law of Garbage Truck', genre: 'Fiction', id:'2', authorId: '2'},
  {name: 'All the way to the moon', genre: 'Science', id:'3', authorId: '3'},
  {name: 'All the way to the moon', genre: 'Magic', id:'3', authorId: '2'},
  {name: 'All the way to the moon', genre: 'Fantasy', id:'3', authorId: '3'},
  {name: 'All the way to the moon', genre: 'Fiction', id:'3', authorId: '3'},
];

const authors = [
  {name: 'Hellen Killer', age: 42, id:'1'},
  {name: 'Trevor Noah', age: 36, id:'2'},
  {name: 'Brandon Sanderson', age: 50, id:'3'},
];

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields : () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent,args) {
        return _.find(authors, {id: parent.authorId});
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields : () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},

    books:{
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, {authorId:parent.id})
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    book: {
      type: BookType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(books, {id: args.id});
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return _.find(authors, {id: args.id})
      }
    },

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books
      }
    },
    authors : {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
})