import chai, { expect } from "chai";
import isFoo from "../src/index";
import mocha from "mocha";

chai.use(isFoo);

describe("chai-simple-test", () => {
  it("should pass if is a valid foo", () => {
    expect("foo").to.be.foo();
  });
});
