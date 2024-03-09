import parseArgs from "minimist";

export default parseArgs(process.argv.slice(2), {
  default: { m: "debug", c: "empty", a: "none", compare: false },
  boolean: ["compare"],
});
