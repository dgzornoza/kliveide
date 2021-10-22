import "mocha";

import { codeRaisesError, testCodeEmit } from "./test-helpers";

describe("Assembler - .continue", () => {
  it("fails in global scope", () => {
    codeRaisesError(
      `
      ld a,b
      .continue
    `,
      "Z0708"
    );
  });

  it("fails in non-loop scope", () => {
    codeRaisesError(
      `
    ld a,b
    .if true
      .continue
    .endif
    `,
      "Z0708"
    );
  });

  it("in loop scope", () => {
    testCodeEmit(
      `
    ld a,b
    .loop 3
      .continue
    .endl
    `,
      0x78
    );
  });

  it("in repeat scope", () => {
    testCodeEmit(
      `
    ld a,b
    .repeat
      .continue
    .until true
    `,
      0x78
    );
  });

  it("in while scope", () => {
    testCodeEmit(
      `
    ld a,b
    exit = false
    .while !exit
      exit = true;
      .continue
    .endw
    `,
      0x78
    );
  });

  it("in for scope", () => {
    testCodeEmit(
      `
    ld a,b
    .for _i = 0 .to 3
      .continue
    .next    `,
      0x78
    );
  });

  it("emit - with loop", () => {
    testCodeEmit(
      `
    .loop 5
    .if $cnt == 4
      .continue
    .endif
      .db $cnt
    .endl
    `,
      0x01,
      0x02,
      0x03,
      0x05
    );
  });

  it("emit - with nested loop", () => {
    testCodeEmit(
      `
    .loop 2
      ld bc,#1234
      .loop 3
        inc a
        .if $cnt == 2
          .continue;
        .endif
        nop
      .endl
    .endl
    `,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00
    );
  });

  it("emit - with repeat", () => {
    testCodeEmit(
      `
    .repeat
      .if $cnt == 4
        .continue
      .endif
      .db $cnt
    .until $cnt == 5
    `,
      0x01,
      0x02,
      0x03,
      0x05
    );
  });

  it("emit - with while", () => {
    testCodeEmit(
      `
    .while $cnt <= 5 
      .if $cnt == 4
        .continue
      .endif
      .db $cnt
    .endw
    `,
      0x01,
      0x02,
      0x03,
      0x05
    );
  });

  it("emit - with for", () => {
    testCodeEmit(
      `
    .for value = 1 to 5
      .if value == 4
        .continue
      .endif
      .db value
    .next
    `,
      0x01,
      0x02,
      0x03,
      0x05
    );
  });

  it("emit - with nested repeat", () => {
    testCodeEmit(
      `
    .loop 2
      ld bc,#1234
      counter = 0
      .repeat
        counter = counter + 1
        inc a
        .if $cnt == 2
          .continue;
        .endif
        nop
      .until counter == 3
    .endl
    `,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00
    );
  });

  it("emit - with nested while", () => {
    testCodeEmit(
      `
    .loop 2
      ld bc,#1234
      counter = 0
      .while counter < 3
        counter = counter + 1
        inc a
        .if $cnt == 2
          .continue;
        .endif
        nop
      .endw
    .endl
    `,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00
    );
  });

  it("emit - with nested for", () => {
    testCodeEmit(
      `
    .loop 2
      ld bc,#1234
      .for _i = 1 to 3
        inc a
        .if $cnt == 2
          .continue;
        .endif
        nop
      .next
    .endl
    `,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00,
      0x01,
      0x34,
      0x12,
      0x3c,
      0x00,
      0x3c,
      0x3c,
      0x00
    );
  });
});
