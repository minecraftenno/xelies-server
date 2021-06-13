/* ts => js
import FlakeId from 'flakeid'

interface IFlakeId {
  gen: () => string
}

const flake: IFlakeId = new FlakeId()

export default flake
*/

"use strict"
Object.defineProperty(exports, "__esModule", { value: true })

const flakeid = require("flakeid")

const flake = new flakeid()

exports.default = flake