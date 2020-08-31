const express = require("express");
const helpers = require("./helpers.js");
const thirdPartyApi = require("./third-party.js");
const app = express();
const port = 3000;

app.use(express.json());

const actionToHandler = {
  default: (req, res) => {
    // This is the default response which returns an empty form
    console.log("Responding with empty form...");
    res.json(
      helpers.buildResponse(
        [
          {
            type: "textInput",
            id: "todoName",
            label: "To-Do Name",
            value: null,
            placeholder: "Enter a name...",
            required: true,
          },
          {
            type: "textArea",
            id: "todoDescription",
            label: "Description",
            value: null,
            placeholder: "Enter a description...",
            rows: 3,
            required: false,
          },
          {
            type: "calendar",
            id: "todoDate",
            label: "Due Date",
            value: null,
            placeholder: "Enter a due date...",
            required: true,
          },
          {
            type: "button",
            id: "submit",
            label: "Submit",
            style: "primary",
          },
        ],
        "https://www.example.com"
      )
    );
  },
  submit: (req, res) => {
    console.log("Default flow");

    const form = helpers.getFormValues(req.body.blocks);

    if (form.todoName.length > 50) {
      // This pathway recognized a validation error and returns an
      // updated array of blocks, but adds a validation error to the
      // field that contains an issue.
      const blocks = helpers.updateBlockById(req.body.blocks, "todoName", {
        error: "Must be less than 50 characters",
      });

      console.log("Responding with validation error");
      res.json(helpers.buildResponse(blocks));
    } else {
      thirdPartyApi.createTodo(
        form.todoName,
        form.todoDescription,
        form.todoDate,
        () => {
          // And in this case, there were no validation errors, so the app
          // makes a call to the third-party to create a to-do and then
          // returns an empty blocks array (which is interpreted by SEDNA
          // as success.
          console.log("Responding with success");
          res.json(helpers.buildResponse([]));
        }
      );
    }
  },
};

const defaultHandler = actionToHandler["default"];

app.post("/sedna", (req, res) => {
  console.log(req.header("authorization"));

  if (req.header("authorization") !== "Bearer abc123") {
    return res.status(401).send("Unauthorized");
  }

  console.log("New request with body...");
  console.log(req.body);

  // The basic controller method can be quite simple and just ferry the
  // request to an appropriate handler. A complex integration might have
  // many branches (different error states, multi-step, etc. etc.) so it
  // is a lot easier to split them into individual functions.
  const handler = actionToHandler[req.query.action] || defaultHandler;
  handler(req, res);
});

app
  .listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  })
  .on("error", (e) => {
    console.error("Could not start the application.", e);
  });
