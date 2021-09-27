import React, { useState } from "react";
import { Query, Builder, Utils as QbUtils } from "react-awesome-query-builder";
// types
import { BasicConfig } from "react-awesome-query-builder";
import data from "./MOCK_DATA.json";

import "react-awesome-query-builder/lib/css/styles.css";
// import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles

// Choose your skin (ant/material/vanilla):
const InitialConfig = BasicConfig; // or MaterialConfig or BasicConfig
let fieldtest = {};
let values = {};
// console.log("🚀 ~ file: QueryAwesome.js ~ line 13 ~ fieldtest", fieldtest);

fieldtest["gender"] = {
  label: "gender",
  type: "select",
  valueSources: ["value"],
  fieldSettings: {
    listValues: [
      { value: "Agender", title: "Agender" },
      { value: "Male", title: "Male" },
      { value: "female", title: "female" },
    ],
  },
};

let labels = [];

const fields = data.map((person) => {
  // console.log(Object.keys(person));
  let keys = Object.keys(person);
  let values = Object.entries(person);
  // console.log("🚀 ~ file: QueryAwesome.js ~ line 35 ~ fields ~ values", values);

  keys.forEach(function (label) {
    if (!labels.includes(label)) {
      labels.push(label);

      // fieldtest[label] = {
      //   label: label,
      //   type: isNaN(label) ? "select" : "qty",
      //   valueSources: ["value"],
      //   fieldSettings: isNaN(label)
      //     ? {
      //         listValues: [
      //           { value: "yellow", title: "Yellow" },
      //           { value: "green", title: "Green" },
      //           { value: "orange", title: "Orange" },
      //         ],
      //       }
      //     : { min: 0 },
      // };
    }
    // console.log(labels);
  });

  // const label = keys.map((label) => (!labels.includes(label) ? label : null));
  // if(!labels.includes(label))
  // labels.push(label);
  // console.log("🚀 ~ file: QueryAwesome.js ~ line 21 ~ fields ~ label", label);

  // let keys = Object.entries(person);
});
// console.log("🚀 ~ file: QueryAwesome.js ~ line 16 ~ fields ~ fields", fields);
// You need to provide your own config. See below 'Config format'
const config = {
  ...InitialConfig,
  fields: fieldtest,
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { id: QbUtils.uuid(), type: "group" };

export const QueryAwesome = () => {
  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config: config,
  });

  const onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState({ tree: immutableTree, config: config });

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  };

  const renderBuilder = (props) => (
    <div className="query-builder-container" style={{ padding: "10px" }}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  );

  return (
    <div>
      <Query
        {...config}
        value={state.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
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
