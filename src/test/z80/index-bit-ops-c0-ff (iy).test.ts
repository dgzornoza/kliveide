import "mocha";
import * as expect from "expect";
import * as fs from "fs";
import * as path from "path";
import { TestCpuApi, TestZ80Machine } from "../../modules/cpu-z80/test-z80-machine";
import { Z80CpuState } from "../../modules/cpu-z80/z80-cpu";
import { importObject } from "./import-object";

const buffer = fs.readFileSync(path.join(__dirname, "../../../build/tz80.wasm"));
let api: TestCpuApi;
let testMachine: TestZ80Machine;

describe("Indexed bit ops c0-ff (iy)", () => {
  before(async () => {
    const wasm = await WebAssembly.instantiate(buffer, importObject);
    api = (wasm.instance.exports as unknown) as TestCpuApi;
    testMachine = new TestZ80Machine(api);
  });

  beforeEach(() => {
    testMachine.reset();
  });

  const reg8 = ["b", "c", "d", "e", "h", "l", "(hl)", "a"];

  for (let q = 0; q <= 7; q++) {
    for (let n = 0; n <= 7; n++) {
      const opCode = 0xc0 + n * 8 + q;
      it(`${opCode.toString(16)}: set ${n},(iy+D) #1`, () => {
        const OFFS = 0x32;
        let s = testMachine.initCode([0xfd, 0xcb, OFFS, opCode]);
        let m = testMachine.memory;
        s.iy = 0x1000;
        m[s.iy + OFFS] = 0x00;
        s.f &= 0xfe;

        s = testMachine.run(s, m);
        m = testMachine.memory;

        expect(m[s.iy + OFFS]).toBe(1 << n);
        if (q !== 6) {
          expect(getReg8(s, q)).toBe(m[s.iy + OFFS]);
        }
        testMachine.shouldKeepRegisters(`F, ${reg8[q]}`);
        testMachine.shouldKeepMemory("1032");

        expect(s.pc).toBe(0x0004);
        expect(s.tacts).toBe(23);
      });

      it(`${opCode.toString(16)}: set ${n},(iy+D) #2`, () => {
        const OFFS = 0x32;
        let s = testMachine.initCode([0xfd, 0xcb, OFFS, opCode]);
        let m = testMachine.memory;
        s.iy = 0x1000;
        m[s.iy + OFFS] = 0xaa;
        s.f &= 0xfe;

        s = testMachine.run(s, m);
        m = testMachine.memory;

        expect(m[s.iy + OFFS]).toBe(0xaa | (1 << n));
        if (q !== 6) {
          expect(getReg8(s, q)).toBe(m[s.iy + OFFS]);
        }
        testMachine.shouldKeepRegisters(`F, ${reg8[q]}`);
        testMachine.shouldKeepMemory("1032");

        expect(s.pc).toBe(0x0004);
        expect(s.tacts).toBe(23);
      });
    }
  }
});

function getReg8(s: Z80CpuState, q: number): number {
  switch (q) {
    case 0:
      return s.b;
    case 1:
      return s.c;
    case 2:
      return s.d;
    case 3:
      return s.e;
    case 4:
      return s.h;
    case 5:
      return s.l;
    case 7:
      return s.a;
  }
  return 0;
}
