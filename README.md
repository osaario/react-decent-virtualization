# React Decent Virtualization

Small virtualization library for React. Works decent enough for most cases. Supports lists and table bodies.

## Installation

```
npm install react-decent-virtualization
```

## How to use

*Decent virtualization is super easy to use*. Just import the virtualized container `TBody` or `List` with the `rowHeight` *prop* and you are good to go. Using a `fixed-width` table with `TBody` is probably a good idea or otherwise the column widths change un-elegantly on the fly.

Be sure that your virtualized list row child is a really unexpensive to render. You probably want to shave from it as much as possible so here are a couple of things to consider: 

1. Avoid unneccessary inline functions or lambdas.
2. Prefer classes before inline-styles (This example does use inline styles).
3. `PureComponent` optimized children might be a little more efficient, depending on the case.


```JSX
import React from "react"

import { TBody } from "react-decent-virtualization"

let id = 0

const createUser = () => {
  id = id + 1
  return {
    name: "Anonymous",
    email: "anon@mail.com",
    phone: "0700123123",
    id,
    userName: "anon"
  }
}

const tdStyle = { padding: 8 }
const thStyle = { textAlign: "left", cursor: "pointer", whiteSpace: "nowrap" }
class UserRow extends React.PureComponent {
  render() {
    const user = this.props.user
    return (
      <tr>
        <td style={tdStyle}>{user.name}</td>
        <td>{user.email}</td>
        <td style={tdStyle}>{user.phone}</td>
        <td>{user.userName}</td>
      </tr>
    )
  }
}

let data: User[] = []
for (let i = 0; i < 100000; i = i + 1) {
  data.push(createUser())
}
class App extends React.Component {
  render() {
    return (
      <div>
        <h2>{data.length} users</h2>
        <table style={{ tableLayout: "fixed", width: "100%", overflow: "hidden" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th>Phone</th>
              <th>Username</th>
            </tr>
          </thead>
          <TBody
            childKey={"id"}
            virtualization={{
              rowHeight: 34
            }}
            value={data}
          >
            {user => <UserRow key={user.id} user={user} />}
          </TBody>
        </table>
      </div>
    )
  }
}
```

## Acknowledgements

Library boilerplate starter: https://github.com/alexjoverm/typescript-library-starter

## Dependencies
