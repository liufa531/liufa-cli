let count = 0
let max = 4
const requestQueen = []

function handleRequest(query, resolve, reject) {
  count++
  fetch(query)
    .then((res) => {
      resolve(res)
    })
    .catch((err) => {
      reject(err)
    })
    .finally(() => {
      count--
      if (requestQueen.length) {
        const { query, resolve, reject } = requestQueen.shift()
        handleRequest(query, resolve, reject)
      }
    })
}
function getData(query) {
  return new Promise((resolve, reject) => {
    if (count <= max) {
      handleRequest(query, resolve, reject)
    } else {
      requestQueen.push({ query, resolve, reject })
    }
  })
}
