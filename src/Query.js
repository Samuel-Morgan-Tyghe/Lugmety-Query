import QueryBuilder from "react-querybuilder";
import data from "./MOCK_DATA.json";
import React from "react";

export const Query = () => {
  console.log("🚀 ~ file: Query.js ~ line 3 ~ data", data);

  const fields = data.map((person) => {
    console.log(Object.keys(person));
    return person;
  });
  console.log("🚀 ~ file: Query.js ~ line 12 ~ fields ~ fields", fields);
  //   const fields = [
  //     { name: "firstName", label: "First Name" },
  //     { name: "lastName", label: "Last Name" },
  //     { name: "age", label: "Age" },
  //     { name: "address", label: "Address" },
  //     { name: "phone", label: "Phone" },
  //     { name: "email", label: "Email" },
  //     { name: "twitter", label: "Twitter" },
  //     { name: "isDev", label: "Is a Developer?", defaultValue: false },
  //   ];
  function logQuery(query) {
    console.log(query);
  }
  return <QueryBuilder fields={fields} onQueryChange={logQuery} />;
};
