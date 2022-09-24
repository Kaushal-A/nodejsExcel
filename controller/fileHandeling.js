const express = require("express");
const xlsxReader = require("xlsx");
const multer = require("multer");
const upload = multer({ dest: "./file" });
const fetch = require("node-fetch");
const { response } = require("express");

// Reading our test file

fileHandeling = () => {
  const file = xlsxReader.readFile("./file/product_list.xlsx");

  let data = [];
  let data2 = [];
  let allPrice = [];

  const sheets = file.SheetNames;

  for (let i = 0; i < sheets.length; i++) {
    const temp = xlsxReader.utils.sheet_to_json(
      file.Sheets[file.SheetNames[i]]
    );
    temp.forEach((res) => {
      data.push(res);
    });
  }

  let requests = data.map((data) =>
    fetch(`https://api.storerestapi.com/products/${data.product_code}`)
  );

  Promise.all(requests)
    .then((responses) => {
      // console.log(responses);
      return responses;
    })
    .then((responses) =>
      Promise.all(
        responses.map((r) => {
          return r.json();
        })
      )
    )
    .then((users) =>
      users.forEach((user) => {
        allPrice.push(user.data.price);
        // console.log(user.data.price);
      })
    )
    .then(() => {
      for (let i = 0; i < sheets.length; i++) {
        const temp = xlsxReader.utils.sheet_to_json(
          file.Sheets[file.SheetNames[i]]
        );
        let j = 0;
        temp.forEach((res) => {
          res.price = allPrice[j++];
          data2.push(res);
        });
      }
      const ws = xlsxReader.utils.json_to_sheet(data2);
      //   console.log(data2);
      xlsxReader.utils.book_append_sheet(file, ws, "Sheet2");

      // Writing to our file
      xlsxReader.writeFile(file, "./file/test.xlsx");
      return true;
    });
};

module.exports = fileHandeling;
