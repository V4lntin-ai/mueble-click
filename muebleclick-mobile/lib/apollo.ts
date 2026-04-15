// lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import * as Storage from './storage'; 

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', 
});

const authLink = setContext(async (_, { headers }) => {
  // Ahora usará localStorage en la web y SecureStore en móvil
  const token = await Storage.getItemAsync('access_token');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});