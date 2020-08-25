const http = require('http');

const blocks = [
  {
    "type": "textInput",
    "id": "todoName",
    "label": "To-Do Name",
    "value": process.env.IS_ERROR ? "This is a very long to-do name which will fail validation..." : "A normal length title",
    "placeholder": "Enter a name...",
    "required": true
  },
  {
    "type": "textArea",
    "id": "todoDescription",
    "label": "Description",
    "value": null,
    "placeholder": "Enter a description...",
    "rows": 3,
    "required": false
  },
  {
    "type": "calendar",
    "id": "todoDate",
    "label": "Due Date",
    "value": null,
    "placeholder": "Enter a due date...",
    "required": true
  },
  {
    "type": "button",
    "id": "submit",
    "label": "Submit",
    "style": "primary"
  }
];

const payload = {
  id: '3ba06f82-7f2a-4ef5-b45a-a573e4fd6e13',
  trace: 'b9c0d704-7634-415f-bf59-fc136063fb4e',
  blocks: process.env.IS_SUBMIT ? blocks : [],
  message: {
    id: '55570',
    subject: 'MIKit test message',
    snippet: 'This is a test...  -- Test1 User ',
    from: [
      'Stage 3 - Head Office - Test1 User / TEST <headoffice@stage3systems.com>'
    ],
    to: [
      'example@example.com'
    ],
    cc: [],
    bcc: [],
    href: 'https://sedna-tst-test1.stage3systems.net/platform/2019-01-01/message/55570',
    jobReferences: [],
    categories: [],
    teams: [
      {
        id: '91',
        name: 'Head Office',
        href: 'https://sedna-tst-test1.stage3systems.net/platform/2019-01-01/team/91'
      }
    ]
  },
  user: {
    id: '87',
    href: 'https://sedna-tst-test1.stage3systems.net/platform/2019-01-01/user/87'
  },
  version: '2020-07-07'
}

const data = JSON.stringify(payload)

const qsValue = process.env.IS_SUBMIT ? '?action=submit' : ''
const authHeader = process.env.IS_AUTHENTICATED ? 'Bearer abc123' : 'Bearer invalid'
const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/sedna${qsValue}`,
  method: 'POST',
  headers: {
    'User-agent': 'SednaApplication (messageInteractionClient)',
    'Content-type': 'application/json',
    'Content-length': data.length + '',
    'Authorization': authHeader,
  },
}

const req = http.request(options, res => {
  console.log(`The app replied with ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error);
})

req.write(data)
req.end()
