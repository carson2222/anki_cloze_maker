const { parse } = require("csv-parse");
const fs = require("fs");

function test(path, newPath, clozeFormation, backImg) {
  let data = [];
  fs.createReadStream(path)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", (row) => {
      let tempData = [];
      row.forEach((el, i) => {
        tempData.push(`{{c${clozeFormation[i] || 1}::${el.replace(",", ";")}}}`);
      });
      const strToPush = `${tempData.join("<br>")},${backImg ? `<img src="${backImg}">` : "nothing"}`;
      data.push(strToPush);
    })
    .on("error", (error) => {
      // Handle the errors
      console.log(error.message);
    })
    .on("end", () => {
      console.log("File read successful");

      fs.writeFile(newPath, data.join("\n"), "utf8", (err) => {
        if (err) {
          console.log("Some error occured - file either not saved or corrupted file saved.");
        } else {
          console.log("It's saved!");
        }
      });
    });
}
test(
  "./phrasalPUT.csv",
  "./phrasalPUTFormatted.csv",
  [1, 1, 2, 2],
  "https://7esl.com/wp-content/uploads/2017/12/2-2.jpg"
);
