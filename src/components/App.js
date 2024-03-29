import React from "react";

import Header from "./Header";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";
import Login from "../components/Auth/Login";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

import { useAuth0 } from "@auth0/auth0-react";
import useAccessToken from "../hooks/useAccessToken";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: "https://hasura.io/learn/graphql/graphiql",
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

const App = () => {
  const idToken = useAccessToken();
  const { loading, logout } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!idToken) {
    return <Login />;
  }
  const client = createApolloClient(idToken);
  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        <div className="row container-fluid p-left-right-0 m-left-right-0">
          <div className="row col-md-9 p-left-right-0 m-left-right-0">
            <div className="col-md-6 sliderMenu p-30">
              <TodoPrivateWrapper />
            </div>
            <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
              <TodoPublicWrapper />
            </div>
          </div>
          <div className="col-md-3 p-left-right-0">
            <div className="col-md-12 sliderMenu p-30 bg-gray">
              <OnlineUsersWrapper />
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
