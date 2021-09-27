import React, { useState, useEffect } from "react";
import { Query, Builder, Utils as QbUtils } from "react-awesome-query-builder";
import { BasicConfig } from "react-awesome-query-builder";

import "react-awesome-query-builder/lib/css/styles.css";
import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles

// Choose your skin (ant/material/vanilla):
const InitialConfig = BasicConfig; // or MaterialConfig or BasicConfig

// You need to provide your own config. See below 'Config format'
const config = {
  ...InitialConfig,
  fields: {
    qty: {
      label: "Qty",
      type: "number",
      fieldSettings: {
        min: 0,
      },
      valueSources: ["value"],
      preferWidgets: ["number"],
    },
    price: {
      label: "Price",
      type: "number",
      valueSources: ["value"],
      fieldSettings: {
        min: 10,
        max: 100,
      },
      preferWidgets: ["slider", "rangeslider"],
    },
    color: {
      label: "Color",
      type: "select",
      valueSources: ["value"],
      fieldSettings: {
        listValues: [
          { value: "yellow", title: "Yellow" },
          { value: "green", title: "Green" },
          { value: "orange", title: "Orange" },
        ],
      },
    },
    is_promotion: {
      label: "Promo?",
      type: "boolean",
      operators: ["equal"],
      valueSources: ["value"],
    },
  },
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { id: QbUtils.uuid(), type: "group" };

export const QueryTest = () => {
  const [name, setName] = useState("");
  const [localStorageList, setLocalStorageList] = useState([]);
  const [state, setState] = useState(
    JSON.parse(localStorage.getItem("tempValue"))
      ? {
          tree: QbUtils.checkTree(
            QbUtils.loadTree(JSON.parse(localStorage.getItem("tempValue"))),
            config
          ),
          config: config,
        }
      : {
          tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
          config: config,
        }
  );

  useEffect(() => {
    refeshStorageList();
  }, []);

  function refeshStorageList() {
    let storageList = [];

    for (var i = 0; i < localStorage.length; i++) {
      storageList.push(localStorage.key(i));
    }

    setLocalStorageList(storageList);
  }

  const onChange = (immutableTree, config) => {
    refeshStorageList();
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState({ tree: immutableTree, config: config });

    const jsonTree = QbUtils.getTree(state.tree);
    localStorage.setItem("tempValue", JSON.stringify(jsonTree));
  };

  const renderBuilder = (props) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  );

  const saveQuery = (e) => {
    e.preventDefault();
    const jsonTree = QbUtils.getTree(state.tree);
    localStorage.setItem(name, JSON.stringify(jsonTree));
    localStorage.setItem("tempValue", JSON.stringify(jsonTree));

    refeshStorageList();
  };
  const items = localStorage;

  const removeQuery = () => {
    setState({
      tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
      config: config,
    });
    localStorage.removeItem("tempValue");
    refeshStorageList();
  };

  const selectQuery = (e) => {
    let targetQuery = JSON.parse(localStorage.getItem(e.target.innerText));
    setState({
      tree: QbUtils.checkTree(QbUtils.loadTree(targetQuery), config),
      config: config,
    });
    refeshStorageList();
  };

  const saveFile = async (blob) => {
    const a = document.createElement("a");
    a.download = "my-file.txt";
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });

  return (
    <div>
      <Query
        {...config}
        value={state.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <form onSubmit={saveQuery}>
        <label>
          Name :{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <input type="submit" value="Save" />
      </form>

      {localStorageList.map((element) => {
        return <p onClick={selectQuery}>{element}</p>;
      })}

      <button onClick={removeQuery}>removeQuery</button>

      <div onClick={() => saveFile(blob)}> save file </div>

      <div className="query-builder-result">
        <div>
          Query string:{" "}
          <pre>
            {JSON.stringify(QbUtils.queryString(state.tree, state.config))}
          </pre>
        </div>
        <div>
          MongoDb query:{" "}
          <pre>
            {JSON.stringify(QbUtils.mongodbFormat(state.tree, state.config))}
          </pre>
        </div>
        <div>
          SQL where:{" "}
          <pre>
            {JSON.stringify(QbUtils.sqlFormat(state.tree, state.config))}
          </pre>
        </div>
        <div>
          JsonLogic:{" "}
          <pre>
            {JSON.stringify(QbUtils.jsonLogicFormat(state.tree, state.config))}
          </pre>
        </div>
      </div>
    </div>
  );
};
