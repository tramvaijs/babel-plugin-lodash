declare module "@babel/helper-plugin-test-runner" {
  const runner: (loc: string) => void;
  export default runner;
}
declare module "@babel/helper-plugin-test-runner/esm.mjs" {
  import runner from "@babel/helper-plugin-test-runner";
  export default runner;
}
