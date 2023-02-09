let pass = '$2a$07$ulLDrgOZPspaiyvABQPv6ejPT9ag4o5XiR4GuuTn0D4u/nC7UHaAC'

const bcryptjs = require('bcryptjs')

let valid = bcryptjs.compareSync('test', pass)

console.log(valid);