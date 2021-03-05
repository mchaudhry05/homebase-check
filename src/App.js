import {
  HomebaseProvider,
  useClient,
  useEntity,
  useTransact,
} from "homebase-react";
import firebase from "firebase/app";
import debounce from "lodash/debounce";
import Check from "./Check";
import Authenticated from "./Components/Authenticated/Authenticated";
import "./App.css";
import React from "react";

const config = {
  schema: {
    user: { uid: { unique: "identity" } },
    stock: {
      user: { type: "ref" },
      tickerSymbol: { unique: "identity" },
    },
  },

  initialData: [
    { stock: { user: -1, tickerSymbol: "", shares: 3, buyPrice: 43.46 } },
    { user: { id: -1, name: "Mafaz" } },
  ],
};

const App = () => {
  return (
    <HomebaseProvider config={config}>
      <Authenticated>
        <Check />
      </Authenticated>
    </HomebaseProvider>
  );
};

export default App;
