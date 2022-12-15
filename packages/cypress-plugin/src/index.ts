declare global {
  export namespace Chai {
    interface Assertion {
      foo(): Promise<void>;
    }
  }
}

const isFoo = (_chai: any) => {
  function assertIsFoo(this: any, _options: any) {
    this.assert(
      this._obj === "foo",
      'expected #{this} to be string "foo"',
      'expected #{this} to not be string "foo"',
      this._obj
    );
  }

  _chai.Assertion.addMethod("foo", assertIsFoo);
};

export default isFoo;
